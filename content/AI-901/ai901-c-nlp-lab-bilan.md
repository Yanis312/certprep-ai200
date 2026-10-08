# Lab et bilan — concepts du traitement du langage naturel

## Le lab : explorer l'analyse de texte

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne dans le navigateur.
- Sur une machine modeste, un **mode Basic** sans modèle est disponible.

### Partie 1 — Résumer avec un modèle génératif

1. Ouvre `https://aka.ms/chat-playground` et attends le chargement du modèle (**Microsoft Phi 3.5 Mini**).
2. Dans **Instructions** :

```
You are an AI assistant that analyzes and summarizes text.
```

3. Envoie le prompt suivant, suivi de l'article du lab sur le Commodore 64 :

```
Summarize this review as a single short paragraph:
```

**Ce que tu dois observer** : un paragraphe court qui reprend l'essentiel de l'article.

### Partie 2 — Un outil d'analyse spécialisé

Un grand modèle de langage fait souvent du bon travail, mais un outil spécialisé donne des résultats **plus prévisibles**.

1. Ouvre `https://aka.ms/language-app` (Language Playground).

Cette application utilise le même modèle Phi 3.5 Mini, avec un mode Basic de secours fondé sur des **techniques statistiques**.

### Détecter la langue

1. Vérifie que l'analyseur **Language detection** est sélectionné.
2. Choisis un exemple, puis **Detect**.
3. **Edit**, puis essaie avec l'étiquette d'ordinateur du lab (« CPC 464 ... Hergestellt in Korea ... Bundesrepublik Deutschland »).

L'application reconnaît 11 langues : anglais, français, espagnol, portugais, allemand, italien, chinois simplifié, japonais, hindi, arabe, russe.

### Repérer les PII

1. Sélectionne l'analyseur **Text PII extraction**.
2. Choisis un exemple, puis **Detect**.
3. **Edit**, puis essaie avec la facture du lab (Margaret Ellis, son adresse, son téléphone).

Types de PII reconnus : noms de personnes, adresses e-mail, numéros de téléphone, adresses postales.

Cette application combine IA générative, analyse statistique et **expressions régulières**. Ce n'est pas un outil de production : elle peut signaler de **faux positifs** et **manquer** des PII.

### Ce que retenir du lab

Les petits modèles et les techniques statistiques suffisent pour montrer les concepts. Pour une analyse de qualité à grande échelle, on utilise une plateforme cloud comme **Microsoft Foundry**, avec ses modèles génératifs et **Azure Language**, un service spécialisé avec des API pour les tâches courantes.

## Le module en 10 lignes

1. L'**analyse de texte** extrait du sens d'un texte non structuré ; c'est une partie du **NLP**.
2. Le texte à analyser est un **corpus**, découpé en **tokens**.
3. Prétraitements : **normalisation**, **mots vides**, **n-grammes**, **stemming**, **lemmatisation**, **étiquetage grammatical**.
4. **Stemming** = couper la fin du mot. **Lemmatisation** = revenir au mot du dictionnaire.
5. **Analyse de fréquence** : compter les termes d'un document.
6. **TF-IDF** : importance d'un mot dans un document **par rapport à la collection**.
7. **Bag-of-words** + **Naive Bayes** : classer (spam, sentiment), sans tenir compte de l'ordre des mots.
8. **TextRank** : résumé **extractif**, fondé sur un graphe, inspiré de PageRank.
9. **Embeddings** : des vecteurs qui capturent le sens ; **Word2Vec**, **GloVe**, puis attention et **GPT**.
10. **Similarité cosinus** pour comparer, **arithmétique vectorielle** pour raisonner par analogie.

## La frise des techniques

```
Statistique ──────────────────────────────────────────────► Sémantique

Fréquence   TF-IDF   Bag-of-words   TextRank   Word2Vec/GloVe   Attention → GPT
  compter    pondérer   classer      résumer    vecteurs de     embeddings
                                                  sens           contextualisés
```

## Technique et tâche

| Tâche | Technique statistique | Approche sémantique |
|---|---|---|
| Trouver le sujet | Fréquence, TF-IDF | Mots proches du vecteur du document |
| Classer | Bag-of-words + Naive Bayes | Vecteur agrégé du document |
| Résumer | TextRank (extractif) | Phrases centrales, ou résumé abstractif |
| Repérer des entités | Règles, motifs | Modèle affiné sur les embeddings |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| À quoi sert la tokenisation ? | À **découper le texte en unités plus petites** pour l'analyse |
| Quelle technique détermine l'importance des mots dans un document précis, par rapport à une collection plus large ? | **TF-IDF** (Term Frequency-Inverse Document Frequency) |
| Quel est le rôle des vecteurs d'embedding en NLP ? | Ils **capturent les relations sémantiques entre tokens dans plusieurs dimensions** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : la tokenisation ne traduit pas et ne résume pas. Naive Bayes est un classifieur, Word2Vec crée des vecteurs. Les embeddings ne dupliquent pas les tokens dans plusieurs langues et ne définissent pas les mots vides.

#### Point examen : le guide d'étude demande de décrire les techniques courantes d'analyse de texte : extraction de mots-clés, détection d'entités, analyse de sentiment et résumé. Sache dire quelle technique sert à quoi.

## Exercices rapides

**1.** Classe du plus ancien au plus récent : GPT, TF-IDF, Word2Vec.

**2.** Quelle technique utiliserais-tu pour : (a) filtrer le spam, (b) résumer un article en gardant ses phrases, (c) trouver ce qui distingue un document parmi cent ?

**3.** Dans le lab, quels deux analyseurs spécialisés essaies-tu ?

**4.** Pourquoi le Language Playground du lab n'est-il pas un outil de production ?

**5.** Donne en une phrase la différence entre stemming et lemmatisation.

<details>
<summary>Voir le corrigé</summary>

**1.** TF-IDF, Word2Vec, GPT.

**2.** (a) Bag-of-words avec Naive Bayes. (b) TextRank. (c) TF-IDF.

**3.** La détection de langue et l'extraction de PII.

**4.** Parce qu'il peut signaler de faux positifs et manquer des PII, surtout en mode de reconnaissance de motifs.

**5.** Le stemming coupe la fin du mot ; la lemmatisation ramène le mot à sa forme valide du dictionnaire.

</details>
