# ACR Tasks — Builds dans le cloud

## C'est quoi ACR Tasks ?

Tu envoies ton code à Azure → Azure build l'image → Azure la pousse dans ACR.
**Plus besoin de Docker installé en local.**

---

## Les 3 types de tâches

### 1. Quick Task — Build à la demande

```bash
# Build depuis dossier local
az acr build --registry myregistry --image inference-api:v1.0.0 .

# Build depuis GitHub (sans cloner)
az acr build --registry myregistry \
  --image inference-api:v1.0.0 \
  https://github.com/myorg/inference-api.git
```

**Quand ?** Build ponctuel, tester un Dockerfile, pas de pipeline CI/CD.

---

### 2. Triggered Task — Déclenchement automatique

**a) Trigger sur commit Git**
```bash
az acr task create \
  --registry myregistry \
  --name build-api \
  --image inference-api:{{.Run.ID}} \
  --context https://github.com/myorg/inference-api.git#main \
  --file Dockerfile \
  --git-access-token $PAT
```

`{{.Run.ID}}` = tag unique par build → traçabilité garantie.

**b) Trigger sur base image**
Ton `FROM python:3.11` est mis à jour → ACR rebuild automatiquement → patches de sécurité sans intervention.

**c) Trigger planifié (cron)**
```bash
--schedule "0 0 * * *"   # tous les jours à minuit UTC
```

---

### 3. Multi-step Task — Pipeline YAML complet

```yaml
version: v1.1.0
steps:
  - build: -t {{.Run.Registry}}/inference-api:{{.Run.ID}} .
  - push:
    - {{.Run.Registry}}/inference-api:{{.Run.ID}}
  - cmd: {{.Run.Registry}}/inference-api:{{.Run.ID}} python -m pytest tests/
```

Build → Push → Test. Si les tests échouent, l'image n'est pas déployée.

---

## Tester une image existante

```bash
az acr run --registry myregistry \
  --cmd 'inference-api:v1.0.0 python --version' \
  /dev/null
```

`/dev/null` = pas de fichier source, on utilise l'image déjà dans ACR.

---

## Règle de sécurité absolue

Les tokens Git (PAT) → toujours dans **Azure Key Vault**, jamais dans le code.
