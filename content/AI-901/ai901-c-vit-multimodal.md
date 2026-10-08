# Vision transformers and multimodal models — ViT et modèles multimodaux

## L'essentiel

- Les **CNN** sont au cœur de la vision depuis des années ; ils servent aussi de base à la détection d'objets.
- Le **transformer**, né dans le traitement du langage, a été adapté aux images : c'est le **vision transformer (ViT)**.
- Un ViT découpe l'image en **patchs** et utilise l'**attention** pour créer des **embeddings** de caractéristiques visuelles.
- Un **modèle multimodal** réunit un encodeur de langage et un encodeur de vision dans un **même espace vectoriel**.

## Rappel : le transformer pour le langage

- Les **tokens** (mots ou morceaux de phrases) sont codés en **embeddings**, des tableaux de nombres.
- L'**attention** donne à chaque embedding des valeurs qui reflètent l'usage du token **dans son contexte**.
- Les tokens utilisés dans des contextes proches ont des vecteurs **d'orientation proche**.

Cela permet l'analyse de texte, la traduction, la génération de langage.

## Le vision transformer (ViT)

Même idée, appliquée aux images.

| | Transformer de langage | Vision transformer |
|---|---|---|
| Unité de base | **Token** de texte | **Patch** de pixels |
| Technique | Attention | **La même** attention |
| Ce que codent les embeddings | Caractéristiques **linguistiques** | Caractéristiques **visuelles** : couleur, forme, contraste, texture |
| Résultat | Vocabulaire linguistique | « Carte » de caractéristiques visuelles |

Le ViT extrait des **patchs** de pixels de l'image et génère un **vecteur** à partir de leurs valeurs. L'attention détermine ensuite les **relations contextuelles entre les patchs**.

> **Exemple du cours.** Les caractéristiques visuelles d'un **chapeau** sont liées à celles d'une **tête**, parce qu'on les voit souvent ensemble. Le modèle ne sait pas ce qu'est un « chapeau » ou une « tête », mais il **déduit une relation** entre leurs caractéristiques visuelles.

## Le modèle multimodal

- Un transformer de langage crée un **vocabulaire linguistique**.
- Un vision transformer crée un **vocabulaire visuel**.

Si les données d'entraînement contiennent des **images avec leur description texte**, on combine les deux encodeurs. Une technique appelée **cross-model attention** crée une **représentation spatiale unifiée** des embeddings.

```
Encodeur de langage ─┐
                     ├─→ espace vectoriel partagé ─→ description de l'image
Encodeur de vision  ─┘
```

Le modèle relie ainsi les **mots** aux **caractéristiques visuelles**. Il peut décrire une image **jamais vue** : il reconnaît les caractéristiques visuelles, puis cherche dans l'espace partagé le langage associé.

> **Exemple du cours.** Photo → « A person in a park with a hat and a backpack »

## CNN ou ViT

| | CNN | ViT |
|---|---|---|
| Outil principal | **Filtres** convolutifs | **Attention** sur des patchs |
| Produit | Cartes de caractéristiques | Embeddings contextuels |
| Origine | Vision | Traitement du langage |
| Usage typique | Classification, base de la détection d'objets | Modèles multimodaux, description d'images |

## L'évolution des modèles de vision

```
Classifieurs statistiques  →  CNN  →  Transformers multimodaux
```

#### Point examen : question officielle du module — un vision transformer est un modèle qui utilise l'attention pour traiter des patchs d'image et créer des embeddings contextuels. Ce n'est pas un outil qui applique des filtres : ça, c'est le filtrage ou le CNN.

## Exercices rapides

**1.** Que signifie ViT ?

**2.** Quelle est l'unité de base traitée par un ViT ?

**3.** Quelle technique un ViT partage-t-il avec les modèles de langage ?

**4.** Cite trois caractéristiques visuelles codées dans les embeddings d'un ViT.

**5.** Que réunit un modèle multimodal ?

**6.** Quelle technique crée la représentation unifiée dans un modèle multimodal ?

**7.** CNN ou ViT ? (a) Utilise des filtres convolutifs. (b) Découpe l'image en patchs. (c) Vient du traitement du langage.

**8.** Pourquoi un modèle multimodal peut-il décrire une image qu'il n'a jamais vue ?

<details>
<summary>Voir le corrigé</summary>

**1.** Vision transformer.

**2.** Le patch de pixels.

**3.** L'attention.

**4.** Trois parmi : couleur, forme, contraste, texture.

**5.** Un encodeur de langage et un encodeur de vision, dans un même espace vectoriel.

**6.** La cross-model attention.

**7.** (a) CNN. (b) ViT. (c) ViT.

**8.** Parce qu'il reconnaît les caractéristiques visuelles et cherche dans l'espace vectoriel partagé le langage qui leur est associé.

</details>
