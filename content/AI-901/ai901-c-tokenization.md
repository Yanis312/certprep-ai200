# Introduction et Tokenization — préparer le texte

## L'essentiel

- L'**analyse de texte** est une partie du **NLP** : elle extrait du sens, de la structure et des informations d'un texte **non structuré**.
- Les techniques ont évolué : des **calculs statistiques** sur la fréquence des termes, jusqu'aux **modèles de langage vectoriels** qui capturent le sens.
- Première étape de toute analyse : découper le texte, appelé **corpus**, en **tokens**.
- Six techniques de prétraitement : **normalisation**, **mots vides**, **n-grammes**, **stemming**, **lemmatisation**, **étiquetage grammatical**.

## Les 7 cas d'usage de l'analyse de texte

| Cas d'usage | Ce qu'il fait |
|---|---|
| **Détection de langue** | Trouve la ou les langues du texte ; souvent la première étape d'un traitement |
| **Extraction de termes clés** | Repère les mots et expressions importants, pour dégager sujets et thèmes |
| **Détection d'entités** | Repère les entités nommées : lieux, personnes, dates, organisations |
| **Détection des PII** | Repère et masque les données personnelles : noms, adresses, téléphones, comptes bancaires |
| **Classification de texte** | Range les documents par catégorie, par exemple spam ou non spam |
| **Analyse de sentiment** | Une forme de classification : positif, neutre ou négatif |
| **Résumé** | Réduit le volume en gardant l'essentiel |

Toutes ces techniques répondent au même besoin : **extraire du sens** d'un texte en langage naturel, ce qui est difficile pour un ordinateur.

## La tokenisation

Le **corpus** est le corps de texte à analyser. On le découpe en **tokens**. Pour simplifier, pense à un token par mot distinct ; en réalité, un token peut être une partie de mot ou une combinaison de mots et de ponctuation.

> **Exemple du cours.** « We choose to go to the moon »

| Token | Identifiant |
|---|---|
| We | 1 |
| choose | 2 |
| to | 3 |
| go | 4 |
| to | 3 |
| the | 5 |
| moon | 6 |

« to » apparaît **deux fois** et garde l'identifiant **3**. La phrase peut donc s'écrire comme la suite de tokens `1 2 3 4 3 5 6`.

Une fois chaque token associé à une valeur, on peut **compter sa fréquence** et repérer les termes les plus utilisés, ce qui aide à trouver le sujet du texte.

## Les 6 techniques de prétraitement

### 1. Normalisation du texte

Avant de créer les tokens, on **supprime la ponctuation** et on **passe tout en minuscules**.

- **Avantage** : meilleure performance pour une analyse fondée sur la fréquence des mots.
- **Risque** : on peut perdre du sens.

> **Exemple.** « Mr Banks has worked in many banks. » Sans majuscules, on ne distingue plus la personne **Mr Banks** des **banks** où il a travaillé. Et « banks. » avec son point indique la fin de la phrase : une information qui disparaît aussi.

### 2. Suppression des mots vides

Les **mots vides** (stop words) sont exclus de l'analyse : « the », « a », « it ». Ils rendent le texte lisible mais portent peu de sens. Sans eux, l'analyse repère mieux les mots importants.

### 3. Extraction de n-grammes

On repère les expressions de **plusieurs mots**, comme « artificial intelligence » ou « natural language processing ».

| Nom | Nombre de mots | Exemple |
|---|---|---|
| **Unigramme** | 1 | « intelligence » |
| **Bigramme** | 2 | « artificial intelligence » |
| **Trigramme** | 3 | « natural language processing » |

### 4. Stemming (racinisation)

On **coupe les terminaisons** (« s », « ing », « ed ») avant de compter, pour que les mots de même racine comptent comme un seul token.

> « powering », « powered », « powerful » → **power**

### 5. Lemmatisation

On ramène chaque mot à sa **forme de base du dictionnaire**, appelée **lemme**, en utilisant des **règles linguistiques** et un **vocabulaire**. Le résultat est toujours un **mot valide**.

> « running » → **run**

### Stemming ou lemmatisation

| | Stemming | Lemmatisation |
|---|---|---|
| Méthode | **Coupe** la fin du mot | Applique des **règles linguistiques** et un vocabulaire |
| Résultat | Une racine, pas toujours un vrai mot | Un **mot valide** du dictionnaire |
| Image | Des ciseaux | Un dictionnaire |

### 6. Étiquetage grammatical (POS tagging)

On attribue à chaque token sa **catégorie grammaticale** : nom, verbe, adjectif, adverbe. La technique s'appuie sur des règles linguistiques et souvent des modèles statistiques, en tenant compte du token **et de son contexte**.

> « Le **livre** est sur la table » : nom. « Je **livre** un colis » : verbe. Seul le contexte permet de trancher.

## Toutes les techniques sur une phrase

Phrase de départ : « The cats were running in the gardens. »

| Technique | Résultat |
|---|---|
| Normalisation | the cats were running in the gardens |
| Suppression des mots vides | cats running gardens |
| Stemming | cat run garden |
| Étiquetage grammatical | cats : nom · running : verbe · gardens : nom |

Le choix des techniques dépend du **problème à résoudre**.

#### Point examen : question officielle du module — le but de la tokenisation est de découper le texte en unités plus petites pour l'analyse. Retiens aussi la différence entre stemming (on coupe) et lemmatisation (on revient au mot du dictionnaire).

## Exercices rapides

**1.** Comment appelle-t-on le corps de texte que l'on analyse ?

**2.** Tokenise « to be or not to be » et donne les identifiants.

**3.** Quelle technique supprime « le », « un », « de » ?

**4.** « machine learning » est-il un unigramme, un bigramme ou un trigramme ?

**5.** Stemming ou lemmatisation ? (a) On coupe « ing » à la fin des mots. (b) On utilise un dictionnaire pour obtenir un mot valide.

**6.** Donne un risque de la normalisation du texte.

**7.** Quelle technique indique qu'un mot est un verbe ou un nom ?

**8.** Quel cas d'usage est souvent la première étape d'un traitement de texte ?

<details>
<summary>Voir le corrigé</summary>

**1.** Un corpus.

**2.** to (1), be (2), or (3), not (4), to (1), be (2). Les mots répétés gardent leur identifiant.

**3.** La suppression des mots vides.

**4.** Un bigramme.

**5.** (a) Stemming. (b) Lemmatisation.

**6.** On peut perdre du sens : sans majuscules, « Mr Banks » ne se distingue plus de « banks ».

**7.** L'étiquetage grammatical (POS tagging).

**8.** La détection de langue.

</details>
