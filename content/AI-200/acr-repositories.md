> **Dans cette unité, on va voir :**
> - La hiérarchie Registry → Repository → Artifact
> - La différence cruciale entre Tag (mutable) et Digest (immuable)
> - Comment les layers sont dédupliqués pour économiser du stockage
> - Les namespaces pour isoler les équipes
> - La géo-réplication (tier Premium)

---

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

#### Mise en situation — Organiser les images d'une plateforme SaaS

**Situation :** Une plateforme SaaS avec 5 microservices (api-gateway, auth, billing, notifications, frontend) qui évoluent indépendamment. Sans organisation, le registry devient un chaos avec des dizaines d'images sans structure.

**Tâche :** Organiser les images de façon logique pour que chaque équipe retrouve rapidement les siennes et que les pipelines CI/CD sachent exactement quoi tirer.

**Action :** Un repository par microservice (`api-gateway`, `auth`, `billing`…), tags semver par release (`v1.2.3`), tag `:latest` mis à jour automatiquement par le pipeline.

**Résultat :** L'équipe billing fait `docker pull myapp.azurecr.io/billing:v2.1.0` et obtient exactement la version voulue. Le pipeline de prod tire `:latest` pour les déploiements automatiques.

---

## Tags vs Digests

### Tag (mutable)
Un tag est un **alias lisible** qui pointe vers une image. Il peut être réassigné à tout moment.

```bash
myregistry.azurecr.io/api:latest       # tag stable, peut changer demain
myregistry.azurecr.io/api:v1.0.3       # tag semver, plus stable
myregistry.azurecr.io/api:prod         # tag environnement, mutable
```

**Problème :** si quelqu'un pousse une nouvelle image sous le même tag, l'ancien contenu est écrasé.

### Digest (immuable)
Le digest est un **hash SHA-256 du contenu de l'image**. Il ne change jamais — si le contenu change, le digest change aussi.

```bash
myregistry.azurecr.io/api@sha256:a1b2c3d4e5f6...
```

#### Mise en situation — Bug en production à cause d'un tag mutable

**Situation :** Une entreprise déploie son API avec le tag `:latest`. Un développeur pousse par erreur une version de test sous `:latest` pendant un déploiement de production. Les nouveaux pods tirent la mauvaise image.

**Tâche :** Garantir que chaque déploiement de production utilise exactement l'image validée, sans risque de substitution.

**Action :** Le pipeline CI génère un tag semver unique (`:v1.4.2-abc123`) **et** un digest. Le fichier de déploiement Kubernetes référence l'image par digest : `api@sha256:a1b2c3...`.

**Résultat :** Même si quelqu'un écrase le tag `:latest`, les pods en production continuent de tourner avec exactement la bonne image. Zero incident lié aux tags mutables.

---

## Layers et déduplication

Une image Docker est composée de **layers** empilés. ACR stocke chaque layer une seule fois.

**Exemple concret :**
- Image A : `python:3.11` (200 MB) + couche app A (50 MB) = 250 MB
- Image B : `python:3.11` (200 MB) + couche app B (60 MB) = 260 MB

**Stockage ACR :** 200 MB (partagé) + 50 MB + 60 MB = **310 MB** au lieu de 510 MB

La déduplication s'applique **automatiquement** — aucune configuration nécessaire.

---

## Namespaces

Les namespaces sont des **préfixes** qui organisent les repositories :

```bash
myregistry.azurecr.io/frontend/web-app:v1
myregistry.azurecr.io/frontend/admin:v1
myregistry.azurecr.io/ml/model-server:v2
myregistry.azurecr.io/ml/training:latest
```

**Avantage :** contrôle d'accès par équipe via RBAC — l'équipe Frontend n'accède qu'au namespace `frontend/`.

---

## Géo-réplication (Premium)

ACR Premium permet de **répliquer les images dans plusieurs régions Azure**.

```bash
az acr replication create --registry myregistry --location westeurope
az acr replication create --registry myregistry --location eastasia
```

#### Mise en situation — Application déployée sur 3 continents

**Situation :** Une app déployée sur AKS en Europe, Asie et États-Unis. Sans géo-réplication, tous les clusters tirent les images depuis la région principale (East US) — latence élevée et trafic inter-régions facturé.

**Tâche :** Réduire la latence de tirage d'images et les coûts de bande passante pour les déploiements dans les 3 régions.

**Action :** Activer la géo-réplication ACR Premium sur `westeurope` et `eastasia`. Un seul push vers ACR, la réplication est automatique vers les 2 autres régions.

**Résultat :** Les clusters AKS tirent les images depuis leur région locale — latence divisée par 10, coûts de bande passante réduits à zéro entre régions, déploiements simultanés dans les 3 régions.

---

## Points clés pour l'examen

- Hiérarchie : **Registry → Repository → Artifact**
- **Tag** = mutable, **Digest sha256** = immuable
- Déduplication des layers → économie de stockage automatique
- **Namespaces** = organisation + contrôle d'accès par équipe
- **Géo-réplication** = tier Premium uniquement
