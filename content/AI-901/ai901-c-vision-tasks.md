# Introduction et Computer vision tasks — les tâches de vision

## L'essentiel

- La **vision par ordinateur** permet à une application d'IA de traiter des **images**, des **vidéos** ou un **flux caméra**.
- Quatre tâches à distinguer : **classification d'image**, **détection d'objets**, **segmentation sémantique**, **analyse contextuelle**.
- Chacune est plus précise que la précédente : une étiquette, puis des boîtes, puis des pixels, puis une description.

## À quoi ça sert

| Scénario | Ce que fait la vision |
|---|---|
| Véhicule autonome | Détecter la circulation et les piétons, et réagir |
| Caisse intelligente | Reconnaître les produits du panier avec des caméras |
| Sonnette connectée | Détecter une personne devant la porte |

Un ordinateur n'a pas d'yeux, mais il sait traiter des images : c'est ce qui permet d'imiter la perception visuelle humaine.

## Les 4 tâches

### 1. Classification d'image

Un modèle, entraîné avec un grand nombre d'images **étiquetées**, prédit **une étiquette de texte** d'après le contenu de l'image.

> **Exemple du cours.** À la caisse d'une épicerie, le client pose un fruit sur la balance. La caméra l'identifie (pomme, orange, banane) et le prix est calculé selon le poids.

Réponse à la question : **qu'est-ce que c'est ?**

### 2. Détection d'objets

Le modèle examine plusieurs régions de l'image pour trouver **chaque objet et son emplacement**. Le résultat donne les objets détectés et les coordonnées de leur **cadre englobant** (bounding box), un rectangle.

> **Exemple.** La caisse scanne plusieurs fruits à la fois et identifie chacun.

Réponse à la question : **quels objets, et où ?**

### 3. Segmentation sémantique

Le modèle classe **chaque pixel** selon l'objet auquel il appartient. La localisation est **beaucoup plus précise** qu'avec un rectangle : on obtient un **masque** qui suit le contour de l'objet.

Réponse à la question : **quels pixels appartiennent à quel objet ?**

### 4. Analyse contextuelle d'image

Les modèles **multimodaux** récents apprennent les relations entre les objets d'une image et le **texte** qui les décrit. Ils interprètent l'image : objets, **activités**, puis génèrent une **description** ou proposent des **tags**.

> **Exemple du cours.** Photo → « A person eating an apple. »

Réponse à la question : **que se passe-t-il dans cette image ?**

## Le tableau à retenir

| Tâche | Résultat | Précision de la localisation |
|---|---|---|
| **Classification** | Une étiquette pour l'image | Aucune |
| **Détection d'objets** | Étiquettes + **cadres englobants** | Rectangle |
| **Segmentation sémantique** | Étiquette pour **chaque pixel** | Contour exact |
| **Analyse contextuelle** | **Description** ou tags | Sens global |

> **Une même photo, quatre résultats.** Une photo d'une orange, d'une pomme et d'une banane sur une table :
>
> - Classification : « fruits ».
> - Détection : trois rectangles, un par fruit.
> - Segmentation : trois masques colorés qui épousent chaque fruit.
> - Analyse contextuelle : « Trois fruits posés sur une table. »

#### Point examen : repère le mot-clé du scénario. « Étiquette » ou « catégorie » = classification. « Emplacement », « cadre », « plusieurs objets » = détection. « Pixel » ou « masque » = segmentation. « Légende », « description », « tags » = analyse contextuelle.

## Exercices rapides

**1.** Quelle tâche renvoie une seule étiquette pour toute l'image ?

**2.** Comment s'appelle le rectangle qui entoure un objet détecté ?

**3.** Quelle tâche classe chaque pixel ?

**4.** Quelle tâche choisir ? (a) Dire si une photo montre un chat ou un chien. (b) Compter et localiser les voitures d'un parking. (c) Détourer précisément une tumeur sur une radio. (d) Écrire une légende pour une photo.

**5.** Quel type de modèle réalise l'analyse contextuelle d'image ?

**6.** De quoi un modèle de classification a-t-il besoin pour être entraîné ?

<details>
<summary>Voir le corrigé</summary>

**1.** La classification d'image.

**2.** Un cadre englobant (bounding box).

**3.** La segmentation sémantique.

**4.** (a) Classification. (b) Détection d'objets. (c) Segmentation sémantique. (d) Analyse contextuelle.

**5.** Un modèle multimodal.

**6.** D'un grand volume d'images, chacune étiquetée avec le bon nom.

</details>
