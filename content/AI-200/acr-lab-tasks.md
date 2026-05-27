> **Dans cette unité on va parler de :**
> - Les fichiers du projet lab (app.py, Dockerfile, azdeploy.ps1) et leur rôle
> - Déployer une infrastructure ACR depuis un script PowerShell
> - Builder une image Docker dans le cloud avec `az acr build` (sans Docker local)
> - Vérifier les images, les tags, les digests dans le registry
> - Exécuter un container directement depuis ACR avec `az acr run`
> - Gérer plusieurs versions d'une image et verrouiller la production

---

## Résumé du lab — Ce qu'on a fait

### Infrastructure créée
- **Resource Group** `rg-ai200-lab` dans `eastus`
- **ACR** `acrf1450915` (SKU Basic) — login server : `acrf1450915.azurecr.io`
- Enregistrement du provider `Microsoft.ContainerRegistry` (une seule fois par subscription)

### Images buildées
| Image | Run ID | Digest | Durée |
|-------|--------|--------|-------|
| `inference-api:v1.0.0` | ca1 | `sha256:72d64d59...` | 22s |
| *(test run Flask)* | ca2 | — | 6s |
| `inference-api:v1.1.0` | ca3 | `sha256:53cffb5b...` | 22s |

### Ce qu'on a observé
- **Aucun Docker local nécessaire** — `az acr build` envoie le contexte vers Azure qui fait tout
- **Déduplication des couches** — `python:3.11-slim` téléchargé une seule fois, réutilisé pour v1.1.0
- **Tags vs Digests** — `v1.0.0` est un tag (modifiable), `sha256:72d64d59...` est le digest (immuable)
- **Verrouillage** — `--write-enabled false` sur `v1.0.0` → `writeEnabled: false` confirmé
- **Historique** — `az acr task list-runs` montre ca1, ca2, ca3 avec statut, trigger et durée

### Commandes clés retenues
```powershell
# 1. Enregistrer le provider
az provider register --namespace Microsoft.ContainerRegistry --wait

# 2. Builder dans le cloud
az acr build --registry $env:ACR_NAME --image inference-api:v1.0.0 ./api

# 3. Vérifier
az acr repository list --name $env:ACR_NAME --output table
az acr repository show-tags --name $env:ACR_NAME --repository inference-api --output table
az acr manifest list-metadata --registry $env:ACR_NAME --name inference-api --output table

# 4. Exécuter un test
az acr run --registry $env:ACR_NAME --cmd "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'" /dev/null

# 5. Historique
az acr task list-runs --registry $env:ACR_NAME --output table

# 6. Verrouiller la production
az acr repository update --name $env:ACR_NAME --image inference-api:v1.0.0 --write-enabled false

# 7. Nettoyage
az group delete --name $env:RESOURCE_GROUP --no-wait --yes
```

---

## Les fichiers du projet

Quand tu télécharges le projet lab, tu obtiens 3 fichiers essentiels. Voici exactement ce que chacun fait :

### `api/app.py` — L'application Flask

```python
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "version": os.getenv("APP_VERSION", "1.0.0")
    })

@app.route('/predict')
def predict():
    return jsonify({
        "prediction": "sample-result",
        "confidence": 0.95,
        "model_version": os.getenv("MODEL_VERSION", "v1")
    })

@app.route('/')
def root():
    return jsonify({
        "name": "Inference API",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "endpoints": ["/health", "/predict"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Ce que ça simule :** une vraie API d'inférence IA — comme ce qu'un modèle de ML expose en production. Les 3 routes représentent :
- `/health` → vérifié par les orchestrateurs (Kubernetes, ACI) pour savoir si le container est vivant
- `/predict` → l'endpoint principal qui renvoie une prédiction (simulée ici)
- `/` → documentation basique de l'API

### `api/Dockerfile` — La recette pour construire l'image

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask

COPY app.py .

ENV APP_VERSION=1.0.0
ENV MODEL_VERSION=v1

EXPOSE 5000

CMD ["python", "app.py"]
```

