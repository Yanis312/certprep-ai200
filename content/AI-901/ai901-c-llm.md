# Introduction et Large language models (LLM)

## L'essentiel

- Un **LLM** est entraîné à produire une **complétion** à partir d'un **prompt**. C'est une version très puissante de la **saisie prédictive** de ton téléphone.
- Il n'y a pas de magie : seulement des mathématiques issues des statistiques, de la science des données et du machine learning.
- Quatre notions à maîtriser : **tokenisation**, **embeddings**, **transformer**, **attention**.
- Le modèle prédit le **token suivant le plus probable**, l'ajoute à la suite, et recommence.

## L'idée de départ

Prends la phrase : *I heard a dog bark loudly at a cat*.

Si tu n'entends que « I heard a dog ... », tu devines que la suite est probablement « bark ». Tu y arrives parce que :

- tu as un **grand vocabulaire** ;
- tu connais les **structures** de la langue : comment les mots s'enchaînent ;
- tu comprends le **sens** : ce qu'on « entend » est un son, et un chien fait certains sons.

Les mots « heard » et « dog » sont des **indices forts** pour deviner la suite. Entraîner un LLM, c'est lui donner ces trois mêmes capacités.

## Étape 1 — La tokenisation

Un LLM ne découpe pas le texte en mots, mais en **tokens**.

Un **token** peut être :

- un **mot** ;
- un **sous-mot**, comme « un » dans « unbelievable » et « unlikely » ;
- un signe de **ponctuation** ;
- une autre suite de caractères fréquente.

La **tokenisation** consiste à découper le texte d'entraînement en tokens distincts et à donner à chacun un **identifiant entier unique**.

| Token | Identifiant |
|---|---|
| I | 1 |
| heard | 2 |
| a | 3 |
| dog | 4 |
| bark | 5 |
| loudly | 6 |
| at | 7 |
| a | 3 (déjà attribué) |
| cat | 8 |

Remarque le second « a » : il garde l'identifiant **3**. Un token = un identifiant, quel que soit le nombre de fois où il apparaît.

Les LLM récents ont des vocabulaires de **centaines de milliers de tokens**.

## Étape 2 — Des vecteurs aux embeddings

Un identifiant ne dit rien du sens. On associe donc à chaque token un **vecteur** : un tableau de plusieurs valeurs numériques, comme `[1, 23, 45]`.

Chaque valeur est un **élément** ou une **dimension**. Ces dimensions servent à coder les caractéristiques **linguistiques et sémantiques** du token.

Au départ, les valeurs sont **aléatoires**. L'entraînement les transforme en vecteurs qui portent du sens. Comme ce sens y est « incrusté », on les appelle des **embeddings**.

| Avant l'entraînement | Après l'entraînement |
|---|---|
| Vecteur initial, valeurs aléatoires | **Embedding** : vecteur qui capture le sens du token |

### Des tokens proches ont des vecteurs proches

| Token | Embedding (exemple simplifié à 3 dimensions) |
|---|---|
| dog | [10, 3, 2] |
| cat | [10, 3, 1] |
| puppy | [5, 3, 2] |
| car | [-2, -2, 1] |
| skateboard | [-3, -2, 2] |

Les tokens utilisés dans des **contextes similaires** ont des vecteurs de **direction similaire**. « dog » et « puppy » pointent à peu près dans la même direction, pas très loin de « cat », mais très loin de « skateboard » ou « car ».

On mesure cette proximité avec la **similarité cosinus** des vecteurs.

L'exemple utilise 3 dimensions pour qu'on puisse le dessiner. En réalité, les embeddings ont des **milliers** de dimensions.

## Étape 3 — Le transformer

C'est le modèle qui fabrique les embeddings, puis s'en sert pour prédire. Il a deux **blocs**.

| Bloc | Rôle |
|---|---|
| **Encodeur** | **Crée les embeddings**, grâce à l'**attention** |
| **Décodeur** | Utilise les embeddings pour déterminer le **token suivant le plus probable** d'une suite commencée par un prompt |

```
Texte ──► tokens ──► ENCODEUR (attention) ──► embeddings ──► DÉCODEUR (attention) ──► token suivant
```

### L'encodage positionnel

Les vecteurs entrent dans le transformer avec un **encodage positionnel**, qui indique **où** se trouve chaque token dans la suite. C'est nécessaire parce que l'**ordre** des tokens compte pour leur relation.

> **Exemple.** « Le chien mord le facteur » et « Le facteur mord le chien » contiennent les mêmes tokens. Seule la position change le sens.

## Étape 4 — L'attention

Une **couche d'attention** examine chaque token **dans son contexte** et détermine comment il est **influencé par les tokens qui l'entourent**.

