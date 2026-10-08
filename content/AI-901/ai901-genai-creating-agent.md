# Creating an agent — créer et utiliser un agent

## L'essentiel

- Un **agent** Foundry est un composant d'IA **empaqueté et réutilisable** qui réunit un **modèle**, des **instructions** et des **outils**.
- Ce qui le distingue d'un modèle seul : les **outils** (des **actions**) et les **connaissances** (du **contexte**).
- Dans le portail : choisir le modèle, écrire les instructions, ajouter outils et connaissances, puis **enregistrer comme agent**.
- Depuis une application : le **SDK Foundry Projects** et la **Project API**.
- Dans le code, c'est `extra_body` avec une **référence d'agent** qui fait appeler l'agent au lieu d'un simple déploiement.

## Les 3 éléments d'un agent

| Élément | Rôle | Exemple |
|---|---|---|
| **Un modèle** | Raisonner | GPT-4.1 |
| **Des instructions** | Le prompt système : rôle, comportement, style, contraintes, règles de sortie | « You're a helpful scheduling assistant who returns answers in concise bullet points. » |
| **Des outils** | Les actions que l'agent peut entreprendre | Recherche web, base de données, serveur MCP |

L'IA agentique dépasse les prompts ponctuels : elle définit un comportement **constant**, proche d'un workflow, **réutilisable** dans plusieurs applications.

Un agent peut :

- **appeler des outils** externes (API, fonctions, récupération) automatiquement ;
- **découper un objectif** en étapes structurées ;
- garder une **mémoire de travail** pendant la conversation ;
- traiter l'entrée, **décider** d'actions et produire des sorties structurées.

## Outils et connaissances

```
Outils        = des ACTIONS
Connaissances = du CONTEXTE
```

### Les outils

Ils permettent au modèle d'**agir** en appelant des systèmes externes : chercher sur le web, interroger une base, utiliser un serveur MCP.

| Exemple d'outil | Usage |
|---|---|
| **Code Interpreter** | Analyse de données, gestion de fichiers |
| Sources de connaissances | Récupérer du contenu |
| Fonctions ou API personnalisées | Agir dans tes systèmes |

Une fois activés, le modèle **inspecte** les outils disponibles et les **appelle quand c'est pertinent**. Les outils se découvrent et se gèrent de façon centralisée dans le **Foundry Tool Catalog**.

### Les connaissances

Elles donnent au modèle l'accès à du contenu externe (documents, jeux de données, sites internes) par **RAG** (génération augmentée par récupération).

Sources possibles : PDF internes, contenu **SharePoint**, fichiers **Azure Storage**, bases de connaissances multi-sources.

Foundry utilise des pipelines de récupération pour :

- **ingérer et indexer** ton contenu ;
- **chercher et ancrer** les réponses ;
- rendre les réponses plus **exactes, traçables** et propres au domaine.

Quand des connaissances sont utilisées, la réponse inclut une **citation** de la source.

> **Exemple.** Un agent RH. Outil : envoyer une demande de congé dans le système de l'entreprise (action). Connaissance : le PDF du règlement des congés (contexte). À « Combien de jours me reste-t-il et puis-je poser vendredi ? », il lit le règlement, répond en citant sa source, puis crée la demande.

## Créer un agent dans le portail

1. **Choisir le modèle**.
2. **Écrire les instructions** système.
3. **Ajouter des outils** et des **connaissances**.
4. **Enregistrer** le modèle, les instructions et les outils **comme agent**.
5. Continuer à tester et affiner dans le playground.

Au départ, cela ressemble au test d'un modèle dans le playground. La différence vient de l'ajout des outils et des connaissances.

## Publier un agent

D'après le résumé du module, un agent configuré et testé peut être **publié comme ressource Azure avec un endpoint stable**.

Publier le transforme en **ressource Azure managée**, avec un endpoint stable à **partager et intégrer** sans exposer ton projet Foundry ni ton code source.

Publier **ne rend pas** l'agent gratuit : les tokens, les outils et les services de données connectés restent facturés. Et cela **ne remplace pas** la Project API.

## Utiliser un agent depuis une application

On utilise le **SDK Foundry Projects** pour se connecter au projet, et la **Project API** pour appeler l'agent.

