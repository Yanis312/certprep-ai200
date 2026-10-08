# Generate responses with the Responses API

## L'essentiel

- L'**API Responses** réunit deux anciennes API (**ChatCompletions** et **Assistants**) en une seule.
- Elle est **avec état** (stateful) : elle garde le fil de la conversation d'un tour à l'autre.
- C'est l'approche **recommandée** dans Foundry ; elle remplace ChatCompletions dans la plupart des cas.
- Méthode clé : **`responses.create()`**, avec `model`, `input`, et en option `instructions`.
- Pour enchaîner les tours : **`previous_response_id`**.

## Ses 4 avantages

| Avantage | Détail |
|---|---|
| **Conversations avec état** | Le contexte est conservé sur plusieurs tours |
| **Expérience unifiée** | Combine les usages de ChatCompletions et de l'API Assistants |
| **Modèles directs Foundry** | Fonctionne avec les modèles hébergés directement dans Foundry, pas seulement Azure OpenAI |
| **Intégration simple** | Accessible par le client compatible OpenAI |

On y accède par un client compatible OpenAI, obtenu avec le SDK Foundry **ou** le SDK OpenAI.

## Une réponse simple

```python
response = openai_client.responses.create(
    model="gpt-4.1",                      # nom de TON déploiement
    input="What is Microsoft Foundry?"
)

print(response.output_text)
```

`input` reçoit une chaîne de texte : ton prompt.

## L'objet réponse

| Propriété | Contenu |
|---|---|
| `output_text` | Le texte généré |
| `id` | Identifiant unique de la réponse |
| `status` | État, par exemple `"completed"` |
| `usage` | Tokens consommés : entrée, sortie, total |
| `model` | Le modèle utilisé |

```python
print(f"Response: {response.output_text}")
print(f"Response ID: {response.id}")
print(f"Tokens used: {response.usage.total_tokens}")
print(f"Status: {response.status}")
```

## Ajouter des instructions

`instructions` joue le rôle du **prompt système** : il guide le comportement du modèle.

```python
response = openai_client.responses.create(
    model="gpt-4.1",
    instructions="You are a helpful AI assistant that answers questions clearly and concisely.",
    input="Explain neural networks."
)
```

## Contrôler la génération

```python
response = openai_client.responses.create(
    model="gpt-4.1",
    instructions="You are a helpful AI assistant that answers questions clearly and concisely.",
    input="Write a creative story about AI.",
    temperature=0.8,          # plus haut = plus créatif
    max_output_tokens=200     # limite la longueur
)
```

| Paramètre | Rôle |
|---|---|
| `temperature` | Contrôle l'aléa, de **0.0 à 2.0**. Plus haut = sortie plus créative et variée |
| `max_output_tokens` | Nombre maximal de tokens dans la réponse |
| `top_p` | Alternative à temperature pour contrôler l'aléa |

Attention au nom : c'est **`max_output_tokens`** avec l'API Responses.

## Modèles directs Foundry

Avec le SDK Foundry ou un client `AzureOpenAI` connecté à un endpoint de projet, l'API Responses fonctionne avec les modèles Azure OpenAI **et** les modèles directs Foundry (Microsoft Phi, DeepSeek...) :

```python
response = openai_client.responses.create(
    model="microsoft-phi-4",
    instructions="You are a helpful AI assistant that answers questions clearly and concisely.",
    input="What are the benefits of small language models?"
)
```

## Conversation sur plusieurs tours

On relie les réponses avec **`previous_response_id`** :

```python
# Premier tour
response1 = openai_client.responses.create(
    model="gpt-4.1",
    instructions="You are a helpful AI assistant that explains technology concepts clearly.",
    input="What is machine learning?"
)

# Deuxième tour : on passe l'id de la réponse précédente
response2 = openai_client.responses.create(
    model="gpt-4.1",
    instructions="You are a helpful AI assistant that explains technology concepts clearly.",
    input="Can you give me an example?",
    previous_response_id=response1.id
)
```

Sans `previous_response_id`, le modèle ne sait pas de quoi « un exemple » parle.

### La boucle de chat complète

```python
last_response_id = None                     # 1. aucun historique au départ

while True:
    input_text = input('\nYou: ')
    if input_text.lower() == "quit":
        break

    response = openai_client.responses.create(
        model=model_name,
        instructions="You are a helpful AI assistant that explains technology concepts clearly.",
        input=input_text,
        previous_response_id=last_response_id    # 2. on relie au tour précédent
    )
    print("\nAssistant:", response.output_text)
    last_response_id = response.id               # 3. on mémorise l'id pour le prochain tour
```

Les trois lignes à connaître : initialiser à `None`, passer `previous_response_id`, mettre à jour avec `response.id`.

À chaque tour, le modèle reçoit le message système (`instructions`), la nouvelle entrée et la réponse précédente.

## Alternative : gérer l'historique à la main

On construit soi-même la liste des messages et on la passe dans `input` :

```python
conversation_history = [
    {"type": "message", "role": "user", "content": "What is machine learning?"}
]

response1 = openai_client.responses.create(model="gpt-4.1", input=conversation_history)

conversation_history += response1.output          # on ajoute la réponse de l'assistant

conversation_history.append(
    {"type": "message", "role": "user", "content": "Can you give me an example?"}
)

response2 = openai_client.responses.create(model="gpt-4.1", input=conversation_history)
```

