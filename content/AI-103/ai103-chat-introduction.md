# Introduction — créer une application de chat

## L'essentiel

- Pour écrire une application de chat avec Microsoft Foundry, tu dois faire **4 choix**.
- Ces choix : l'**endpoint**, le **SDK**, l'**authentification** et l'**API de chat**.
- Ce module t'apprend à faire le bon choix pour chacun, puis à écrire le code.
- Certaines fonctions de Foundry sont en **préversion** : des détails peuvent changer.

## Les 4 choix

| Choix | Options | Unité |
|---|---|---|
| **Endpoint** | Endpoint du projet ou endpoint Azure OpenAI | Choose an endpoint and SDK |
| **SDK client** | SDK Foundry ou SDK OpenAI | Choose an endpoint and SDK |
| **Authentification** | Microsoft Entra ID, clé d'API, jeton | Choose an endpoint and SDK |
| **API de chat** | Responses ou ChatCompletions | Les deux unités suivantes |

## La vue d'ensemble

```
Ton application Python
        │
        │  1. SDK : Foundry (azure-ai-projects)  ou  OpenAI (openai)
        │  2. Authentification : Entra ID (recommandé) ou clé
        ▼
   Endpoint : projet  ou  Azure OpenAI
        │
        │  3. API : Responses (recommandée)  ou  ChatCompletions
        ▼
   Modèle déployé (nom du déploiement)
```

## Exemple

Tu dois ajouter un assistant à un site de recettes de cuisine. Avant d'écrire une ligne, tu décides :

- **endpoint** : Azure OpenAI, car tu veux seulement interroger un modèle ;
- **SDK** : OpenAI, pour un code portable ;
- **authentification** : Entra ID, car l'application ira en production ;
- **API** : Responses, car c'est un nouveau projet et tu veux garder le fil de la conversation.

#### Point examen : la compétence visée est « Configurer une application pour se connecter à un projet Foundry » et « Intégrer des flux génératifs à l'aide des SDK ». Attends-toi à du code Python à compléter.

## Exercices rapides

**1.** Quels sont les 4 choix à faire avant de développer une application de chat ?

**2.** Quelles sont les deux API de chat possibles ?

**3.** Quelle authentification pour une application en production ?

<details>
<summary>Voir le corrigé</summary>

**1.** L'endpoint, le SDK, l'authentification et l'API de chat.

**2.** Responses et ChatCompletions.

**3.** Microsoft Entra ID.

</details>
