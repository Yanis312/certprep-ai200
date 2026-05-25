## Stratégie de tags : stable vs unique

### Tags stables (mutables)
Des tags lisibles, mis à jour à chaque release :

```bash
myregistry.azurecr.io/api:latest
myregistry.azurecr.io/api:stable
myregistry.azurecr.io/api:prod
```

**Avantage :** facile à utiliser — `docker pull api:latest` donne toujours la dernière version  
**Risque :** mutable — quelqu'un peut pousser une image différente sous le même tag

### Tags uniques (immuables)
Identifiants précis qui ne changent jamais :

```bash
myregistry.azurecr.io/api:v1.2.3
myregistry.azurecr.io/api:v1.2.3-abc123
myregistry.azurecr.io/api:2026-05-24-ca3
```

**Bonne pratique :** combiner les deux — tagger avec semver (**:v1.2.3**) ET mettre à jour **:latest** en parallèle.

---

## Versioning sémantique (semver)

Format : `MAJEUR.MINEUR.PATCH`

```bash
:v1.0.0   # release initiale
:v1.0.1   # correction de bug (patch)
:v1.1.0   # nouvelle fonctionnalité rétrocompatible (minor)
:v2.0.0   # changement breaking (major)
```

**Pattern complet (recommandé) :**
```bash
az acr build --registry myregistry \
  --image "api:v1.2.3" \
  --image "api:latest" \
  .
```

---

## Immutabilité des repositories

Pour protéger les images de production contre les modifications accidentelles :

```bash
# Verrouiller un repository en lecture seule
az acr repository update \
  --name myregistry \
  --repository api \
  --write-enabled false

# Vérifier le statut
az acr repository show \
  --name myregistry \
  --repository api
```

**Effet :** aucun `docker push` ne peut remplacer les images existantes. Pour mettre à jour, il faut d'abord réactiver les écritures.

---

## Suppression des images obsolètes

### Commande `acr purge`

```bash
# Supprimer les images non-taguées de plus de 30 jours
az acr run \
  --registry myregistry \
  --cmd "acr purge --registry myregistry \
    --filter 'api:.*' \
    --ago 30d \
    --untagged" \
  /dev/null

# Tester sans supprimer (dry-run recommandé avant)
az acr run \
  --registry myregistry \
  --cmd "acr purge --registry myregistry \
    --filter 'api:.*' \
    --ago 30d \
    --untagged \
    --dry-run" \
  /dev/null
```

**Options importantes :**
- `--ago 30d` — images de plus de 30 jours
- `--untagged` — inclure les manifests sans tag
- `--dry-run` — simuler sans supprimer (toujours tester d'abord !)
- `--keep 5` — conserver les 5 images les plus récentes

---

## Politiques de rétention (Premium)

ACR Premium permet d'automatiser la suppression des manifests non-taguées :

```bash
az acr config retention update \
  --registry myregistry \
  --status enabled \
  --days 30 \
  --type UntaggedManifests
```

**Différence avec `acr purge` :**
- `acr purge` = nettoyage manuel ou planifié via Task
- Politique de rétention = règle automatique gérée par ACR lui-même

---

## Points clés pour l'examen

- **Tags stables** (`:latest`) = mutables, pratiques mais risqués en prod
- **Tags uniques** (`:v1.2.3`) = immuables, traçables — à préférer
- **`az acr repository update --write-enabled false`** = lecture seule pour protéger la prod
- **`acr purge`** = nettoyage des images obsolètes avec filtres et dry-run
- **Politiques de rétention** = automatisation Premium, supprime les manifests non-taguées
- Toujours faire un **--dry-run** avant de purger en production
