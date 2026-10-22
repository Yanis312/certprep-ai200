# Lecture de code 3 — texte, parole, extraction

## L'essentiel

- **Azure Language** : `TextAnalyticsClient`, avec une méthode par tâche (`detect_language`, `recognize_pii_entities`...).
- **Speech** : une `SpeechConfig`, puis un `SpeechRecognizer` (parole → texte) ou un `SpeechSynthesizer` (texte → parole).
- **Content Understanding** : `begin_analyze` lance une **opération longue**, `poller.result()` attend le résultat.
- Les méthodes reçoivent souvent une **liste** de documents et renvoient une liste : d'où le `[0]`.

## Azure Language

```python
text = "¡Hola! Me llamo Josefina y vivo en Madrid, España."
result = client.detect_language([text])[0]          # une liste en entrée, on prend le 1er résultat

print(result.primary_language.name)                 # Spanish
print(result.primary_language.iso6391_name)         # es
print(result.primary_language.confidence_score)     # score de confiance
```

```python
result = client.recognize_pii_entities([text])[0]
print(result.redacted_text)                          # le texte avec les PII masquées
for entity in result.entities:
    print(entity.text, entity.category, entity.confidence_score)
```

| Méthode | Tâche |
|---|---|
| `detect_language` | Détecter la langue |
| `recognize_pii_entities` | Repérer et masquer les données personnelles |

| Propriété | Contenu |
|---|---|
| `primary_language.name` | Le nom de la langue |
| `iso6391_name` | Le code à 2 lettres (`es`, `fr`) |
| `confidence_score` | La confiance, de 0 à 1 |
| `redacted_text` | Le texte avec les PII remplacées |
| `entities` | Les entités trouvées, avec `text` et `category` |

## Speech : reconnaissance (parole → texte)

```python
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=speech_key, endpoint=endpoint_url)
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)      # ENTRÉE : le micro

speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

def recognized_handler(evt):
    print(f"Recognized: {evt.result.text}")          # phrase finale

speech_recognizer.recognized.connect(recognized_handler)
speech_recognizer.start_continuous_recognition()     # écoute en continu
input("Press Enter to stop...")
speech_recognizer.stop_continuous_recognition()
```

| Élément | Signification |
|---|---|
| `recognizing` | Événement pendant que la personne parle : résultat **partiel** |
| `recognized` | Événement quand une phrase est terminée : résultat **final** |
| `start_continuous_recognition()` | Écoute en continu, jusqu'à l'arrêt |

## Speech : synthèse (texte → parole)

```python
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)   # SORTIE : le haut-parleur
speech_config.speech_synthesis_voice_name = 'en-US-Ava:DragonHDLatestNeural' # choix de la voix

speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
result = speech_synthesizer.speak_text_async(text).get()

if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("Speech synthesized")
```

### Le piège entrée / sortie

| | Reconnaissance | Synthèse |
|---|---|---|
| Classe | `SpeechRecognizer` | `SpeechSynthesizer` |
| Audio | `AudioConfig(use_default_microphone=True)` | `AudioOutputConfig(use_default_speaker=True)` |
| Appareil | **Micro** | **Haut-parleur** |
| Résultat | `evt.result.text` | `ResultReason.SynthesizingAudioCompleted` |

## Content Understanding

```python
client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))

analyzer_id = "prebuilt-invoice"                         # quel analyseur
inputs = [{"url": "https://.../invoice.pdf"}]            # quel contenu

poller = client.begin_analyze(analyzer_id=analyzer_id, inputs=inputs)   # 1) lancer
result = poller.result()                                                 # 2) attendre

for content in result.contents:                                          # 3) lire
    print(content.markdown)          # le contenu en markdown (ou la transcription)
    print(content.fields)            # les champs extraits
```

| Élément | Signification |
|---|---|
| `analyzer_id` | L'analyseur : `prebuilt-invoice` pour une facture, `prebuilt-audioSearch` pour de l'audio |
| `begin_analyze` | Lance une **opération longue** (LRO) : le préfixe `begin_` le signale |
| `poller.result()` | Attend la fin ; le SDK interroge le service en coulisses |
| `contents` | Les résultats : `markdown` et `fields` |

Dans la réponse JSON, chaque champ a un **type**, une **valeur** et une **confiance** :

```json
"CustomerName": { "type": "string", "valueString": "MICROSOFT CORPORATION", "confidence": 0.95 }
```

#### Point examen : micro = `AudioConfig` + `SpeechRecognizer` ; haut-parleur = `AudioOutputConfig` + `SpeechSynthesizer`. Content Understanding = `begin_analyze` puis `poller.result()`. Language = une liste en entrée, d'où le `[0]`.

## Exercices rapides

**1.** Quelle méthode de `TextAnalyticsClient` masque les données personnelles ?

**2.** Pourquoi écrit-on `client.detect_language([text])[0]` ?

**3.** Que contient `result.redacted_text` ?

**4.** Ce code lit-il le micro ou joue-t-il du son ?

```python
audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
```

**5.** Quel événement donne le résultat final d'une phrase reconnue : `recognizing` ou `recognized` ?

**6.** Quelle ligne choisit la voix de synthèse ?

**7.** Que signale le préfixe `begin_` dans `begin_analyze` ?

**8.** Quel `analyzer_id` utiliser pour une facture ?

**9.** Trouve l'erreur : on veut lire du texte à voix haute.

```python
audio_config = speechsdk.audio.AudioConfig(use_default_microphone=True)
synth = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)
```

<details>
<summary>Voir le corrigé</summary>

**1.** `recognize_pii_entities`.

**2.** La méthode reçoit une liste de documents et renvoie une liste de résultats ; `[0]` prend le premier.

**3.** Le texte avec les données personnelles masquées.

**4.** Il joue du son : c'est une configuration de sortie vers le haut-parleur.

**5.** `recognized`.

**6.** `speech_config.speech_synthesis_voice_name = '...'`.

**7.** Une opération longue (LRO) : on attend le résultat avec `poller.result()`.

**8.** `prebuilt-invoice`.

**9.** Pour la synthèse, il faut une sortie audio : `AudioOutputConfig(use_default_speaker=True)`, pas le micro.

</details>
