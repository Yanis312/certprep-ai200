> **Dans cette unité on va parler de :**
> - Déployer ACR + builder une image avec ACR Tasks
> - Créer un App Service Plan Linux
> - Créer une Web App for Containers avec Managed Identity
> - Assigner le rôle AcrPull à l'identité managée
> - Configurer le port, les logs, et vérifier le déploiement
> - Tester l'endpoint de traitement de documents

---

## Résumé du lab

| Ressource créée | Nom | Détail |
|-----------------|-----|--------|
| Resource Group | `rg-appservice-lab` | East US |
| ACR | `acrXXXXXXXX` | SKU Basic |
| App Service Plan | `asp-lab` | Linux, tier Basic B1 |
| Web App | `docprocessor-XXXXXXXX` | Container Linux |
| Managed Identity | system-assigned | Rôle AcrPull sur l'ACR |

---

## Étape 0 — Préparation

```powershell
# Ajouter az au PATH
$env:PATH = "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin;" + $env:PATH

# Aller dans le dossier lab
cd "d:\AI-900 CERTIFICATION\AI-200\01-container-hosting\lab"

# Charger les variables (si elles existent déjà)
. .\.env.ps1
```

---

## Étape 1 — Déployer ACR et builder l'image

```powershell
# Lancer le script de déploiement (crée le RG + l'ACR)
.\azdeploy.ps1

# Charger les variables d'environnement
. .\.env.ps1

# Vérifier
$env:ACR_NAME    # doit afficher le nom de l'ACR
```

```powershell
# Builder l'image inference-api:v1.0.0 dans le cloud
az acr build `
    --registry $env:ACR_NAME `
    --image inference-api:v1.0.0 `
    ./api
```

**Ce qui se passe :** ACR Tasks build l'image dans Azure, la push dans le registry. Run ID : ca1.

---

## Étape 2 — Créer l'App Service Plan

```powershell
az appservice plan create `
    --resource-group $env:RESOURCE_GROUP `
    --name asp-lab `
    --is-linux `
    --sku B1
```

**Points importants :**
- `--is-linux` → obligatoire pour les containers Linux
- `--sku B1` → tier Basic (requis pour Always-on et managed identity)
- L'App Service Plan est l'unité de facturation — il définit CPU/RAM et le prix

---

## Étape 3 — Créer la Web App for Containers

```powershell
az webapp create `
    --resource-group $env:RESOURCE_GROUP `
    --plan asp-lab `
    --name "docprocessor-$env:ACR_NAME" `
    --container-image-name "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0"
```

> **Pourquoi `docprocessor-$env:ACR_NAME` ?** Les noms de web apps sont globaux sur Azure — le hash dans `$env:ACR_NAME` garantit l'unicité.

---

## Étape 4 — Activer la Managed Identity et assigner AcrPull

```powershell
# Activer la system-assigned managed identity
az webapp identity assign `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME"
```

La commande retourne un JSON avec le `principalId` de l'identité. Note-le — tu en as besoin pour l'étape suivante.

```powershell
# Récupérer le principalId de l'identité
$principalId = az webapp identity show `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME" `
    --query principalId `
    --output tsv

# Récupérer l'ID de l'ACR
$acrId = az acr show `
    --name $env:ACR_NAME `
    --query id `
    --output tsv

# Assigner le rôle AcrPull à l'identité sur l'ACR
az role assignment create `
    --assignee $principalId `
    --role AcrPull `
    --scope $acrId
```

**Ce qui vient de se passer :** L'identité managée de ta web app peut maintenant puller des images depuis ton ACR — sans aucun username/password stocké.

---

#### ⭐ STAR — Pourquoi Managed Identity plutôt qu'Admin credentials

**Situation :** L'équipe sécurité fait un audit et trouve des credentials ACR en clair dans les App Settings de la web app.

**Tâche :** Éliminer tous les credentials stockés tout en maintenant l'accès au registry.

**Action :**
1. Activer system-assigned identity sur la web app
2. Assigner AcrPull à cette identité sur l'ACR
3. Supprimer les App Settings contenant les credentials

**Résultat :** Aucun mot de passe dans la configuration. L'audit sécurité passe. Si la web app est supprimée, l'accès est automatiquement révoqué.

---

## Étape 5 — Configurer l'authentification ACR via Managed Identity

```powershell
az webapp config container set `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME" `
    --container-image-name "$env:ACR_NAME.azurecr.io/inference-api:v1.0.0" `
    --container-registry-url "https://$env:ACR_NAME.azurecr.io"
```

---

## Étape 6 — Configurer le port et activer les logs

```powershell
# Configurer WEBSITES_PORT (Flask écoute sur 5000)
az webapp config appsettings set `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME" `
    --settings WEBSITES_PORT=5000

# Activer les logs container
az webapp log config `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME" `
    --docker-container-logging filesystem
```

---

## Étape 7 — Vérifier le déploiement

```powershell
# Récupérer l'URL de la web app
$url = az webapp show `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME" `
    --query defaultHostName `
    --output tsv

Write-Host "URL : https://$url"
```

```powershell
# Tester l'endpoint health
curl "https://$url/health"
# Résultat attendu : {"status": "healthy", "version": "1.0.0"}

# Tester l'endpoint predict
curl "https://$url/predict"
# Résultat attendu : {"prediction": "sample-result", "confidence": 0.95}
```

```powershell
# Voir les logs en temps réel si problème
az webapp log tail `
    --resource-group $env:RESOURCE_GROUP `
    --name "docprocessor-$env:ACR_NAME"
```

---

## Étape 8 — Nettoyage (OBLIGATOIRE)

```powershell
az group delete `
    --name $env:RESOURCE_GROUP `
    --no-wait `
    --yes
```

> ⚠️ Un App Service Plan Basic B1 coûte ~$0.075/heure. Supprime le resource group immédiatement après le lab.

---

## Ce que ce lab valide pour l'examen

| Commande | Ce qu'elle fait |
|----------|----------------|
| `az appservice plan create --is-linux --sku B1` | Créer un plan App Service Linux |
| `az webapp create --container-image-name ...` | Créer une web app depuis une image container |
| `az webapp identity assign` | Activer la managed identity |
| `az role assignment create --role AcrPull` | Donner accès ACR à l'identité |
| `az webapp config appsettings set --settings WEBSITES_PORT=5000` | Configurer le port du container |
| `az webapp log config --docker-container-logging filesystem` | Activer les logs |
| `az webapp log tail` | Voir les logs en temps réel |
| `az webapp show --query defaultHostName` | Récupérer l'URL de l'app |
