## Qu'est-ce qu'Azure Container Registry ?

Azure Container Registry (ACR) est un **registre privé géré** qui stocke et distribue des images OCI (Open Container Initiative) : images Docker, charts Helm, artefacts WASM, etc.

Contrairement à Docker Hub (public par défaut), ACR est **privé, sécurisé et intégré nativement à l'écosystème Azure**.

---

## Pourquoi utiliser ACR ?

**Intégration native Azure**
- AKS, Container Apps et App Service tirent les images directement depuis ACR sans configuration supplémentaire
- Authentification via Azure AD — pas besoin de gérer des credentials séparés

**Sécurité**
- Réseau privé (Private Endpoints, règles de pare-feu)
- Analyse des vulnérabilités des images (Microsoft Defender)
- Contrôle d'accès granulaire via RBAC Azure

**Performances**
- Géo-réplication pour distribuer les images près des régions de déploiement
- Déduplication des layers pour réduire les coûts de stockage

---

## Les 3 tiers ACR

| Tier | Stockage | Cas d'usage |
|------|----------|-------------|
| **Basic** | 10 GB | Dev, tests |
| **Standard** | 100 GB | La plupart des projets |
| **Premium** | 500 GB | Géo-réplication, Private Endpoints, rétention avancée |

**À retenir pour l'examen :** la géo-réplication et les Private Endpoints nécessitent le tier **Premium**.

---

## Login et authentification

**URL du login server :** `<nom-du-registry>.azurecr.io`

```bash
# Connexion avec Azure CLI (recommandé en dev)
az acr login --name myregistry

# Connexion manuelle avec admin user (non recommandé en prod)
docker login myregistry.azurecr.io -u admin -p <password>
```

**En production :** utiliser un **Service Principal** ou une **Managed Identity** — jamais l'admin user (mots de passe rotationnels difficiles à gérer).

---

## Workflow de base

```bash
# 1. Build local
docker build -t myapp:v1 .

# 2. Tagger pour le registry
docker tag myapp:v1 myregistry.azurecr.io/myapp:v1

# 3. Pousser
docker push myregistry.azurecr.io/myapp:v1

# 4. Tirer depuis une autre machine
docker pull myregistry.azurecr.io/myapp:v1
```

ACR Tasks permettent d'automatiser le build directement dans le cloud — sans Docker en local.

---

## Points clés pour l'examen

- ACR stocke des **artefacts OCI** (images Docker, Helm, WASM…)
- URL format : `<nom>.azurecr.io`
- Tier **Premium** → géo-réplication + Private Endpoints
- Auth recommandée : **Managed Identity** ou **Service Principal**
- Intégration native avec **AKS**, **Container Apps**, **App Service**
