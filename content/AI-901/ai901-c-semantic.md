# Semantic language models — les modèles sémantiques

## L'essentiel

- Les modèles de langage modernes codent les tokens sous forme de **vecteurs** appelés **embeddings**.
- Cette approche s'est répandue avec **Word2Vec** et **GloVe**.
- Des tokens de **sens proche** ont des vecteurs d'**orientation proche**.
- La **similarité cosinus** mesure cette proximité.
- On peut **additionner et soustraire** des vecteurs pour raisonner sur le sens.
- Avec l'**attention**, on obtient des **embeddings contextualisés**, comme dans la famille **GPT** : la base de l'IA générative.

## Du statistique au sémantique

| | Techniques statistiques | Modèles sémantiques |
|---|---|---|
| Fondement | Compter les mots | Coder le **sens** dans des vecteurs |
| Exemples | Fréquence, TF-IDF, bag-of-words | Word2Vec, GloVe, GPT |
| Comprend que « chien » et « chiot » sont proches | Non | **Oui** |

## Trois générations

| Technique | Ce qu'elle apporte |
|---|---|
| **Word2Vec**, **GloVe** | Chaque token devient un **vecteur dense** à plusieurs dimensions ; les valeurs reflètent ses caractéristiques sémantiques |
| **Attention** | Chaque token est considéré **dans son contexte** ; on calcule l'influence des tokens voisins |
| **Embeddings contextualisés** (famille GPT) | Le résultat de l'attention : la base de l'IA générative moderne |

## Représenter le texte par des vecteurs

Un vecteur est un **point dans un espace à plusieurs dimensions**. Il décrit une **direction** et une **distance** depuis l'origine.

| Mot | Vecteur |
|---|---|
| dog | [0.8, 0.6, 0.1] |
| puppy | [0.9, 0.7, 0.4] |
| cat | [0.7, 0.5, 0.2] |
| kitten | [0.8, 0.6, 0.5] |
| young | [0.1, 0.1, 0.3] |
| ball | [0.3, 0.9, 0.1] |
| tree | [0.2, 0.1, 0.9] |

- « dog » et « cat » sont proches : deux animaux domestiques.
- « puppy » et « kitten » sont proches : deux jeunes animaux.
- « tree », « young » et « ball » ont des orientations nettement différentes.

## Trouver les termes liés : la similarité cosinus

```
similarité_cosinus(A, B) = (A · B) / (||A|| × ||B||)
```

`A · B` est le **produit scalaire**, `||A||` la **norme** (longueur) du vecteur A.

### Calcul complet : dog et cat

1. **Produit scalaire** : (0,8 × 0,7) + (0,6 × 0,5) + (0,1 × 0,2) = 0,56 + 0,30 + 0,02 = **0,88**
2. **Norme de dog** : √(0,64 + 0,36 + 0,01) = √1,01 ≈ **1,005**
3. **Norme de cat** : √(0,49 + 0,25 + 0,04) = √0,78 ≈ **0,883**
4. **Similarité** : 0,88 / (1,005 × 0,883) ≈ **0,992**

### Trouver l'intrus

| Paire | Similarité cosinus | Lecture |
|---|---|---|
| dog / cat | 0,992 | Très proches |
| dog / tree | 0,333 | Éloignés |
| cat / tree | 0,452 | Éloignés |

« tree » est l'intrus.

Une valeur **proche de 1** = sens très proche. Une valeur **basse** = sens éloigné.

## L'arithmétique des vecteurs

On peut additionner ou soustraire des vecteurs, puis chercher le token dont le vecteur correspond.

### Addition

```
dog + young = [0.8, 0.6, 0.1] + [0.1, 0.1, 0.3] = [0.9, 0.7, 0.4] = puppy
cat + young = [0.7, 0.5, 0.2] + [0.1, 0.1, 0.3] = [0.8, 0.6, 0.5] = kitten
```

Ça fonctionne parce que le vecteur « young » code la **transformation** d'un animal adulte en son petit.

### Soustraction

```
puppy  - young = [0.9, 0.7, 0.4] - [0.1, 0.1, 0.3] = [0.8, 0.6, 0.1] = dog
kitten - young = [0.8, 0.6, 0.5] - [0.1, 0.1, 0.3] = [0.7, 0.5, 0.2] = cat
```

En pratique, le calcul tombe rarement pile sur un mot : on cherche le mot dont le vecteur est **le plus proche** du résultat.

## Le raisonnement par analogie

« puppy est à dog ce que kitten est à ? »

```
kitten - puppy + dog
= [0.8, 0.6, 0.5] - [0.9, 0.7, 0.4] + [0.8, 0.6, 0.1]
= [-0.1, -0.1, 0.1] + [0.8, 0.6, 0.1]
= [0.7, 0.5, 0.2]
= cat
```

Les opérations sur les vecteurs capturent donc des **relations linguistiques**.

## Les modèles sémantiques pour l'analyse de texte

| Tâche | Comment les vecteurs aident |
|---|---|
| **Résumé** | On code chaque phrase en vecteur (souvent la moyenne des embeddings de ses mots). Les phrases les plus **centrales** par rapport au sens du document sont extraites |
| **Extraction de mots-clés** | On compare l'embedding de chaque mot à la représentation du document. Les mots les plus proches sont les termes clés |
| **Reconnaissance d'entités nommées** | Le modèle est affiné (fine-tuning) pour que les types d'entités similaires se **regroupent**. Il examine l'embedding du token et son contexte |
| **Classification** | Le document devient un vecteur agrégé (par exemple la moyenne de ses embeddings), utilisé par un classifieur ou comparé à des vecteurs types de chaque classe |

Comme des documents de sens proche ont des orientations proches, cette approche regroupe naturellement les contenus liés.

#### Point examen : question officielle du module — le rôle des vecteurs d'embedding en NLP est de capturer les relations sémantiques entre tokens dans plusieurs dimensions. Sache aussi refaire un produit scalaire simple.

## Exercices rapides

**1.** Cite deux techniques qui ont répandu la représentation des tokens par des vecteurs.

**2.** Que mesure la similarité cosinus ?

**3.** Calcule le produit scalaire de [1, 2, 0] et [3, 1, 4].

**4.** Deux mots ont une similarité cosinus de 0,97. Et deux autres, de 0,20. Lesquels ont le sens le plus proche ?

**5.** Avec les vecteurs du cours, que donne `dog + young` ?

**6.** Écris le calcul vectoriel qui répond à : « puppy est à dog ce que kitten est à ? »

**7.** Qu'apporte l'attention par rapport à Word2Vec ?

**8.** Comment représente-t-on un document entier pour le classer ?

<details>
<summary>Voir le corrigé</summary>

**1.** Word2Vec et GloVe.

**2.** La proximité d'orientation de deux vecteurs, donc la proximité de sens des tokens.

**3.** (1 × 3) + (2 × 1) + (0 × 4) = 3 + 2 + 0 = 5.

**4.** Les deux premiers : plus la valeur est proche de 1, plus les sens sont proches.

**5.** [0.9, 0.7, 0.4], c'est-à-dire « puppy ».

**6.** `kitten - puppy + dog`, ce qui donne le vecteur de « cat ».

**7.** Elle considère chaque token dans son contexte et calcule l'influence des tokens voisins, ce qui donne des embeddings contextualisés.

**8.** Par un vecteur agrégé, par exemple la moyenne des embeddings de ses mots.

</details>
