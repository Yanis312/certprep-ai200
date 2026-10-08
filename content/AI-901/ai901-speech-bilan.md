# Bilan du module — la parole dans Azure

## Le module en 10 lignes

1. Interaction vocale = **reconnaissance** (entrée) + **synthèse** (sortie).
2. **Azure Speech** : speech-to-text, text-to-speech, traduction vocale.
3. STT : **modèle acoustique** (audio → phonèmes) puis **modèle de langage** (phonèmes → mots).
4. Transcription **temps réel** (flux) ou **par lots** (fichiers par URI SAS, asynchrone).
5. TTS : il faut le **texte** et la **voix** ; tokenisation → phonétique → prosodie → phonèmes → audio.
6. **Voix neuronales** : plus naturelles, meilleure intonation. Voix personnalisées possibles.
7. SDK : `azure-cognitiveservices-speech`, `SpeechConfig`, `SpeechRecognizer`, `SpeechSynthesizer`.
8. **Speech-to-speech** : STT → raisonnement → TTS.
9. **Voice Live** : les trois étapes dans un service **managé**, avec un modèle génératif à choisir.
10. **Voice mode** d'un agent Foundry : la voix encapsulée dans l'agent, moins de code client.

## Les trois capacités

| Capacité | Sens | Service | Objet ou paquet |
|---|---|---|---|
| Speech-to-text | Voix → texte | Azure Speech | `SpeechRecognizer` |
| Text-to-speech | Texte → voix | Azure Speech | `SpeechSynthesizer` |
| Speech-to-speech | Voix → voix | Voice Live | `azure-ai-voicelive` |

## Aide-mémoire de code

```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=key, endpoint=endpoint)

# Reconnaissance : micro → texte
audio_in = speechsdk.audio.AudioConfig(use_default_microphone=True)
recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_in)

# Synthèse : texte → haut-parleur
audio_out = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
speech_config.speech_synthesis_voice_name = 'en-US-Ava:DragonHDLatestNeural'
synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_out)
synthesizer.speak_text_async("Bonjour").get()
```

## Choisir

```
L'utilisateur doit-il avoir une vraie conversation orale, en temps réel ?
├── Oui → Voice Live (ou Voice mode d'un agent Foundry)
└── Non
    ├── J'ai de l'audio et je veux du texte → speech-to-text
    │       ├── en direct → temps réel
    │       └── un stock de fichiers → par lots
    └── J'ai du texte et je veux de l'audio → text-to-speech
```

## À propos de l'évaluation

Tu ne m'as pas collé le knowledge check de ce module. Le quiz de cette unité est donc entièrement de moi, construit à partir du cours et du résumé officiel. Colle-moi les questions de Microsoft si tu veux que je les ajoute.

#### Point examen : le guide d'étude cite « Identifier les fonctionnalités de la reconnaissance et de la synthèse vocales » côté concepts, et « Créer une application légère avec Azure Speech dans Foundry Tools » côté mise en œuvre. Sache lire un extrait avec SpeechRecognizer ou SpeechSynthesizer.

## Exercices rapides

**1.** Associe : (a) `SpeechRecognizer`, (b) `SpeechSynthesizer`, (c) `azure-ai-voicelive`.

**2.** Quel paquet sert à la fois pour la reconnaissance et la synthèse ?

**3.** Un centre d'appels veut transcrire les enregistrements de la veille pendant la nuit. Quel mode ?

**4.** Une application doit lire les horaires de bus à voix haute. Quelle capacité, et de quoi a-t-elle besoin ?

**5.** Pourquoi Voice Live est-il plus simple que d'assembler soi-même les composants ?

<details>
<summary>Voir le corrigé</summary>

**1.** (a) Speech-to-text. (b) Text-to-speech. (c) Speech-to-speech avec Voice Live.

**2.** `azure-cognitiveservices-speech`.

**3.** La transcription par lots.

**4.** La synthèse vocale (text-to-speech). Elle a besoin du texte à dire et de la voix à utiliser.

**5.** Parce qu'il combine speech-to-text, raisonnement et text-to-speech dans un seul service managé, dont Azure gère les modèles et l'infrastructure.

</details>
