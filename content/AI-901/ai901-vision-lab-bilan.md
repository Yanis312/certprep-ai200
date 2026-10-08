# Lab et bilan — vision par ordinateur dans Azure

## Le lab

Utiliser des modèles génératifs de Foundry pour **analyser** des images, puis en **créer**.

- **Durée** : environ 30 minutes.
- Tout se fait dans le **portail Foundry**.
- La seconde partie demande un abonnement qui a **accès aux modèles de génération d'images**. Avec un abonnement étudiant, ce n'est pas garanti.

### Étape 1 — Projet

`https://ai.azure.com` → active **New Foundry** → crée un projet (ressource Foundry, abonnement, groupe de ressources, région recommandée).

### Étape 2 — Analyser des images

1. Télécharge `https://microsoftlearning.github.io/mslearn-ai-fundamentals/data/images.zip` et extrais l'archive.
2. **Discover → Models** : cherche et déploie **gpt-5-mini** avec les paramètres par défaut. Faute de quota, prends un autre modèle GPT de chat (gpt-5-nano, gpt-5.4-mini) ou une autre région.
3. Dans le playground, mets les **Instructions** :

```
You are an AI assistant that helps people identify vintage computer hardware.
```

4. Clique sur **Upload image** et choisis une des images extraites.
5. Ajoute un texte comme `What can you tell me about this?` et envoie.
6. Recommence avec les autres images : `What is this?`, `Tell me about this.`

**Ce que tu dois observer** : le prompt contient **l'image et le texte**, et la réponse décrit le matériel photographié.

### Étape 3 — Lire le code d'analyse

Onglet **Call model**, options **Python** et **Key authentication**. L'exemple par défaut n'a qu'un prompt texte. Pour analyser une image, on modifie `input` :

```python
response = client.responses.create(
    model=deployment_name,
    input=[{
        "role": "user",
        "content": [
            {"type": "input_text", "text": "what's in this image?"},
            {"type": "input_image", "image_url": "https://an-online-image.jpg"},
        ],
    }],
)

print(f"answer: {response.output_text}")
```

### Étape 4 — Générer des images

1. Reviens à la page **Models** et choisis **Deploy a base model**.
2. Filtre : **Collections** → **Direct from Azure** ; **Inference tasks** → **Text to image**.
3. Déploie un modèle disponible, comme **gpt-image-1-mini** ou **FLUX.2-pro**.
4. Dans le **playground d'images**, décris une image : `A vintage PC with a CRT monitor`.

Tu retrouves les filtres du catalogue : **Collection** et **Inference tasks**.

### Étape 5 — Lire le code de génération

Si le modèle propose **View code**, avec **Python**, **OpenAI SDK**, **Key authentication** :

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

Certains modèles n'affichent pas de code d'exemple : la génération dans le playground suffit alors.

### Nettoyage

`https://portal.azure.com` → groupe de ressources → **Delete resource group** → saisis le nom.

## Le module en 10 lignes

1. La vision par ordinateur interprète images, vidéos et flux de caméra.
2. Un modèle **multimodal** traite plusieurs types de données à la fois.
3. Les **modèles GPT avec vision** décrivent une image et répondent à des questions dessus.
4. Familles : **GPT-4.1** (généraliste), **série GPT-5** (entreprise et agents), modèles partenaires.
5. API Responses : un message avec `input_text` et `input_image` ; image par **URL** ou **base64**.
6. Génération d'images : **GPT-Image-1.5**, **GPT-Image-1**, **GPT-Image-1-Mini**, et **FLUX**.
7. Code : `tools=[{"type": "image_generation"}]` ou `client.images.generate(...)`, puis décodage **base64**.
8. Génération vidéo : **Sora 1** et **Sora 2**, seuls modèles vidéo natifs de Foundry.
9. Vidéo = **travail asynchrone** : créer, interroger, télécharger. Exemple en **REST** avec `curl`.
10. Dans tous les cas, `model` reçoit le **nom du déploiement**.

## Trois familles, trois sens

| Famille | Entrée | Sortie | Modèles |
|---|---|---|---|
| Analyse (multimodal) | Texte + image | Texte | GPT-4.1, série GPT-5 |
| Génération d'images | Texte (ou image) | Image | GPT-Image-1.5, 1, 1-Mini, FLUX |
| Génération de vidéos | Texte, image ou vidéo | Vidéo | Sora 1, Sora 2 |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Qu'est-ce qu'un modèle multimodal ? | Un modèle qui peut comprendre et traiter **plus d'un type de données**, comme le texte et les images |
| Comment générer des images par programme avec les modèles de Foundry ? | En envoyant des **prompts texte par l'API Responses d'OpenAI** avec un **modèle d'image déployé** |
| Quelle valeur passer au paramètre `model` ? | Le **nom du déploiement** donné au modèle dans la ressource Foundry |
| Pourquoi la génération vidéo avec Sora est-elle un travail asynchrone ? | Parce qu'elle est **gourmande en ressources** et **prend du temps** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : charger des images dans le playground n'est pas « par programme » ; `model` n'est ni le nom de base du modèle ni le nom de la ressource ; l'API REST sait faire des requêtes synchrones.

#### Point examen : ce module couvre les puces « Interpréter une entrée visuelle avec un modèle multimodal déployé » et « Créer de nouvelles sorties visuelles avec des modèles génératifs » du guide d'étude.

## Exercices rapides

**1.** Associe chaque besoin à une famille : (a) décrire une photo, (b) créer une affiche, (c) produire un clip de 8 secondes.

**2.** Écris de mémoire les deux parties d'un message qui contient du texte et une image.

**3.** Quels filtres du catalogue le lab utilise-t-il pour trouver un modèle de génération d'images ?

**4.** Pourquoi faut-il décoder le résultat d'une génération d'image ?

**5.** Quelle est la différence de déroulement entre générer une image et générer une vidéo ?

<details>
<summary>Voir le corrigé</summary>

**1.** (a) Modèle multimodal avec vision. (b) Génération d'images. (c) Génération de vidéos avec Sora.

**2.** `{"type": "input_text", "text": "..."}` et `{"type": "input_image", "image_url": "..."}`.

**3.** Collections → Direct from Azure, et Inference tasks → Text to image.

**4.** Parce que l'image revient encodée en base64 ; il faut la décoder pour obtenir le fichier binaire.

**5.** L'image s'obtient en une requête. La vidéo passe par un travail asynchrone : créer, interroger l'état, télécharger.

</details>
