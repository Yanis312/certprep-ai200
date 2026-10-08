# Use Azure Language with an agent — MCP

## L'essentiel

- Un agent sait comprendre et générer du langage, mais un modèle génératif seul ne fait pas d'analyse de texte **déterministe et structurée**.
- Ajouter **Azure Language** à un agent lui donne une analyse de texte **constante et prévisible**.
- Le lien se fait par **MCP** (Model Context Protocol), un **standard ouvert** pour connecter les agents aux outils et aux données.
- MCP suit une architecture **client-serveur** : l'**agent** est le client, le **service** qui expose les outils est le serveur.
- Le **serveur MCP Azure Language** est un service **managé** qui expose les capacités d'Azure Language.

## MCP : l'adaptateur universel

Sans MCP, il faudrait écrire du code d'intégration sur mesure pour **chaque** service dont l'agent a besoin. Avec MCP, on connecte l'agent à un **serveur MCP** qui expose déjà ces capacités de façon standard.

```
        AGENT (client MCP)
              │
              │   protocole MCP, le même pour tous
              ▼
   ┌──────────────────────┐
   │   Serveur MCP        │   expose des outils, des données, des actions
   │   Azure Language     │
   └──────────────────────┘
```

| Rôle | Qui | Ce qu'il fait |
|---|---|---|
| **Client MCP** | L'agent IA, ou l'application hôte qui le fait tourner | Envoie des requêtes, reçoit des réponses |
| **Serveur MCP** | Le service qui expose outils, données ou actions | Écoute les requêtes, exécute la capacité demandée, renvoie un **résultat structuré** |

Une fois connecté, l'agent peut **découvrir** les outils que le serveur propose et les **invoquer** au besoin, sans travail d'intégration particulier.

Le serveur peut répondre de deux façons :

- **fournir des données** : scores de sentiment, expressions clés, entités ;
- **exécuter une action** : traiter un lot de documents.

Cette séparation garde la logique de l'agent propre et rend facile le fait de **changer ou d'étendre** ses capacités en se branchant sur d'autres serveurs MCP.

## Le serveur MCP Azure Language

C'est un **service managé** qui expose les capacités d'Azure Language par MCP : reconnaissance d'entités nommées, analyse de sentiment, détection de langue, et d'autres.

Avantages :

- l'agent appelle ces outils avec le **même protocole** que pour tout autre serveur MCP ;
- pas besoin d'appeler directement l'**API REST** d'Azure Language ;
- pas de **jetons d'authentification** à gérer dans le code de l'agent.

Une ressource Foundry inclut déjà l'accès aux outils Language : **inutile de créer une ressource Azure Language séparée**.

## Dans le portail Foundry

1. **Déployer un modèle**, puis l'**enregistrer comme agent** depuis le playground.
2. Dans les outils, chercher **Azure Language in Foundry Tools** et l'ajouter.
3. **Configurer la connexion** avec le **nom de ta ressource Foundry**.
4. Utiliser des prompts pour demander à l'agent d'analyser du texte avec l'outil.

## Ce que ça donne

L'agent combine le **raisonnement** du modèle de langage et la **précision** d'Azure Language.

> **Exemple 1 : router des tickets de support.** Un ticket arrive. L'agent appelle l'outil de détection de langue : « es », confiance 1.00. Il transmet alors le ticket à l'équipe hispanophone. Le code de langue est fiable et toujours au même format, ce qui rend l'automatisation sûre.
>
> **Exemple 2 : masquer des PII.** Avant de résumer une conversation, l'agent appelle l'outil de détection de PII, récupère le texte masqué, puis rédige son résumé à partir de cette version.

## Trois façons d'utiliser Azure Language

| Façon | Qui appelle | Vu dans |
|---|---|---|
| Playground du portail | Toi, à la main | L'unité précédente et le lab |
| SDK `azure-ai-textanalytics` | Ton code Python | L'unité « client application » |
| Serveur MCP | Un **agent** | Cette unité |

#### Point examen : question officielle du module — le but principal du serveur MCP Azure Language est d'exposer les capacités d'Azure Language aux agents par le Model Context Protocol. Il ne remplace pas les modèles génératifs de l'agent.

## Exercices rapides

**1.** Que signifie MCP, et à quoi sert ce protocole ?

**2.** Dans l'architecture MCP, qui est le client ? Qui est le serveur ?

**3.** Pourquoi un agent a-t-il besoin d'Azure Language alors qu'il a déjà un modèle génératif ?

**4.** Faut-il créer une ressource Azure Language séparée pour utiliser le serveur MCP Azure Language ?

**5.** Avec quoi configure-t-on la connexion au serveur MCP Azure Language dans le portail ?

**6.** Donne deux tâches pour lesquelles un agent équipé d'Azure Language est bien adapté.

**7.** Quel avantage MCP apporte-t-il quand on veut ajouter une nouvelle capacité à un agent ?

<details>
<summary>Voir le corrigé</summary>

**1.** Model Context Protocol : un standard ouvert qui définit comment les agents IA se connectent à des outils et des sources de données externes.

**2.** Le client est l'agent, ou l'application hôte qui le fait tourner. Le serveur est le service qui expose les outils, données ou actions.

**3.** Parce qu'un modèle génératif seul ne fait pas d'analyse de texte déterministe et structurée. Azure Language apporte des résultats constants et prévisibles.

**4.** Non. Une ressource Foundry inclut déjà l'accès aux outils Language.

**5.** Avec le nom de la ressource Foundry.

**6.** Router des tickets de support selon la langue détectée, et identifier puis masquer les PII.

**7.** Il suffit de connecter l'agent à un autre serveur MCP, sans écrire de code d'intégration sur mesure.

</details>
