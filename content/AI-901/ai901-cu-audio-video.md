# Extraire de l'information de l'audio et de la vidéo

## L'essentiel

- L'information d'entreprise se trouve de plus en plus dans de l'**audio** et de la **vidéo** : appels enregistrés, réunions en visioconférence.
- **Azure Content Understanding** analyse aussi ces formats.
- Pour l'audio, il fournit des **transcriptions**, des **résumés** et d'autres informations clés.
- Le principe est le même que pour les documents : un **schéma** dit quoi extraire, un **analyseur** l'applique, le résultat revient en **JSON**.
- Analyseurs préconstruits : **`prebuilt-audioSearch`** et **`prebuilt-videoSearch`**.

## Extraire des données d'un fichier audio

### Exemple : résumer une messagerie vocale

Schéma des informations à extraire de chaque appel :

- Caller (appelant)
- Message summary (résumé du message)
- Requested actions (actions demandées)
- Callback number (numéro de rappel)
- Alternative contact details (autres coordonnées)

Message laissé :

> « Hi, this is Ava from Contoso. Just calling to follow up on our meeting last week. I wanted to let you know that I've run the numbers and I think we can meet your price expectations. Please call me back on 555-12345 or send me an e-mail at Ava@contoso.com and we'll discuss next steps. Thanks, bye! »

Résultat de l'analyse avec ce schéma :

| Champ | Valeur extraite |
|---|---|
| Caller | Ava from Contoso |
| Message summary | Ava a rappelé au sujet d'une réunion et indique qu'ils peuvent respecter les attentes de prix. Elle demande un rappel ou un e-mail pour la suite |
| Requested actions | Rappeler ou envoyer un e-mail pour discuter des prochaines étapes |
| Callback number | 555-12345 |
| Alternative contact details | Ava@contoso.com |

Deux choses à remarquer :

