# Images and image processing — pixels et filtres

## L'essentiel

- Pour un ordinateur, une image est un **tableau de valeurs numériques de pixels**.
- Chaque pixel vaut de **0 (noir)** à **255 (blanc)**.
- Une image en niveaux de gris a **1 couche** ; une image couleur en a **3**, les **canaux** rouge, vert, bleu (**RGB**).
- Un **filtre** modifie les pixels à l'aide d'un **noyau** (kernel) que l'on fait glisser sur l'image : c'est la **convolution**.

## Une image est un tableau de nombres

```
 0   0   0   0   0   0   0
 0   0   0   0   0   0   0
 0   0  255 255 255  0   0
 0   0  255 255 255  0   0
 0   0  255 255 255  0   0
 0   0   0   0   0   0   0
 0   0   0   0   0   0   0
```

Ce tableau de 7 lignes et 7 colonnes est une image de **7x7 pixels** : c'est sa **résolution**. Elle montre un carré blanc sur fond noir.

| Valeur | Couleur |
|---|---|
| 0 | Noir |
| 255 | Blanc |
| Entre les deux | Nuances de gris |

## Les images en couleur : 3 canaux

Une image couleur superpose trois couches de pixels : **rouge**, **vert**, **bleu**.

| Couleur obtenue | Rouge | Vert | Bleu |
|---|---|---|---|
| **Violet** | 150 | 0 | 255 |
| **Jaune** | 255 | 255 | 0 |

Dans l'exemple du cours, le fond de l'image est violet et le carré central est jaune.

| | Niveaux de gris | Couleur |
|---|---|---|
| Nombre de couches | 1 | 3 (canaux RGB) |
| Dimensions du tableau | 2 (lignes, colonnes) | 3 |

## Les filtres

Un filtre est défini par un ou plusieurs tableaux de valeurs appelés **noyaux** (filter kernels). Exemple de noyau 3x3 :

```
-1 -1 -1
-1  8 -1
-1 -1 -1
```

Le noyau est **convolué** sur l'image : on le pose sur un bloc de 3x3 pixels, on calcule une **somme pondérée**, on écrit le résultat dans une nouvelle image, puis on décale le noyau d'un pixel.

### Le calcul pas à pas

**Position 1** : coin supérieur gauche. Un seul pixel du bloc vaut 255, en bas à droite.

```
(0 x -1) + (0 x -1) + (0 x -1) +
(0 x -1) + (0 x  8) + (0 x -1) +
(0 x -1) + (0 x -1) + (255 x -1) = -255
```

**Position 2** : on décale d'un pixel vers la droite. Deux pixels du bloc valent 255.

```
(0 x -1) + (0 x -1)   + (0 x -1) +
(0 x -1) + (0 x  8)   + (0 x -1) +
(0 x -1) + (255 x -1) + (255 x -1) = -510
```

Le nouveau tableau commence donc par `-255  -510`. On répète jusqu'à avoir parcouru toute l'image.

### Deux ajustements

| Problème | Solution |
|---|---|
| Certaines valeurs sortent de la plage 0 à 255 | Elles sont **ajustées** pour rentrer dans la plage |
| Le bord extérieur ne peut pas être calculé | On applique une valeur de **remplissage** (padding), en général **0** |

### Le résultat

Ce filtre fait ressortir les **contours** des formes. C'est un **filtre de Laplace**.

> **Pourquoi ça marche.** Au milieu du carré blanc, les 9 pixels valent 255 : (255 x 8) - (8 x 255) = **0**. Zone uniforme, donc rien. Sur un bord, le pixel central diffère de ses voisins : le résultat est fort. Le filtre ne garde que les endroits où la valeur **change**.

Comme le filtre est convolué sur l'image, on parle de **filtrage convolutif**. D'autres filtres produisent du **flou**, de la **netteté**, une **inversion des couleurs**.

#### Point examen : question officielle du module — la vision par ordinateur repose sur la manipulation et l'analyse des pixels. Retiens : 0 = noir, 255 = blanc, 3 canaux RGB, et le filtre de Laplace fait ressortir les contours.

## Exercices rapides

**1.** Quelle valeur représente le noir ? Le blanc ?

**2.** Combien de canaux possède une image couleur, et lesquels ?

**3.** Quelle couleur donne Rouge 255, Vert 255, Bleu 0 ?

**4.** Comment appelle-t-on le tableau de valeurs qui définit un filtre ?

**5.** Avec le noyau de Laplace du cours, calcule le résultat pour un bloc 3x3 dont tous les pixels valent 100.

**6.** Avec le même noyau, calcule le résultat pour ce bloc :

```
0    0    0
0   255  255
0   255  255
```

**7.** Que fait le filtre de Laplace sur une image ?

**8.** Quelle valeur de remplissage applique-t-on en général sur le bord ?

<details>
<summary>Voir le corrigé</summary>

**1.** 0 pour le noir, 255 pour le blanc.

**2.** Trois : rouge, vert, bleu (RGB).

**3.** Du jaune.

**4.** Un noyau (filter kernel).

**5.** (100 x 8) - (8 x 100) = 0. Une zone uniforme donne zéro.

**6.** Centre : 255 x 8 = 2040. Trois voisins à 255 : 3 x -255 = -765. Total : 2040 - 765 = 1275, une valeur forte, car on est sur un coin du carré. Elle sera ensuite ajustée à la plage 0 à 255.

**7.** Il fait ressortir les contours des objets.

**8.** Zéro.

</details>
