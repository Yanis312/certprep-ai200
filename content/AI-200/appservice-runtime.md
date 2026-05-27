> **Dans cette unité on va parler de :**
> - Overrider le CMD du Dockerfile avec une startup command
> - Configurer le bon port avec `WEBSITES_PORT`
> - Le stockage persistant avec `/home` et `WEBSITES_ENABLE_APP_SERVICE_STORAGE`
> - Éliminer les cold starts avec Always-on
> - Monitorer la santé du container avec les health checks

---

## Startup commands

Par défaut, App Service utilise le `CMD` défini dans ton Dockerfile. Tu peux l'overrider :

```bash
# Overrider CMD (ENTRYPOINT reste inchangé)
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --startup-file "gunicorn --bind=0.0.0.0:8000 --workers=4 app:application"

# Avec shell (pour migrations avant démarrage)
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --startup-file "/bin/bash -c 'python migrate.py && gunicorn app:application'"
```

**Cas d'usage courants :**
- Passer des arguments runtime à l'application
- Exécuter des migrations DB avant le démarrage
- Démarrer plusieurs processus dans le container
- Overrider les configs du framework

---

## Configuration du port

App Service route automatiquement le trafic vers le port **80 ou 8080**. Si ton container écoute sur un autre port, tu dois le déclarer :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings WEBSITES_PORT=8000
```

| Framework | Port par défaut | Setting nécessaire |
|-----------|----------------|-------------------|
| Node.js (Express) | 3000 | `WEBSITES_PORT=3000` |
| Python (Gunicorn) | 8000 | `WEBSITES_PORT=8000` |
| Java (Spring Boot) | 8080 | `WEBSITES_PORT=8080` |
| ASP.NET Core | 80 | Aucun |

> **Important :** App Service gère le TLS en amont. Ton container reçoit du **HTTP** même si le client se connecte en HTTPS. Un seul port HTTP est supporté par container.

---

## Stockage persistant

Par défaut, tout ce qui est écrit dans le container est **ephémère** — perdu au redémarrage.

Pour persister des données, active le montage `/home` :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```

**Avec ce setting :**
- `/home` persiste entre les redémarrages
- Toutes les instances d'une app scalée **partagent le même `/home`**
- `/home/LogFiles/` stocke les logs du container et de l'application

> **Pour de gros volumes ou des I/O élevés :** Monte Azure Storage comme volume supplémentaire — le quota de `/home` est partagé entre toutes les apps du plan.

---

#### ⭐ STAR — Stockage persistant pour un service de traitement

**Situation :** Un service de traitement de documents écrit les résultats sur le disque. Après chaque redémarrage App Service, les fichiers traités disparaissent.

**Tâche :** Persister les résultats de traitement entre les redémarrages sans changer le code.

**Action :**
```bash
az webapp config appsettings set \
    --resource-group myRG --name myDocService \
    --settings WEBSITES_ENABLE_APP_SERVICE_STORAGE=true
```
L'application écrit dans `/home/output/` au lieu du filesystem local.

**Résultat :** Les fichiers survivent aux redémarrages. Toutes les instances de l'app (si scale out) accèdent aux mêmes fichiers dans `/home`.

---

## Always-on

Sans Always-on, App Service met l'app en veille après ~20 minutes d'inactivité. La prochaine requête déclenche un **cold start** (plusieurs secondes à minutes selon la taille de l'image).

```bash
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --always-on true
```

App Service envoie des requêtes périodiques pour maintenir l'app active.

> **Requis :** Tier **Basic ou supérieur** (pas disponible sur le tier Free/Shared).

**À activer pour :**
- Applications production où le temps de réponse compte
- Apps avec long startup time
- Containers avec grosses images
- Services avec processus background ou connexions persistantes

---

## Health checks

App Service envoie des requêtes HTTP périodiques pour vérifier que le container est en bonne santé :

```bash
az webapp config set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --generic-configurations '{"healthCheckPath": "/health"}'
```

**Comportement :**
- Ping toutes les **minutes**
- Après **10 échecs consécutifs** → instance retirée du load balancer
- Instance remplacée si elle reste unhealthy trop longtemps

**Implémentation minimale (Flask) :**

```python
@app.route('/health')
def health_check():
    return {'status': 'healthy'}, 200
```

**Implémentation complète (avec vérification des dépendances) :**

```python
@app.route('/health')
def health_check():
    try:
        db.execute('SELECT 1')          # Vérifier la DB
        storage.list_containers()       # Vérifier le stockage
        return {'status': 'healthy'}, 200
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}, 503
```

> **Attention :** Changer la config health check redémarre l'app — à faire prudemment en production.