**Ligne par ligne :**
| Instruction | Ce qu'elle fait |
|-------------|----------------|
| `FROM python:3.11-slim` | Image de base légère (~50MB vs 1GB pour la version complète) |
| `WORKDIR /app` | Tous les fichiers iront dans `/app` à l'intérieur du container |
| `RUN pip install flask` | Installe Flask au moment du build (couche cachée et réutilisée) |
| `COPY app.py .` | Copie le code dans l'image |
| `ENV APP_VERSION=1.0.0` | Variable d'environnement lisible par `os.getenv()` dans app.py |
| `EXPOSE 5000` | Déclare le port (documentation — n'ouvre pas vraiment le port) |
| `CMD ["python", "app.py"]` | Commande lancée au démarrage du container |

### `azdeploy.ps1` — Le script de déploiement infrastructure

Ce script crée automatiquement :
1. Un **Resource Group** (conteneur logique de toutes tes ressources Azure)
2. Un **Azure Container Registry** avec un nom unique (hash SHA1 de ton ID utilisateur)
3. Un fichier `.env.ps1` avec les variables d'environnement pour la suite du lab

```powershell
# Les 2 lignes que tu dois remplir :
$rg = "rg-ai200-lab"    # nom du resource group
$location = "eastus"    # région Azure

# Tout le reste est automatique :
# - Hash de ton compte Azure → nom unique pour l'ACR
# - Création du resource group si absent
# - Création de l'ACR SKU Basic
# - Sauvegarde des variables dans .env.ps1
```

---

#### ⭐ STAR — Pourquoi on sépare l'app, le Dockerfile et le script de déploiement ?

**Situation :** Une équipe doit déployer la même API d'inférence dans 5 environnements différents (dev, staging, prod EU, prod US, prod AS).

**Tâche :** Éviter de dupliquer le code et de configurer chaque environnement à la main.

**Action :** On sépare les responsabilités en 3 couches :
- `app.py` → le code métier, identique partout
- `Dockerfile` → la recette de l'image, identique partout
- `azdeploy.ps1` → l'infrastructure, différente par environnement (nom du RG, région)

**Résultat :** Un seul `git pull` + un seul script suffit pour déployer dans un nouvel environnement. Les variables d'environnement (`APP_VERSION`, `MODEL_VERSION`) permettent de configurer sans toucher au code.

---

## Étape 0 — Charger les variables d'environnement

Après avoir lancé `azdeploy.ps1`, charge les variables dans ton terminal :

```powershell
# PowerShell — OBLIGATOIRE avant toutes les commandes suivantes
. .\.env.ps1

# Vérifier que c'est chargé
$env:ACR_NAME    # doit afficher le nom de ton ACR (ex: acrf1450915)
```

> **Pourquoi `. .\.env.ps1` et pas `.\env.ps1` ?**
> Le `.` (dot-sourcing) exécute le script **dans le contexte courant** — les variables restent disponibles dans ton terminal. Sans le dot, les variables disparaissent quand le script se termine.

---

## Étape 1 — Déployer l'infrastructure

```powershell
# 1. Connexion Azure
az login --use-device-code

# 2. Enregistrer le provider (une seule fois par subscription)
az provider register --namespace Microsoft.ContainerRegistry --wait

# 3. Lancer le script de déploiement
.\azdeploy.ps1

# 4. Charger les variables
. .\.env.ps1
```

**Résultat attendu :**
```
✓ Resource group created: rg-ai200-lab
✓ ACR created: acrf1450915
  Login server: acrf1450915.azurecr.io
```

---

## Étape 2 — Builder l'image avec ACR Tasks

```powershell
az acr build `
    --registry $env:ACR_NAME `
    --image inference-api:v1.0.0 `
    ./api
```

**Ce que tu vas voir dans la sortie :**
1. `Packing source code into tar to upload...` → ton dossier `./api` est compressé
2. `Queued a build with ID: ca1` → Azure a créé une ACR Task run
3. `Step 1/7 : FROM python:3.11-slim` → le build Docker se passe dans Azure
4. `Step 5/7 : RUN pip install --no-cache-dir flask` → Flask s'installe
5. `Successfully pushed image: acrf1450915.azurecr.io/inference-api:v1.0.0`
6. `Run ID: ca1 was successful after 45s`

> **Aucun Docker local nécessaire** — c'est la puissance d'ACR Tasks. Azure s'occupe du build dans le cloud et push directement dans ton registry.

---

## Étape 3 — Vérifier l'image dans le registry

```powershell
# Lister les repositories
az acr repository list --name $env:ACR_NAME --output table

# Lister les tags
az acr repository show-tags `
    --name $env:ACR_NAME `
    --repository inference-api `
    --output table

# Voir le digest SHA-256
az acr manifest list-metadata `
    --registry $env:ACR_NAME `
    --name inference-api `
    --output table
```

**Ce que tu vas voir :**

```
Result
-----------
inference-api
```
```
Result
-------
v1.0.0
```
```
Digest                                                                   Tags       CreatedTime
-----------------------------------------------------------------------  ---------  ---------------------------
sha256:a3f8c2d1...                                                       ['v1.0.0'] 2025-01-15T10:23:45.000000Z
```

**Note le digest** — c'est le hash SHA-256 qui identifie l'image de façon **immuable**. Même si tu changes le tag `v1.0.0` pour pointer vers une autre image, le digest `sha256:a3f8c2d1...` pointera toujours vers cette version exacte.

---

#### ⭐ STAR — Tags vs Digests en production

**Situation :** Un déploiement en production utilise `inference-api:v1.0.0`. La nuit, un développeur écrase accidentellement le tag `v1.0.0` avec une nouvelle image.

**Tâche :** Revenir à la version exacte qui tournait avant l'incident.

**Action :** Utiliser le digest au lieu du tag dans le manifeste de déploiement :
```yaml
# Fragile — le tag peut changer
image: acrf1450915.azurecr.io/inference-api:v1.0.0

# Immuable — pointe toujours vers la même image exacte
image: acrf1450915.azurecr.io/inference-api@sha256:a3f8c2d1...
```

**Résultat :** Le déploiement par digest est impossible à écraser. L'équipe peut rollback instantanément vers la version exacte qui tournait.

---

## Étape 4 — Exécuter l'image avec `az acr run`

```powershell
az acr run `
    --registry $env:ACR_NAME `
    --cmd "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0 python -c 'from app import app'" `
    /dev/null
```

**Décomposition de la commande :**
- `--registry` → quel ACR utiliser pour récupérer l'image
- `--cmd` → commande à exécuter dans le container (`python -c 'from app import app'` teste que Flask s'importe correctement)
- `/dev/null` → pas de fichiers sources à envoyer (l'image est déjà dans le registry)

**Résultat attendu :** `Run ID: ca2 was successful after 20s`

---

## Étape 5 — Builder une v1.1.0

```powershell
az acr build `
    --registry $env:ACR_NAME `
    --image inference-api:v1.1.0 `
    ./api

# Vérifier que les 2 versions coexistent
az acr repository show-tags `
    --name $env:ACR_NAME `
    --repository inference-api `
    --output table
```

**Résultat :**
```
Result
-------
v1.0.0
v1.1.0
```

Les deux versions coexistent dans le même repository — c'est exactement le comportement attendu d'un registry de production.

---

## Étape 6 — Historique et verrouillage de la production

```powershell
# Voir l'historique de tous les builds
az acr task list-runs `
    --registry $env:ACR_NAME `
    --output table
```

**Résultat :**
```
RUN ID    TASK    PLATFORM    STATUS     TRIGGER    STARTED              DURATION
--------  ------  ----------  ---------  ---------  -------------------  ----------
ca3       ...     linux       Succeeded  Manual     2025-01-15T10:35:00  00:00:42
ca2       ...     linux       Succeeded  Manual     2025-01-15T10:28:00  00:00:21
ca1       ...     linux       Succeeded  Manual     2025-01-15T10:23:00  00:00:45
```

```powershell
# Verrouiller v1.0.0 en lecture seule (image de production)
az acr repository update `
    --name $env:ACR_NAME `
    --image inference-api:v1.0.0 `
    --write-enabled false

# Vérifier le verrou
az acr repository show `
    --name $env:ACR_NAME `
    --image inference-api:v1.0.0
```

**Résultat :** `"writeEnabled": false` — personne ne peut écraser cette image.

---

#### ⭐ STAR — Verrouiller une image de production

**Situation :** Une équipe vient de déployer `inference-api:v1.0.0` en production pour 10 000 utilisateurs. Un développeur fait une erreur et rebuild avec le même tag `v1.0.0`.

**Tâche :** Empêcher que n'importe qui puisse écraser une image de production.

**Action :**
```powershell
az acr repository update `
    --name $env:ACR_NAME `
    --image inference-api:v1.0.0 `
    --write-enabled false
```

**Résultat :** Toute tentative de push sur `v1.0.0` renvoie une erreur `403 Forbidden`. La version production est protégée. Le développeur doit créer `v1.0.1` au lieu d'écraser `v1.0.0`.

---

## Étape 7 — Nettoyage (OBLIGATOIRE)

```powershell
az group delete `
    --name $env:RESOURCE_GROUP `
    --no-wait `
    --yes
```

**Pourquoi `--no-wait` ?** La suppression d'un resource group peut prendre 2-3 minutes. `--no-wait` rend la main immédiatement — Azure continue la suppression en arrière-plan.

**Pourquoi `--yes` ?** Evite la confirmation interactive. Sans ce flag, Azure demande "Are you sure?" et attend une réponse.

> ⚠️ **Fais-le immédiatement après le lab.** Un ACR Basic coûte ~$0.167/jour même sans images dedans.

---

## Ce que ce lab valide (important pour l'examen)

| Commande | Ce qu'elle fait |
|----------|----------------|
| `az provider register --namespace Microsoft.ContainerRegistry` | Activer le service sur ta subscription |
| `az acr build --registry $ACR --image api:v1 ./api` | Builder dans le cloud sans Docker local |
| `az acr repository list` | Lister les repositories dans l'ACR |
| `az acr repository show-tags` | Voir les versions (tags) d'une image |
| `az acr manifest list-metadata` | Voir le digest SHA-256 |
| `az acr run --cmd "image cmd" /dev/null` | Exécuter une image depuis ACR |
| `az acr task list-runs` | Historique des builds ACR Tasks |
| `az acr repository update --write-enabled false` | Verrouiller une image en production |
| `az group delete --no-wait --yes` | Nettoyer toutes les ressources d'un coup |

---

## Dépannage

```powershell
# Vérifier que tu es connecté au bon compte
az account show

# Vérifier que la variable ACR_NAME est chargée
$env:ACR_NAME    # doit afficher le nom de ton ACR

# Si vide → recharger les variables
. .\.env.ps1

# Vérifier que le registry existe
az acr list --output table

# Si erreur MissingSubscriptionRegistration
az provider register --namespace Microsoft.ContainerRegistry --wait
```

---

## Résumé officiel Microsoft — Ce que tu as appris dans ce module

> *Extrait de la page Summary de Microsoft Learn*

**1. Hiérarchie ACR**
ACR organise les images avec une hiérarchie : **Registry → Repository → Artifact**. Les manifests, couches et digests permettent un stockage efficace et une identification précise des images.

**2. Tags vs Digests**
- Les **tags** (`v1.0.0`) sont des références lisibles mais mutables
- Les **digests** (`sha256:...`) sont des identifiants immuables qui garantissent la reproductibilité

**3. ACR Tasks**
- **Quick tasks** : builds à la demande depuis des fichiers locaux ou un dépôt Git
- **Triggers automatiques** : répondent aux commits de code source et aux mises à jour des images de base
- **Multi-step tasks** : workflows complets build → test → push entièrement dans ACR

**4. Stratégies de tags et versioning**
- La **version sémantique** communique la nature des changements
- Les **tags uniques** (SHA commit) garantissent la cohérence des déploiements
- Le **verrouillage d'image** (`write-enabled false`) empêche la suppression accidentelle des images de production

**5. L'exercice pratique**
Tu as appliqué tous ces concepts en buildant, taggant et exécutant des images avec Azure CLI — sans Docker local.
