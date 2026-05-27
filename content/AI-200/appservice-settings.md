> **Dans cette unité on va parler de :**
> - App Settings : variables d'environnement injectées au démarrage du container
> - Connection Strings et leurs préfixes automatiques (SQLAZURECONNSTR_, etc.)
> - Pourquoi les Connection Strings sont moins recommandées pour Python/Node.js
> - Bulk editing avec JSON export/import
> - Slot Settings : configs qui restent sur un slot lors d'un swap staging → production
> - Key Vault References : injecter des secrets sans les exposer dans la config

---

## App Settings — Variables d'environnement

Les App Settings sont des **paires nom-valeur** qu'App Service injecte comme variables d'environnement dans le container au démarrage.

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings \
        STORAGE_ACCOUNT_NAME=mystorageaccount \
        LOG_LEVEL=INFO \
        MAX_DOCUMENT_SIZE_MB=50
```

**Lecture dans l'application :**
```python
import os

storage_account = os.environ.get('STORAGE_ACCOUNT_NAME')
log_level = os.environ.get('LOG_LEVEL', 'WARNING')      # valeur par défaut si absente
max_size = int(os.environ.get('MAX_DOCUMENT_SIZE_MB', 10))
```

**Règles importantes :**
- **Chiffrées au repos** — toujours, peu importe le contenu, même les settings non-sensibles
- **Noms** : lettres, chiffres, underscores uniquement. Pas d'espaces, pas de tirets
- **Pour .NET** : les clés imbriquées avec `:` doivent utiliser `__` → `ConnectionStrings__DefaultConnection`
- **Chaque modification** redémarre l'app

---

## Connection Strings

Forme spécialisée des app settings, conçue pour les connexions base de données. App Service ajoute automatiquement un **préfixe de type** au nom de la variable :

```bash
az webapp config connection-string set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --connection-string-type SQLAzure \
    --settings DefaultConnection="Server=myserver.database.windows.net;Database=mydb;..."
```

La variable devient : **`SQLAZURECONNSTR_DefaultConnection`**

| Type CLI | Préfixe variable d'env |
|---------|----------------------|
| `SQLServer` | `SQLCONNSTR_` |
| `SQLAzure` | `SQLAZURECONNSTR_` |
| `MySQL` | `MYSQLCONNSTR_` |
| `PostgreSQL` | `POSTGRESQLCONNSTR_` |
| `Custom` | `CUSTOMCONNSTR_` |

### Quand utiliser les Connection Strings vs App Settings ?

**Connection Strings → .NET uniquement.** ASP.NET et Entity Framework cherchent ces préfixes nativement.

**App Settings → Python, Node.js, Java, tout le reste.** Le préfixe automatique ajoute de la complexité inutile. Pour Python, utilise simplement :
```bash
--settings DB_CONNECTION_STRING="Server=myserver..."
```
Et lis avec `os.environ.get('DB_CONNECTION_STRING')`. Beaucoup plus clair.

---

## Bulk editing — Modifier plusieurs settings d'un coup

```bash
# Exporter les settings actuels en JSON
az webapp config appsettings list \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --output json > settings.json
```

**Format du JSON exporté :**
```json
[
  { "name": "STORAGE_ACCOUNT_NAME", "value": "mystorageaccount", "slotSetting": false },
  { "name": "LOG_LEVEL", "value": "INFO", "slotSetting": false },
  { "name": "MAX_DOCUMENT_SIZE_MB", "value": "50", "slotSetting": false }
]
```

```bash
# Modifier le fichier puis réimporter
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings @settings.json
```

Dans le portail Azure : **Environment variables → Advanced edit** pour modifier directement en JSON.

---

## Deployment Slots et Slot Settings

Les **deployment slots** permettent de faire tourner plusieurs versions de l'app en parallèle (ex: `staging` + `production`) sur le même App Service plan.

```
https://myapp.azurewebsites.net          → production
https://myapp-staging.azurewebsites.net  → staging
```

### Le swap
Un swap échange le contenu de deux slots — la version staging devient la production en quelques secondes, sans downtime.

**Le problème :** Certains settings ne doivent PAS suivre lors du swap. Si `ENVIRONMENT=production` swappait avec `ENVIRONMENT=staging`, la prod se retrouverait avec la config staging.

### Slot Settings — settings qui restent sur leur slot

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --slot staging \
    --slot-settings \
        ENVIRONMENT=staging \
        API_ENDPOINT=https://api-staging.example.com \
        LOG_LEVEL=DEBUG
```

**Settings à marquer comme slot settings :**
- Identifiants d'environnement (`ENVIRONMENT=production`)
- Endpoints spécifiques (`API_ENDPOINT`, `DB_CONNECTION_STRING`)
- Feature flags activés uniquement en staging
- Niveau de logging (DEBUG en staging, WARNING en prod)

#### ⭐ STAR — Swap sans impacter la production

**Situation :** L'équipe fait un swap staging → production. La production commence à logger en DEBUG au lieu de WARNING. Les logs explosent et les performances chutent.

**Tâche :** Empêcher que `LOG_LEVEL` suive lors des swaps.

**Action :** Marquer `LOG_LEVEL` comme slot setting sur les deux slots :
- Slot production : `LOG_LEVEL=WARNING` (slot setting)
- Slot staging : `LOG_LEVEL=DEBUG` (slot setting)

**Résultat :** Après le swap, le code de staging va en production, mais chaque slot garde son propre `LOG_LEVEL`. La prod reste en WARNING, le staging reste en DEBUG.

---

## Key Vault References — Secrets sans les exposer

Pour les secrets sensibles (clés API, passwords, certificats), ne les mets jamais en clair dans les App Settings. Utilise une référence Key Vault :

```bash
az webapp config appsettings set \
    --resource-group myResourceGroup \
    --name myDocumentProcessor \
    --settings \
        API_KEY="@Microsoft.KeyVault(SecretUri=https://myvault.vault.azure.net/secrets/api-key)"
```

App Service résout la référence et injecte la **vraie valeur** comme variable `API_KEY`. **L'application lit `os.environ.get('API_KEY')` normalement — elle ne sait pas que la valeur vient de Key Vault.**

**Prérequis :**
1. Managed identity activée sur la web app
2. L'identité a le rôle `Key Vault Secrets User` sur le Key Vault
3. Syntaxe `@Microsoft.KeyVault(...)` dans la valeur du setting

**Rotation automatique :** Sans version dans l'URI (`/secrets/api-key` sans `/<version>`), App Service récupère toujours la dernière version. Refresh dans les 24h, ou immédiat au prochain redémarrage.

**Vérifier que la référence est résolue :**
Le portail affiche le statut de résolution. Si la référence échoue, l'app reçoit la chaîne littérale `@Microsoft.KeyVault(...)` au lieu de la valeur.

---

## Vérifier la configuration — Kudu

Pour voir toutes les variables injectées dans ton container :

```
https://<app-name>.scm.azurewebsites.net/Env
```

Affiche tes app settings + les **variables système** qu'App Service injecte automatiquement (comme `WEBSITE_HOSTNAME`, `WEBSITES_PORT`, etc.).
