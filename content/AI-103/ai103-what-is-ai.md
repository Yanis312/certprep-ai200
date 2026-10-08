# What is AI? — les 5 capacités de l'IA

## L'essentiel

- L'**IA** désigne des logiciels capables d'imiter un comportement humain : comprendre une entrée, raisonner dessus, produire une réponse ou une prédiction.
- Les solutions actuelles reposent sur des **modèles de machine learning** qui ont appris les relations de sens présentes dans d'énormes volumes de données.
- Un développeur peut intégrer **5 grandes capacités** dans une application.
- Identifier la capacité dont tu as besoin te dit **quel service Azure provisionner**.

## Les 5 capacités

| Capacité | Ce qu'elle fait | Exemple |
|---|---|---|
| **IA générative et agents** | Génère des réponses originales à partir d'un prompt en langage naturel | Chat interactif, aide à la rédaction |
| **Traitement du langage naturel (NLP)** | Donne du sens à du texte | Classer des e-mails, détecter le sentiment d'un avis |
| **Parole (computer speech)** | Reconnaît et synthétise la voix | Transcription d'une réunion, lecture à voix haute |
| **Vision par ordinateur** | Interprète images, vidéos et flux caméra | Caisse automatique qui reconnaît les produits |
| **Extraction d'informations** | Extrait les données clés de documents, formulaires, images, enregistrements | Lire la date et le total d'un ticket de caisse scanné |

## IA générative et agents

L'IA générative repose sur les **LLM** (large language models). Elle sert de plus en plus de base à l'**IA agentique**.

Un **agent** = trois choses réunies :

- un **LLM** (il raisonne) ;
- des **instructions** ciblées (elles définissent sa mission) ;
- des **outils** (pour trouver des connaissances et automatiser des tâches).

> **Exemple.** Un agent « notes de frais » : le LLM comprend la demande, les instructions disent « tu ne valides que les dépenses sous 500 € », et un outil va lire la politique de l'entreprise puis enregistrer la note dans le système comptable.

## NLP : toujours utile malgré les LLM

Les LLM descendent du NLP et savent faire beaucoup de ses tâches. Mais le NLP statistique classique garde un intérêt pour l'**analyse de texte** spécialisée :

- algorithmes basés sur la **fréquence des termes** ;
- modèles dédiés à une tâche : **classification de texte**, **analyse de sentiment**, **résumé**.

Ces techniques sont souvent moins chères et plus prévisibles qu'un LLM.

## Parole

Deux sens : **reconnaître** la voix (speech to text) et la **synthétiser** (text to speech).

Les progrès récents gèrent le bruit de fond, les interruptions, plusieurs langues et accents. Usages : conversation vocale, transcription et analyse de paroles en direct ou enregistrées, traduction simultanée, interfaces « lire à voix haute ».

## Vision par ordinateur

L'application accepte et interprète une entrée visuelle : image, vidéo, flux caméra en direct.

Les modèles génératifs sont de plus en plus **multimodaux** : ils traitent une image en entrée et peuvent aussi **générer** des images et des vidéos.

## Extraction d'informations

C'est une **combinaison** des autres capacités :

- IA générative pour raisonner sur le langage ;
- NLP pour comprendre les documents ;
- vision et parole pour analyser les médias.

> **Exemple.** Une application de notes de frais extrait d'un ticket scanné la date d'achat, le détail de chaque ligne et le montant total.

#### Point examen : on te décrit un besoin métier et tu dois reconnaître la capacité. « Extraire les champs d'une facture » = extraction d'informations. « Reconnaître des produits sur une photo » = vision. « Transcrire un appel » = parole.

## Exercices rapides

Pour chaque besoin, donne la capacité d'IA concernée.

**1.** Un chatbot qui rédige une réponse personnalisée à chaque client.

**2.** Un tableau de bord qui indique si les avis clients sont positifs ou négatifs.

**3.** Une borne de parking qui lit les plaques d'immatriculation avec une caméra.

**4.** Un outil qui récupère le numéro, la date et le total de factures PDF scannées.

**5.** Quels sont les trois composants d'un agent ?

<details>
<summary>Voir le corrigé</summary>

**1.** IA générative (un LLM génère une réponse originale à partir d'un prompt).

**2.** Traitement du langage naturel : c'est de l'analyse de sentiment.

**3.** Vision par ordinateur.

**4.** Extraction d'informations.

**5.** Un LLM, des instructions et des outils.

</details>
