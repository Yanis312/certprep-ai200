# Introduction et modèles multimodaux pour l'analyse d'images

## L'essentiel

- La **vision par ordinateur** permet aux machines d'interpréter images, vidéos et flux de caméra.
- Un **modèle multimodal** comprend et traite **plusieurs types de données à la fois** : texte, images, audio, vidéo.
- On parle de **modèles GPT avec vision** quand un modèle combine compréhension visuelle et réponse en langage naturel.
- Avec l'**API Responses**, une seule requête contient du **texte** et une ou plusieurs **images**.
- Une image se fournit par **URL** ou en **base64**.

## Applications de la vision

| Secteur | Usage |
|---|---|
| Industrie | **Détection de défauts** sur une chaîne de montage, en temps réel |
| Santé | Analyse de radios, IRM et scanners : mise en évidence d'anomalies |
| Commerce | **Surveillance des rayons** : produits manquants ou mal placés |
| Transport | **Véhicules autonomes** : panneaux, marquages, piétons, autres véhicules |

## Les modèles multimodaux

Ils servent dans :

- des **applications d'IA**, où comprendre une image améliore le parcours de l'utilisateur ;
- des **agents IA**, où une entrée visuelle aide à mieux décider.

| Exemple | Ce que fait le modèle |
|---|---|
| Un agent qui examine des documents et des captures d'écran chargés | Lit et interprète le visuel |
| Une application de support qui analyse les photos envoyées par les clients | Comprend le problème montré |
| Un outil pédagogique | Explique des schémas ou des graphiques en langage simple |

Comme ils acceptent **texte et images ensemble**, ils **réduisent le besoin de pipelines de vision séparés**.

### Ce que savent faire les modèles GPT avec vision

- **Décrire** le contenu d'une image en langage naturel.
- **Répondre à des questions** sur les objets, le texte ou la scène.
- **Extraire le sens** de graphiques, captures d'écran, documents ou photos.
- **Combiner** compréhension d'image et consignes textuelles dans un seul prompt.

Ils sont conçus pour un raisonnement visuel **souple et généraliste**, sans expertise poussée en vision par ordinateur.

## Les modèles dans Foundry

| Famille | Usage typique |
|---|---|
| **GPT-4.1 / 4.1-mini / 4.1-nano** | Modèles multimodaux généralistes : description d'image, questions sur une image, analyse de documents et de captures d'écran, lecture de graphiques et de schémas |
| **Série GPT-5** (GPT-5.1, GPT-5.2...) | Modèles avancés pour l'entreprise et l'agentique : entrées multimodales, **sorties structurées**, **usage d'outils**, raisonnement sur un large contexte. Pour agents de production et applications multimodales complexes |
| Modèles partenaires | Par exemple **Anthropic**, avec compréhension du texte et des images |

## Dans le playground

Dans le nouveau portail Foundry, le **model playground** permet de discuter avec un modèle déployé : tu choisis un modèle avec vision, tu **charges une image**, tu testes tes prompts.

Une fois validées, les mêmes capacités s'utilisent par programme, via des API.

## Par le code : l'API Responses

L'**API Responses** est conçue pour les applications agentiques et prend en charge nativement les entrées multimodales.

Structure du prompt :

- une **consigne textuelle**, comme « What objects are visible in this image? » ;
- une ou plusieurs **images** attachées à la même requête.

Le modèle traite les deux entrées **en même temps**.

### Le code

```bash
pip install openai
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("FOUNDRY_KEY"),
    base_url=os.getenv("ENDPOINT"),       # https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/
)

image_url = ""

response = client.responses.create(
    model=os.getenv("MODEL_NAME"),        # le nom de TON déploiement
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "What is in this image? Provide 3 bullet points."},
                {"type": "input_image", "image_url": image_url}
            ],
        }
    ],
)

print(response.output_text)
```

Ce qu'il faut voir :

| Élément | Rôle |
|---|---|
| `input=[{...}]` | Une **liste** de messages, et non une simple chaîne |
| `"role": "user"` | Le message vient de l'utilisateur |
| `"content": [...]` | Un message **en plusieurs parties** |
| `{"type": "input_text", "text": ...}` | La partie **texte** |
| `{"type": "input_image", "image_url": ...}` | La partie **image** |

Trois informations sont nécessaires : la **clé** de la ressource Foundry, son **endpoint**, et le **nom du déploiement**.

Un modèle déployé a un nom de base (par exemple `gpt-4.1-mini`) et un **nom de déploiement** que tu lui donnes (par exemple `my-vision-deploy`). C'est ce dernier que l'on passe à `model`.

> **Exemple du cours.** Une application qui identifie les animaux photographiés en safari : le code charge l'image, récupère la question de l'utilisateur, construit un message en plusieurs parties avec l'image et le texte, puis affiche la réponse du modèle.

## Texte seul ou texte + image

```python
# Texte seul
input="Explique ce qu'est un zèbre."

# Texte + image
input=[{"role": "user", "content": [
    {"type": "input_text", "text": "Quel animal est-ce ?"},
    {"type": "input_image", "image_url": "https://exemple.com/photo.jpg"},
]}]
```

#### Point examen : question officielle du module — un modèle multimodal est un modèle qui peut comprendre et traiter plus d'un type de données, comme le texte et les images. Retiens aussi les deux types de contenu input_text et input_image.

## Exercices rapides

**1.** Qu'est-ce qu'un modèle multimodal ?

**2.** Sous quelles deux formes peut-on fournir une image dans une requête ?

**3.** Quels sont les deux types de contenu d'un message qui mêle texte et image ?

**4.** Complète : `{"type": "________", "image_url": url}`

**5.** Pourquoi les modèles multimodaux réduisent-ils le besoin de pipelines de vision séparés ?

**6.** Que passe-t-on au paramètre `model` ?

**7.** Quelle famille de modèles Foundry vise les agents de production et les applications multimodales complexes ?

**8.** Cite deux choses qu'un modèle GPT avec vision peut faire à partir d'une image.

<details>
<summary>Voir le corrigé</summary>

**1.** Un modèle qui peut comprendre et traiter plus d'un type de données à la fois, comme le texte, les images, l'audio ou la vidéo.

**2.** Par URL, ou en données encodées en base64.

**3.** `input_text` et `input_image`.

**4.** `input_image`.

**5.** Parce qu'ils acceptent texte et images dans le même modèle et la même requête.

**6.** Le nom du déploiement que tu as donné au modèle dans Foundry.

**7.** La série GPT-5.

**8.** Deux parmi : décrire l'image, répondre à des questions sur son contenu, extraire le sens d'un graphique ou d'un document, combiner image et consignes textuelles.

</details>