Cette approche manuelle est utile pour :

- **choisir** quels messages entrent dans le contexte ;
- **élaguer** la conversation pour respecter les limites de tokens ;
- **stocker et restaurer** l'historique depuis une base de données.

| | `previous_response_id` | Historique manuel |
|---|---|---|
| Qui garde l'historique | Le service | Ton code |
| Code | Très court | Plus long |
| Contrôle du contexte | Limité | Total |

## Retrouver une réponse passée

```python
previous_response = openai_client.responses.retrieve("resp_67cb61fa3a448190bcf2c42d96f0d1a8")
print(previous_response.output_text)
```

## La fenêtre de contexte

Garder l'historique **augmente la consommation de tokens**. Pour un seul appel, la fenêtre de contexte active peut contenir :

- les **instructions système** et règles de sécurité ;
- ton **prompt** courant ;
- l'**historique** de la conversation ;
- les **schémas d'outils** (fonctions, spécifications OpenAPI, outils MCP) ;
- les **sorties d'outils** (résultats de recherche, sortie de l'interpréteur de code, fichiers) ;
- la **mémoire ou les documents récupérés** (RAG, file search).

Tout cela est concaténé, transformé en tokens et envoyé au modèle **à chaque requête**. Le SDK gère l'état pour toi, mais **ne rend pas l'usage des tokens moins cher**.

> **Exemple.** Au 20e tour d'une conversation, tu ne paies pas seulement ta question de 15 tokens : les 19 échanges précédents repartent aussi vers le modèle.

## Streaming

Une réponse longue peut donner l'impression que l'application est figée. Le **streaming** renvoie la sortie **au fur et à mesure**.

```python
stream = openai_client.responses.create(
    model="gpt-4.1",
    input="Write a short story about a robot learning to paint.",
    stream=True
)

for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="")               # un morceau de texte
    elif event.type == "response.completed":
        response_id = event.response.id          # l'id, disponible à la fin
```

| Type d'événement | Signification |
|---|---|
| `response.output_text.delta` | Un nouveau morceau de texte, dans `event.delta` |
| `response.completed` | Le flux est fini ; l'id est dans `event.response.id` |

## Mode asynchrone

Pour les applications à hautes performances, **`AsyncOpenAI`** fait des appels **non bloquants**. On l'importe à la place de `OpenAI` et on met `await` devant chaque appel.

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://<resource-name>.openai.azure.com/openai/v1/",
    api_key=token_provider,
)

async def ask(prompt):
    response = await client.responses.create(model="gpt-4.1", input=prompt)
    return response.output_text

async def main():
    prompts = ["Explain quantum computing briefly.",
               "Summarize the benefits of async I/O.",
               "Give a one-sentence definition of machine learning."]
    results = await asyncio.gather(*(ask(p) for p in prompts))   # 3 requêtes en parallèle

asyncio.run(main())
```

Le vrai gain apparaît quand on lance **plusieurs requêtes en même temps** avec `asyncio.gather()`. Un seul `await` dans `asyncio.run()` prend à peu près le même temps que le client synchrone.

Le streaming asynchrone s'écrit avec `async for event in stream`.

## Streaming ou asynchrone ?

| | Streaming | Asynchrone |
|---|---|---|
| Problème résolu | L'utilisateur attend sans rien voir | Les requêtes s'exécutent l'une après l'autre |
| Solution | Afficher le texte au fil de l'eau | Lancer plusieurs appels en parallèle |
| Mot-clé | `stream=True` | `AsyncOpenAI`, `await`, `asyncio.gather()` |

#### Point examen : la méthode pour générer une réponse avec l'API Responses est client.responses.create(). client.chat.completions.create() appartient à l'API ChatCompletions.

## Exercices rapides

**1.** Complète pour continuer une conversation :

```python
r2 = client.responses.create(model="gpt-4.1", input="Et ensuite ?", ________=r1.id)
```

**2.** Quelle propriété contient le texte généré ? Et le nombre total de tokens ?

**3.** Quel paramètre joue le rôle du prompt système ?

**4.** Tu veux limiter la réponse à 100 tokens. Quel paramètre ?

**5.** Quel événement de streaming contient un morceau de texte ?

**6.** Un utilisateur trouve que l'application « gèle » pendant les longues réponses. Streaming ou asynchrone ?

**7.** Tu dois envoyer 50 prompts indépendants le plus vite possible. Streaming ou asynchrone ?

**8.** Vrai ou faux : avec `previous_response_id`, l'historique ne consomme plus de tokens.

<details>
<summary>Voir le corrigé</summary>

**1.** `previous_response_id`.

**2.** `response.output_text` et `response.usage.total_tokens`.

**3.** `instructions`.

**4.** `max_output_tokens`.

**5.** `response.output_text.delta`, dont le texte est dans `event.delta`.

**6.** Le streaming (`stream=True`).

**7.** L'asynchrone : `AsyncOpenAI` avec `asyncio.gather()`.

**8.** Faux. L'historique est renvoyé au modèle à chaque requête. Le SDK gère l'état mais ne réduit pas le coût en tokens.

</details>
