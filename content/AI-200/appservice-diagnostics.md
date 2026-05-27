> **Dans cette unité on va parler de :**
> - Activer les logs container (stdout/stderr) et les types capturés
> - Le log stream en temps réel — CLI et portail
> - Kudu (SCM) — ce qu'il peut faire et sa vraie limitation
> - Azure Monitor / Log Analytics — pour la rétention long terme et les alertes
> - SSH dans le container — configuration Dockerfile requise, port 2222
> - Les 4 problèmes courants et comment les diagnostiquer méthodiquement

---

## Logs du container

App Service capture **stdout** et **stderr** de ton container. Par défaut, les logs ne sont pas persistés — il faut l'activer :

```bash
az webapp log config \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --docker-container-logging filesystem
```

Les logs sont ensuite disponibles dans `/home/LogFiles/` et via les outils de diagnostic.

**Types de logs capturés :**

| Type | Exemples |
|------|---------|
| **Application output** | `print()`, `logging.info()` → stdout |
| **Error output** | Exceptions, tracebacks → stderr |
| **Framework logs** | Démarrage de Gunicorn/Express, logs de requêtes |
| **Platform messages** | "Container started", "Container stopped", events du cycle de vie |

**Bonne pratique :** Configure ton app pour écrire sur stdout/stderr. Évite les fichiers de logs custom — ils ne sont pas capturés par défaut et sont perdus au redémarrage (sauf si `/home` persistant est activé).

---

## Log stream — Logs en temps réel

```bash
# Streamer les logs en direct
az webapp log tail \
    --resource-group myResourceGroup \
    --name myDocumentProcessor
```

**Ctrl+C** pour arrêter.

Dans le portail : **Monitoring → Log stream**

**Pour une app scalée** : affiche les logs de **toutes les instances** avec un préfixe identifiant l'instance. Utile pour voir si une instance spécifique a un problème.

**Cas d'usage :**
- Débugger des problèmes de démarrage en temps réel
- Surveiller le comportement de l'app pendant des tests de charge
- Observer les erreurs pendant qu'un utilisateur reproduit un bug

---

## Kudu — Console de diagnostic avancée

Kudu (aussi appelé SCM site) est un outil de gestion et diagnostic qui tourne **en parallèle** de ta web app.

**Accès :**
```
https://<app-name>.scm.azurewebsites.net
```

**Ce que Kudu peut faire :**

| Feature | URL | Utilité |
|---------|-----|---------|
| **Environment** | `/Env` | Voir toutes les variables d'env injectées |
| **Debug console** | `/DebugConsole` | Naviguer dans `/home` via un shell |
| **Log files** | `/api/logs/docker` | Accéder directement aux fichiers de logs |
| **Diagnostic dump** | `/api/dump` | Télécharger un ZIP complet pour analyse offline |
| **Process explorer** | `/ProcessExplorer` | Voir les processus Kudu (pas du container) |

### La limitation fondamentale de Kudu

> **Kudu ne tourne PAS dans le même environnement que ton container.**

Kudu est un site séparé. Il peut accéder à `/home` (stockage partagé) mais **pas au filesystem interne du container**. Tu ne peux pas :
- Voir les fichiers dans `/app` du container
- Inspecter les processus qui tournent dans le container
- Exécuter des commandes dans le container

**Pour ça, il faut SSH.**

---

## Azure Monitor / Log Analytics

Pour la rétention long terme, les alertes et les requêtes avancées :

```bash
resourceId=$(az webapp show -g myResourceGroup -n myDocumentProcessor --query id -o tsv)
workspaceId=$(az monitor log-analytics workspace show -g myRG -n myWorkspace --query id -o tsv)

az monitor diagnostic-settings create \
    --resource "$resourceId" \
    --name myDiagnosticSettings \
    --workspace "$workspaceId" \
    --logs '[
        {"category":"AppServiceConsoleLogs","enabled":true},
        {"category":"AppServiceHTTPLogs","enabled":true},
        {"category":"AppServicePlatformLogs","enabled":true}
    ]'
```

**Catégories de logs disponibles :**

| Catégorie | Contenu |
|-----------|---------|
| `AppServiceConsoleLogs` | stdout et stderr du container |
| `AppServiceHTTPLogs` | Requêtes HTTP : méthode, URL, status, durée |
| `AppServicePlatformLogs` | Événements cycle de vie du container |
| `AppServiceAppLogs` | Logs applicatifs si configurés |

