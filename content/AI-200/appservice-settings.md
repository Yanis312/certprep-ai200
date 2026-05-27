> **Dans cette unité on va parler de :**
> - Les App Settings : variables d'environnement injectées dans le container
> - Les Connection Strings et leurs préfixes automatiques
> - L'édition en masse (bulk edit) avec JSON
> - Les Slot Settings : configs qui restent sur un slot lors d'un swap
> - Les Key Vault references pour les secrets sensibles

---

## App Settings

Des paires nom-valeur injectées comme **variables d'environnement** au démarrage du container.

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings \
        STORAGE_ACCOUNT_NAME=mystorageaccount \
        LOG_LEVEL=INFO \
        MAX_DOCUMENT_SIZE_MB=50
```

**Lecture dans Python :**

```python
import os

storage_account = os.environ.get('STORAGE_ACCOUNT_NAME')
log_level = os.environ.get('LOG_LEVEL', 'WARNING')
max_size = int(os.environ.get('MAX_DOCUMENT_SIZE_MB', 10))
```

**Règles :**
- Chiffrées au repos — toujours, peu importe le contenu
- Noms : lettres, chiffres, underscores uniquement
- Pour .NET avec clés imbriquées : utiliser `__` au lieu de `:` → `ConnectionStrings__Default`

---

## Connection Strings

Forme spécialisée des app settings pour les connexions base de données. App Service ajoute automatiquement un **préfixe de type** :

```bash
az webapp config connection-string set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --connection-string-type SQLAzure \
    --settings DefaultConnection="Server=myserver.database.windows.net;..."
```

| Type | Préfixe variable d'env |
|------|----------------------|
| SQL Server | `SQLCONNSTR_` |
| SQL Azure | `SQLAZURECONNSTR_` |
| MySQL | `MYSQLCONNSTR_` |
| PostgreSQL | `POSTGRESQLCONNSTR_` |
| Custom | `CUSTOMCONNSTR_` |

La variable sera accessible comme `SQLAZURECONNSTR_DefaultConnection`.

> **Pour Python, Node.js, etc. :** Les app settings simples sont préférables aux Connection Strings — le préfixe ajoute de la complexité sans bénéfice pour les frameworks non-.NET.

---

## Bulk editing

Pour configurer beaucoup de settings d'un coup :

```bash
# Exporter les settings actuels
az webapp config appsettings list \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --output json > settings.json
```

Format JSON exporté :

```json
[
  { "name": "STORAGE_ACCOUNT_NAME", "value": "mystorageaccount", "slotSetting": false },
  { "name": "LOG_LEVEL", "value": "INFO", "slotSetting": false }
]
```

```bash
# Réimporter après modification
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings @settings.json
```

Dans le portail Azure : **Environment variables > Advanced edit** pour modifier en JSON directement.

---

## Slot Settings

Les **deployment slots** permettent de faire tourner plusieurs versions en parallèle (ex: staging + production) sur le même App Service plan.

**Swap** = permuter staging et production. Certains settings ne doivent PAS suivre lors du swap :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --slot staging \
    --slot-settings \
        ENVIRONMENT=staging \
        API_ENDPOINT=https://api-staging.example.com
```

**Settings à marquer comme slot settings :**
- Identifiants d'environnement (`ENVIRONMENT=production`)
- Endpoints spécifiques à l'env (API URLs, DB connections)
- Feature flags (actifs uniquement en staging)
- Verbose logging (ne doit pas passer en production)

#### ⭐ STAR — Slot settings lors d'un swap

**Situation :** Une app a `ENVIRONMENT=staging` en staging et `ENVIRONMENT=production` en prod. Sans slot settings, le swap inverserait les deux.

**Tâche :** `ENVIRONMENT` doit toujours refléter l'environnement réel, pas suivre le code.

**Action :** Marquer `ENVIRONMENT` comme slot setting — il reste attaché au slot, pas à l'app.

**Résultat :** Après le swap, la prod garde `ENVIRONMENT=production`, le staging garde `ENVIRONMENT=staging` — même si le code a été interverti.

---

## Key Vault References

Pour les secrets sensibles (clés API, passwords), référencer directement Azure Key Vault :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings \
        API_KEY="@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/api-key)"
```

App Service résout la référence et injecte la valeur réelle comme variable `API_KEY`. **Ton code ne sait pas que la valeur vient de Key Vault.**

**Prérequis :**
- Managed identity activée sur la web app
- L'identité a accès en lecture aux secrets du Key Vault
- Syntaxe `@Microsoft.KeyVault(...)` dans la valeur du setting

**Rotation automatique :** Sans version dans l'URI, App Service récupère la dernière version. Rafraîchissement dans les 24h, ou immédiat au prochain redémarrage.

---

## Vérifier la configuration

**Via Kudu (SCM) :**

```
https://<app-name>.scm.azurewebsites.net/Env
```

Affiche toutes les variables d'environnement injectées dans le container — tes app settings + les variables système Azure.