Les tokens voisins reçoivent un **poids** qui reflète leur influence. Ces poids servent à calculer les valeurs de l'embedding.

> **Exemple du cours.** Pour le token « bark » dans « I heard a dog bark », les tokens « heard » et « dog » reçoivent **plus de poids** que « I » ou « a », car ce sont des indices plus forts.

Au début, le modèle ne « sait » pas quels tokens s'influencent. En voyant de plus en plus de texte, il apprend peu à peu quels tokens apparaissent souvent ensemble.

| Variante | Rôle |
|---|---|
| **Attention multi-têtes** (multi-head) | Évalue plusieurs éléments du token **en parallèle**, pour aller plus vite |
| **Attention masquée** (masked) | Pendant l'entraînement du décodeur, **ignore les tokens situés après** le token courant |

## Étape 5 — Prédire la suite

Le décodeur prédit **un token à la fois**.

1. Il regarde les tokens de la suite **jusqu'ici**.
2. L'attention attribue des poids.
3. Un réseau de neurones détermine le candidat **le plus probable**.
4. Ce token est **ajouté à la suite**.
5. On **recommence**, jusqu'à ce que le décodeur prédise la **fin** de la suite.

> **Exemple.** Pour « When my dog was a ... », le modèle évalue les tokens présents, pondère par l'attention, et prédit que le token suivant le plus probable est « puppy », plutôt que « cat » ou « skateboard ».

### Comment le décodeur apprend

Pendant l'entraînement, on connaît déjà la suite complète. Avec l'**attention masquée**, le modèle ne voit que ce qui **précède**. Il prédit le token suivant, le compare au **vrai** token, et ajuste ses poids pour réduire l'erreur.

## LLM et SLM

Les **SLM** (small language models) sont les « cousins plus compacts » des LLM. Les deux capturent les relations linguistiques et sémantiques entre les mots d'un vocabulaire.

## Le vocabulaire en un tableau

| Terme | Définition courte |
|---|---|
| **Prompt** | L'entrée donnée au modèle |
| **Complétion** | Ce que le modèle génère en réponse |
| **Token** | L'unité de texte : mot, sous-mot, ponctuation |
| **Tokenisation** | Découper le texte en tokens |
| **Vecteur** | Un tableau de nombres |
| **Embedding** | Un vecteur qui capture le **sens** d'un token |
| **Transformer** | L'architecture du modèle, avec encodeur et décodeur |
| **Attention** | Le mécanisme qui examine la relation entre un token et ceux qui l'entourent |
| **Similarité cosinus** | La mesure de proximité entre deux vecteurs |

#### Point examen : quatre questions officielles portent sur cette unité — un LLM génère du texte proche du langage humain ; la tokenisation découpe le texte en unités plus petites ; les embeddings sont des représentations vectorielles des tokens qui capturent leur sens ; une couche d'attention examine les relations entre chaque token et ceux qui l'entourent.

## Exercices rapides

**1.** À quoi sert la tokenisation ?

**2.** Donne trois choses qu'un token peut être.

**3.** Qu'est-ce qu'un embedding ?

**4.** Parmi « chat », « chaton » et « tracteur », quels deux tokens auront les embeddings les plus proches ? Avec quelle mesure le vérifie-t-on ?

**5.** Quel est le rôle de l'encodeur ? Et du décodeur ?

**6.** Que fait une couche d'attention ?

**7.** Pourquoi faut-il un encodage positionnel ?

**8.** Dans « I heard a dog bark », quels tokens reçoivent le plus de poids pour prédire « bark » ?

**9.** Comment le modèle génère-t-il une phrase entière ?

**10.** Que fait l'attention masquée ?

<details>
<summary>Voir le corrigé</summary>

**1.** À découper le texte en unités plus petites, les tokens, chacune avec un identifiant unique.

**2.** Trois parmi : un mot, un sous-mot, un signe de ponctuation, une suite de caractères fréquente.

**3.** Une représentation vectorielle d'un token, qui capture son sens.

**4.** « chat » et « chaton ». On le vérifie avec la similarité cosinus.

**5.** L'encodeur crée les embeddings. Le décodeur s'en sert pour déterminer le token suivant le plus probable.

**6.** Elle examine chaque token dans son contexte et détermine comment il est influencé par les tokens qui l'entourent.

**7.** Parce que l'ordre des tokens dans la suite compte pour leur relation.

**8.** « heard » et « dog ».

**9.** Un token à la fois : il prédit le plus probable, l'ajoute à la suite et recommence, jusqu'à prédire la fin.

**10.** Pendant l'entraînement du décodeur, elle ignore les tokens situés après le token courant.

</details>
