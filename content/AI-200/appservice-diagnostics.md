> **Dans cette unité on va parler de :**
> - Activer et lire les logs du container (stdout/stderr)
> - Le log stream en temps réel avec `az webapp log tail`
> - Kudu (SCM) — le portail de diagnostic avancé
> - Les diagnostics Azure Monitor / Log Analytics
> - SSH dans le container pour le troubleshooting interactif
> - Les problèmes courants et leurs solutions

---

## Logs du container

App Service capture **stdout** et **stderr** de ton container. Pour les activer :

```bash
az webapp log config \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --docker-container-logging filesystem
```

Les logs sont stockés dans `/home/LogFiles/` et accessibles via les outils de diagnostic.

**Ce qui est capturé :**

| Type | Description |
|------|-------------|
| Application output | Tout ce que ton app écrit sur stdout |
| Error output | Exceptions et erreurs sur stderr |
| Framework logs | Démarrage du serveur web, logs de requêtes |
| Platform messages | Événements du cycle de vie du container (start, stop...) |

---

## Log stream (temps réel)

```bash
# Streamer les logs en direct
az webapp log tail \
    --resource-group myResourceGroup \
    --name myDocumentProcessor
```

**Ctrl+C** pour arrêter. Dans le portail : **Monitoring > Log stream**.

Pour une app scalée, le stream affiche les logs de **toutes les instances** avec un identifiant par instance.

---

## Kudu — SCM (diagnostic avancé)

Accès :

```
https://<app-name>.scm.azurewebsites.net
```

**Fonctionnalités clés :**

| Feature | Utilité |
|---------|---------|
| **Environment** | Voir toutes les variables d'env injectées dans le container |
| **Debug console** | Naviguer dans `/home` — logs, fichiers persistants |
| **Diagnostic dump** | Télécharger un ZIP complet (logs + config + diagnostics) |

> **Limite importante :** Kudu n'est PAS le même environnement que ton container. Tu ne peux pas voir le filesystem du container ni les processus qui tournent dedans. Pour ça, utilise SSH.

---

## Azure Monitor / Log Analytics

Pour de la rétention long terme et des analyses avancées :

```bash
resourceId=$(az webapp show -g myResourceGroup -n myDocumentProcessor --query id -o tsv)
workspaceId=$(az monitor log-analytics workspace show -g myResourceGroup -n myWorkspace --query id -o tsv)

az monitor diagnostic-settings create \
    --resource "$resourceId" \
    --name myDiagnosticSettings \
    --workspace "$workspaceId" \
    --logs '[
        {"category":"AppServiceConsoleLogs","enabled":true},
        {"category":"AppServiceHTTPLogs","enabled":true}
    ]'
```

**Catégories disponibles :**

| Catégorie | Contenu |
|-----------|---------|
| `AppServiceConsoleLogs` | stdout et stderr du container |
| `AppServiceHTTPLogs` | Requêtes et réponses HTTP |
| `AppServicePlatformLogs` | Événements cycle de vie du container |
| `AppServiceAppLogs` | Logs applicatifs (si configurés) |

**Exemple de query Kusto pour les erreurs récentes :**

```kusto
AppServiceConsoleLogs
| where Level == "Error"
| where TimeGenerated > ago(1h)
| project TimeGenerated, ResultDescription
| order by TimeGenerated desc
```

---

## SSH dans le container

Pour le troubleshooting interactif — nécessite d'avoir configuré SSH dans ton image :

**Dockerfile :**

```dockerfile
RUN apt-get update && apt-get install -y openssh-server \
    && echo "root:Docker!" | chpasswd

COPY sshd_config /etc/ssh/

EXPOSE 8000 2222

CMD ["/bin/bash", "-c", "service ssh start && gunicorn app:application"]
```

- Le serveur SSH doit écouter sur le port **2222**
- Le mot de passe root doit être **`Docker!`** (requis par App Service)

Accès SSH via le portail : **Development Tools > SSH**

---

## Problèmes courants

### Container ne démarre pas

**Symptômes :** L'URL retourne une erreur, les logs montrent des échecs au démarrage.

**Diagnostic :**
```bash
az webapp log tail --resource-group myRG --name myApp
```

**Causes fréquentes :**
- Variables d'environnement manquantes que l'app requiert au démarrage
- Mismatch entre `WEBSITES_PORT` et le port écouté par le container
- Crash de l'application pendant l'initialisation (dépendances manquantes)

---

### Réponses 404 après déploiement

**Symptômes :** Le container démarre, mais les requêtes retournent 404.

**Causes fréquentes :**
- Application qui écoute sur `localhost` au lieu de `0.0.0.0`
- `WEBSITES_PORT` incorrect
- Routes de l'application mal configurées

---

#### ⭐ STAR — Diagnostiquer une erreur de démarrage

**Situation :** Une API déployée sur App Service renvoie une erreur 500 immédiatement après le déploiement. Aucun log visible dans le portail.

**Tâche :** Identifier si c'est une erreur de config (variable manquante) ou une erreur de code.

**Action :**
```bash
# 1. Activer les logs
az webapp log config --resource-group myRG --name myAPI --docker-container-logging filesystem

# 2. Streamer en temps réel
az webapp log tail --resource-group myRG --name myAPI

# 3. Vérifier les variables d'env dans Kudu
# https://myapi.scm.azurewebsites.net/Env
```

**Résultat :** Les logs montrent `KeyError: 'STORAGE_CONNECTION_STRING'` — une variable d'environnement manquante. Ajout de l'app setting → container démarre correctement.

---

### Variables d'environnement manquantes

**Symptômes :** L'app log des erreurs sur des valeurs undefined.

**Diagnostic :**
- Vérifier dans le portail que les settings sont sauvegardés
- Checker dans Kudu (`/Env`) que les variables sont injectées
- Vérifier les typos dans les noms de variables

---

### Cold starts lents

**Symptômes :** Première requête après idle très lente.

**Solutions :**
1. Activer **Always-on** (tier Basic minimum)
2. Réduire la taille de l'image (multi-stage build, base image slim)
3. Optimiser le startup de l'application (différer l'initialisation lourde)

---

## Récap des commandes de diagnostic

```bash
# Activer les logs
az webapp log config --docker-container-logging filesystem ...

# Stream en temps réel
az webapp log tail ...

# Télécharger les logs
az webapp log download ...

# Voir les settings actuels
az webapp config appsettings list --output table ...

# Redémarrer l'app
az webapp restart ...
```
