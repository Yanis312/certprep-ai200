# Image generation models — générer des images

## L'essentiel

- Les modèles de vision associent une image à du texte. Les modèles de **génération d'images** font l'**inverse** : ils créent une image à partir d'une description.
- Foundry propose des modèles **text-to-image**. Microsoft recommande la famille **GPT-Image-1**, en particulier **GPT-Image-1.5**, pour les nouveaux projets.
- Les trois modèles : **GPT-Image-1.5** (le plus avancé), **GPT-Image-1** (généraliste), **GPT-Image-1-Mini** (léger et économique).
- Par le code : l'**API Responses** avec l'outil `image_generation`, ou l'API **Images**.
- L'image revient encodée en **base64**, qu'il faut décoder pour l'enregistrer.

## Vision et génération : deux sens

```
ANALYSE (multimodal)        image  ──►  texte
GÉNÉRATION (text-to-image)  texte  ──►  image
```

## Les modèles de la famille GPT-Image

| Modèle | Position | Points forts | Pour quoi |
|---|---|---|---|
| **GPT-Image-1.5** | Le plus récent et le plus avancé | Haute fidélité, bon respect du prompt, meilleure **constance** d'une itération à l'autre. Text-to-image, image-to-image, **édition précise** | Image de marque, marketing, design, quand l'exactitude visuelle compte |
| **GPT-Image-1** | Généraliste et puissant, successeur des modèles **DALL-E** | Text-to-image, **variations**, édition précise. Largement pris en charge dans les outils et API Foundry | Applications créatives, prototypage, génération de contenu visuel |
| **GPT-Image-1-Mini** | Version **légère et économique** | Mêmes tâches de base, optimisé pour une **latence** ou un **coût** réduits | Expérimentation, outils internes, génération **à gros volume** |

Tous ces modèles peuvent être :

- **déployés** dans une ressource Foundry (Azure OpenAI) ;
- **testés** dans le playground Foundry ;
- **appelés par programme** avec l'API Responses ou les API de génération d'images.

### Modèles tiers

On trouve aussi des modèles d'autres éditeurs. **FLUX**, par exemple, est une famille de modèles de génération d'images de **Black Forest Labs**, conçue pour des images photoréalistes et de styles variés.

## Choisir un modèle

| Besoin | Modèle |
|---|---|
| Visuels de campagne où la marque doit être respectée | GPT-Image-1.5 |
| Prototyper des illustrations pour une application | GPT-Image-1 |
| Générer 50 000 vignettes au moindre coût | GPT-Image-1-Mini |

## Dans le playground

Tu déploies un modèle, tu **décris** l'image voulue, et une image correspondante est générée.

## Par le code

Il faut :

- une **ressource Foundry** ;
- un **modèle déployé** : son nom de déploiement est ce que l'on passe à `model` ;
- une **authentification** : clé d'API ou Microsoft Entra ID.

### Base64

Les images sont des fichiers **binaires** (des octets bruts). JSON et les URL ne contiennent que du **texte**. L'encodage **base64** convertit des données binaires en texte ASCII sûr, ce qui permet de les placer dans du JSON ou une URL.

### Avec l'API Responses

```python
import os
import base64
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["FOUNDRY_KEY"],
    base_url=os.environ["ENDPOINT"],
)

prompt = "A modern flat illustration of a robot holding a potted plant, clean vector style, pastel colors."

response = client.responses.create(
    model=os.environ["MODEL_NAME"],          # le nom de ton déploiement
    input=prompt,
    tools=[{"type": "image_generation"}],
)

image_base64 = next(
    item.result for item in response.output
    if item.type == "image_generation_call"
)

with open("foundry_generated.png", "wb") as f:
    f.write(base64.b64decode(image_base64))
```

| Étape | Code |
|---|---|
| Demander une image | `tools=[{"type": "image_generation"}]` |
| Retrouver le résultat | L'élément de `response.output` dont le type est `image_generation_call` |
| Décoder | `base64.b64decode(image_base64)` |
| Enregistrer | Écriture du fichier en mode binaire (`"wb"`) |

### Avec l'API Images

Le lab montre une autre façon, avec la classe **images** du SDK :

```python
img = client.images.generate(
    model=deployment_name,
    prompt="A cute baby polar bear",
    n=1,
    size="1024x1024",
)

image_bytes = base64.b64decode(img.data[0].b64_json)
with open("output.png", "wb") as f:
    f.write(image_bytes)
```

`n` est le nombre d'images, `size` leur taille. La classe images permet de **générer** de nouvelles images et d'**éditer** des images existantes.

## Usages

Générer des images originales à partir de descriptions est très utile dans les **médias**, l'**édition** et la **création de contenu**.

> **Exemple.** Un site de recettes veut une illustration pour chaque nouvelle recette. Un script envoie le titre de la recette comme prompt, reçoit l'image en base64, la décode et l'enregistre à côté de l'article.

#### Point examen : deux questions officielles du module — on génère des images par programme en envoyant des prompts texte par l'API Responses d'OpenAI avec un modèle d'image déployé ; la valeur à passer au paramètre model est le nom du déploiement donné au modèle dans la ressource Foundry.

## Exercices rapides

**1.** Quelle famille de modèles Microsoft recommande-t-il pour la plupart des nouveaux projets de génération d'images ?

**2.** Associe : (a) le plus avancé, (b) léger et économique, (c) généraliste, successeur de DALL-E.

**3.** Quelle définition d'outil demande une image avec l'API Responses ?

**4.** Pourquoi l'image revient-elle en base64 ?

**5.** Quelle fonction Python décode le résultat ?

**6.** Tu as déployé `gpt-image-1.5` sous le nom `visuels-marketing`. Que passes-tu à `model` ?

**7.** Quel éditeur propose la famille de modèles FLUX ?

**8.** Dans `client.images.generate(...)`, à quoi servent `n` et `size` ?

<details>
<summary>Voir le corrigé</summary>

**1.** La famille GPT-Image-1, en particulier GPT-Image-1.5.

**2.** (a) GPT-Image-1.5, (b) GPT-Image-1-Mini, (c) GPT-Image-1.

**3.** `{"type": "image_generation"}`.

**4.** Parce qu'une image est un fichier binaire, alors que JSON ne transporte que du texte. Base64 convertit le binaire en texte.

**5.** `base64.b64decode(...)`.

**6.** `visuels-marketing`, le nom du déploiement.

**7.** Black Forest Labs.

**8.** `n` fixe le nombre d'images à générer, `size` leurs dimensions.

</details>
