> **Dans cette unité on va parler de :**
> - Les deux sources d'images (ACR et autres registries)
> - Managed Identity vs Admin credentials pour l'authentification ACR
> - Déployer avec le portail, la CLI et VS Code
> - Mettre à jour une image et activer le déploiement continu
> - Le comportement du pull d'images (initial, restart, scale out)

---

## Sources d'images

| Source | Usage |
|--------|-------|
| **Azure Container Registry** | Recommandé production — intégration Entra ID, managed identity, scan |
| **Autres registries** (Docker Hub, GitHub CR, self-hosted) | Images publiques ou privées via HTTPS + Docker Registry API V2 |

---

## Authentification ACR

### Managed Identity (recommandée)

App Service s'authentifie via une **identité Azure**, sans credentials stockés.

| Type | Comportement |
|------|-------------|
| **System-assigned** | Liée au cycle de vie de la web app — supprimée avec l'app |
| **User-assigned** | Ressource indépendante — assignable à plusieurs apps |

L'identité doit avoir le rôle **AcrPull** sur le registry.

### Admin credentials (développement uniquement)

```bash
az acr update --name myregistry --admin-enabled true
```

Stocke credentials dans App Service — à éviter en production.

---

#### ⭐ STAR — Pourquoi préférer Managed Identity

**Situation :** Équipe sécurité interdit les mots de passe stockés dans les configs App Service.

**Tâche :** Permettre à App Service de puller les images ACR sans aucun credential stocké.

**Action :**
```bash
# 1. Activer l'identité managée sur la web app
az webapp identity assign --resource-group myRG --name myApp

# 2. Assigner AcrPull à cette identité
az role assignment create \
    --assignee <principal-id> \
    --role AcrPull \
    --scope /subscriptions/.../registries/myACR
```

**Résultat :** Aucun mot de passe dans la config. Rotation automatique. Si l'app est supprimée, l'accès est révoqué automatiquement.

---

## Déployer avec la CLI

```bash
# Depuis ACR
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v1

# Depuis Docker Hub (image publique)
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name nginx \
    --docker-registry-server-url https://index.docker.io/v1/

# Depuis Docker Hub (image privée)
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name myusername/myapp:latest \
    --docker-registry-server-url https://index.docker.io/v1/ \
    --docker-registry-server-user myusername \
    --docker-registry-server-password <password>
```

Pour GitHub Container Registry : utiliser `https://ghcr.io` comme server URL.

---

## Mettre à jour l'image

```bash
# Changer de tag → App Service redémarre automatiquement
az webapp config container set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v2
```

> **Même tag (ex: `latest`) ?** App Service ne détecte pas le changement automatiquement. Il faut redémarrer manuellement ou activer le déploiement continu.

---

## Déploiement continu

```bash
# Retourne une webhook URL à configurer dans ACR
az webapp deployment container config \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --enable-cd true
```

Configure ACR pour appeler la webhook à chaque push → App Service redémarre et pull la nouvelle image.

---

## Comportement du pull d'images

| Moment | Ce qui se passe |
|--------|----------------|
| **Premier déploiement** | Toutes les couches téléchargées |
| **Redémarrage** | Seules les couches modifiées (cache) |
| **Scale out** | Chaque nouvelle instance pull — peut être lent si grosse image |
| **Changement de tier** | Nouvelle infrastructure → pull complet possible |

---

## Vérifier le déploiement

```bash
az webapp show \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --query defaultHostName \
    --output tsv
```
