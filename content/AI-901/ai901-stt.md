# Introduction et Speech recognition — la reconnaissance vocale

## L'essentiel

- Une interaction vocale demande au moins deux capacités : la **reconnaissance** (interpréter la parole) et la **synthèse** (produire de la parole).
- **Azure Speech** dans Foundry Tools fournit **speech-to-text**, **text-to-speech** et **traduction vocale**.
- La reconnaissance vocale (**STT**) convertit la parole en données, le plus souvent en **texte**.
- Elle s'appuie sur deux modèles : un **modèle acoustique** et un **modèle de langage**.
- Deux modes de transcription : **temps réel** et **par lots** (batch).

## Pourquoi la voix

Les interfaces vocales offrent une façon plus naturelle d'utiliser un logiciel, et rendent applications et agents plus **accessibles** et **inclusifs**.

| Secteur | Exemple |
|---|---|
| Santé | **Dictée clinique** : le médecin dicte ses notes, l'application les transcrit |
| Support client | **Transcription d'appels** en temps réel, pour les relire et analyser le sentiment |
| Médias | **Sous-titrage automatique** en direct ou en différé |
| Éducation | Retour sur la **prononciation** dans une application de langues |
| Commerce | **Assistants vocaux** qui comprennent une demande et répondent à l'oral |

## Comment marche la reconnaissance vocale

```
Audio  ──►  Modèle acoustique  ──►  phonèmes  ──►  Modèle de langage  ──►  mots  ──►  texte
```

| Modèle | Rôle |
|---|---|
| **Modèle acoustique** | Convertit l'audio en **phonèmes**, des représentations de sons précis |
| **Modèle de langage** | Fait correspondre les phonèmes à des **mots** |

Le texte obtenu sert à produire des sous-titres, des transcriptions d'appels, de la dictée de notes.

## Azure Speech — Speech to Text

Azure Speech comprend une **API speech-to-text** pour traiter une entrée vocale venant d'un **micro** ou d'un **fichier audio**.

Dans le portail : **Build → Models → onglet AI services → Azure Speech - Speech to Text**. Dans le playground, tu charges un fichier audio ou tu t'enregistres, et le service transcrit.

Le playground sert à expérimenter. Pour intégrer la fonction dans une application, il faut du code.

## Le SDK speech-to-text

Le SDK permet à l'application de :

- **capter ou envoyer** de l'audio (micro, fichier, flux) ;
- **transmettre** cet audio à Azure Speech de façon sécurisée ;
- **recevoir** le texte transcrit, en quasi temps réel ou à la fin du traitement.

Il prend en charge le réseau, l'authentification, le streaming audio et l'analyse des réponses.

### Installation

```bash
pip install azure-cognitiveservices-speech
```

Il faut aussi une **ressource Foundry** : son **endpoint** et sa **clé** authentifient la connexion.

### Les 5 étapes à l'exécution

1. L'application **initialise le SDK** : endpoint et authentification (clé ou Microsoft Entra ID).
2. L'audio est **capté ou chargé** : micro, fichier ou flux.
3. L'audio est **envoyé** à Azure Speech.
4. La reconnaissance **s'exécute dans le cloud**.
5. Le **texte** est renvoyé, avec des métadonnées facultatives.

### Le code

```python
import azure.cognitiveservices.speech as speechsdk

# Configuration avec l'endpoint et la clé de la ressource
speech_config = speechsdk.SpeechConfig(
    subscription=speech_key,
    endpoint=endpoint_url
)

# Un recognizer qui écoute le micro
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
speech_recognizer = speechsdk.SpeechRecognizer(
    speech_config=speech_config,
    audio_config=audio_config
)

# Gestionnaires d'événements
def recognized_handler(evt):
    print(f"Recognized: {evt.result.text}")

def recognizing_handler(evt):
    print(f"Recognizing: {evt.result.text}")

speech_recognizer.recognized.connect(recognized_handler)
speech_recognizer.recognizing.connect(recognizing_handler)

# Reconnaissance en continu
speech_recognizer.start_continuous_recognition()
input("Press Enter to stop...")
speech_recognizer.stop_continuous_recognition()
```

Les trois objets à connaître :

| Objet | Rôle |
|---|---|
| `SpeechConfig` | La connexion : clé et endpoint |
| `AudioConfig` | La **source** audio : ici le micro par défaut |
| `SpeechRecognizer` | L'objet qui **fait la transcription** |

Les deux événements :

| Événement | Quand |
|---|---|
| `recognizing` | Pendant la reconnaissance : résultat **provisoire** |
| `recognized` | Une phrase est terminée : résultat **final** |

> **Exemple du cours.** Une application qui transcrit des messages vocaux : on indique l'endpoint, la clé et le fichier audio, on utilise un `SpeechRecognizer`, puis on affiche le texte.

## Temps réel ou par lots

| | Temps réel | Par lots (batch) |
|---|---|---|
| Source | Un flux audio (micro ou fichier) écouté par l'application | Des enregistrements stockés : partage de fichiers, serveur distant, stockage Azure |
| Fonctionnement | L'application envoie l'audio en flux et reçoit le texte au fur et à mesure | On indique les fichiers par une **URI SAS** et on reçoit le résultat de façon **asynchrone** |
| Usage | Présentations, démos, toute situation où quelqu'un parle | Traiter un stock d'enregistrements |
| Délai | Immédiat | Les travaux sont planifiés **au mieux** : démarrage souvent en quelques minutes, sans garantie |

SAS signifie *shared access signature* : un lien qui donne un accès contrôlé à des fichiers stockés.

#### Point examen : retiens les deux modèles (acoustique → phonèmes, langage → mots), le paquet azure-cognitiveservices-speech, l'objet SpeechRecognizer, et la différence entre transcription en temps réel et par lots.

## Exercices rapides

**1.** Quelles deux capacités un système doit-il avoir pour une interaction vocale ?

**2.** Que fait le modèle acoustique ? Et le modèle de langage ?

**3.** Quel paquet pip installe le SDK Azure Speech en Python ?

**4.** Quel objet réalise la transcription ?

**5.** Temps réel ou par lots ? (a) Sous-titrer une conférence en direct. (b) Transcrire 4 000 appels enregistrés le mois dernier.

**6.** Quelle différence entre les événements `recognizing` et `recognized` ?

**7.** Comment désigne-t-on les fichiers à traiter dans une transcription par lots ?

**8.** Avec quoi le SDK s'authentifie-t-il auprès du service ?

<details>
<summary>Voir le corrigé</summary>

**1.** La reconnaissance vocale et la synthèse vocale.

**2.** Le modèle acoustique convertit l'audio en phonèmes. Le modèle de langage fait correspondre les phonèmes à des mots.

**3.** `azure-cognitiveservices-speech`.

**4.** `SpeechRecognizer`.

**5.** (a) Temps réel. (b) Par lots.

**6.** `recognizing` donne un résultat provisoire pendant l'écoute ; `recognized` donne le résultat final d'une phrase.

**7.** Par une URI SAS (shared access signature).

**8.** Avec l'endpoint et la clé de la ressource Foundry, ou avec Microsoft Entra ID.

</details>
