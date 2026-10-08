# Convolutional neural networks — les CNN

## L'essentiel

- Un **CNN** (réseau de neurones convolutif) est une architecture de **deep learning** très utilisée en vision.
- Il utilise des **filtres** pour extraire des **cartes de caractéristiques** (feature maps) numériques de l'image.
- Ces valeurs alimentent un réseau de neurones qui **prédit une étiquette**.
- Les poids des filtres ne sont pas écrits à la main : ils sont **appris pendant l'entraînement**.

## Du filtre au CNN

| | Filtre classique | CNN |
|---|---|---|
| But | Créer un **effet visuel** (retouche d'image) | **Extraire du sens** de l'image |
| Poids du noyau | Fixés à la main | **Appris** pendant l'entraînement |
| Résultat | Une nouvelle image | Une **prédiction** |

## Le parcours d'une image dans un CNN

```
Image étiquetée
   ↓
1. Couches de filtres      → cartes de caractéristiques
   ↓
2. Pooling                 → cartes plus petites
   ↓
3. Aplatissement           → un seul tableau à 1 dimension
   ↓
4. Réseau entièrement connecté
   ↓
5. Couche de sortie (softmax) → probabilités par classe
```

| Étape | Ce qui se passe |
|---|---|
| **Entrée** | Des images avec des étiquettes connues (0 : pomme, 1 : banane, 2 : orange) |
| **Filtres** | Une ou plusieurs couches de filtres extraient des caractéristiques. Les noyaux démarrent avec des **poids aléatoires** et produisent des **cartes de caractéristiques** |
| **Pooling** | Des couches réduisent la taille des cartes pour ne garder que les caractéristiques visuelles **essentielles** |
| **Aplatissement** | Les cartes sont mises à plat en un tableau à **une seule dimension** |
| **Réseau entièrement connecté** | Il reçoit ces valeurs |
| **Sortie** | Une fonction **softmax** (ou similaire) donne une **probabilité par classe**, par exemple `[0.2, 0.5, 0.3]` |

> **Lire la sortie.** `[0.2, 0.5, 0.3]` avec les classes 0 : pomme, 1 : banane, 2 : orange. La plus forte probabilité est 0,5 en position 1 : le modèle prédit **banane**.

## L'entraînement

1. Les poids des filtres sont d'abord **aléatoires**.
2. Le modèle prédit des probabilités, par exemple `[0.2, 0.5, 0.3]`.
3. On compare à la vraie réponse. Pour une banane (classe 1) : `[0.0, 1.0, 0.0]`.
4. L'écart sert à calculer la **perte** (loss).
5. On **modifie les poids** du réseau entièrement connecté **et** des noyaux des filtres pour réduire la perte.
6. On recommence sur plusieurs **époques** (epochs), jusqu'à obtenir les meilleurs poids.

Les poids sont alors **enregistrés** : le modèle peut prédire l'étiquette de nouvelles images.

## Le vocabulaire

| Terme | Définition |
|---|---|
| **Carte de caractéristiques** (feature map) | Tableau de valeurs produit par un filtre |
| **Pooling** | Réduction de la taille des cartes |
| **Softmax** | Fonction qui donne une probabilité par classe |
| **Perte** (loss) | Écart entre la prédiction et la vraie réponse |
| **Époque** (epoch) | Un passage complet de l'entraînement |

Un vrai CNN contient plusieurs couches de filtres et d'autres couches de traitement. L'idée à retenir est simple : **les filtres extraient des caractéristiques numériques, et un réseau de neurones s'en sert pour prédire une étiquette**.

#### Point examen : question officielle du module — le rôle principal des filtres dans un CNN de classification est d'extraire des caractéristiques numériques des images pour un réseau de neurones. Ce n'est ni un effet visuel, ni une compression.

## Exercices rapides

**1.** Que signifie CNN ?

**2.** Que produisent les filtres d'un CNN ?

**3.** Quelle valeur ont les poids des filtres au début de l'entraînement ?

**4.** À quoi sert le pooling ?

**5.** La sortie est `[0.1, 0.2, 0.7]` avec 0 : pomme, 1 : banane, 2 : orange. Quelle est la prédiction ?

**6.** Pour une image de pomme (classe 0), quelle est la sortie idéale ?

**7.** Qu'est-ce que la perte ?

**8.** Quels poids sont ajustés pendant l'entraînement ?

<details>
<summary>Voir le corrigé</summary>

**1.** Convolutional neural network, réseau de neurones convolutif.

**2.** Des cartes de caractéristiques (feature maps).

**3.** Des valeurs aléatoires.

**4.** À réduire la taille des cartes de caractéristiques en gardant l'essentiel.

**5.** Orange (probabilité 0,7).

**6.** `[1.0, 0.0, 0.0]`.

**7.** L'écart entre les probabilités prédites et la vraie classe.

**8.** Ceux du réseau entièrement connecté et ceux des noyaux des filtres.

</details>
