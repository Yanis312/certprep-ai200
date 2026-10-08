# Statistical text analysis — l'analyse statistique

## L'essentiel

- Une fois le texte découpé en tokens, des techniques **statistiques** permettent d'en tirer du sens.
- **Analyse de fréquence** : compter les termes d'**un** document.
- **TF-IDF** : trouver les termes importants d'un document **par rapport à une collection** de documents.
- **Bag-of-words** + **Naive Bayes** : **classer** des textes, par exemple spam ou sentiment.
- **TextRank** : **résumer** un texte en choisissant ses phrases les plus représentatives.

## 1. L'analyse de fréquence

On compte combien de fois chaque token normalisé apparaît. L'idée : les termes les plus fréquents révèlent le sujet du document.

> **Exemple du cours.** Un paragraphe sur l'IA dans l'entreprise, après tokenisation, normalisation et lemmatisation :

| Terme | Fréquence |
|---|---|
| ai | 4 |
| business | 3 |
| benefit | 2 |
| customer | 2 |

Conclusion : le texte parle de l'IA et de ses bénéfices pour l'entreprise.

**Limite** : efficace pour **un seul** document, mais pas pour distinguer plusieurs documents du même corpus.

## 2. TF-IDF

**TF-IDF** signifie *Term Frequency - Inverse Document Frequency*.

### Le problème

Deux textes parlent d'agents IA Microsoft. Les termes les plus fréquents sont les mêmes dans les deux : « agent », « ai », « microsoft ». On sait qu'ils ont un thème commun, mais on ne sait pas ce qui les **distingue**.

### L'idée

Un terme est **important pour un document** s'il y apparaît **souvent**, mais **rarement dans les autres** documents.

### Le calcul en 3 étapes

| Étape | Formule | Signification |
|---|---|---|
| **TF** | Nombre d'apparitions du mot dans le document | Fréquence du terme |
| **IDF** | `idf(t) = log(N / df(t))` | Rareté du mot dans la collection |
| **TF-IDF** | `tf × idf` | Le score final |

`N` est le nombre total de documents, `df(t)` le nombre de documents qui contiennent le mot `t`.

| Score | Signification |
|---|---|
| **Élevé** | Le mot apparaît souvent dans **ce** document et rarement ailleurs |
| **Bas** | Le mot est commun à beaucoup de documents |

### L'exemple chiffré

Deux documents (N = 2).

- « agent », « ai » et « microsoft » sont dans les **deux** : `df = 2`, donc `idf = log(2/2) = log(1) = 0`. Leur score est **0** : ils ne distinguent rien.
- « copilot » n'est que dans le document A : `df = 1`, donc `idf = log(2/1) ≈ 0,693`. Il y apparaît 3 fois : `3 × 0,693 ≈ 2,079`.

| Document A | TF-IDF | | Document B | TF-IDF |
|---|---|---|---|---|
| copilot | 2,0794 | | code | 2,0794 |
| studio | 2,0794 | | develop | 2,0794 |
| declarative | 1,3863 | | foundry | 2,0794 |

Conclusion : A parle de création **déclarative** d'agents avec **Copilot Studio** ; B parle de développement **par le code** avec **Foundry**.

Le logarithme utilisé ici est le logarithme naturel.

## 3. Bag-of-words et Naive Bayes

**Bag-of-words** (sac de mots) est une technique d'extraction de caractéristiques : elle représente les tokens comme un **vecteur de fréquences**, en **ignorant la grammaire et l'ordre des mots**.

```
« le chat mange le poisson »   →   { le: 2, chat: 1, mange: 1, poisson: 1 }
« le poisson mange le chat »   →   { le: 2, chat: 1, mange: 1, poisson: 1 }
```

Les deux phrases donnent le **même** sac de mots, alors que leur sens est opposé. C'est la limite de la méthode.

Ce vecteur sert d'entrée à un algorithme de machine learning comme **Naive Bayes** : un **classifieur probabiliste** qui applique le théorème de Bayes pour prédire la classe probable d'un document d'après la fréquence des mots.

