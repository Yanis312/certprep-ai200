> **Dans cette unité on va parler de :**
> - Les deux sources d'images (ACR recommandé vs autres registries)
> - Les deux méthodes d'auth ACR : Managed Identity vs Admin credentials — différences réelles
> - System-assigned vs User-assigned managed identity — quand utiliser laquelle
> - Déployer avec le portail Azure, la CLI, VS Code
> - Mettre à jour une image : changement de tag vs même tag
> - Le déploiement continu avec webhooks
> - Le comportement du pull d'images selon les situations

---

## Sources d'images

Quand tu crées une **Web App for Containers**, tu choisis d'où vient l'image :

### Azure Container Registry (ACR) — Recommandé production

- Intégration native avec **Microsoft Entra ID**
- Supporte la **Managed Identity** (pas de credentials à gérer)
- Géo-réplication, scan d'images, accès réseau privé
- Registries de la même subscription apparaissent automatiquement dans le portail

### Autres registries (Docker Hub, GitHub Container Registry, self-hosted)

Tout registry accessible via HTTPS qui supporte **Docker Registry HTTP API V2**.

- **Images publiques** : juste le nom de l'image (ex: `nginx:latest`)
- **Images privées** : server URL + username + password

---

## Authentification ACR — Le point critique

### Managed Identity (à utiliser en production)

App Service s'authentifie auprès d'ACR via une **identité Azure** — aucun mot de passe stocké nulle part.

**System-assigned managed identity**
- Créée automatiquement quand tu l'actives sur la web app
- **Liée au cycle de vie de la web app** — supprimée quand l'app est supprimée
- Simple quand une seule app a besoin d'accéder au registry

**User-assigned managed identity**
- Tu la crées comme une **ressource Azure indépendante**
- Persiste même si la web app est supprimée
- Peut être assignée à **plusieurs apps simultanément**
- Idéal quand plusieurs apps partagent le même accès ACR, ou quand tu veux configurer les permissions avant de créer l'app

Dans les deux cas, l'identité doit avoir le rôle **AcrPull** sur le registry.

### Admin credentials (développement seulement)

```bash
# Activer l'admin user sur l'ACR
az acr update --name myregistry --admin-enabled true
```

Stocke username + password dans la config App Service. **Problèmes :**
- Credentials visibles dans la configuration
- Rotation manuelle si compromis
- Mauvaise pratique de sécurité pour la production

---

#### ⭐ STAR — System-assigned vs User-assigned selon le contexte

**Situation :** Une entreprise a 3 microservices déployés sur App Service, tous accédant au même ACR privé. La politique sécurité interdit tout mot de passe stocké.

**Tâche :** Configurer l'accès ACR pour les 3 apps sans credentials stockés, et permettre d'ajouter facilement de nouvelles apps plus tard.

**Action :**
- **Mauvaise approche** : System-assigned identity pour chaque app → 3 assignations de rôle AcrPull à maintenir séparément
- **Bonne approche** : Une user-assigned identity → 1 seule assignation de rôle AcrPull → assignée aux 3 apps

```bash
# Créer l'identité une fois
az identity create --name id-acr-access --resource-group myRG

# Assigner AcrPull à cette identité
az role assignment create \
    --assignee <identity-client-id> \
    --role AcrPull \
    --scope /subscriptions/.../registries/myACR

# Assigner l'identité aux 3 apps
az webapp identity assign --identities <identity-id> -g myRG -n app1
az webapp identity assign --identities <identity-id> -g myRG -n app2
az webapp identity assign --identities <identity-id> -g myRG -n app3
```

**Résultat :** Quand une 4ème app est ajoutée, il suffit d'une commande. Aucun credential à gérer, rotation automatique par Azure.

---

## Déployer avec la CLI

### Depuis ACR
```bash
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v1
```

### Depuis Docker Hub (image publique)
```bash
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name nginx \
    --docker-registry-server-url https://index.docker.io/v1/
```

### Depuis Docker Hub (image privée)
```bash
az webapp create \
    --resource-group myResourceGroup \
    --plan myAppServicePlan \
    --name myWebApp \
    --container-image-name myusername/myapp:latest \
    --docker-registry-server-url https://index.docker.io/v1/ \
    --docker-registry-server-user myusername \
    --docker-registry-server-password <password>
```

Pour **GitHub Container Registry** : utiliser `https://ghcr.io` comme server URL.

---

## Mettre à jour l'image

### Changement de tag (nouvelle version)
```bash
az webapp config container set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --container-image-name myregistry.azurecr.io/docprocessor:v2
```
App Service **redémarre automatiquement** et pull la nouvelle image.

### Même tag (ex: `latest`)
App Service **ne détecte PAS le changement**. Il ne sait pas que le contenu sous le tag a changé.

Options :
1. Redémarrer manuellement : `az webapp restart`
2. Activer le déploiement continu (webhook)

---

## Déploiement continu (CD)

```bash
az webapp deployment container config \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --enable-cd true
# → Retourne une webhook URL
```

Configure ensuite ACR pour appeler cette webhook à chaque push → App Service redémarre automatiquement et pull la nouvelle image.

---

## Comportement du pull d'images — Points clés pour l'examen

| Situation | Ce qui se passe |
|-----------|----------------|
| **Premier déploiement** | Toutes les couches téléchargées |
| **Redémarrage** | Seules les couches modifiées (cache utilisé) |
| **Scale out** | Chaque nouvelle instance pull l'image — peut être lent si image volumineuse |
| **Changement de tier** | Nouvelle infrastructure allouée → pull complet possible |

> **Implication pour le scale out :** Si ton image fait 2GB et que App Service doit ajouter 5 instances rapidement, chaque instance va puller 2GB. Raison de plus pour optimiser la taille des images.

---

## Vérifier le déploiement

```bash
az webapp show \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --query defaultHostName \
    --output tsv
# → myDocumentProcessor.azurewebsites.net
```

Ouvre l'URL dans un navigateur ou teste avec `curl`. Si le container échoue à démarrer, les outils de l'Unité 5 t'aideront à diagnostiquer.
