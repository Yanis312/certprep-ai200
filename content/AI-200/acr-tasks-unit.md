> **Dans cette unité, on va voir :**
> - Ce qu'est ACR Tasks et pourquoi ça remplace Docker en local
> - Les Quick Tasks (`az acr build`) pour builder dans le cloud
> - Les 3 types de triggers : Source Code, Base Image Update, Scheduled
> - Les variables intégrées (`{{.Run.ID}}`) pour les tags traçables
> - Sécuriser les secrets avec Azure Key Vault

---

## Qu'est-ce qu'ACR Tasks ?

ACR Tasks est un service qui exécute des **builds de containers dans le cloud Azure** — sans avoir besoin de Docker en local ni d'un serveur CI/CD séparé.

#### Mise en situation — Équipe sans Docker en local

**Situation :** Une équipe de 5 développeurs travaille sur des machines avec peu de RAM. Faire tourner Docker Desktop + le build local ralentit tout le monde. Le pipeline CI est lent car il build sur un runner partagé surchargé.

**Tâche :** Builder les images Docker de façon rapide, sans surcharger les machines locales, et pousser directement dans ACR.

**Action :** L'équipe adopte `az acr build` — les développeurs envoient juste le contexte (leur code), Azure s'occupe du build dans le cloud.

**Résultat :** Build en 45 secondes contre 3 minutes en local, pas de Docker installé nécessaire, l'image est directement dans ACR prête à déployer.

---

## Quick Task

Une quick task est un **build ponctuel, déclenché manuellement**.

```bash
# Builder et pousser depuis le dossier courant
az acr build --registry myregistry --image api:v1 .

# Tester une image existante dans ACR (sans source locale)
az acr run \
  --registry myregistry \
  --cmd "myregistry.azurecr.io/api:v1 python --version" \
  /dev/null
```

`/dev/null` comme contexte = pas besoin de fichiers sources — on exécute juste une image déjà dans le registry.

---

## Triggered Tasks — Les 3 types de triggers

### 1. Source Code Trigger
Déclenché à chaque commit Git (webhook GitHub/Azure DevOps).

```bash
az acr task create \
  --registry myregistry \
  --name build-api \
  --image "api:{{.Run.ID}}" \
  --context https://github.com/user/repo.git \
  --branch main \
  --git-access-token $(az keyvault secret show \
    --vault-name myvault --name github-pat --query value -o tsv)
```

#### Mise en situation — CI/CD automatique sur chaque commit

**Situation :** Une équipe veut que chaque push sur `main` déclenche automatiquement un build et un push de l'image Docker dans ACR, sans intervention manuelle.

**Tâche :** Mettre en place un pipeline de build automatique déclenché par les commits Git.

**Action :** Créer une ACR Task avec Source Code Trigger pointant sur le repo GitHub, branche `main`, avec le PAT stocké dans Key Vault. L'image est taguée avec `{{.Run.ID}}` pour traçabilité.

**Résultat :** Chaque `git push` sur `main` déclenche un build automatique. L'image `api:ca7` dans ACR correspond exactement au commit `ca7` — traçabilité parfaite entre code et image.

---

### 2. Base Image Trigger
Déclenché automatiquement quand l'image de base est mise à jour dans ACR.

**Cas d'usage :** `node:20` reçoit un patch de sécurité → toutes les images qui en héritent se rebuilident automatiquement.

#### Mise en situation — Patch de sécurité urgent

**Situation :** Une CVE critique est découverte dans `python:3.11`. L'équipe sécurité doit mettre à jour toutes les images qui utilisent cette base — mais il y en a 12 dans le registry.

**Tâche :** Appliquer le patch de sécurité sur toutes les images dérivées de `python:3.11` sans reconstruire manuellement chacune.

**Action :** L'équipe a configuré des ACR Tasks avec Base Image Trigger. Ils pushent la nouvelle `python:3.11-patched` dans ACR → les 12 tâches se déclenchent automatiquement.

**Résultat :** 12 images rebuiltées et pushées en parallèle en moins de 5 minutes, sans intervention manuelle sur chaque repo.

---

### 3. Scheduled Trigger (cron)
Déclenché selon une planification cron.

```bash
az acr task create \
  --registry myregistry \
  --name nightly-scan \
  --schedule "0 2 * * *" \
  --image "api:nightly"
```

---

## Variables intégrées

| Variable | Exemple | Usage |
|----------|---------|-------|
| `{{.Run.ID}}` | `ca3` | Tag unique et traçable par build |
| `{{.Run.Date}}` | `2026-05-24` | Timestamp du build |
| `{{.Run.Registry}}` | `myregistry.azurecr.io` | URL du registry |

**`{{.Run.ID}}` est la plus importante** — tag unique par exécution, permet de tracer quel build = quelle image.

---

## Multi-step Tasks (YAML)

Pour des workflows complexes (build → test → push) :

```yaml
version: v1.1.0
steps:
  - build: -t myregistry.azurecr.io/api:{{.Run.ID}} .
  - push:
    - myregistry.azurecr.io/api:{{.Run.ID}}
  - cmd: myregistry.azurecr.io/api:{{.Run.ID}} python -m pytest
```

---

## Sécurité : secrets dans Key Vault

```bash
# ✅ Lire le PAT depuis Key Vault
--git-access-token $(az keyvault secret show \
  --vault-name myvault \
  --name github-pat \
  --query value -o tsv)

# ❌ Jamais en dur dans la commande
--git-access-token ghp_abc123xyz
```

---

## Points clés pour l'examen

- **Quick task** = `az acr build` — build ponctuel, pas de Docker local requis
- **3 triggers** : Source Code (commit Git), Base Image Update, Scheduled (cron)
- **`{{.Run.ID}}`** = tag unique et traçable par build
- **Multi-step YAML** = build + test + push en pipeline
- Secrets → toujours dans **Azure Key Vault**, jamais en dur