| Usage | Fonctionnement |
|---|---|
| **Filtre anti-spam** | « miracle cure », « lose weight fast », « anti-aging » reviennent plus dans le spam ; le modèle signale les messages qui les contiennent |
| **Analyse de sentiment** | Même méthode : le sac de mots fournit les caractéristiques, le modèle attribue « positif » ou « négatif » |

## 4. TextRank

**TextRank** est un algorithme **non supervisé**, fondé sur un **graphe**. Il représente le texte comme un réseau de **nœuds** reliés.

Il applique au texte le principe de **PageRank** de Google, qui classe les pages web selon leurs liens.

L'idée clé : **une phrase est importante si elle ressemble à beaucoup d'autres phrases importantes**.

### Les 3 étapes

1. **Construire un graphe** : chaque phrase devient un **nœud**. Les liens (arêtes) sont pondérés par la **similarité** entre phrases, mesurée par le recouvrement de mots ou la similarité cosinus.
2. **Calculer les rangs** de façon itérative : le score d'un nœud dépend des scores des nœuds qui lui sont reliés. Un facteur d'amortissement, en général **0,85**, intervient dans le calcul.
3. **Extraire** les phrases les mieux classées : elles forment le résumé.

### L'exemple du cours

Cinq phrases sur le cloud computing. Les phrases 1, 3 et 5 partagent beaucoup de termes avec les autres (« cloud computing ») et reçoivent les meilleurs scores. Le résumé :

> « Cloud computing provides on-demand access to computing resources. Azure is Microsoft's cloud computing platform. Cloud computing enables scalability and flexibility. »

### Résumé extractif ou abstractif

| | Extractif | Abstractif |
|---|---|---|
| Principe | **Sélectionne** des phrases du texte d'origine | **Génère** un nouveau texte |
| Texte nouveau | Aucun | Oui |
| Technique | TextRank | Modèles sémantiques récents |

TextRank s'applique aussi au niveau des **mots**, pour l'**extraction de mots-clés** : les mots deviennent les nœuds, et les liens représentent leur co-occurrence dans une fenêtre fixe.

## Quelle technique pour quel besoin

| Besoin | Technique |
|---|---|
| Trouver le sujet d'**un** document | Analyse de fréquence |
| Trouver ce qui distingue un document **dans une collection** | **TF-IDF** |
| Classer des textes : spam, sentiment | Bag-of-words + Naive Bayes |
| Résumer en choisissant des phrases | TextRank |

#### Point examen : question officielle du module — la technique qui détermine l'importance des mots dans un document précis, par rapport à une collection plus large, est TF-IDF. Naive Bayes sert à classer, Word2Vec à créer des vecteurs.

## Exercices rapides

**1.** Que signifie TF-IDF ?

**2.** Un mot apparaît dans tous les documents d'une collection. Quel est son IDF, et pourquoi ?

**3.** Un mot a un TF-IDF élevé dans un document. Qu'est-ce que cela indique ?

**4.** Collection de 4 documents. Le mot « foundry » apparaît 5 fois dans le document 1, et dans 2 documents en tout. Écris le calcul de son TF-IDF (sans le résoudre).

**5.** Que néglige la représentation bag-of-words ?

**6.** Quel algorithme classe un e-mail comme spam à partir de la fréquence des mots ?

**7.** Sur quel algorithme célèbre TextRank est-il fondé ?

**8.** Quelle différence entre résumé extractif et abstractif ?

**9.** Dans TextRank appliqué au résumé, que représente un nœud ?

<details>
<summary>Voir le corrigé</summary>

**1.** Term Frequency - Inverse Document Frequency.

**2.** Zéro. `log(N/N) = log(1) = 0` : un mot présent partout ne distingue aucun document.

**3.** Que le mot apparaît souvent dans ce document, mais rarement dans les autres.

**4.** `5 × log(4 / 2)`, soit `5 × log(2)`.

**5.** La grammaire et l'ordre des mots.

**6.** Naive Bayes.

**7.** PageRank, de Google.

**8.** L'extractif sélectionne des phrases du texte d'origine ; l'abstractif génère un texte nouveau.

**9.** Une phrase du document.

</details>
