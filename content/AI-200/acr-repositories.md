## La hiérarchie ACR

```
Registry (myapp.azurecr.io)
└── Repository (api)
    ├── Artifact — myapp.azurecr.io/api:v1.0.0
    ├── Artifact — myapp.azurecr.io/api:v1.1.0
    └── Artifact — myapp.azurecr.io/api:latest
```

**Registry** — le service ACR lui-même, accessible via son URL unique  
**Repository** — groupe d'images partageant le même nom (ex: `api`, `worker`, `frontend`)  
**Artifact** — une image concrète identifiée par un tag ou un digest

---

## Tags vs Digests

### Tag (mutable)
Un tag est un **alias lisible** qui pointe vers une image. Il peut être réassigné.

```bash
myregistry.azurecr.io/api:latest     # tag stable, peut changer
myregistry.azurecr.io/api:v1.0.3     # tag semver, plus stable
```

**Problème :** si quelqu'un repousse une image avec le même tag, le tag pointe maintenant vers la nouvelle image.

### Digest (immuable)
Le digest est un **hash SHA-256 du contenu de l'image**. Il ne change jamais.

```bash
myregistry.azurecr.io/api@sha256:a1b2c3d4e5f6...
```

**Règle de production :** référencer les images par digest pour garantir exactement la même image sur tous les serveurs.

---

## Layers et déduplication

Une image Docker est composée de **layers** empilés. ACR stocke chaque layer une seule fois.

**Exemple :**
- Image A : python:3.11 + couche app A → 200 MB + 50 MB
- Image B : python:3.11 + couche app B → même 200 MB + 60 MB

**Stockage ACR :** 200 MB (partagé) + 50 MB + 60 MB = **310 MB** au lieu de 520 MB

La déduplication s'applique **automatiquement** — aucune configuration nécessaire.

---

## Namespaces

Les namespaces sont des **préfixes** qui organisent les repositories dans un registry :

```bash
myregistry.azurecr.io/frontend/web-app:v1
myregistry.azurecr.io/frontend/admin:v1
myregistry.azurecr.io/ml/model-server:v2
myregistry.azurecr.io/ml/training:latest
```

**Avantage :** contrôle d'accès par équipe — l'équipe Frontend n'accède qu'au namespace `frontend/`, l'équipe ML qu'à `ml/`.

---

## Géo-réplication (Premium)

ACR Premium permet de **répliquer les images dans plusieurs régions Azure**.

```bash
az acr replication create --registry myregistry --location westeurope
az acr replication create --registry myregistry --location eastasia
```

**Résultat :** les clusters AKS en Europe et en Asie tirent les images depuis leur région locale — latence minimale, pas de trafic inter-régions.

---

## Points clés pour l'examen

- Hiérarchie : **Registry → Repository → Artifact**
- **Tag** = mutable, **Digest sha256** = immuable
- Déduplication des layers → économie de stockage automatique
- **Namespaces** = organisation + contrôle d'accès
- **Géo-réplication** = tier Premium uniquement