- certains champs sont **copiés** tels quels (le numéro, l'e-mail) ;
- d'autres sont **rédigés** par l'IA à partir du sens (le résumé, les actions demandées).

C'est plus qu'une transcription : le service **comprend** le message.

## Analyser de l'audio dans le portail Foundry

Le portail est un moyen rapide de **vérifier que l'analyseur renvoie les bons champs** avant d'automatiser par le code. On peut y :

- choisir un analyseur **audio ou vidéo** et le lancer sur un fichier ;
- consulter les sorties : **transcription** pour l'audio, et **informations extraites** selon le schéma ;
- afficher le **JSON** renvoyé, pour un traitement en aval.

> **Exemple du cours.** Au lieu d'écouter un appel en entier, tu lances l'analyseur audio préconstruit. À la fin, tu lis la transcription écrite et les informations précises tirées de l'appel, en JSON.

## Extraire des données d'une vidéo

Content Understanding prend aussi en charge l'**analyse vidéo**. Par exemple : analyser une visioconférence enregistrée pour en tirer la présence, le lieu et d'autres informations.

### Exemple : une image de la caméra de la salle

Schéma :

- Location
- In-person attendees
- Remote attendees
- Total attendees

Image analysée : une personne dans une salle de réunion, en appel avec trois participants à distance.

| Champ | Valeur extraite |
|---|---|
| Location | Conference room |
| In-person attendees | 1 |
| Remote attendees | 3 |
| Total attendees | 4 |

Le service ne se contente pas de décrire l'image : il **compte** et **classe** les participants selon les champs demandés.

### Pour un enregistrement vidéo complet

Le schéma pourrait aussi demander :

- le **nombre de participants** à différents moments ;
- **qui a parlé** pendant l'appel, et ce qui a été dit ;
- un **résumé** de la discussion ;
- la liste des **actions assignées**.

## Par le code

Même principe que pour une facture : seul l'identifiant de l'analyseur et le fichier changent.

```python
import os
from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.core.credentials import AzureKeyCredential

endpoint = os.environ["FOUNDRY_ENDPOINT"]  # ex. "https://<resource>.services.ai.azure.com/"
key = os.environ["FOUNDRY_KEY"]

client = ContentUnderstandingClient(
    endpoint=endpoint,
    credential=AzureKeyCredential(key)
)

# Un analyseur préconstruit pour l'audio
analyzer_id = "prebuilt-audioSearch"

inputs = [
    {"url": "https://<your-host>/samples/voicemail.wav"}
]

# Lancer l'analyse (opération longue asynchrone)
poller = client.begin_analyze(analyzer_id=analyzer_id, inputs=inputs)

# Attendre la fin (le SDK interroge en coulisses)
result = poller.result()

for content in result.contents:
    print(getattr(content, "markdown", None))   # transcription, si fournie
    print(getattr(content, "fields", None))     # champs extraits
```

| Ligne | Rôle |
|---|---|
| `analyzer_id = "prebuilt-audioSearch"` | Le choix de l'analyseur audio |
| `inputs = [{"url": ...}]` | Le fichier à analyser, désigné par une URL |
| `client.begin_analyze(...)` | **Lance** l'analyse asynchrone |
| `poller.result()` | **Attend** le résultat ; le SDK fait l'interrogation |
| `content.markdown` | La transcription ou le rendu Markdown |
| `content.fields` | Les champs extraits |

Selon l'analyseur et le schéma, on reçoit une transcription, des champs, ou les deux.

## Documents, audio, vidéo : la même logique

| | Document | Audio | Vidéo |
|---|---|---|---|
| Exemple | Facture | Message vocal | Visioconférence |
| Schéma d'exemple | Vendor, total, items | Caller, summary, callback | Location, attendees |
| Analyseur préconstruit | `prebuilt-invoice` | `prebuilt-audioSearch` | `prebuilt-videoSearch` |
| Sortie | JSON | JSON, avec transcription | JSON |
| Code | `begin_analyze` + `poller.result()` | Le même | Le même |

#### Point examen : le guide d'étude demande d'« extraire de l'information à partir d'audio et de vidéo avec Content Understanding ». Retiens que le même couple schéma + analyseur, et le même code asynchrone, s'appliquent à tous les types de contenu.

## Exercices rapides

**1.** Quels types de résultats Content Understanding fournit-il à partir d'un fichier audio ?

**2.** Dans l'exemple de la messagerie vocale, cite trois champs du schéma.

**3.** Lequel de ces champs est rédigé par l'IA plutôt que copié : le numéro de rappel ou le résumé du message ?

**4.** Dans l'exemple de la salle de réunion, quels champs le schéma demande-t-il ?

**5.** Quel analyseur préconstruit pour un appel enregistré ? Et pour une vidéo ?

**6.** Qu'est-ce qui change dans le code entre l'analyse d'une facture et celle d'un fichier audio ?

**7.** Cite deux informations que l'on pourrait ajouter au schéma pour un enregistrement vidéo complet d'une réunion.

**8.** Pourquoi tester un analyseur dans le portail avant d'écrire du code ?

<details>
<summary>Voir le corrigé</summary>

**1.** Des transcriptions, des résumés et d'autres informations clés.

**2.** Trois parmi : Caller, Message summary, Requested actions, Callback number, Alternative contact details.

**3.** Le résumé du message.

**4.** Location, In-person attendees, Remote attendees et Total attendees.

**5.** `prebuilt-audioSearch` pour l'audio, `prebuilt-videoSearch` pour la vidéo.

**6.** L'identifiant de l'analyseur et le fichier fourni en entrée. Le reste, `begin_analyze` puis `poller.result()`, est identique.

**7.** Deux parmi : le nombre de participants à différents moments, qui a parlé et ce qui a été dit, un résumé de la discussion, la liste des actions assignées.

**8.** Pour vérifier rapidement que l'analyseur renvoie bien les champs attendus avant d'automatiser.

</details>
