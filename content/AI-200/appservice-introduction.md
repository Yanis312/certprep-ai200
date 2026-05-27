> **Dans cette unité on va parler de :**
> - Ce qu'est Azure App Service pour containers et pourquoi l'utiliser
> - Les sources d'images supportées (ACR, Docker Hub, GitHub Container Registry)
> - Les deux méthodes d'authentification ACR : Managed Identity vs Admin credentials
> - Déployer un container avec le portail Azure, la CLI, et VS Code
> - Gérer les mises à jour d'images et le déploiement continu

---

## Azure App Service — C'est quoi ?

Azure App Service est une plateforme **PaaS (Platform as a Service)** pour héberger des applications web. Avec **Web App for Containers**, tu apportes ton image Docker et Azure gère tout le reste :

- Provisionnement de l'infrastructure
- Load balancing (répartition du trafic)
- Scaling automatique
- Patches et mises à jour de l'OS

**Tu ne gères pas de serveurs.** Tu t'occupes uniquement de ton code et de ton container.

---

## Sources d'images

Quand tu crées une Web App for Containers, tu choisis d'où vient ton image :

| Source | Quand l'utiliser |
|--------|-----------------|
| **Azure Container Registry (ACR)** | Recommandé pour la production — intégration native avec Entra ID, identité managée, scan d'images |
| **Autres registries** (Docker Hub, GitHub Container Registry, registries privés) | Images publiques ou privées accessibles via HTTPS + Docker Registry HTTP API V2 |

---

## Authentification ACR — 2 méthodes

### Managed Identity (recommandée pour la production)

App Service s'authentifie auprès d'ACR via une **identité Azure**, sans credentials stockés.

**System-assigned identity** — liée au cycle de vie de la web app :
- Azure crée l'identité quand tu l'actives
- Elle est supprimée avec la web app
- Simple si une seule app accède au registry

**User-assigned identity** — existe indépendamment de la web app :
- Tu la crées séparément comme ressource Azure
- Tu peux l'assigner à plusieurs apps
- Idéal si plusieurs apps partagent le même accès registry

L'identité doit avoir le rôle **AcrPull** sur le registry.

### Admin credentials (pour le développement)

```bash
# Activer l'admin user sur l'ACR
az acr update --name myregistry --admin-enabled true
```

Utilise le username et password de l'ACR. Plus simple à configurer mais stocke des credentials dans App Service — à éviter en production.

---

#### ⭐ STAR — Managed Identity vs Admin credentials

**Situation :** Une équipe déploie une API d'inférence sur App Service avec accès à un ACR privé. L'équipe sécurité interdit les mots de passe stockés dans les configs.

**Tâche :** Permettre à App Service de puller les images ACR sans stocker de credentials.

**Action :** Activer une system-assigned managed identity sur la web app, puis lui assigner le rôle AcrPull sur l'ACR :
```bash
# Activer l'identité managée
az webapp identity assign --resource-group myRG --name myApp

# Assigner AcrPull à l'identité
az role assignment create \
    --assignee <identity-principal-id> \
    --role AcrPull \
    --scope /subscriptions/.../resourceGroups/myRG/providers/Microsoft.ContainerRegistry/registries/myACR
```

**Résultat :** App Service pulle les images automatiquement sans aucun mot de passe stocké. Si l'app est supprimée, l'identité disparaît avec elle — pas de cleanup manuel.

---

## Déployer avec la CLI

```bash
# Créer la web app avec une image ACR
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v1

# Image publique Docker Hub
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name nginx \
    --docker-registry-server-url https://index.docker.io/v1/

# Image privée Docker Hub
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name myusername/myapp:latest \
    --docker-registry-server-url https://index.docker.io/v1/ \
    --docker-registry-server-user myusername \
    --docker-registry-server-password <password>
```

---

## Mettre à jour l'image

```bash
# Changer vers une nouvelle version (tag différent)
az webapp config container set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v2
```

App Service redémarre automatiquement et pull la nouvelle image.

> **Attention :** Si tu pushes une nouvelle image avec le **même tag** (ex: `latest`), App Service ne le détecte pas automatiquement. Il faut soit redémarrer manuellement, soit activer le déploiement continu.

---

## Déploiement continu (CD)

```bash
# Activer le CD — retourne une webhook URL
az webapp deployment container config \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --enable-cd true
```

Configure ton registry (ACR) pour appeler cette webhook URL à chaque push. App Service redémarre alors automatiquement et pull la nouvelle image.

---

## Comportement du pull d'images

| Moment | Ce qui se passe |
|--------|----------------|
| **Premier déploiement** | Toutes les couches de l'image sont téléchargées |
| **Redémarrage** | Seules les couches modifiées sont téléchargées (cache) |
| **Scale out** | Chaque nouvelle instance pull l'image (peut être lent si image volumineuse) |
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

Ouvre l'URL retournée dans un navigateur ou avec `curl` pour vérifier que l'app répond.
