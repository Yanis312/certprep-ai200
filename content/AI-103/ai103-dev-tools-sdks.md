# Developer tools and SDKs — outils de développement

## L'essentiel

- Le portail Foundry permet beaucoup de choses, mais un développeur doit aussi **écrire, tester et déployer du code**.
- Deux environnements conviennent : **Visual Studio** (IDE complet) et **Visual Studio Code** (éditeur léger).
- L'extension **Foundry Toolkit pour VS Code** apporte Foundry dans l'éditeur.
- Trois familles d'API et SDK à connaître : **SDK Foundry**, **API OpenAI**, **SDK des Foundry Tools**.

## Visual Studio ou VS Code ?

| | Visual Studio | Visual Studio Code |
|---|---|---|
| Type | Environnement de développement intégré (IDE) | Éditeur de code |
| Profil type | Développeur Windows centré sur .NET | Développeur web utilisant beaucoup de langages et bibliothèques open source |

Les deux conviennent pour développer de l'IA sur Azure. Le critère : les langages, SDK et API dont tu as besoin, et ton confort.

## L'extension Foundry Toolkit pour VS Code

Elle simplifie cinq tâches :

- **parcourir et gérer** les ressources du projet : modèles déployés, agents, connexions, vector stores ;
- **déployer des modèles** depuis le catalogue ;
- **tester** modèles et agents dans des playgrounds intégrés ;
- **configurer des agents** déclaratifs et hébergés avec un concepteur visuel et des fichiers **YAML** ;
- **générer le code d'intégration** pour relier les agents à tes applications.

> **Exemple.** Sans quitter VS Code, tu déploies `gpt-4o-mini`, tu l'essaies dans le playground, puis tu demandes à l'extension de générer le code Python qui appelle ce déploiement.

## GitHub et GitHub Copilot

- **GitHub** : la plateforme la plus utilisée pour le contrôle de source et le DevOps. Indispensable dès qu'on travaille en équipe.
- **GitHub Copilot** : un assistant IA qui améliore la productivité du développeur.

Visual Studio et VS Code intègrent tous les deux GitHub nativement et donnent accès à GitHub Copilot.

Attention à ne pas confondre : **GitHub Copilot** aide à écrire du code en général. **Foundry Toolkit** sert à travailler avec les projets Foundry.

## Langages

C#, Python, Node, TypeScript, Java et d'autres. L'examen AI-103 attend surtout du **Python**.

## Les trois familles d'API et SDK

| SDK ou API | À quoi il sert | Exemple d'usage |
|---|---|---|
| **SDK Microsoft Foundry** | Se connecter à un projet Foundry et accéder aux éléments propres à Foundry | Agents, bases de connaissances Foundry IQ |
| **API OpenAI** | Utiliser les SDK OpenAI pour créer des applications de chat sur des modèles Foundry compatibles avec la syntaxe OpenAI | Un chatbot avec le SDK `openai` |
| **SDK des Foundry Tools** | Bibliothèques propres à chaque service d'IA, pour plusieurs langages. Les Foundry Tools sont aussi accessibles par **API REST** | Analyse de sentiment, traduction |

## Exemple : quel paquet Python pour quel besoin ?

```python
# 1. SDK Foundry : projets, agents, Foundry IQ
from azure.ai.projects import AIProjectClient

# 2. API OpenAI : chat avec un modèle compatible OpenAI
from openai import OpenAI

# 3. SDK d'un Foundry Tool : ici Azure Language
from azure.ai.textanalytics import TextAnalyticsClient
```

Règle simple : **agent ou Foundry IQ → SDK Foundry**. **Chat simple sur un modèle → API OpenAI**. **Tâche préconstruite (traduction, parole, sentiment) → SDK de l'outil**.

#### Point examen : l'extension VS Code pour travailler avec les projets Foundry s'appelle Foundry Toolkit for Visual Studio Code. Ni l'extension Python ni GitHub Copilot ne jouent ce rôle.

## Exercices rapides

**1.** Tu veux créer un agent par le code et lui connecter une base Foundry IQ. Quel SDK ?

**2.** Tu veux appeler le service de traduction sans installer de bibliothèque. Est-ce possible ?

**3.** Dans quel format de fichier Foundry Toolkit permet-il de configurer un agent ?

**4.** Cite deux choses que Foundry Toolkit permet de faire depuis VS Code.

**5.** Quelle est la différence de rôle entre GitHub Copilot et Foundry Toolkit ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le SDK Microsoft Foundry : il donne accès aux éléments propres à Foundry comme les agents et Foundry IQ.

**2.** Oui, les Foundry Tools sont aussi accessibles par leurs API REST.

**3.** En YAML, en plus du concepteur visuel.

**4.** Deux parmi : parcourir les ressources du projet, déployer des modèles, tester dans un playground, configurer des agents, générer du code d'intégration.

**5.** GitHub Copilot est un assistant IA pour écrire du code plus vite. Foundry Toolkit sert à gérer et tester les ressources d'un projet Foundry.

</details>
