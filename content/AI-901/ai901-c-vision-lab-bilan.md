# Lab et bilan — concepts de la vision par ordinateur

## Le lab : explorer la vision

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne dans le navigateur.
- But : voir comment un prompt peut combiner **texte et image**.

### Les étapes

1. Ouvre `https://aka.ms/chat-playground` et attends le chargement du modèle (**Microsoft Phi 3.5 Mini**).
2. Télécharge `images.zip` depuis `https://aka.ms/ai-images` et extrais-le.
3. Dans le panneau de gauche, section **Vision**, active **Image analysis** et attends le chargement du modèle de vision.
4. Dans **Instructions** :

```
You are an AI assistant that helps people identify vintage computer hardware.
```

5. Clique sur **Upload image** (📎) et choisis une image.
6. Envoie un prompt :

```
What can you tell me about this?
```

7. Recommence avec les autres images : `What is this?`, `Tell me about this.`

### Ce qui se passe en coulisses

```
Image → MobileNetV2 (classification) → étiquette
                                           ↓
                       prompt + étiquette → Phi 3.5 Mini → réponse
```

Le modèle **MobileNetV2** détermine le sujet probable de l'image. Ce résultat est **ajouté au prompt** envoyé au modèle de langage Phi.

### Ce qu'il faut retenir du lab

- Ici, ce sont **deux petits modèles** mis bout à bout : la qualité des réponses varie beaucoup.
- Un vrai **modèle multimodal** traite l'image et le texte ensemble.
- **Microsoft Foundry** propose des modèles multimodaux qui interprètent des images bien plus complexes.
- L'outil **Azure Content Understanding** permet aussi d'analyser des images.

## Le module en 10 lignes

1. La vision par ordinateur repose sur l'analyse et la manipulation des **pixels**.
2. Un pixel vaut de **0 (noir)** à **255 (blanc)** ; une image couleur a **3 canaux RGB**.
3. **Classification** : une étiquette pour l'image.
4. **Détection d'objets** : objets + **cadres englobants**.
5. **Segmentation sémantique** : une classe pour **chaque pixel**.
6. **Analyse contextuelle** : description et tags, par un modèle multimodal.
7. Un **filtre** applique un **noyau** par **convolution** ; le filtre de **Laplace** fait ressortir les contours.
8. Un **CNN** utilise des filtres pour extraire des **cartes de caractéristiques**, puis prédit une étiquette.
9. Un **ViT** applique l'**attention** à des **patchs** d'image et crée des embeddings contextuels.
10. La **diffusion** génère une image en retirant le bruit de pixels aléatoires.

## L'évolution des modèles

```
Classifieurs statistiques  →  CNN  →  Transformers multimodaux
                                       (interprètent ET génèrent des images)
```

## Qui fait quoi

| Besoin | Réponse |
|---|---|
| Faire ressortir les contours d'une image | Filtre de Laplace |
| Dire ce que montre une image | Classification (CNN) |
| Localiser plusieurs objets | Détection d'objets |
| Détourer au pixel près | Segmentation sémantique |
| Rédiger une légende | Modèle multimodal |
| Créer une image à partir d'un texte | Diffusion |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| La vision par ordinateur repose sur la manipulation et l'analyse de quelles valeurs dans une image ? | Les **pixels** |
| Quel est le rôle principal des filtres dans un CNN utilisé pour la classification d'image ? | **Extraire des caractéristiques numériques** des images pour un réseau de neurones |
| Quelle description correspond le mieux à un Vision Transformer (ViT) ? | Un modèle qui utilise l'**attention** pour traiter des **patchs** d'image et créer des **embeddings contextuels** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : les horodatages et les noms de fichiers ne sont pas des pixels. Dans un CNN, les filtres ne servent ni à embellir l'image ni à la compresser. Un ViT n'est pas un outil de filtres, ni un agent qui convertit un LLM.

#### Point examen : le guide d'étude demande de décrire les capacités de vision par ordinateur. Sache associer chaque tâche à son résultat, et chaque architecture (CNN, ViT, diffusion) à son mot-clé : filtres, attention sur des patchs, retrait du bruit.

## Exercices rapides

**1.** Dans le lab, quel modèle identifie le sujet de l'image ?

**2.** Dans le lab, comment l'information de l'image arrive-t-elle au modèle de langage ?

**3.** Associe : (a) filtres, (b) attention sur des patchs, (c) retrait du bruit — avec CNN, diffusion, ViT.

**4.** Classe du plus ancien au plus récent : CNN, transformers multimodaux, classifieurs statistiques.

**5.** Quelle tâche donne un cadre englobant, et laquelle donne un masque de pixels ?

<details>
<summary>Voir le corrigé</summary>

**1.** MobileNetV2.

**2.** Le résultat de la classification est ajouté au prompt envoyé au modèle Phi.

**3.** (a) CNN. (b) ViT. (c) Diffusion.

**4.** Classifieurs statistiques, CNN, transformers multimodaux.

**5.** La détection d'objets donne un cadre englobant ; la segmentation sémantique donne un masque de pixels.

</details>