La Project API permet de :

- intégrer des agents dans des applications web, des bots ou des workflows backend ;
- orchestrer des tâches en plusieurs étapes ;
- passer des entrées structurées ou des appels d'outils ;
- faire tourner des agents à grande échelle.

L'identifiant de l'agent (**agent-id**) se trouve dans le playground de l'agent : vue code, variables `.env`.

### Le code

```python
# pip install --pre azure-ai-projects>=2.0.0b1
# pip install azure-identity

from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

myEndpoint = "https://<resource>.services.ai.azure.com/api/projects/<resource-name>"

project_client = AIProjectClient(
    endpoint=myEndpoint,
    credential=DefaultAzureCredential(),
)

myAgent = "learning-agent"
# Récupérer un agent existant
agent = project_client.agents.get(agent_name=myAgent)
print(f"Retrieved agent: {agent.name}")

openai_client = project_client.get_openai_client()

# Référencer l'agent pour obtenir une réponse
response = openai_client.responses.create(
    input=[{"role": "user", "content": "Tell me what you can help with."}],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
)

print(f"Response output: {response.output_text}")
```

Les quatre lignes à savoir distinguer :

| Ligne | Ce qu'elle fait |
|---|---|
| `AIProjectClient(endpoint=..., credential=DefaultAzureCredential())` | **Se connecte au projet**, avec une identité Entra ID |
| `project_client.agents.get(agent_name=myAgent)` | **Récupère** l'agent existant |
| `project_client.get_openai_client()` | Obtient le **client compatible OpenAI** |
| `responses.create(..., extra_body={"agent": {...}})` | **Appelle l'agent** |

### Appeler un modèle ou appeler un agent

```python
# Un MODÈLE : on donne le nom du déploiement
client.responses.create(model="mon-deploiement", input=[...])

# Un AGENT : pas de paramètre model, mais une référence d'agent
client.responses.create(input=[...],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}})
```

Remarque ce qui manque dans l'appel à l'agent : ni `model`, ni prompt système. Ils sont **déjà dans l'agent**.

Dans le lab, le code affiché par le portail écrit la référence un peu différemment : `extra_body={"agent_reference": {"name": ..., "version": ..., "type": "agent_reference"}}`. L'idée est la même : c'est `extra_body` qui désigne l'agent.

#### Point examen : deux questions officielles du module — publier un agent le convertit en ressource Azure managée avec un endpoint stable, à partager et intégrer sans exposer le projet Foundry ni le code source ; dans l'exemple Python, la ligne qui appelle l'agent est celle de responses.create avec extra_body et agent_reference.

## Exercices rapides

**1.** Quels sont les trois éléments d'un agent Foundry ?

**2.** Complète : les outils sont des ____, les connaissances sont du ____.

**3.** Par quelle technique les connaissances sont-elles fournies au modèle ?

**4.** Que contient la réponse quand l'agent s'est appuyé sur une source de connaissances ?

**5.** Quelle ligne du code récupère l'agent ? Quelle ligne l'appelle ?

**6.** Pourquoi l'appel à l'agent n'a-t-il pas de paramètre `model` ?

**7.** Que change la publication d'un agent ?

**8.** Quelle authentification le code d'exemple utilise-t-il pour se connecter au projet ?

**9.** Où trouve-t-on l'identifiant de l'agent ?

<details>
<summary>Voir le corrigé</summary>

**1.** Un modèle, des instructions et des outils.

**2.** Les outils sont des actions, les connaissances sont du contexte.

**3.** Par RAG, la génération augmentée par récupération.

**4.** Une citation de la source de connaissances utilisée.

**5.** `project_client.agents.get(agent_name=myAgent)` le récupère ; `openai_client.responses.create(..., extra_body={...})` l'appelle.

**6.** Parce que le modèle, comme les instructions et les outils, est déjà défini dans l'agent.

**7.** Elle transforme l'agent en ressource Azure managée avec un endpoint stable, à partager et intégrer sans exposer le projet ni le code source.

**8.** `DefaultAzureCredential`, c'est-à-dire une identité Microsoft Entra ID.

**9.** Dans le playground de l'agent, en vue code, parmi les variables `.env`.

</details>
