# Les thèmes du Practice Assessment officiel

## L'essentiel

- Le Practice Assessment officiel de Microsoft pose des questions sur des points que les deux parcours abordent peu : **Face**, **CLU**, **tags d'image**, **modèles audio**, **analyseurs préconstruits de Content Understanding**.
- Cette fiche les réunit, avec ce qu'il faut savoir pour chacun.
- Les grands classiques reviennent aussi : **IA responsable**, choix de la **tâche de vision**, **techniques d'analyse de texte**, `responses.create` avec **input_image** et **agent_reference**.

## Vision : ce qu'Azure AI Vision renvoie

| Fonction | Ce qu'elle renvoie |
|---|---|
| **Tags** (étiquettes) | Des mots-clés qui décrivent l'image (« extérieur », « voiture », « route »), chacun avec un score de confiance |
| **Légende** (caption) | Une phrase qui décrit l'image, avec un **score de confiance** |
| **Détection d'objets** | Chaque objet avec son **cadre englobant** |
| **OCR** (Read) | Le texte imprimé ou manuscrit de l'image |

> **Piège.** Une légende est accompagnée d'un **score de confiance**, pas d'un cadre englobant. Le cadre, c'est pour la détection d'objets.

### Face : identification ou vérification

| | Identification | Vérification |
|---|---|---|
| Question posée | « Qui est cette personne ? » | « Est-ce bien la même personne ? » |
| Comparaison | Un visage contre **plusieurs** (1:N) | Un visage contre **un seul** (1:1) |
| Exemple | Retrouver un employé dans un groupe enregistré | Comparer un selfie à la photo d'une pièce d'identité |

Les fonctions d'identification et de vérification de Face sont en **accès limité** : Microsoft les réserve aux usages approuvés, au nom de l'IA responsable.

## Texte : les détails que Microsoft aime demander

### La détection de langue

Elle renvoie trois choses : le **nom** de la langue, son **code ISO 639-1** (`fr`, `es`) et un **score de confiance** de 0 à 1.

> **Piège.** Si la langue ne peut pas être déterminée (texte trop court, symboles), le résultat est **« (Unknown) »** avec un score **NaN** (pas un nombre).

Elle ne fait **ni** analyse de sentiment, **ni** masquage de données personnelles : ce sont d'autres fonctions.

### Entités : trois méthodes à ne pas confondre

| Méthode | Ce qu'elle fait |
|---|---|
| `recognize_entities` | Repère les entités et leur **catégorie** (personne, lieu, organisation, quantité) |
| `recognize_linked_entities` | Relie chaque entité à une **base de connaissances** (par exemple Wikipédia) |
| `recognize_pii_entities` | Repère et **masque** les données personnelles |

### CLU (Conversational Language Understanding)

CLU comprend l'**intention** d'une phrase dite par un utilisateur.

| Élément | Rôle | Exemple |
|---|---|---|
| **Intention** (intent) | Ce que veut l'utilisateur | `CommanderPizza` |
| **Entité** | L'information utile dans la phrase | `taille = grande` |
| **Énoncé** (utterance) | Une phrase d'exemple pour l'entraînement | « Je veux une grande pizza » |

Le **schéma** d'un modèle CLU contient les **intentions et les entités**. Les énoncés servent à l'**entraîner**.

### L'analyse statistique du texte

Avant de compter les mots, on **retire les mots vides** (« le », « de », « the »). Sinon, ce sont eux qui arrivent en tête.

### Knowledge mining

**Rechercher et indexer** un grand volume de documents (y compris des images) pour en extraire de l'information s'appelle le **knowledge mining**. Le service Azure : **Azure AI Search**.

## Parole : le Speech SDK en détail

```python
speech_config = speechsdk.SpeechConfig(subscription=key, region=region)   # clé et région ICI
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)  # source audio ICI
recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

result = recognizer.recognize_once_async().get()    # UN seul énoncé
print(result.text)
```

