# Video generation models — générer des vidéos

## L'essentiel

- Foundry propose des modèles de **génération de vidéo** : **Sora 1** et **Sora 2**.
- Les modèles **Sora** sont les **seuls** modèles natifs de génération vidéo fournis directement par Foundry.
- La génération vidéo est **gourmande en ressources** : elle s'exécute comme un **travail asynchrone**.
- Asynchrone = **créer** le travail, **interroger** son état, **télécharger** la vidéo.
- Le code d'exemple du portail utilise l'**interface REST**, avec `curl`.

## Sora 1 et Sora 2

| | Sora 1 | Sora 2 (préversion publique) |
|---|---|---|
| Position | Premier modèle text-to-video d'OpenAI dans Foundry | Nouvelle génération, nette amélioration |
| Entrées | Texte ; peut aussi partir d'images | **Texte → vidéo**, **image → vidéo**, **vidéo → vidéo** (remix) |
| Nouveautés | Plusieurs résolutions et durées | **Génération audio**, réalisme amélioré, **remix** pour des retouches ciblées sans tout régénérer |
| Accès | Azure OpenAI Service et Video Playground | API **Azure OpenAI v1** et Video Playground, avec garde-fous d'IA responsable intégrés |
| Usages | Vidéos de concept et storyboards, courtes animations, prototypage visuel | Vidéos marketing, aperçus cinématographiques et bandes-annonces, contenus éducatifs et immersifs |

### Deux points à retenir

- D'autres modèles Foundry peuvent être multimodaux (texte, image, audio), mais ils **ne produisent pas de vidéo**.
- Sora 1 et Sora 2 ont des **restrictions d'IA responsable** : limites sur les **personnes réelles**, les **personnages protégés par le droit d'auteur** et certains types de contenu.

## Dans le playground

Une fois le modèle déployé, on le teste dans le playground. On peut fixer des paramètres comme les **dimensions** et la **durée** de la vidéo.

Le prompt doit **décrire le contenu** voulu. Après quelques minutes, la vidéo est produite.

## REST, SDK, curl, Bash

| Terme | Définition |
|---|---|
| **API REST** | Une interface web qui permet à des programmes de communiquer par **HTTP** |
| **SDK** | Une boîte à outils pour développeurs, construite **au-dessus** de cette interface |
| **curl** | Un outil en ligne de commande qui envoie et reçoit des données sur Internet : il fait des requêtes HTTP et affiche la réponse |
| **Bash** | Un shell et langage de script en ligne de commande. `curl` est une commande que l'on lance **dans** Bash |

On peut toujours utiliser l'API REST directement, surtout s'il n'existe pas de SDK dans le langage que l'on connaît.

## Pourquoi asynchrone

La génération dure souvent **1 à 5 minutes**. Le programme ne reste pas bloqué à attendre : il lance le travail et revient voir plus tard.

```
1. CRÉER      POST  .../videos                    →  reçoit un identifiant de vidéo
      │
      ▼
2. INTERROGER GET   .../videos/{video_id}         →  état : en cours... completed ou failed
      │         (à répéter jusqu'à la fin)
      ▼
3. TÉLÉCHARGER GET  .../videos/{video_id}/content →  le fichier MP4
```

Il faut une ressource Foundry dans une **région prise en charge**, un **déploiement Sora** et une authentification : **clé d'API** ou **Microsoft Entra ID**.

## Les 3 requêtes

**1. Créer le travail**

```bash
curl -X POST "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/videos" \
  -H "Content-Type: application/json" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  -d '{
    "model": "sora-2",
    "prompt": "A cinematic close-up of raindrops sliding down a neon-lit window at night.",
    "size": "1280x720",
    "seconds": "8"
  }'
```

La réponse contient un **identifiant de vidéo** à interroger.

**2. Interroger l'état**

```bash
curl -X GET "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/videos/{video_id}" \
  -H "api-key: $AZURE_OPENAI_API_KEY"
```

On répète jusqu'à ce que l'état soit `completed` (ou `failed`).

**3. Télécharger**

```bash
curl -L "https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/videos/{video_id}/content?variant=video" \
  -H "api-key: $AZURE_OPENAI_API_KEY" \
  --output output.mp4
```

Le téléchargement n'est possible qu'**après** l'état `completed`.

| Requête | Méthode | Rôle |
|---|---|---|
| `.../videos` | `POST` | Lancer le rendu |
| `.../videos/{video_id}` | `GET` | Connaître l'état |
| `.../videos/{video_id}/content` | `GET` | Récupérer le MP4 |

Dans le corps de la première requête : `model` (le déploiement), `prompt` (la description), `size` (les dimensions), `seconds` (la durée).

## Image ou vidéo : la différence de fonctionnement

| | Génération d'image | Génération de vidéo |
|---|---|---|
| Modèles | Famille GPT-Image, FLUX | Sora 1, Sora 2 |
| Déroulement | Une requête, une réponse | **Travail asynchrone** en 3 temps |
| Durée | Courte | Souvent 1 à 5 minutes |
| Exemple du cours | SDK Python | Interface REST avec `curl` |

#### Point examen : question officielle du module — la génération vidéo avec les modèles Sora est traitée comme un travail asynchrone parce qu'elle est gourmande en ressources et prend du temps. Ce n'est pas parce que l'API REST ne sait pas faire de requêtes synchrones.

## Exercices rapides

**1.** Quels sont les seuls modèles natifs de génération vidéo dans Foundry ?

**2.** Donne les 3 étapes d'un travail asynchrone de génération vidéo.

**3.** Pourquoi la génération vidéo est-elle asynchrone ?

**4.** Quelles nouveautés Sora 2 apporte-t-il par rapport à Sora 1 ?

**5.** Quelle méthode HTTP lance le travail ? Laquelle interroge son état ?

**6.** À quel moment peut-on télécharger la vidéo ?

**7.** Cite deux restrictions d'IA responsable des modèles Sora.

**8.** Qu'est-ce que `curl` ?

<details>
<summary>Voir le corrigé</summary>

**1.** Les modèles Sora : Sora 1 et Sora 2.

**2.** Créer le travail, interroger son état, télécharger la vidéo une fois terminée.

**3.** Parce qu'elle est gourmande en ressources et prend du temps, souvent 1 à 5 minutes.

**4.** L'image vers vidéo et la vidéo vers vidéo (remix), la génération audio, un réalisme amélioré et des retouches ciblées.

**5.** `POST` pour lancer, `GET` pour interroger.

**6.** Seulement après que l'état est `completed`.

**7.** Deux parmi : limites sur les personnes réelles, sur les personnages protégés par le droit d'auteur, sur certains types de contenu.

**8.** Un outil en ligne de commande qui envoie des requêtes HTTP et affiche la réponse du serveur.

</details>
