> **Dans cette unité, on va voir :**
> - La différence entre tags stables (mutables) et tags uniques (immuables)
> - Le versioning sémantique (semver) et pourquoi c'est la bonne pratique
> - Comment verrouiller un repository en lecture seule pour la production
> - Supprimer les vieilles images avec `acr purge`
> - Les politiques de rétention automatiques (Premium)

---

## Tags stables vs tags uniques

### Tags stables (mutables)
Des tags lisibles, mis à jour à chaque release :

```bash
myregistry.azurecr.io/api:latest
myregistry.azurecr.io/api:stable
myregistry.azurecr.io/api:prod
```

**Avantage :** facile à utiliser — `docker pull api:latest` donne toujours la dernière version
**Risque :** mutable — un push accidentel peut écraser l'image de production

### Tags uniques (immuables)
Identifiants précis qui ne changent jamais :

```bash
myregistry.azurecr.io/api:v1.2.3
myregistry.azurecr.io/api:v1.2.3-abc123
myregistry.azurecr.io/api:2026-05-24-ca3
```

#### Mise en situation — Incident causé par un tag mutable

**Situation :** Une app de paiement est en production avec l'image `payments:latest`. Un développeur teste une nouvelle fonctionnalité et pousse accidentellement sous `payments:latest` depuis sa branche de dev. Le déploiement suivant tire cette version de test en production.

**Tâche :** Éviter ce type d'incident et garantir que chaque déploiement de production est traçable et reproductible.

**Action :** Le pipeline CI/CD génère deux tags systématiquement : `:v1.4.2` (semver fixe, immuable) et `:latest` (mis à jour uniquement depuis la branche main). Les déploiements Kubernetes référencent `:v1.4.2`, jamais `:latest`.

**Résultat :** Plus d'incident lié aux tags. En cas de bug, rollback immédiat vers `payments:v1.4.1` en 30 secondes. Chaque déploiement est reproductible à l'identique.

---

## Versioning sémantique (semver)

Format : `MAJEUR.MINEUR.PATCH`

```bash
:v1.0.0   # release initiale
:v1.0.1   # correction de bug (patch)
:v1.1.0   # nouvelle fonctionnalité rétrocompatible (minor)
:v2.0.0   # changement breaking (major)
```

**Bonne pratique — double tag :**
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

#### Mise en situation — Audit de conformité

**Situation :** Une fintech doit prouver à ses auditeurs que les images déployées en production il y a 6 mois n'ont pas été modifiées. Leurs images sont dans ACR, mais sans protection elles pourraient être écrasées.

**Tâche :** Garantir l'intégrité des images de production pour les besoins d'audit et de conformité réglementaire.

**Action :** Après chaque release validée, l'équipe DevOps exécute `az acr repository update --write-enabled false` sur le repository de production. Les images sont figées — impossible de les modifier sans réactivation explicite.

**Résultat :** L'auditeur peut vérifier que l'image `api:v1.4.2` déployée il y a 6 mois est identique à celle en registry (même digest sha256). Conformité prouvée, zéro discussion.

---

## Suppression des images obsolètes

### acr purge

```bash
# Supprimer les images non-taguées de plus de 30 jours
az acr run \
  --registry myregistry \
  --cmd "acr purge --registry myregistry \
    --filter 'api:.*' \
    --ago 30d \
    --untagged" \
  /dev/null

# TOUJOURS tester avec --dry-run avant de supprimer
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
- `--untagged` — inclure les manifests sans tag (layers orphelins)
- `--dry-run` — simuler sans supprimer (**toujours faire ça d'abord**)
- `--keep 5` — conserver les 5 images les plus récentes quoi qu'il arrive

#### Mise en situation — Facture de stockage ACR qui explose

**Situation :** Une startup a un pipeline CI qui build et pousse une image à chaque commit depuis 6 mois. Le registry ACR contient maintenant 800+ artifacts non-taguées. La facture de stockage Azure passe de 20€/mois à 180€/mois.

**Tâche :** Nettoyer les images obsolètes et mettre en place une politique de nettoyage automatique pour éviter que ça se reproduise.

**Action :** D'abord `--dry-run` pour vérifier ce qui sera supprimé. Puis `acr purge --ago 30d --untagged --keep 5` pour garder les 5 dernières par repository. Enfin, planifier la tâche en cron hebdomadaire.

**Résultat :** 750 artifacts supprimées, stockage réduit de 87%, facture revenue à 25€/mois. La cron hebdomadaire maintient le registre propre automatiquement.

---

## Politiques de rétention (Premium)

```bash
az acr config retention update \
  --registry myregistry \
  --status enabled \
  --days 30 \
  --type UntaggedManifests
```

**Différence avec `acr purge` :**
- `acr purge` = nettoyage manuel ou planifié via Task
- Politique de rétention = règle automatique gérée par ACR directement (tier Premium)

---

## Points clés pour l'examen

- **Tags stables** (`:latest`) = mutables, pratiques mais risqués en prod
- **Tags uniques** (`:v1.2.3`) = immuables, traçables — à préférer pour la prod
- **`az acr repository update --write-enabled false`** = lecture seule, protection de la prod
- **`acr purge`** = nettoyage avec filtres — **toujours `--dry-run` d'abord**
- **Politiques de rétention** = automatisation Premium, supprime les manifests non-taguées
