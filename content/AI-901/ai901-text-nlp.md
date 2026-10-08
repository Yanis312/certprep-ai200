# Text and natural language — texte et langage naturel

## L'essentiel

- Le **traitement du langage naturel (NLP)** regroupe les modèles et techniques qui donnent du sens au langage.
- Le NLP est la **base** sur laquelle sont construits les grands modèles de langage de l'IA générative.
- Il permet l'**analyse de texte** : analyser et résumer du texte en langage naturel.
- Les modèles génératifs font beaucoup de ces tâches aujourd'hui, mais des **outils NLP spécialisés** restent utilisés pour obtenir des **résultats prévisibles** ou appliquer des **règles personnalisées**.

## Les 4 techniques d'analyse de texte

| Technique | Ce qu'elle fait | Exemple |
|---|---|---|
| **Détection de langue** | Détermine dans quelle(s) langue(s) un document est écrit | « Bonjour à tous » → français |
| **Classification de texte** | Range un document dans une catégorie. Inclut l'**analyse de sentiment** : positif, négatif ou neutre | « Livraison catastrophique » → négatif |
| **Extraction de termes clés et détection d'entités** | Repère les mots ou expressions importants, et les mentions de **personnes, lieux, organisations** | « Ada Lovelace a travaillé à Londres » → personne : Ada Lovelace ; lieu : Londres |
| **Résumé** | Réduit le volume de texte en gardant les points principaux | Un article de 3 pages → 4 phrases |

Deux précisions qui reviennent à l'examen :

- la **détection de langue** est souvent la **première étape** d'un traitement en plusieurs phases ;
- une forme spécialisée de détection d'entités sert à **détecter et masquer les données personnelles (PII)** : noms, adresses, numéros de téléphone.

## PII : informations personnelles identifiables

```
Avant :  « Contactez Marie Dupont au 06 12 34 56 78, 12 rue des Lilas. »
Après :  « Contactez ********* au **************, ****************. »
```

On appelle cette opération le **masquage** (redaction). Elle sert à respecter les politiques et les lois sur la vie privée avant de partager ou d'analyser des données.

## Un traitement en chaîne

```
Avis client
    │
    ▼
1. Détection de langue      →  espagnol
    │
    ▼
2. Masquage des PII         →  nom et téléphone cachés
    │
    ▼
3. Analyse de sentiment     →  négatif
    │
    ▼
4. Extraction de termes clés →  « retard », « colis abîmé »
```

## Scénarios courants

- Analyser des documents ou des **transcriptions** d'appels et de réunions, pour dégager les sujets clés et les mentions de personnes, lieux, organisations, produits.
- Analyser des publications sur les réseaux sociaux, des **avis produits** ou des articles, pour évaluer le sentiment et l'opinion.
- Créer des **chatbots** qui répondent aux questions fréquentes ou mènent des dialogues prévisibles, **sans la complexité de l'IA générative**.
- **Masquer les PII** avant de partager ou d'analyser des données.

## NLP spécialisé ou IA générative ?

| Besoin | Choix |
|---|---|
| Résultat **prévisible**, toujours au même format | Outil NLP spécialisé |
| **Règles personnalisées** à appliquer | Outil NLP spécialisé |
| FAQ simple, dialogue prévisible | Outil NLP spécialisé |
| Réponse ouverte, rédigée, créative | IA générative |

#### Point examen : le guide d'étude cite quatre techniques d'analyse de texte — extraction de mots-clés, détection d'entités, analyse de sentiment et résumé. Sache reconnaître chacune à partir d'un exemple.

## Exercices rapides

Quelle technique est utilisée ?

**1.** Trier automatiquement des e-mails entre « facturation », « technique » et « commercial ».

**2.** Remplacer les numéros de carte bancaire par des étoiles dans des transcriptions.

**3.** Savoir si un commentaire est écrit en portugais ou en espagnol.

**4.** Sortir « Alan Turing », « Bletchley Park » et « 1943 » d'un article.

**5.** Transformer un rapport de 20 pages en un paragraphe.

**6.** Mesurer si les tweets sur un produit sont plutôt favorables.

Et aussi :

**7.** Quelle technique est souvent la première étape d'un traitement de texte en plusieurs phases ?

**8.** Pourquoi utiliser un outil NLP spécialisé plutôt qu'un modèle génératif ?

<details>
<summary>Voir le corrigé</summary>

**1.** Classification de texte.

**2.** Détection et masquage des PII, une forme de détection d'entités.

**3.** Détection de langue.

**4.** Détection d'entités.

**5.** Résumé.

**6.** Analyse de sentiment, une forme de classification de texte.

**7.** La détection de langue.

**8.** Pour obtenir des résultats prévisibles ou appliquer des règles personnalisées.

</details>
