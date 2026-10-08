# Lab et bilan — Introduction to AI concepts

## Le lab : explorer les charges de travail d'IA

- **Durée** : environ 15 minutes.
- **Où** : bouton de lancement sur la page de l'unité Microsoft Learn.
- **Quoi** : tu explores l'application sur l'histoire de l'informatique utilisée tout au long du module, et tu essaies toi-même chaque capacité.

Je n'ai pas eu les instructions détaillées de ce lab. Voici ce qu'il faut observer en le faisant :

| À essayer | Capacité à reconnaître |
|---|---|
| Poser une question dans le chat | IA générative |
| Résumer un article, extraire noms et dates | Analyse de texte |
| Parler au micro, écouter la réponse | Reconnaissance puis synthèse vocale |
| Charger la photo d'un ordinateur | Vision par ordinateur |
| Lire un numéro de série sur une photo | Extraction d'informations |
| Poser une question dangereuse ou illégale | IA responsable (filtres de contenu) |

## Le module en 10 lignes

1. L'**IA générative** crée du contenu original à partir d'un **prompt**, grâce à un **modèle de langage**.
2. **LLM** : puissant et généraliste. **SLM** : ciblé, léger, déployable en local.
3. Un **agent** = modèle + instructions + outils (de **connaissance** ou d'**action**).
4. **NLP** : détection de langue, classification et sentiment, termes clés et entités, résumé.
5. Le masquage des **PII** est une forme spécialisée de détection d'entités.
6. **Reconnaissance** vocale = speech-to-text. **Synthèse** vocale = text-to-speech.
7. Vision : **classification** (l'image), **détection** (une boîte), **segmentation** (les pixels), **multimodal** (une description).
8. Extraction : **OCR** + **modèle d'analyse** → des champs.
9. IA responsable : **6 principes**, de la conception à l'exploitation.
10. Les **filtres de contenu** aident, mais ne suffisent pas.

## Tableau de reconnaissance rapide

| L'énoncé dit... | Capacité |
|---|---|
| « génère », « rédige », « répond à un prompt » | IA générative |
| « effectue des tâches pour l'utilisateur », « utilise des outils » | Agent |
| « sentiment », « entités », « résumé », « langue du texte » | Analyse de texte (NLP) |
| « transcrit », « dicte » | Reconnaissance vocale |
| « lit à voix haute », « voix » | Synthèse vocale |
| « photo », « caméra », « identifie des objets » | Vision par ordinateur |
| « extrait les champs », « formulaire scanné », « reçu » | Extraction d'informations |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quelle est la description la plus exacte de l'IA générative ? | Elle utilise un **modèle de langage** pour créer du **contenu original** en réponse à un **prompt** |
| Qu'est-ce qu'un agent IA ? | Une **application d'IA** qui peut effectuer des **tâches pour le compte d'un utilisateur** |
| Une application lit des e-mails à voix haute. Quelle capacité vocale ? | La **synthèse vocale** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : l'IA générative n'est **pas** une forme ancienne remplacée par le machine learning, et elle n'est **pas** réservée aux spécialistes. Un agent n'est **pas** une personne.

#### Point examen : ce module correspond au sous-domaine « Identifier les charges de travail d'IA » et aux principes d'IA responsable, soit une bonne part des 40 à 45 % du premier domaine de l'AI-901.

## Exercices rapides

**1.** Donne les 6 capacités ou thèmes couverts par le module.

**2.** Cite les 6 principes d'IA responsable.

**3.** Associe : (a) boîte autour d'un objet, (b) pixels d'un objet, (c) étiquette pour l'image.

**4.** Une application écoute une question, cherche dans une base, puis envoie un e-mail de réponse. Quelles capacités et quels types d'outils sont en jeu ?

**5.** Quelle technologie est à la base de l'analyse de documents ?

<details>
<summary>Voir le corrigé</summary>

**1.** IA générative et agents, traitement du langage naturel et analyse de texte, parole, vision par ordinateur, extraction d'informations, IA responsable.

**2.** Équité, fiabilité et sécurité, confidentialité et sécurité, inclusion, transparence, responsabilité.

**3.** (a) Détection d'objets, (b) segmentation sémantique, (c) classification d'images.

**4.** Reconnaissance vocale pour écouter ; un agent avec un outil de connaissance (la base) et un outil d'action (l'envoi d'e-mail).

**5.** L'OCR, la reconnaissance optique de caractères.

</details>
