# Lab — une application de chat qui utilise des outils

## Objectif

Construire un assistant de voyage pour l'agence fictive **Margie's Travel**, qui combine deux outils :

- **`web_search`** pour l'information générale et récente sur les destinations ;
- **`file_search`** pour répondre à partir des brochures PDF de l'agence.

- **Durée** : environ 30 minutes.
- **Endpoint** : l'endpoint **Azure OpenAI**, avec authentification **Entra ID**.

Certaines technologies du lab sont en préversion.

## Prérequis

Abonnement Azure actif (avec accès administrateur), Visual Studio Code, Python **3.13.x**, Git, Azure CLI.

## Étape 1 — Projet et modèle

1. Ouvre `https://ai.azure.com`, active **New Foundry** si besoin, crée un projet (ressource Foundry par défaut, ton abonnement, un groupe de ressources, une région recommandée).
2. **Discover → Models**, cherche **gpt-5.2**, déploie avec les paramètres par défaut.
3. Le modèle s'ouvre dans le playground.

## Étape 2 — Essayer les outils dans le playground

1. Si tu n'es pas dans le playground : **Build → Deployments**, puis ton modèle.
2. Dans le champ **Instructions** :

```
You are a travel assistant that provides information on travel services available from Margie's Travel.
```

3. Demande : `What are some recommended tourist activities in New York next month?`

**Ce que tu dois observer** : une réponse générique. Le modèle s'appuie sur ses données d'entraînement et ne sait rien de ce qui se passe le mois prochain.

4. Sous les instructions, section **Tools** : **Add**, puis ajoute **web_search**.
5. Repose la même question.

**Ce que tu dois observer** : le modèle utilise `web_search` et donne des informations actuelles.

## Étape 3 — Préparer le code

1. Page **Home** du portail : note l'**Azure OpenAI Endpoint** (pas l'endpoint du projet).
2. VS Code → `Ctrl+Shift+P` → **Git: Clone** → `https://github.com/microsoftlearning/mslearn-ai-studio`.
3. **Python: Select Interpreter** → un environnement Venv.
4. Dossier `/labfiles/tools/python/tools-app` :

| Élément | Rôle |
|---|---|
| `brochures` | Les brochures PDF de Margie's Travel |
| `.env` | Configuration |
| `requirements.txt` | Dépendances |
| `tools-app.py` | Le code de l'application |

5. Terminal intégré dans ce dossier, avec le préfixe `(.venv)` :

```bash
pip install -r requirements.txt
```

6. Dans `.env` : l'Azure OpenAI Endpoint et le nom exact du déploiement (`MODEL_DEPLOYMENT`).

## Étape 4 — Le client

```python
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
     DefaultAzureCredential(), "https://ai.azure.com/.default"
)

openai_client = OpenAI(
     base_url=azure_openai_endpoint,
     api_key=token_provider
)
```

## Étape 5 — Créer le vector store et charger les brochures

```python
print("Creating vector store and uploading files...")
vector_store = openai_client.vector_stores.create(
     name="travel-brochures"
)
file_streams = [open(f, "rb") for f in glob.glob("brochures/*.pdf")]
if not file_streams:
     print("No PDF files found in the brochures folder!")
     return
file_batch = openai_client.vector_stores.file_batches.upload_and_poll(
     vector_store_id=vector_store.id,
     files=file_streams
)
for f in file_streams:
     f.close()
print(f"Vector store created with {file_batch.file_counts.completed} files.")
```

À remarquer : `file_batches.upload_and_poll` charge **plusieurs fichiers** d'un coup, et `file_batch.file_counts.completed` donne le nombre de fichiers indexés.

## Étape 6 — L'appel avec deux outils

```python
response = openai_client.responses.create(
     model=model_deployment,
     instructions="""
     You are a travel assistant that provides information on travel services available from Margie's Travel.
     Answer questions about services offered by Margie's Travel using the provided travel brochures.
     Search the web for general information about destinations or current travel advice.
     """,
     input=input_text,
     previous_response_id=last_response_id,
     tools=[
         {
             "type": "file_search",
             "vector_store_ids": [vector_store.id]
         },
         {
             "type": "web_search"
         }
     ]
)
print(response.output_text)
last_response_id = response.id
```

Lis bien les **instructions** : elles disent au modèle **quand** utiliser chaque outil. Les brochures pour les services de l'agence, le web pour l'information générale.

## Étape 7 — Exécuter et tester

```bash
az login
python tools-app.py
```

| Question | Outil attendu |
|---|---|
| `What's happening in San Francisco next month?` | `web_search` |
| `What hotels does Margie's Travel offer there?` | `file_search` |

La deuxième question dit « there » : elle ne fonctionne que parce que `previous_response_id` conserve le contexte.

Tape `quit` pour sortir.

## Nettoyage

Dans le **portail Azure**, ouvre le groupe de ressources du lab, choisis **Delete resource group**, saisis son nom et confirme.

## Exercices rapides

**1.** Quels deux outils le lab combine-t-il ?

**2.** Dans le playground, où ajoute-t-on un outil ?

**3.** Quelle méthode charge plusieurs fichiers dans un vector store ?

**4.** Comment le modèle sait-il qu'il doit utiliser les brochures pour les hôtels de l'agence et le web pour le reste ?

**5.** Pourquoi « What hotels does Margie's Travel offer there? » est-elle comprise ?

<details>
<summary>Voir le corrigé</summary>

**1.** `file_search` et `web_search`.

**2.** Dans la section Tools, sous les instructions, avec le bouton Add.

**3.** `openai_client.vector_stores.file_batches.upload_and_poll(...)`.

**4.** Grâce aux instructions, qui précisent l'usage de chaque source ; le modèle choisit ensuite l'outil selon la question.

**5.** Parce que `previous_response_id` transmet le contexte du tour précédent, où il était question de San Francisco.

</details>