| Élément | À retenir |
|---|---|
| `SpeechConfig` | Contient la **clé** et la **région** (ou l'endpoint), la langue, la voix |
| `AudioConfig` | Contient seulement la **source audio** : micro ou fichier |
| `recognize_once_async()` | Reconnaît **un seul énoncé** (jusqu'à un silence), puis s'arrête |
| `start_continuous_recognition()` | Écoute **en continu**, jusqu'à l'arrêt |
| `.get()` | Attend et renvoie le résultat de l'opération asynchrone |

## Modèles : lequel pour quoi

| Besoin | Modèle |
|---|---|
| Générer une image à partir d'un texte | **DALL-E** ou **gpt-image** |
| Transcrire de l'audio | **Whisper** |
| Comparer des textes par le sens (recherche, classement) | Un modèle d'**embedding** |
| Comprendre texte + image, ou parole + image, dans un même prompt | Un modèle **multimodal** |

### Envoyer de l'audio à un modèle audio

Avec un modèle audio (de type gpt-4o-audio), on envoie le fichier **WAV encodé en base64** dans un contenu `input_audio`, et on demande les **modalités** `["text", "audio"]` pour recevoir une réponse écrite et parlée.

### Images : générer ou modifier

| Besoin | Technique |
|---|---|
| Créer une image à partir de rien | Génération **texte vers image** |
| Modifier une image existante à partir d'un prompt | **Édition image vers image** |

Un bon prompt d'image décrit le **sujet**, le **décor**, le **style** et l'ambiance, pas une simple liste d'objets.

> « Un vieux phare sur une falaise, au coucher du soleil, style aquarelle, couleurs chaudes. »

### Comparer deux images

Avec l'API Responses, chaque image est une partie `input_image` distincte, à côté d'un `input_text`. Le type `image_url` est le format de l'ancienne API Chat Completions.

## Foundry : portail et déploiements

| Élément | À retenir |
|---|---|
| **Chat playground** | Tester des prompts sur un modèle déployé, **sans code** |
| **Déploiement standard** dans une ressource Foundry | Les **guardrails** de Foundry (filtres de contenu) s'appliquent |
| **Calcul managé** | Le modèle tourne sur des machines dédiées ; utilisé pour certains modèles du catalogue |
| `responses.create()` | L'API **unifiée** ; `chat.completions` est l'ancienne API |
| **Message système** | Fixe le rôle, le style et les limites ; il ne remplace ni la sécurité ni l'entraînement |
| **Outils d'un agent** | On les ajoute depuis Foundry Tools ; les **outils intégrés** n'exigent pas de code hébergé. Ce sont les **instructions**, pas le modèle, qui définissent le comportement |

## Content Understanding : les détails

| Élément | À retenir |
|---|---|
| **Analyseur** | Définit le type de contenu, les réglages et le format de sortie |
| **Schéma de champs** | Définit **quoi** extraire ; utile pour des formulaires variés ou manuscrits, plutôt que des positions fixes |
| `enableOcr` | Réglage pour lire le texte des **documents** ; il ne concerne pas l'audio ni la vidéo |
| `prebuilt-callCenter` | Analyseur préconstruit pour les appels : transcription par rôle (agent, client), **résumé** et **sentiment** |
| Vidéo : `transcriptPhrases` | Ce qui est dit, par locuteur, avec horodatage |
| Vidéo : `keyFrameTimesMs` | Les horodatages des **images clés** |
| Vidéo : `cameraShotTimesMs` | Les horodatages des **changements de plan** |

#### Point examen : retiens les paires qui se ressemblent : identification (1:N) / vérification (1:1), recognize_entities / recognize_linked_entities, recognize_once / continuous, SpeechConfig (clé, région) / AudioConfig (micro), légende avec score de confiance / objet avec cadre englobant.

## Exercices rapides

**1.** Une application compare le selfie d'un client à la photo de sa carte d'identité. Identification ou vérification ?

**2.** Que renvoie la détection de langue pour le texte « :-) !!! » ?

**3.** Quelle méthode relie « Paris » à sa page Wikipédia ?

**4.** Dans un modèle CLU, à quoi servent les énoncés ?

**5.** Où se mettent la clé et la région dans le Speech SDK ?

**6.** Tu veux transcrire un appel de 20 minutes. recognize_once_async ou reconnaissance continue ?

**7.** Quel modèle utiliser pour transcrire de l'audio : DALL-E, Whisper ou un modèle d'embedding ?

**8.** Quel analyseur Content Understanding donne la transcription, le résumé et le sentiment d'un appel ?

**9.** Quelle propriété vidéo de Content Understanding marque les changements de plan ?

<details>
<summary>Voir le corrigé</summary>

**1.** Vérification (1:1).

**2.** « (Unknown) » avec un score NaN.

**3.** `recognize_linked_entities`.

**4.** À entraîner le modèle ; le schéma, lui, contient les intentions et les entités.

**5.** Dans `SpeechConfig`.

**6.** La reconnaissance continue : recognize_once_async s'arrête après un seul énoncé.

**7.** Whisper.

**8.** `prebuilt-callCenter`.

**9.** `cameraShotTimesMs`.

</details>