**Requête Kusto pour les erreurs récentes :**
```kusto
AppServiceConsoleLogs
| where Level == "Error"
| where TimeGenerated > ago(1h)
| project TimeGenerated, ResultDescription
| order by TimeGenerated desc
```

---

## SSH dans le container

SSH te donne un accès **interactif direct** à l'intérieur du container — la seule façon d'inspecter les fichiers et processus du container en temps réel.

### Configuration requise dans le Dockerfile

```dockerfile
FROM python:3.11-slim

# Installer et configurer SSH
RUN apt-get update && apt-get install -y openssh-server \
    && echo "root:Docker!" | chpasswd    # Mot de passe OBLIGATOIRE exact

COPY sshd_config /etc/ssh/              # Config SSH custom

EXPOSE 8000 2222                        # 8000 = app, 2222 = SSH (obligatoire)

CMD ["/bin/bash", "-c", "service ssh start && gunicorn app:application"]
```

**Points critiques :**
- Port SSH = **2222** (exigé par App Service, pas 22)
- Mot de passe root = **`Docker!`** (exigé exact par App Service)
- SSH doit démarrer EN MÊME TEMPS que l'application (pas de process manager séparé requis)

**Accès SSH :** Portail Azure → ta web app → **Development Tools → SSH**

---

## Problèmes courants — Guide de diagnostic

### 1. Container ne démarre pas
**Symptômes :** URL retourne une erreur, logs montrent des échecs.

**Procédure :**
```bash
# Étape 1 : activer les logs si pas encore fait
az webapp log config --docker-container-logging filesystem -g myRG -n myApp

# Étape 2 : voir ce qui se passe au démarrage
az webapp log tail -g myRG -n myApp

# Étape 3 : vérifier les variables d'env dans Kudu
# https://myapp.scm.azurewebsites.net/Env
```

**Causes les plus fréquentes :**
- Variable d'environnement manquante que l'app requiert au démarrage
- `WEBSITES_PORT` incorrect ou absent
- Crash de l'app pendant l'initialisation (voir les logs pour le traceback)
- Image non accessible (permissions ACR manquantes)

---

### 2. Réponses 404 après déploiement

**Symptômes :** Container démarre, mais toutes les requêtes retournent 404.

**Causes et solutions :**

| Cause | Solution |
|-------|---------|
| App écoute sur `localhost` | Changer pour `0.0.0.0` dans le code |
| `WEBSITES_PORT` incorrect | Mettre le bon port dans les app settings |
| Routes mal configurées | Vérifier que l'app répond à `/` ou au chemin attendu |

---

### 3. Variables d'environnement manquantes

**Symptômes :** `KeyError`, `None` là où une valeur est attendue, comportement inattendu.

**Diagnostic :**
1. Portail Azure → Environment variables → vérifier que le setting existe
2. Kudu `/Env` → vérifier que la variable est bien injectée dans le container
3. Vérifier les typos dans le nom de la variable

---

### 4. Cold starts lents

**Symptômes :** Première requête après idle prend 10-30 secondes ou plus.

**Solutions par ordre d'efficacité :**

| Solution | Effet | Prérequis |
|---------|-------|-----------|
| Activer **Always-on** | Élimine le cold start | Tier Basic |
| Réduire la taille de l'image | Moins de données à pull | Multi-stage build |
| Optimiser le startup | App prête plus vite | Diff initialisation lourde |
| Pre-warming (tier Premium) | Instances chaudes prêtes | Tier Premium v3 |

---

#### ⭐ STAR — Diagnostic méthodique d'une panne

**Situation :** L'API de traitement de documents retourne 500 en production depuis le dernier déploiement. Les utilisateurs ne peuvent plus uploader de documents.

**Tâche :** Identifier la cause racine sans accès direct au serveur.

**Action :**
```bash
# 1. Voir les logs en temps réel
az webapp log tail -g prod-rg -n doc-processor

# Résultat : "Error: AZURE_STORAGE_CONNECTION_STRING environment variable not set"

# 2. Vérifier les app settings
az webapp config appsettings list -g prod-rg -n doc-processor --output table

# Résultat : AZURE_STORAGE_CONNECTION_STRING absent de la liste !

# 3. Ajouter le setting manquant
az webapp config appsettings set -g prod-rg -n doc-processor \
    --settings AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;..."
```

**Résultat :** La variable manquait depuis le dernier déploiement (erreur lors du transfert des settings d'environnement). 5 minutes de diagnostic → problème résolu → service restauré.
