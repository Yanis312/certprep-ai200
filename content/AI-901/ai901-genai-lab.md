# Lab — un modèle génératif, puis un agent

## Objectif

Déployer un modèle, le faire évoluer pas à pas (instructions, outil, connaissances), puis l'**enregistrer comme agent** et voir le code qui l'appelle.

- **Durée** : environ 35 minutes.
- Tout se fait dans le **portail Foundry**.

Ce lab est le plus utile du parcours pour l'examen : il rejoue toute la progression « modèle → agent ».

## Étape 1 — Projet et modèle

1. `https://ai.azure.com`, active **New Foundry**, crée un projet (ressource Foundry, abonnement, groupe de ressources, région recommandée).
2. **Discover → Models**, cherche **gpt-5-mini**, **Deploy** avec les paramètres par défaut.

Faute de quota, prends un autre modèle GPT de chat (gpt-5-nano, gpt-5.4-mini) ou une autre région.

Au cœur de chaque agent, il y a un **LLM**.

## Étape 2 — Discuter avec le modèle

1. `Who was Ada Lovelace?`
2. `Tell me more about her work with Charles Babbage.`

**Ce que tu dois observer** : « her » est compris comme Ada Lovelace. Les applications de chat génératif incluent souvent l'**historique de la conversation dans le prompt**, ce qui conserve le contexte.

3. Clique sur **New chat** pour effacer l'historique.
4. `List three facts about Ada Lovelace.`

**Ce que tu dois observer** : la réponse suit la consigne explicite (trois faits).

Leçon du lab : les réponses d'un LLM sont **générées dynamiquement**, pas lues dans une source statique. C'est ce qui le rend souple, mais la réponse **n'est pas forcément ancrée dans des faits qui font autorité**.

## Étape 3 — Donner des instructions

1. **New chat**.
2. Dans **Instructions**, mets ce prompt système :

```
You are an expert in the history of computing and AI. You only answer questions about significant people and events in the development of computing, and about notable vintage computers. Do not engage in conversations on any topic that is unrelated to computing history.
```

3. `Tell me about ELIZA.` puis `How does it compare with modern LLMs?`
4. Pose une question hors sujet : `What's the capital of Spain?`

**Ce que tu dois observer** : le modèle refuse ou recadre la question hors sujet. Le prompt système lui donne un **rôle**, un **format** et des **limites**.

## Étape 4 — Ajouter l'outil web_search

Jusqu'ici, le modèle répond à partir de ses données d'entraînement. Un outil lui donne accès à des sources externes.

1. Sous les instructions, ouvre la section **Tools**.
2. Liste **Add** → active **Web search**.
3. **New chat**.
4. `Find a vintage computer store near Seattle` (ou ta ville).

**Ce que tu dois observer** : le modèle a cherché sur le web.

## Étape 5 — Ajouter des connaissances

Un agent travaille souvent dans un contexte métier, avec de l'information spécialisée ou propriétaire.

1. Télécharge `https://microsoftlearning.github.io/mslearn-ai-fundamentals/data/vintage_computer_identifiers.docx`.
2. Dans la section **Tools**, **charge ce fichier** en créant un **nouvel index** avec le nom par défaut. Quand l'index est créé, **attache-le**.
3. **New chat**.
4. `I have a printed circuit board with the "ASSY 250425" on it. What can you tell me about it?`
5. Essaie aussi : `What kind of computer does a PCB with "820-001A" come from?`, `What about "i386"?`

**Ce que tu dois observer** : la réponse s'appuie sur le fichier. S'il ne contient rien de pertinent, le modèle se rabat sur ses connaissances d'entraînement ou sur `web_search`.

C'est un outil **file search** : le fichier est indexé, puis interrogé pour ancrer les réponses.

## Étape 6 — Enregistrer comme agent

Pour une vraie expérience agentique, il faut **encapsuler** le modèle, ses instructions et sa configuration d'outils dans un **agent**.

L'intérêt : les applications clientes se connectent à son endpoint **sans avoir à fournir de prompt système ni à implémenter leur propre logique RAG**.

1. En haut à droite : **Save as agent**.
2. Nomme-le **computing-historian**.
3. L'agent s'ouvre dans un playground propre aux agents.

### Lire la définition YAML

Onglet **YAML**, dans le volet de droite :

