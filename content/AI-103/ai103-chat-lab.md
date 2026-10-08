# Lab — créer une application de chat

## Objectif

Créer une application de chat en Python avec le **SDK OpenAI**, connectée à un modèle déployé dans un projet Foundry. Tu passes par quatre versions successives du même code.

- **Durée** : environ 45 minutes.
- **Endpoint utilisé** : l'endpoint **Azure OpenAI**, pas l'endpoint du projet.
- **Authentification** : Microsoft Entra ID.

Certaines technologies du lab sont en préversion : des avertissements ou erreurs inattendus sont possibles.

## Prérequis

| Outil | Remarque |
|---|---|
| Abonnement Azure actif | |
| Visual Studio Code | Avec l'extension **Python** |
| Python **3.13.x** | Python 3.14 existe, mais certaines dépendances ne sont pas encore compilées pour cette version |
| Git | Installé et configuré |
| Azure CLI | Pour `az login` |

## Étape 1 — Créer le projet Foundry

1. Ouvre `https://ai.azure.com` et connecte-toi.
2. Active l'option **New Foundry** dans la barre du haut si elle ne l'est pas.
3. Crée un projet avec un nom unique. Dans **Advanced options** :
   - **Foundry resource** : nom par défaut (en général `{nom_du_projet}-resource`) ;
   - **Subscription** : ton abonnement ;
   - **Resource group** : nouveau ou existant ;
   - **Region** : une des régions recommandées.

## Étape 2 — Déployer un modèle

1. Page **Discover**, onglet **Models**.
2. Cherche **gpt-5.2**.
3. Lis la model card, puis déploie avec les **paramètres par défaut**.
4. Le modèle s'ouvre dans le playground : teste-le si tu veux.

## Étape 3 — Récupérer l'endpoint

1. Va sur la page **Home**.
2. Note l'**Azure OpenAI Endpoint**.

Piège du lab : c'est bien l'endpoint **Azure OpenAI** qu'il faut, pas l'endpoint du projet.

## Étape 4 — Préparer le code

1. Dans VS Code : palette de commandes (`Ctrl+Shift+P`) → **Git: Clone** → `https://github.com/microsoftlearning/mslearn-ai-studio`.
2. Commande **Python: Select Interpreter** → crée un environnement **Venv** basé sur Python 3.13.
3. Ouvre le dossier `/labfiles/foundry-chat/python/chat-app`. Il contient :

| Fichier | Rôle |
|---|---|
| `.env` | Configuration de l'application |
| `requirements.txt` | Dépendances Python |
| `chat-app.py` | L'application de chat |
| `chat-async.py` | La version asynchrone |

4. Clic droit sur le dossier `chat-app` → **Open in integrated terminal**. Le préfixe `(.venv)` doit apparaître.
5. Installe les dépendances :

```bash
pip install -r requirements.txt
```

6. Dans `.env`, renseigne l'**Azure OpenAI Endpoint** et le **nom exact du déploiement** (réglage `MODEL_DEPLOYMENT`).

## Étape 5 — Version 1 : ChatCompletions

Imports :

```python
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider
```

Client :

```python
token_provider = get_bearer_token_provider(
     DefaultAzureCredential(), "https://ai.azure.com/.default"
)

openai_client = OpenAI(
     base_url=azure_openai_endpoint,
     api_key=token_provider
)
```

Appel, dans la boucle :

```python
completion = openai_client.chat.completions.create(
     model=model_deployment,
     messages=[
         {"role": "system", "content": "You are a helpful AI assistant that answers questions and provides information."},
         {"role": "user", "content": input_text}
     ]
)
print(completion.choices[0].message.content)
```

Connexion puis exécution :

```bash
az login
python chat-app.py
```

Si tu as des abonnements dans plusieurs tenants, précise-le avec le paramètre `--tenant`.

Prompt de test : `Tell me about the ELIZA chatbot.` Tape `quit` pour sortir.

## Étape 6 — Version 2 : Responses

Remplace l'appel par :

```python
response = openai_client.responses.create(
             model=model_deployment,
             instructions="You are a helpful AI assistant that answers questions and provides information.",
             input=input_text
)
print(response.output_text)
```

Relance, pose la question sur ELIZA, puis : `How does it compare to modern LLMs?`

