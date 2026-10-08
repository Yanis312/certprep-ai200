# Understand text analysis in Foundry — deux approches

## L'essentiel

- L'**analyse de texte** examine automatiquement du texte pour en extraire de l'information utile : sentiment, mots-clés, entités, sujets.
- Foundry propose **deux approches** :
  - des **modèles d'IA généralistes**, pilotés par des prompts en langage naturel ;
  - **Azure Language**, des outils spécialisés qui renvoient des résultats **structurés et déterministes**.
- Le modèle généraliste est **souple** ; Azure Language est **prévisible**.
- Pour commencer : une **ressource Foundry** et un **projet Foundry**.

## Les deux approches

| | Modèle généraliste | Azure Language |
|---|---|---|
| Ce que c'est | Un modèle de langage entraîné sur d'énormes volumes de texte | Un service NLP avec des **analyseurs spécialisés** par tâche |
| Comment on s'en sert | Par un **prompt** en langage naturel | Par un analyseur dédié |
| Technique | IA générative | Techniques **statistiques** |
| Résultat | Varie selon la formulation du prompt | **Structuré, déterministe** |
| Configuration ou entraînement | Aucun | Aucun |
| Idéal pour | Explorer, combiner des tâches, analyse conversationnelle | Les **pipelines automatisés** où la constance compte |

## Approche 1 — le modèle généraliste

Un modèle généraliste suit des instructions en langage naturel pour analyser le sentiment, extraire des entités, résumer, traduire, répondre à des questions.

| Tâche | Ce qu'elle fait |
|---|---|
| **Extraction d'expressions clés** | Liste les principaux concepts d'un texte non structuré |
| **Liaison d'entités** (entity linking) | Identifie des entités connues, avec un lien vers **Wikipédia** |
| **Analyse de sentiment et d'opinion** | Indique si le texte est positif ou négatif |
| **Résumé** | Retient l'information la plus importante |

On explore tout ça dans le **chat playground** du portail. Comme le modèle comprend le contexte, on peut **enchaîner** des questions ou affiner l'analyse dans la même conversation.

### Extraction d'expressions clés

Utile pour l'**indexation** et la **recherche** de documents.

> **Avis :** « I had a fantastic meal at the diner in Seattle on Saturday. The mushroom risotto was perfectly prepared, and really tasty. Our waiter, Pete, was friendly and efficient... »
>
> **Expressions extraites :** casual dinner, dessert, fantastic meal, diner, great recommendation, mushroom risotto, Pete, place, Saturday, Seattle, strawberry cheesecake, waiter.

### Reconnaissance d'entités nommées

Une **entité** est un élément d'un type ou d'une catégorie donné, parfois avec un sous-type.

> **Texte :** « On May 2nd, 2017, John Smith visited New York to attend a conference hosted by Microsoft. The event started at 8:00 AM and lasted 3 hours. Over 25% of the 40 attendees traveled more than 10 miles to participate. »

| Type d'entité | Sous-type | Valeur |
|---|---|---|
| Person | — | John Smith |
| Location | — | New York |
| Organization | — | Microsoft |
| DateTime | Date | May 2nd, 2017 |
| DateTime | Time | 8:00 AM |
| DateTime | Duration | 3 hours |
| Quantity | Percentage | 25% |
| Quantity | Number | 40 |
| Quantity | Dimension | 10 miles |

### Analyse de sentiment

Elle classe un document en **positif, négatif ou neutre**. Utile pour les réseaux sociaux, les avis clients, les forums.

Le résultat **dépend de la formulation**. Tu peux demander une note globale, ou un détail **phrase par phrase**. Plus le prompt est précis, plus la réponse est structurée et détaillée.

> **Avis :** « I had a wonderful dinner at a cozy bistro in Portland... »
>
> **Réponse possible, phrase par phrase :** phrase 1 positive (« wonderful dinner », « cozy bistro »), phrase 2 positive (« cooked perfectly »)... **Sentiment global : fortement positif.**

### Combiner les tâches

Tout passant par des prompts, on combine librement. Par exemple : traduire un long avis, puis le résumer, dans la même conversation.

## Approche 2 — Azure Language

Un modèle généraliste fait souvent un bon travail, mais un outil spécialisé donne parfois des résultats **plus prévisibles**.

**Azure Language dans Foundry Tools** est un service NLP avec des analyseurs conçus pour des tâches précises. Ils utilisent des techniques statistiques et renvoient une sortie **structurée et déterministe**.

Dans le portail : **Build → Models → onglet AI services**.

### Détection de langue

Dans un flux multilingue, la première étape est souvent d'identifier la langue, pour router le texte vers le bon modèle. Le service renvoie la **langue principale** et un **score de confiance**.

> **Texte :** « ¡Hola! Me llamo Josefina y vivo en Madrid, España. »

| Langue | Code ISO 639-1 | Score de confiance |
|---|---|---|
| Spanish | es | 1.00 |

### Détection des PII

Elle repère les détails personnels (noms, téléphones, e-mails, adresses) et peut les **masquer**. Elle couvre aussi les **informations de santé** (PHI).

> **Texte :** « Maria Garcia called from 020 7946 0958 and asked to send documents to 42 Market Road, London, UK, SW1A 1AA. »

| Texte | Catégorie |
|---|---|
| Maria Garcia | Person |
| 020 7946 0958 | Phone number |
| 42 Market Road, London, UK, SW1A 1AA | Address |

## Choisir

| Besoin | Approche |
|---|---|
| Résumer et commenter librement un avis | Modèle généraliste |
| Traduire puis résumer dans la même conversation | Modèle généraliste |
| Renvoyer un **code de langue** et un **score de confiance** identiques à chaque appel | Azure Language |
| **Masquer les PII** dans 10 000 documents par nuit | Azure Language |

#### Point examen : « résultats structurés », « déterministes », « techniques statistiques », « pipeline automatisé » pointent vers Azure Language. « Prompt en langage naturel », « flexible », « questions de suivi » pointent vers un modèle généraliste.

## Exercices rapides

**1.** Quelles sont les deux approches d'analyse de texte dans Foundry ?

**2.** Laquelle renvoie des résultats déterministes ?

**3.** Dans la phrase « Léa a rejoint Contoso à Lyon le 3 mars », donne les entités et leur type.

**4.** Que renvoie la détection de langue d'Azure Language ?

**5.** Quelle tâche identifie des entités connues avec un lien vers Wikipédia ?

**6.** Pourquoi le résultat d'une analyse de sentiment par un modèle généraliste peut-il changer d'un appel à l'autre ?

**7.** Où trouve-t-on les services Azure Language à tester dans le portail ?

**8.** Modèle généraliste ou Azure Language ? (a) Explorer ce qu'on peut tirer d'un lot d'avis. (b) Masquer des numéros de téléphone avant archivage.

<details>
<summary>Voir le corrigé</summary>

**1.** Les modèles d'IA généralistes et Azure Language dans Foundry Tools.

**2.** Azure Language.

**3.** Léa : Person. Contoso : Organization. Lyon : Location. 3 mars : DateTime (Date).

**4.** La langue principale, son code ISO 639-1 et un score de confiance.

**5.** La liaison d'entités (entity linking).

**6.** Parce que la sortie dépend de la formulation du prompt et que le modèle génère du texte de façon probabiliste.

**7.** Page Build, puis Models, puis l'onglet AI services.

**8.** (a) Modèle généraliste. (b) Azure Language.

</details>
