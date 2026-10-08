# Microsoft Foundry for AI

## L'essentiel

- **Microsoft Foundry** est une **plateforme en tant que service (PaaS)** unifiée, de niveau entreprise, pour créer, déployer et gérer des applications et agents d'IA.
- Quatre piliers : **Models**, **Agents**, **Tools**, **Knowledge**.
- Une **ressource Foundry** fournit les capacités de la plateforme. Un **projet Foundry** est un espace de travail **à l'intérieur** de cette ressource.
- Le **portail Foundry** est l'interface web pour développer, tester et exploiter.
- Une application d'IA suit le schéma **client-serveur** : dans Foundry, le **serveur** est ton **déploiement de modèle**.

## Les 4 piliers

| Pilier | Ce que c'est |
|---|---|
| **Models** | Des milliers de modèles dans un catalogue unifié : premiers éditeurs, tiers et open source |
| **Agents** | Des agents intelligents, orientés tâche, construits directement dans tes projets |
| **Tools** | Une suite de services Azure prêts à l'emploi : parole, vision, langage, document intelligence... |
| **Knowledge** | **Foundry IQ**, la couche de connaissances qui ancre les agents dans les données de l'organisation |

### Models

Le catalogue donne accès aux modèles OpenAI hébergés dans Azure, comme la famille **GPT-5**, et à des modèles d'**Anthropic** (Claude), **Mistral**, **Cohere**, **Meta** (Llama), **DeepSeek**, **xAI** (Grok), **Black Forest Labs**, ainsi qu'à des modèles **Hugging Face**.

On peut les parcourir, les évaluer avec les **classements** (leaderboards) et les **playgrounds** intégrés, puis gérer les déploiements. Types de déploiement cités : **standard, provisioned, batch**.

### Agents

Foundry suit une approche **« agent d'abord »**. Les agents raisonnent sur les entrées, **appellent des outils**, interagissent avec les données et automatisent des workflows.

Foundry gère la **coordination** sous-jacente : fil des messages, exécution des outils, contrôles de sécurité, observabilité. Le développeur se concentre sur les objectifs et les capacités de l'agent.

On construit en **low-code** ou en **code-first**, y compris des systèmes **multi-agents**.

### Tools

Les **Foundry Tools** apportent des capacités d'IA faciles à intégrer dans une application web ou mobile. Plus d'une douzaine de services, utilisables séparément ou ensemble :

| Outil | Exemple d'usage |
|---|---|
| Azure Vision | Analyser des images |
| Azure Language | Résumer un texte, classer, extraire des expressions clés |
| Azure Speech | Passer de la parole au texte et du texte à la parole |

### Knowledge : Foundry IQ

Foundry IQ fournit une couche de connaissances **multi-sources** et **consciente des permissions**.

- On crée une **base de connaissances** configurable, faite de sources internes et externes : **Azure Blob Storage, SharePoint, OneLake**, données web publiques.
- Foundry IQ gère automatiquement l'**indexation**, le **découpage** des documents (chunking), les **embeddings** vectoriels et l'extraction de métadonnées.
- Il utilise la **récupération agentique** (agentic retrieval) : la question est découpée en **sous-requêtes**, plusieurs sources sont interrogées **en parallèle**, et la réponse revient avec des **citations**.
- Il applique les **permissions de l'utilisateur** et les étiquettes de sensibilité **Microsoft Purview**.

Conséquence : l'agent ne renvoie que des informations que l'utilisateur est **autorisé à voir**.

## Ressource Foundry et projet Foundry

| | Ressource Foundry | Projet Foundry |
|---|---|---|
| Nature | La **ressource Azure** qui fournit les capacités de la plateforme | Un **espace de travail** à l'intérieur de la ressource |
| Donne accès à / contient | Les modèles, le service d'agents, la gouvernance des déploiements, la supervision, les frontières de sécurité, les quotas | Agents, évaluations, fichiers et jeux de données, index vectoriels, flux, connexions, réglages du projet |
| Combien | Une par équipe ou département, par exemple | **Plusieurs** par ressource, un par cas d'usage |

On crée une ressource Foundry dans le **portail Azure**, le **portail Foundry**, ou par **script**.

```
Ressource Foundry (équipe Marketing)
├── Projet « Chatbot site web »
├── Projet « Résumés de campagnes »
└── Projet « Analyse d'avis clients »
```

## Le workflow dans le portail Foundry

1. Se connecter au portail avec son abonnement Azure et **créer un projet**.
2. Choisir un modèle dans le **catalogue** et le **déployer**.
3. L'**expérimenter** dans le **playground** : écrire des prompts, tester les réponses, régler les paramètres.
4. **Utiliser** le modèle configuré dans ta propre **application cliente**.

## Client et serveur

Une **application cliente** est un programme avec lequel l'utilisateur interagit sur son appareil, qui envoie des requêtes à un serveur et affiche les résultats.

La **logique applicative** est le code qui envoie les requêtes au modèle, reçoit la réponse, puis traite et transforme les résultats.

| Le client | Le serveur (le déploiement de modèle) |
|---|---|
| Présente une interface (UI ou ligne de commande) | Reçoit le prompt |
| Recueille l'entrée : texte, voix, image | Exécute l'**inférence** sur le modèle |
| Met l'entrée en forme : prompt ou requête d'API | Applique instructions système, sécurité, contexte |
| Envoie la requête au serveur (endpoint du modèle) | Renvoie la sortie : texte, image, audio ou JSON structuré |
| Affiche la sortie reçue | |

> **Exemple.** Dans une application de chat sur ton téléphone : l'écran où tu tapes est le **client**. Le modèle déployé dans Foundry, qui calcule la réponse, est le **serveur**.

#### Point examen : la différence ressource Foundry / projet Foundry, et le fait que le serveur d'une application d'IA Foundry est le déploiement de modèle. Retiens aussi que Foundry IQ respecte les permissions de l'utilisateur.

## Exercices rapides

**1.** Cite les 4 piliers de Foundry.

**2.** Quelle différence entre une ressource Foundry et un projet Foundry ?

**3.** Dans une application d'IA, qui exécute l'inférence : le client ou le serveur ?

**4.** Dans Foundry, à quoi correspond le serveur ?

**5.** Donne les 4 étapes du workflow de développement dans le portail Foundry.

**6.** Que gère automatiquement Foundry IQ quand on lui connecte des sources de données ?

**7.** Qu'est-ce que la récupération agentique ?

**8.** Un utilisateur n'a pas le droit de lire un document RH. L'agent branché sur Foundry IQ peut-il lui en citer le contenu ?

<details>
<summary>Voir le corrigé</summary>

**1.** Models, Agents, Tools, Knowledge.

**2.** La ressource Foundry est la ressource Azure qui fournit les capacités de la plateforme. Le projet est un espace de travail à l'intérieur, où l'on construit applications, agents et évaluations.

**3.** Le serveur.

**4.** Au déploiement de modèle.

**5.** Créer un projet, choisir et déployer un modèle du catalogue, l'expérimenter dans le playground, l'utiliser dans une application cliente.

**6.** L'indexation, le découpage des documents, les embeddings vectoriels et l'extraction de métadonnées.

**7.** La question est découpée en sous-requêtes, plusieurs sources sont interrogées en parallèle, et la réponse revient avec des citations.

**8.** Non. Foundry IQ applique les permissions de l'utilisateur et les étiquettes de sensibilité Purview.

</details>