```yaml
id: computing-historian:1
name: computing-historian
version: "1"
definition:
  kind: prompt
  model: gpt-5-mini
  instructions: You are an expert in the history of computing and AI. ...
  tools:
    - type: web_search
    - type: file_search
      vector_store_ids:
        - vs_qpRG020jZSewWHPI7B06q2V4
status: active
```

Tu y retrouves les **trois éléments d'un agent** :

| Dans le YAML | Élément |
|---|---|
| `model: gpt-5-mini` | Le **modèle** |
| `instructions: ...` | Les **instructions** |
| `tools:` avec `web_search` et `file_search` | Les **outils** |

L'agent a aussi un **nom** et une **version** : c'est ce qui le rend réutilisable et identifiable.

4. Reviens à l'onglet **Chat** et demande `Who are you?`. L'agent se présente comme un historien de l'informatique.

## Étape 7 — Prévisualiser l'agent

1. En haut du chat, liste **Publish** → **Preview web app**.
2. Une interface de chat s'ouvre dans un nouvel onglet.
3. `What can you tell me about the Altair 8800?`

## Étape 8 — Voir le code client

En haut du chat : **Continue in code**.

```python
# pip install azure-ai-projects>=2.1.0

from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

endpoint = "https://ai-resrce.services.ai.azure.com/api/projects/ai-project"

project_client = AIProjectClient(
    endpoint=endpoint,
    credential=DefaultAzureCredential(),
)

my_agent = "computing-historian"
my_version = "1"

openai_client = project_client.get_openai_client()

response = openai_client.responses.create(
    input=[{"role": "user", "content": "Tell me what you can help with."}],
    extra_body={"agent_reference": {"name": my_agent, "version": my_version, "type": "agent_reference"}},
)

print(f"Response output: {response.output_text}")
```

Trois points à retenir :

- la bibliothèque **Azure.AI.Projects** crée un **`AIProjectClient`** connecté au projet ;
- se connecter à un projet, qui peut contenir des ressources sensibles, **n'accepte pas l'authentification par clé** : il faut une **identité Entra ID** ;
- `get_openai_client()` donne un client OpenAI qui utilise la même **API Responses** que pour un modèle. Comme un projet peut contenir plusieurs agents et modèles, l'agent visé est précisé dans **`extra_body`**.

## La progression du lab

| Étape | Ce qu'on ajoute | Ce que ça apporte |
|---|---|---|
| Modèle seul | Rien | Des réponses générales, tirées de l'entraînement |
| + Instructions | Un prompt système | Un rôle, des limites |
| + `web_search` | Un outil | De l'information à jour |
| + Fichier indexé | Des connaissances | De l'information spécialisée, ancrée |
| Save as agent | L'encapsulation | Un composant réutilisable, avec son endpoint |

## Nettoyage

`https://portal.azure.com` → groupe de ressources du projet → **Delete resource group** → saisis le nom et confirme.

## Exercices rapides

**1.** Pourquoi le modèle comprend-il « her » à la deuxième question ?

**2.** Que montre la question « What's the capital of Spain? » après l'ajout des instructions ?

**3.** Que se passe-t-il quand le fichier de connaissances ne contient pas la réponse ?

**4.** Quel avantage y a-t-il à enregistrer le modèle configuré comme agent ?

**5.** Quels trois éléments d'un agent retrouve-t-on dans sa définition YAML ?

**6.** Pourquoi le code client de l'agent utilise-t-il `DefaultAzureCredential` et non une clé d'API ?

**7.** Dans le code, quel paramètre indique quel agent appeler ?

**8.** Où prévisualise-t-on l'agent dans une petite application web ?

<details>
<summary>Voir le corrigé</summary>

**1.** Parce que l'historique de la conversation est inclus dans le prompt, ce qui conserve le contexte.

**2.** Que le prompt système limite l'agent à son sujet : il refuse ou recadre une question hors périmètre.

**3.** Le modèle utilise ses connaissances d'entraînement ou l'outil `web_search`.

**4.** Les applications clientes se connectent à son endpoint sans fournir de prompt système ni implémenter leur propre logique RAG.

**5.** Le modèle, les instructions et les outils.

**6.** Parce que la connexion à un projet, qui peut contenir des ressources sensibles, ne prend pas en charge l'authentification par clé : il faut une identité Entra ID.

**7.** `extra_body`, avec la référence de l'agent (nom, version, type `agent_reference`).

**8.** Dans la liste Publish, avec Preview web app.

</details>
