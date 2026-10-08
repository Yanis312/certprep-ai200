# Speech synthesis — la synthèse vocale

## L'essentiel

- La synthèse vocale (**TTS**, text-to-speech) produit de la parole audible à partir d'un **texte**.
- Elle a besoin de deux informations : le **texte** à dire et la **voix** à utiliser.
- Azure Speech propose des voix prédéfinies, dont des **voix neuronales** plus naturelles, et permet des **voix personnalisées**.
- L'audio peut être **joué** sur un haut-parleur ou **écrit** dans un fichier.
- Objet clé du SDK : **`SpeechSynthesizer`**.

## Comment marche la synthèse

```
Texte
  │  1. tokenisation : découpage en mots
  ▼
Mots  ──►  2. sons phonétiques attribués à chaque mot
  │
  ▼
3. unités prosodiques : groupes, propositions, phrases
  │
  ▼
4. phonèmes  ──►  5. audio, avec une voix, un débit, une hauteur et un volume
```

| Étape | Ce qui se passe |
|---|---|
| **Tokenisation** | Le texte est découpé en mots |
| **Transcription phonétique** | Des sons sont attribués à chaque mot |
| **Unités prosodiques** | La transcription est découpée en groupes de mots, propositions ou phrases |
| **Phonèmes** | Créés à partir des unités prosodiques |
| **Synthèse** | Les phonèmes deviennent de l'audio, avec une **voix**, un **débit**, une **hauteur** (pitch) et un **volume** |

La **prosodie**, c'est le rythme et l'intonation : ce qui fait qu'une phrase sonne comme une question ou une affirmation.

## À quoi ça sert

- Générer des **réponses parlées** à une entrée utilisateur.
- **Lire des messages** à voix haute.
- **Diffuser des annonces**.

## Azure Speech — Text to Speech

L'**API text-to-speech** convertit un texte en parole, à jouer directement ou à enregistrer dans un fichier audio.

| Type de voix | Détail |
|---|---|
| **Voix prédéfinies** | Plusieurs voix, plusieurs langues et prononciations régionales |
| **Voix neuronales** | Utilisent des réseaux de neurones ; corrigent des limites classiques comme l'**intonation**, pour un rendu plus naturel |
| **Voix personnalisées** | À développer soi-même et à utiliser avec l'API |

Dans le playground **Azure Speech - Text to Speech** du portail, tu choisis une voix et tu règles des paramètres comme la **vitesse** et la **hauteur**.

## Le SDK text-to-speech

Le SDK permet à l'application de :

- **envoyer** du texte à Azure Speech ;
- **générer** de l'audio avec des voix neuronales ;
- **jouer** l'audio ou l'**enregistrer** dans un fichier.

Il s'utilise en général dans :

- des **applications clientes**, pour dire un texte immédiatement (bureau, mobile) ;
- des **services backend**, pour produire des fichiers audio à écouter plus tard.

### Les 5 étapes à l'exécution

1. L'application **initialise le SDK** : endpoint et authentification.
2. Le **texte** est fourni.
3. Le texte est **envoyé** à Azure Speech.
4. La synthèse **s'exécute dans le cloud** : des modèles neuronaux génèrent l'audio.
5. L'**audio** est renvoyé : l'application le joue, le diffuse ou l'enregistre.

### Le code

```python
import os
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(
    subscription=os.environ.get('FOUNDRY_KEY'),
    endpoint=os.environ.get('ENDPOINT'))
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

# Choix de la voix
speech_config.speech_synthesis_voice_name = 'en-US-Ava:DragonHDLatestNeural'

speech_synthesizer = speechsdk.SpeechSynthesizer(
    speech_config=speech_config, audio_config=audio_config)

text = input()
speech_synthesis_result = speech_synthesizer.speak_text_async(text).get()

if speech_synthesis_result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("Speech synthesized for text [{}]".format(text))
elif speech_synthesis_result.reason == speechsdk.ResultReason.Canceled:
    print("Speech synthesis canceled")
```

| Élément | Rôle |
|---|---|
| `SpeechConfig` | La connexion : clé et endpoint |
| `AudioOutputConfig(use_default_speaker=True)` | La **sortie** audio : ici le haut-parleur par défaut |
| `speech_synthesis_voice_name` | La **voix** choisie |
| `SpeechSynthesizer` | L'objet qui **génère la parole** |
| `speak_text_async(text).get()` | Lance la synthèse et attend le résultat |
| `ResultReason.SynthesizingAudioCompleted` | La synthèse a réussi |

> **Exemple du cours.** Une application qui lit des SMS à voix haute : elle se connecte à l'endpoint d'Azure Speech, crée un `SpeechSynthesizer`, lit le fichier texte du message et génère l'audio.

## Reconnaissance et synthèse : le miroir

| | Reconnaissance (STT) | Synthèse (TTS) |
|---|---|---|
| Sens | Voix → texte | Texte → voix |
| Objet principal | `SpeechRecognizer` | `SpeechSynthesizer` |
| Configuration audio | `AudioConfig` (entrée, micro) | `AudioOutputConfig` (sortie, haut-parleur) |
| Paquet | `azure-cognitiveservices-speech` | Le même |

#### Point examen : retiens que la synthèse a besoin du texte et de la voix, que les voix neuronales améliorent l'intonation, et que l'objet du SDK est SpeechSynthesizer. Ne le confonds pas avec SpeechRecognizer.

## Exercices rapides

**1.** De quelles deux informations une solution text-to-speech a-t-elle besoin ?

**2.** Quelle est la première étape du traitement du texte dans la synthèse ?

**3.** Qu'apportent les voix neuronales ?

**4.** Quel objet du SDK génère la parole ?

**5.** Quelle propriété fixe la voix utilisée ?

**6.** Cite deux paramètres réglables dans le playground Text to Speech.

**7.** Recognizer ou Synthesizer ? (a) Lire une notification à voix haute. (b) Transcrire une dictée.

**8.** Dans quels deux types de logiciels utilise-t-on en général le SDK text-to-speech ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le texte à dire et la voix à utiliser.

**2.** La tokenisation : le découpage du texte en mots.

**3.** Un rendu plus naturel : elles corrigent des limites comme les problèmes d'intonation.

**4.** `SpeechSynthesizer`.

**5.** `speech_config.speech_synthesis_voice_name`.

**6.** La vitesse et la hauteur (pitch).

**7.** (a) `SpeechSynthesizer`. (b) `SpeechRecognizer`.

**8.** Les applications clientes, pour une lecture immédiate, et les services backend, pour générer des fichiers audio.

</details>
