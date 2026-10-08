# Bilan du module — application de chat générative

## Le module en 10 lignes

1. Quatre choix avant de coder : **endpoint**, **SDK**, **authentification**, **API de chat**.
2. Le **Model playground** teste sans code ; le bouton **Code** génère un exemple pré-rempli.
3. Deux endpoints par projet : **projet** (`services.ai.azure.com/api/projects/...`) et **Azure OpenAI** (`openai.azure.com/openai/v1`).
4. **SDK Foundry** : paquet `azure-ai-projects`, classe `AIProjectClient`, client de chat par `get_openai_client()`.
5. **SDK OpenAI** : paquet `openai`, classe `OpenAI` avec `base_url` et `api_key`.
6. **Entra ID** recommandé : `DefaultAzureCredential` + `get_bearer_token_provider`. Clés dans **Key Vault**.
7. SDK Foundry pour **agents, évaluations, traçage, connexions** ; SDK OpenAI pour l'**inférence portable**.
8. **Responses** : `responses.create(model, instructions, input)`, lecture par `output_text`, suivi par `previous_response_id`.
9. **ChatCompletions** : `chat.completions.create(model, messages)`, lecture par `choices[0].message.content`, historique **manuel**.
10. **Streaming** (`stream=True`) pour l'affichage progressif ; **AsyncOpenAI** + `asyncio.gather()` pour le parallélisme.

## Aide-mémoire de code

```python
# --- Connexion avec le SDK Foundry ---
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project_client = AIProjectClient(credential=DefaultAzureCredential(), endpoint=project_endpoint)
openai_client = project_client.get_openai_client(api_version="2024-10-21")

# --- Connexion avec le SDK OpenAI + Entra ID ---
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(DefaultAzureCredential(), "https://ai.azure.com/.default")
openai_client = OpenAI(base_url="https://<res>.openai.azure.com/openai/v1/", api_key=token_provider)

# --- API Responses ---
r = openai_client.responses.create(model="deploiement", instructions="...", input="...",
                                   previous_response_id=last_id)
print(r.output_text); last_id = r.id

# --- API ChatCompletions ---
c = openai_client.chat.completions.create(model="deploiement", messages=[
        {"role": "system", "content": "..."}, {"role": "user", "content": "..."}])
print(c.choices[0].message.content)
```

## Arbre de décision

```
As-tu besoin d'agents, d'évaluations, de traçage ou de connexions ?
├── Oui → SDK Foundry (azure-ai-projects) + endpoint du projet
└── Non → SDK OpenAI (openai) + endpoint Azure OpenAI

Nouveau projet ?
├── Oui → API Responses
└── Non, code existant ou multiplateforme → API ChatCompletions
```

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel endpoint offre la prise en charge la plus large des API OpenAI avec les Foundry Models ? | L'endpoint **Azure OpenAI** |
| Quel paquet installer pour utiliser le SDK Microsoft Foundry en Python ? | **azure-ai-projects** |
| Quelle méthode pour générer des réponses avec l'API Responses ? | **client.responses.create()** |

Pour la première question, le texte collé ne contenait pas le corrigé de Microsoft. La réponse vient du cours : l'endpoint Azure OpenAI v1 est présenté comme celui de la compatibilité large avec les API OpenAI. Vérifie-la en faisant le knowledge check sur Learn.

## Les pièges classiques

| Piège | La bonne version |
|---|---|
| Mettre le nom du modèle dans `model` | C'est le **nom du déploiement** |
| Chercher un paquet `azure-foundry` | Le paquet est **`azure-ai-projects`** |
| Oublier `openai` avec le SDK Foundry | Le client de chat **dérive du SDK OpenAI** |
| Croire que ChatCompletions garde l'historique | Il est **sans état** |
| Écrire `max_tokens` avec Responses | C'est **`max_output_tokens`** |
| Utiliser l'endpoint du projet avec le client `OpenAI` du lab | Le lab utilise l'endpoint **Azure OpenAI** |

#### Point examen : sur ce module, l'examen peut te donner un extrait de code avec un trou. Entraîne-toi à réécrire de mémoire l'aide-mémoire ci-dessus.

## Exercices rapides

**1.** Écris de mémoire l'appel Responses minimal qui pose la question « Bonjour » au déploiement `d1`.

**2.** Écris le même appel avec ChatCompletions.

**3.** Quels paquets pip pour le SDK Foundry avec une application de chat ?

**4.** Ton application doit créer des agents et lancer des évaluations. Quel SDK ?

**5.** Cite deux éléments qui occupent la fenêtre de contexte en plus de ton prompt.

**6.** Quelle différence entre le client `OpenAI` et le client `AzureOpenAI` ?

<details>
<summary>Voir le corrigé</summary>

**1.** `client.responses.create(model="d1", input="Bonjour")`

**2.** `client.chat.completions.create(model="d1", messages=[{"role": "user", "content": "Bonjour"}])`

**3.** `azure-ai-projects`, `azure-identity` et `openai`.

**4.** Le SDK Foundry.

**5.** Deux parmi : instructions système, historique de conversation, schémas d'outils, sorties d'outils, documents ou mémoire récupérés.

**6.** `OpenAI` est le cas général avec `base_url` vers l'endpoint v1. `AzureOpenAI` sert quand il faut une version précise de l'API : on lui donne `azure_endpoint` et `api_version`.

</details>
