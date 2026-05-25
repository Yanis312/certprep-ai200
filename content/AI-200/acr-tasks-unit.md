## Qu'est-ce qu'ACR Tasks ?

ACR Tasks est un service qui exécute des **builds de containers dans le cloud Azure** — sans avoir besoin de Docker en local ni d'un serveur CI/CD séparé.

---

## Quick Task (tâche rapide)

Une quick task est un **build ponctuel, déclenché manuellement**.

```bash
# Build et push depuis le dossier courant
az acr build --registry myregistry --image api:v1 .

# Tester une image existante dans ACR (pas de source locale)
az acr run \
  --registry myregistry \
  --cmd "myregistry.azurecr.io/api:v1 python --version" \
  /dev/null
```

`/dev/null` comme contexte signifie qu'on n'a pas besoin de fichiers sources — on teste juste une image déjà dans le registry.

---

## Triggered Tasks (tâches déclenchées)

Les triggered tasks s'exécutent automatiquement selon 3 types de triggers :

### 1. Source Code Trigger
Déclenché à chaque commit Git (via webhook GitHub/Azure DevOps).

```bash
az acr task create \
  --registry myregistry \
  --name build-api \
  --image "api:{{.Run.ID}}" \
  --context https://github.com/user/repo.git \
  --branch main \
  --git-access-token $(az keyvault secret show --vault-name myvault --name github-pat --query value -o tsv)
```

### 2. Base Image Trigger
Déclenché automatiquement quand l'image de base est mise à jour dans ACR.

**Cas d'usage :** node:20 reçoit un patch de sécurité → toutes les images qui en héritent se rebuilident automatiquement.

### 3. Scheduled Trigger (cron)
Déclenché selon une planification cron.

```bash
az acr task create \
  --registry myregistry \
  --name nightly-build \
  --schedule "0 2 * * *" \   # tous les jours à 2h du matin
  --image "api:nightly"
```

---

## Multi-step Tasks (YAML)

Pour des workflows complexes (build → test → push → notifier), on utilise un fichier YAML :

```yaml
version: v1.1.0
steps:
  - build: -t myregistry.azurecr.io/api:{{.Run.ID}} .
  - push:
    - myregistry.azurecr.io/api:{{.Run.ID}}
  - cmd: myregistry.azurecr.io/api:{{.Run.ID}} python -m pytest
```

---

## Variables intégrées

ACR Tasks expose des variables utilisables dans les commandes et tags :

| Variable | Valeur exemple | Usage |
|----------|---------------|-------|
| `{{.Run.ID}}` | `ca3` | Tag unique et traçable par build |
| `{{.Run.Date}}` | `2026-05-24` | Timestamp du build |
| `{{.Run.Registry}}` | `myregistry.azurecr.io` | URL du registry |

**`{{.Run.ID}}` est la plus importante** — elle génère un identifiant unique pour chaque exécution, ce qui permet de tracer exactement quel build a produit quelle image.

---

## Sécurité des credentials

**Ne jamais** mettre un Personal Access Token (PAT) en dur dans une commande ou un fichier versionné.

```bash
# ✅ Correct : lire le PAT depuis Key Vault
--git-access-token $(az keyvault secret show \
  --vault-name myvault \
  --name github-pat \
  --query value -o tsv)

# ❌ Jamais ça
--git-access-token ghp_abc123xyz
```

---

## Points clés pour l'examen

- **Quick task** = `az acr build` ou `az acr run` — build ponctuel, pas de Docker local
- **3 triggers** : Source Code (commit Git), Base Image Update, Scheduled (cron)
- **`{{.Run.ID}}`** = tag unique et traçable par build
- **Multi-step YAML** = build + test + push en pipeline
- Secrets → toujours dans **Azure Key Vault**
