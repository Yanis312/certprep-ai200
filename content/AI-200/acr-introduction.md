> **Dans cette unité, on va voir :**
> - Ce qu'est Azure Container Registry (ACR) et pourquoi l'utiliser
> - La différence avec Docker Hub
> - Les 3 tiers (Basic, Standard, Premium) et leurs fonctionnalités
> - Comment s'authentifier et le workflow de base

---

## Qu'est-ce qu'Azure Container Registry ?

Azure Container Registry (ACR) est un **registre privé géré** qui stocke et distribue des images OCI (Open Container Initiative) : images Docker, charts Helm, artefacts WASM, etc.

Contrairement à Docker Hub (public par défaut), ACR est **privé, sécurisé et intégré nativement à l'écosystème Azure**.

#### Mise en situation — Une startup qui déploie son API

**Situation :** Une startup e-commerce développe une API Node.js qu'elle déploie sur Azure Kubernetes Service (AKS). Elle utilise Docker Hub, mais les images sont publiques — n'importe qui peut les télécharger.

**Tâche :** Passer à un registre privé, sécurisé, sans gérer des credentials supplémentaires pour que AKS puisse tirer les images.

**Action :** L'équipe crée un ACR Standard (`myapp.azurecr.io`), active l'intégration native avec AKS via Managed Identity, et pousse toutes les images vers ACR.

**Résultat :** AKS tire les images directement depuis ACR sans aucun secret à gérer — déploiements en moins de 30 secondes, images inaccessibles au public.

---

## Pourquoi utiliser ACR plutôt que Docker Hub ?

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
| **Basic** | 10 GB | Dev, tests locaux |
| **Standard** | 100 GB | La plupart des projets en production |
| **Premium** | 500 GB | Géo-réplication, Private Endpoints, rétention avancée |

**À retenir pour l'examen :** la géo-réplication et les Private Endpoints nécessitent le tier **Premium**.

---

## Login et authentification

**URL du login server :** `<nom-du-registry>.azurecr.io`

```bash
# Connexion avec Azure CLI (recommandé en dev)
az acr login --name myregistry

# Connexion manuelle avec admin user (tests uniquement)
docker login myregistry.azurecr.io -u admin -p <password>
```

**En production :** utiliser un **Service Principal** ou une **Managed Identity** — jamais l'admin user.

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

#### Mise en situation — Sécuriser un déploiement multi-équipes

**Situation :** Une entreprise a 3 équipes (frontend, backend, ML) qui toutes poussent des images vers le même registry ACR. Le RSSI demande que chaque équipe ne voit que ses propres images.

**Tâche :** Contrôler les accès par équipe dans un seul registry sans multiplier les registries.

**Action :** L'admin Azure crée des namespaces (`frontend/`, `backend/`, `ml/`) et assigne des rôles RBAC précis : chaque Service Principal d'équipe a `AcrPush` uniquement sur son namespace.

**Résultat :** L'équipe ML ne peut ni voir ni modifier les images frontend — sécurité fine sans coûts supplémentaires de registries multiples.

---

## Points clés pour l'examen

- ACR stocke des **artefacts OCI** (images Docker, Helm, WASM…)
- URL format : `<nom>.azurecr.io`
- Tier **Premium** → géo-réplication + Private Endpoints
- Auth recommandée : **Managed Identity** ou **Service Principal**
- Intégration native avec **AKS**, **Container Apps**, **App Service**
