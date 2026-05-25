# Azure Container Registry — Fondamentaux

## C'est quoi ACR ?

Azure Container Registry = registre Docker **privé** sur Azure.
Tu y stockes tes images de containers au lieu de Docker Hub (public) ou des machines locales.

**Problème résolu :** chaque dev build localement → environnements différents → builds inconsistants.
**Avec ACR :** source de vérité centralisée, builds identiques, rollback possible.

---

## ACR vs Docker Hub

- **ACR** → privé, accès contrôlé, intégré nativement à AKS / Container Apps / App Service
- **Docker Hub** → public par défaut, pas lié à Azure, pas de géo-réplication

---

## La hiérarchie en 3 niveaux

```
Registry   → surfagest.azurecr.io        (URL unique du registre)
  └── Repository → production/api        (groupe d'images du même type)
        └── Artifact → :v1.0.0           (image concrète)
```

**Analogie :** Registry = bibliothèque / Repository = étagère / Artifact = livre

**Namespaces** (organisation par équipes) :
- `production/inference-api`
- `staging/inference-api`
- `ml-team/model-server`

Chaque équipe ne peut accéder qu'à son namespace → contrôle d'accès précis.

---

## Tags vs Digests — La distinction critique

**Tag** (`inference-api:v1.2.0`) → mutable, peut changer si on repousse → développement

**Digest** (`inference-api@sha256:abc123...`) → immuable, garanti → production obligatoire

```bash
# DEV — par tag (pratique)
docker pull myregistry.azurecr.io/inference-api:v1.2.0

# PROD — par digest (garanti identique)
docker pull myregistry.azurecr.io/inference-api@sha256:0a2e0185...
```

---

## Layers (couches)

Une image = plusieurs layers empilées (1 par instruction Dockerfile).
ACR **déduplique** les layers communes — 10 images avec `python:3.11` → 1 seule copie stockée.

---

## Tiers de service

- **Basic** → développement / apprentissage
- **Standard** → production classique
- **Premium** → géo-réplication, endpoints privés, content trust
