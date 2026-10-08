# Microsoft Foundry — ressource, projets et portail

## L'essentiel

- **Microsoft Foundry** est la plateforme de développement d'IA sur Azure.
- On peut créer des ressources d'IA à la main sans Foundry, mais Foundry est **recommandé pour tout sauf les solutions les plus simples**.
- Foundry offre deux façons de travailler : le **portail Foundry** (interface web) et le **SDK Foundry** (par le code).
- Le travail s'organise en **projets**, chacun rattaché à une **ressource Foundry**.

## Ressource Foundry et projets

```
Ressource Foundry (dans Azure)
│   fournit : calcul, stockage, outils d'IA, autres services
│
├── Projet par défaut      ← un des projets est désigné « par défaut »
├── Projet B
└── Projet C
```

- Un **projet** appartient à **une seule** ressource Foundry.
- Une ressource Foundry peut avoir **un ou plusieurs** projets enfants.
- La ressource porte l'infrastructure ; le projet porte les éléments de ta solution.

> **Analogie.** La ressource Foundry est l'immeuble (électricité, eau, ascenseur). Les projets sont les appartements : chacun a son contenu, mais tous utilisent les services de l'immeuble.

## Les 4 types d'éléments d'un projet

| Élément | Ce que c'est | À retenir |
|---|---|---|
| **Models** | Déploiements de LLM issus du catalogue **Foundry Models** (Microsoft, OpenAI, autres fournisseurs) | Accessibles par 2 endpoints (voir plus bas) |
| **Agents** | Configuration nommée qui réunit un LLM, des instructions et des outils | Créés et utilisés via le **Foundry Agent Service**, par l'endpoint du projet |
| **Tools** | Outils utilisés par les agents | Intégrés (recherche web, interpréteur de code) ou reliés par **MCP** ; inclut aussi les Foundry Tools |
| **Knowledge** | Sources de connaissances qui donnent du contexte aux prompts | **Foundry IQ** crée une connexion de connaissances unique, basée sur MCP |

**MCP** signifie Model Context Protocol : un protocole standard pour brancher des outils personnalisés ou tiers sur un agent.

## Deux endpoints pour parler aux modèles

| Endpoint | API et SDK utilisés | Quand |
|---|---|---|
| **Endpoint du projet** | API et SDK spécifiques à Foundry | Modèles, **agents**, Foundry IQ |
| **Endpoint Azure OpenAI** | API et SDK OpenAI | Modèles compatibles avec la syntaxe OpenAI |

Les **agents** passent obligatoirement par l'**endpoint du projet**.

## Exemple : se connecter à un projet en Python

Aperçu seulement, le détail arrive au module « Develop a generative AI chat app ».

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

# L'endpoint du projet se trouve dans le portail Foundry
project = AIProjectClient(
    endpoint="https://<ressource>.services.ai.azure.com/api/projects/<projet>",
    credential=DefaultAzureCredential(),   # authentification sans clé
)

# Récupérer un client compatible OpenAI pour discuter avec un modèle déployé
client = project.get_openai_client()
reponse = client.responses.create(model="gpt-4o", input="Bonjour !")
print(reponse.output_text)
```

Ce qu'il faut voir : on donne l'**endpoint du projet**, on s'authentifie, puis on appelle un modèle par le **nom de son déploiement**.

## Le portail Foundry

La plupart des projets commencent dans le portail. On y fait six choses :

- trouver, comparer, déployer et tester des **modèles** ;
- créer et tester des **agents** ;
- créer des connexions **MCP** vers des outils et des sources Foundry IQ ;
- explorer et tester les **Foundry Tools** ;
- gérer la **configuration** des ressources et les **accès** des utilisateurs ;
- trouver les **endpoints et les clés** nécessaires aux applications clientes.

## Automatiser avec le SDK

Le **SDK Foundry** permet de créer et gérer les éléments d'un projet par script, ou dans des actions **CI/CD** de pipelines DevOps.

## Architecture classique (hub)

Les anciens projets Foundry, dits **classic**, peuvent reposer sur une architecture à base de **hub**. Ce cours porte sur la nouvelle architecture **ressource Foundry + projets**. Le portail passe lui aussi à une nouvelle interface, et certaines tâches n'y sont pas encore disponibles.

#### Point examen : pour travailler avec les éléments d'un projet Foundry, le bon portail est le portail Microsoft Foundry, pas le portail Azure. Le portail Azure sert à gérer les ressources Azure elles-mêmes.

## Exercices rapides

**1.** Vrai ou faux : un projet Foundry peut appartenir à deux ressources Foundry.

**2.** Par quel endpoint utilise-t-on un agent ?

**3.** Tu as déjà du code écrit avec le SDK OpenAI. Quel endpoint te permet de le réutiliser avec un modèle déployé dans Foundry ?

**4.** Quel composant crée une connexion de connaissances unique et centralisée pour les agents ?

**5.** Ton équipe veut créer les déploiements de modèles automatiquement à chaque mise en production. Portail ou SDK ?

<details>
<summary>Voir le corrigé</summary>

**1.** Faux. Un projet appartient à une seule ressource Foundry. C'est la ressource qui peut avoir plusieurs projets.

**2.** L'endpoint du projet, via le Foundry Agent Service.

**3.** L'endpoint Azure OpenAI, qui accepte les API et SDK OpenAI.

**4.** Foundry IQ, basé sur MCP.

**5.** Le SDK Foundry, utilisable dans des scripts et des pipelines CI/CD. Le portail est une interface manuelle.

</details>