**Ce que tu dois observer** : le modèle ne comprend pas à quoi « it » renvoie. Le contexte est perdu, car chaque appel est indépendant.

## Étape 7 — Version 3 : suivi de conversation

Avant la boucle :

```python
last_response_id = None
```

Dans la boucle :

```python
response = openai_client.responses.create(
             model=model_deployment,
             instructions="You are a helpful AI assistant that answers questions and provides information.",
             input=input_text,
             previous_response_id=last_response_id,
)
print(response.output_text)
last_response_id = response.id
```

**Ce que tu dois observer** : la deuxième question reçoit cette fois une vraie comparaison entre ELIZA et les LLM modernes. La réponse est longue et l'application semble figée en attendant.

On pourrait aussi passer l'id de **n'importe quelle** réponse antérieure, pour rediriger une conversation ou reprendre un ancien fil.

## Étape 8 — Version 4 : streaming

```python
stream = openai_client.responses.create(
             model=model_deployment,
             instructions="You are a helpful AI assistant that answers questions and provides information.",
             input=input_text,
             previous_response_id=last_response_id,
             stream=True
)
for event in stream:
     if event.type == "response.output_text.delta":
         print(event.delta, end="")
     elif event.type == "response.completed":
         last_response_id = event.response.id
print()
```

**Ce que tu dois observer** : le texte s'affiche morceau par morceau.

## Étape 9 — Version asynchrone

Dans `chat-async.py`. Imports :

```python
import asyncio
from openai import AsyncOpenAI
from azure.identity.aio import DefaultAzureCredential, get_bearer_token_provider
```

Remarque le module **`azure.identity.aio`** : c'est la version asynchrone des identifiants.

Client :

```python
credential = DefaultAzureCredential()
token_provider = get_bearer_token_provider(
 credential, "https://ai.azure.com/.default"
)

async_client = AsyncOpenAI(
     base_url=azure_openai_endpoint,
     api_key=token_provider
)
```

Appel :

```python
response = await async_client.responses.create(
             model=model_deployment,
             instructions="You are a helpful AI assistant that answers questions and provides information.",
             input=input_text,
             previous_response_id=last_response_id
)
assistant_text = response.output_text
print("Assistant:", assistant_text)
last_response_id = response.id
```

Dans le bloc `finally`, on ferme la session :

```python
await credential.close()
```

Exécution : `python chat-async.py`, prompt de test `Tell me about the Turing test.`

## Les 4 versions en un coup d'œil

| Version | Ce qui change | Problème résolu |
|---|---|---|
| 1. ChatCompletions | `chat.completions.create()` + `messages` | Point de départ |
| 2. Responses | `responses.create()` + `instructions` + `input` | Syntaxe plus simple |
| 3. Suivi | `previous_response_id` | Le contexte n'est plus perdu |
| 4. Streaming | `stream=True` + boucle sur les événements | L'application ne paraît plus figée |

## Nettoyage

Pour éviter des coûts inutiles :

1. Ouvre le **portail Azure** et affiche le groupe de ressources du lab.
2. Sélectionne **Delete resource group**.
3. Saisis le nom du groupe et confirme.

## Exercices rapides

**1.** Quel endpoint le lab utilise-t-il ?

**2.** Pourquoi la deuxième question échoue-t-elle à l'étape 6 ?

**3.** Quelles deux lignes ajoutes-tu pour corriger ce problème ?

**4.** De quel module importe-t-on `DefaultAzureCredential` pour la version asynchrone ?

**5.** Quelle commande faut-il lancer avant `python chat-app.py` pour que l'authentification Entra ID fonctionne ?

**6.** Que fait-on à la fin pour ne plus rien payer ?

<details>
<summary>Voir le corrigé</summary>

**1.** L'endpoint Azure OpenAI, avec l'authentification Entra ID.

**2.** Chaque appel est indépendant : sans `previous_response_id`, le modèle n'a pas le contexte de la question précédente.

**3.** `previous_response_id=last_response_id` dans l'appel, et `last_response_id = response.id` après la réponse (avec `last_response_id = None` avant la boucle).

**4.** De `azure.identity.aio`.

**5.** `az login`.

**6.** On supprime le groupe de ressources dans le portail Azure.

</details>
