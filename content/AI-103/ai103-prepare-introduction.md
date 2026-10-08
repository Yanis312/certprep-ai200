# Introduction — préparer un projet d'IA sur Azure

## L'essentiel

- Aujourd'hui, un développeur doit savoir construire des **solutions d'IA complètes**, pas seulement appeler un modèle.
- Une solution d'IA combine **quatre ingrédients** : des modèles de machine learning, des services d'IA, du prompt engineering et du code personnalisé.
- Azure propose plusieurs services pour ça. Avant de coder, il faut **choisir** les bons services, outils et frameworks.
- Ce module présente **Microsoft Foundry**, la plateforme de développement d'IA sur Azure.

## Les quatre ingrédients d'une solution d'IA

| Ingrédient | À quoi il sert | Exemple |
|---|---|---|
| Modèles de machine learning | Le « cerveau » qui interprète et génère | Un LLM comme GPT-4o |
| Services d'IA | Des fonctions prêtes à l'emploi | Traduction, synthèse vocale |
| Prompt engineering | Les consignes données au modèle | « Tu es un assistant RH, réponds en 3 phrases » |
| Code personnalisé | La colle qui relie tout à ton application | Une API Python qui appelle le modèle |

## Exemple concret

Tu veux un assistant qui répond aux questions des clients d'une banque par téléphone :

- un **modèle** de langage rédige la réponse ;
- un **service d'IA** (Azure Speech) transforme la voix en texte, puis le texte en voix ;
- un **prompt** impose le ton et les limites (« ne donne jamais de conseil en investissement ») ;
- ton **code** reçoit l'appel, enchaîne les étapes et journalise la conversation.

Aucun des quatre ne suffit seul : c'est leur combinaison qui fait la solution.

## Ce que couvre le module

| # | Unité | Idée clé |
|---|---|---|
| 2 | What is AI? | Les 5 grandes capacités de l'IA |
| 3 | Microsoft Foundry | Ressource Foundry, projets, portail |
| 4 | Foundry Tools | Les services prêts à l'emploi |
| 5 | Developer tools and SDKs | VS Code, Foundry Toolkit, SDK |
| 6 | Responsible AI | Les 6 principes de Microsoft |
| 7 | Exercice | Créer un projet Foundry |

#### Point examen : ce module alimente le domaine « Planifier et gérer une solution IA Azure », qui pèse 25 à 30 % de l'AI-103.

## Exercices rapides

**1.** Cite les quatre éléments qu'une solution d'IA complète doit combiner.

**2.** Quelle plateforme Microsoft recommande-t-il pour développer de l'IA sur Azure ?

**3.** Dans l'exemple de la banque, quel ingrédient impose « ne donne jamais de conseil en investissement » ?

<details>
<summary>Voir le corrigé</summary>

**1.** Des modèles de machine learning, des services d'IA, du prompt engineering et du code personnalisé.

**2.** Microsoft Foundry.

**3.** Le prompt engineering : c'est une consigne donnée au modèle.

</details>
