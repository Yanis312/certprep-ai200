> **Dans cette unité on va parler de :**
> - Overrider le CMD du Dockerfile avec une startup command (et pourquoi ENTRYPOINT reste intact)
> - Configurer le bon port avec `WEBSITES_PORT` — tableau par framework
> - La différence entre filesystem éphémère (défaut) et `/home` persistant
> - Les implications du stockage partagé `/home` lors du scale out
> - Always-on et les cold starts — comment ça fonctionne vraiment
> - Les health checks — intervalles, seuils, implémentation

---

## Startup commands

Par défaut, App Service exécute le **CMD** défini dans ton Dockerfile. Tu peux l'overrider sans rebuilder l'image :

```bash
# Overrider CMD — ENTRYPOINT reste inchangé
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --startup-file "gunicorn --bind=0.0.0.0:8000 --workers=4 app:application"
```

**La startup command remplace CMD. ENTRYPOINT est toujours respecté.**

### Avec un shell (pour les scripts d'initialisation)
```bash
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --startup-file "/bin/bash -c 'python migrate.py && gunicorn app:application'"
```

### Cas d'usage courants
| Scénario | Startup command |
|----------|----------------|
| Plus de workers Gunicorn | `gunicorn --bind=0.0.0.0:8000 --workers=4 app:application` |
| Migrations DB avant démarrage | `/bin/bash -c 'python migrate.py && python app.py'` |
| Config framework spécifique | `node server.js --port 8080 --env production` |

---

#### ⭐ STAR — Migration DB avant démarrage sans rebuild

**Situation :** L'équipe déploie une nouvelle version de l'API avec des changements de schéma DB. Sans migration, l'app crash au démarrage car la DB est incompatible.

**Tâche :** S'assurer que les migrations s'exécutent avant que l'app démarre, sans modifier le Dockerfile.

**Action :**
```bash
az webapp config set \
    --resource-group myRG --name myAPI \
    --startup-file "/bin/bash -c 'python manage.py migrate && gunicorn app:application'"
```

**Résultat :** À chaque déploiement, les migrations s'exécutent d'abord. Si elles échouent, l'app ne démarre pas — ce qui est le bon comportement (mieux qu'une app qui crashe après démarrage).

---

## Configuration du port

App Service route le trafic vers les ports **80 ou 8080** par défaut. Si ton container écoute ailleurs :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings WEBSITES_PORT=8000
```

| Framework | Port par défaut | Setting requis |
|-----------|----------------|---------------|
| Node.js / Express | 3000 | `WEBSITES_PORT=3000` |
| Python / Gunicorn | 8000 | `WEBSITES_PORT=8000` |
| Java / Spring Boot | 8080 | `WEBSITES_PORT=8080` |
| ASP.NET Core | 80 | Aucun |
| Flask (dev) | 5000 | `WEBSITES_PORT=5000` |

**Points importants :**
- App Service gère le TLS en amont → ton container reçoit du **HTTP** même si le client envoie du HTTPS
- **Un seul port HTTP** est supporté par container custom
- Le container doit binder sur **`0.0.0.0`** (pas `localhost`) pour recevoir les requêtes externes

---

## Stockage persistant

Par défaut, tout ce qu'un container écrit dans son filesystem est **perdu au redémarrage**. C'est le comportement standard des containers.

```bash
# Activer le montage /home persistant
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

**Ce que ça change :**

| | Sans storage (défaut) | Avec storage activé |
|-|----------------------|-------------------|
| Données au redémarrage | Perdues | Conservées dans `/home` |
| Entre instances (scale out) | Isolées | **Partagées** — toutes les instances lisent/écrivent le même `/home` |
| Logs | Perdus | Conservés dans `/home/LogFiles/` |

> **Attention avec le scale out :** Si 5 instances écrivent simultanément dans `/home/output/`, il peut y avoir des conflits. Pour des workloads à haute concurrence, utilise Azure Blob Storage à la place.

---

#### ⭐ STAR — Stockage partagé vs Blob Storage

**Situation :** Un service de traitement de documents scalé à 10 instances écrit les résultats dans `/home/output/`. Des fichiers disparaissent et d'autres sont corrompus.

**Tâche :** Identifier et corriger le problème de concurrence sur le stockage.

**Action :** Migrer vers Azure Blob Storage avec des noms de fichiers uniques (UUID) au lieu du stockage `/home` partagé.

**Résultat :** Chaque instance écrit dans son propre blob — zéro conflit. Le `/home` reste utilisé uniquement pour les logs. Les fichiers de résultats sont accessibles depuis une URL Blob.

---

## Always-on — Éliminer les cold starts

### Ce qu'est un cold start
Sans Always-on, App Service met l'app en veille après **~20 minutes d'inactivité**. Quand la prochaine requête arrive :
1. App Service doit démarrer le container
2. Puller l'image si les couches ne sont pas en cache
3. Attendre que l'application soit prête
4. Traiter la requête

Ce délai peut être de quelques secondes à **plusieurs minutes** selon la taille de l'image et le temps de démarrage de l'app.

```bash
# Activer Always-on — tier Basic minimum requis
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --always-on true
```

App Service envoie des **pings périodiques** pour maintenir l'app active en permanence.

**Quand activer Always-on :**
- Apps production où le temps de réponse est critique
- Services avec long startup time (chargement de modèles ML, connexions DB)
- Containers avec grosses images
- Services qui maintiennent des connexions persistantes (WebSockets, queues)

> **Requis :** Tier **Basic ou supérieur** — non disponible sur Free et Shared.

---

## Health checks

App Service surveille activement la santé de chaque instance :

```bash
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --generic-configurations '{"healthCheckPath": "/health"}'
```

**Comment ça fonctionne :**
- Ping HTTP vers `/health` toutes les **1 minute**
- Réponse HTTP 200 = instance saine
- Après **10 échecs consécutifs** → instance retirée du load balancer
- Si l'instance reste unhealthy longtemps → App Service la remplace

**Implémentation simple :**
```python
@app.route('/health')
def health_check():
    return {'status': 'healthy'}, 200
```

**Implémentation avec vérification des dépendances :**
```python
@app.route('/health')
def health_check():
    try:
        db.execute('SELECT 1')           # DB accessible ?
        storage.list_containers()        # Storage accessible ?
        return {'status': 'healthy'}, 200
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 503
```

> **Attention :** Modifier la config health check **redémarre l'app**. À faire prudemment en production, de préférence pendant une fenêtre de maintenance.

---

#### ⭐ STAR — Health check qui détecte une vraie panne

**Situation :** Une API d'inférence répond HTTP 200 à toutes les requêtes, mais retourne des erreurs 500 parce que sa connexion à Azure Cognitive Services est perdue.

**Tâche :** Faire en sorte que App Service détecte que l'instance est "malade" même si le container tourne.

**Action :** Implémenter un health check qui teste vraiment les dépendances :
```python
@app.route('/health')
def health_check():
    try:
        # Tester la connexion au service d'inférence
        response = requests.get(COGNITIVE_SERVICES_URL + '/status', timeout=2)
        if response.status_code != 200:
            return {'status': 'unhealthy', 'reason': 'cognitive services unreachable'}, 503
        return {'status': 'healthy'}, 200
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 503
```

**Résultat :** App Service retire automatiquement les instances avec la connexion perdue. Le load balancer ne route que vers les instances saines. L'équipe est alertée sans intervention manuelle.
