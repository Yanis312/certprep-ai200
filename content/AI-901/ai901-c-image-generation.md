# Image generation — la génération d'images

## L'essentiel

- La même architecture **multimodale** qui décrit une image peut aussi **créer une image** à partir d'un prompt.
- La plupart des modèles récents utilisent la **diffusion**.
- La diffusion part de **pixels aléatoires** et **retire le bruit** étape par étape.
- Certains modèles appliquent le même principe à la **vidéo**.

## Les deux sens d'un modèle multimodal

| Sens | Entrée | Sortie |
|---|---|---|
| Analyse | Image | Texte (description) |
| **Génération** | Texte (prompt) | **Image** |

En associant les caractéristiques visuelles au langage, un modèle de synthèse d'image peut partir d'une description et produire l'image ou la vidéo demandée.

## La diffusion

1. Le **prompt** sert à identifier un ensemble de **caractéristiques visuelles** liées, à combiner.
2. On part d'un ensemble **aléatoire** de valeurs de pixels : du **bruit**.
3. Le modèle **retire du bruit** pour faire apparaître une structure.
4. Après chaque itération, il **compare l'image au prompt**.
5. On répète jusqu'à obtenir l'image finale.

> **Exemple du cours.** Prompt : « A dog carrying a stick in its mouth »

```
Bruit pur  →  formes floues  →  silhouette d'un chien  →  chien net avec un bâton
```

> **Une image pour retenir.** Un sculpteur part d'un bloc brut et enlève de la matière jusqu'à faire apparaître la statue. La diffusion enlève du bruit jusqu'à faire apparaître l'image.

## La génération de vidéo

Même technique, avec deux contraintes en plus :

| Contrainte | Exemple |
|---|---|
| **Comportement physique** des objets | Le chien marche avec les pattes au sol |
| **Progression dans le temps** | La vidéo montre une suite d'actions logique |

## La vision, d'un coup d'œil

| Capacité | Technique |
|---|---|
| Modifier une image | Filtres |
| Classer une image | CNN |
| Décrire une image | Modèle multimodal (ViT + langage) |
| **Créer** une image | **Diffusion** |

#### Point examen : diffusion = partir de pixels aléatoires et retirer le bruit de façon itérative, en se guidant sur le prompt. C'est le mot-clé à associer à la génération d'images.

## Exercices rapides

**1.** Quelle technique la plupart des modèles de génération d'images utilisent-ils ?

**2.** De quoi part le processus de diffusion ?

**3.** Que fait le modèle à chaque itération ?

**4.** À quoi l'image est-elle comparée après chaque itération ?

**5.** Quelles deux contraintes s'ajoutent pour générer une vidéo ?

**6.** Quelle architecture permet à la fois de décrire et de générer des images ?

<details>
<summary>Voir le corrigé</summary>

**1.** La diffusion.

**2.** D'un ensemble aléatoire de valeurs de pixels, c'est-à-dire du bruit.

**3.** Il retire du bruit pour créer de la structure.

**4.** Au prompt.

**5.** Le comportement physique des objets et la progression dans le temps.

**6.** L'architecture multimodale.

</details>
