# Lecture de code 1 — paquets, clients et endpoints

## L'essentiel

- À l'examen, tu dois **lire** du Python, jamais en écrire. Le plus souvent, il faut reconnaître **quel paquet**, **quel client** ou **quelle ligne** correspond à un service.
- Chaque service a **son paquet** (`pip install ...`) et **sa classe de client**.
- Un client a presque toujours besoin de deux choses : un **endpoint** (l'adresse) et une **authentification** (une clé ou une identité).
- Les modèles et les agents passent par le **client OpenAI** et la méthode `responses.create`.

## Le tableau à connaître par cœur

| Service | Paquet à installer | Import | Client |
|---|---|---|---|
| Modèles génératifs (texte, image) | `openai` | `from openai import OpenAI` | `OpenAI(...)` |
| Projet Foundry et agents | `azure-ai-projects`, `azure-identity` | `from azure.ai.projects import AIProjectClient` | `AIProjectClient(...)` |
| Azure Language (analyse de texte) | `azure-ai-textanalytics` | `from azure.ai.textanalytics import TextAnalyticsClient` | `TextAnalyticsClient(...)` |
| Azure Speech | `azure-cognitiveservices-speech` | `import azure.cognitiveservices.speech as speechsdk` | `SpeechConfig`, `SpeechRecognizer`, `SpeechSynthesizer` |
| Voice Live | `azure-ai-voicelive` | | |
| Content Understanding | `azure-ai-contentunderstanding` | `from azure.ai.contentunderstanding import ContentUnderstandingClient` | `ContentUnderstandingClient(...)` |

> **Astuce mémoire.** Le nom du paquet ressemble au service : *textanalytics* pour le texte, *speech* pour la parole, *contentunderstanding* pour l'extraction, *projects* pour le projet Foundry.

## Les deux façons de s'authentifier

| Méthode | Code | Quand |
|---|---|---|
| **Clé** | `AzureKeyCredential(key)` ou `api_key=...` | Labs, exemples simples |
| **Identité Microsoft Entra** | `DefaultAzureCredential()` | Projet Foundry et agents ; plus sûr, pas de clé dans le code |

```python
from azure.core.credentials import AzureKeyCredential      # authentification par clé
from azure.identity import DefaultAzureCredential          # authentification par identité
```

## Lire un client : 3 exemples

### Le client OpenAI (modèles)

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url=f"{os.environ['AZURE_OPENAI_ENDPOINT']}/openai",   # l'adresse
    api_key=os.environ["AZURE_OPENAI_API_KEY"]                  # la clé
)
```

### Le client de projet Foundry (agents)

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project_client = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential(),
)
openai_client = project_client.get_openai_client()   # un client OpenAI tiré du projet
```

### Le client Azure Language

```python
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

## Ne pas mettre les secrets dans le code

Les exemples lisent l'endpoint et la clé depuis des **variables d'environnement**, souvent chargées d'un fichier `.env` :

```python
import os
from dotenv import load_dotenv

load_dotenv()                                    # charge le fichier .env
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")    # lit une variable
api_key = os.getenv("API_KEY")
```

`os.getenv("X")` et `os.environ["X"]` lisent tous les deux une variable d'environnement.

## Lire une URL d'endpoint

```
https://MA-RESSOURCE.services.ai.azure.com/api/projects/MON-PROJET/openai/responses?api-version=2025-11-15-preview
        └ ressource ┘                        └ projet ┘  └ API OpenAI ┘ └ méthode ┘  └ version de l'API ┘
```

| Morceau | Signification |
|---|---|
| `MA-RESSOURCE.services.ai.azure.com` | La **ressource** Foundry |
| `/api/projects/MON-PROJET` | Le **projet** dans la ressource |
| `/openai/responses` | L'API **Responses** |
| `api-version=...` | La version de l'API |

En appel REST direct (`curl`), on envoie un **POST** avec un en-tête `Authorization: Bearer <jeton>` (ou `api-key: <clé>`) et un corps JSON qui contient `model` et `input`.

#### Point examen : on te montre un import ou un `pip install` et on te demande le service, ou l'inverse. Retiens le tableau des paquets et la différence clé (`AzureKeyCredential`) / identité (`DefaultAzureCredential`).

## Exercices rapides

**1.** Quel paquet installer pour analyser le sentiment ou détecter la langue d'un texte ?

**2.** Quel client utilise-t-on pour récupérer un agent Foundry ?

**3.** Que fait `DefaultAzureCredential()` ?

**4.** Ligne manquante : quel import faut-il pour cette ligne ?

```python
client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

**5.** À quoi sert `load_dotenv()` ?

**6.** Dans l'URL `https://contoso.services.ai.azure.com/api/projects/support/openai/responses`, quel est le nom du projet ?

**7.** Associe : `azure-cognitiveservices-speech`, `openai`, `azure-ai-contentunderstanding` — avec : extraire les champs d'une facture, transcrire un appel, générer du texte.

**8.** Trouve l'erreur : on veut analyser du texte avec Azure Language.

```python
from openai import OpenAI
client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

<details>
<summary>Voir le corrigé</summary>

**1.** `azure-ai-textanalytics`.

**2.** `AIProjectClient`, du paquet `azure-ai-projects`.

**3.** Elle authentifie avec une identité Microsoft Entra, sans clé dans le code.

**4.** `from azure.ai.contentunderstanding import ContentUnderstandingClient` (et `from azure.core.credentials import AzureKeyCredential`).

**5.** À charger les variables du fichier `.env` dans l'environnement.

**6.** `support`.

**7.** Speech = transcrire un appel. openai = générer du texte. contentunderstanding = extraire les champs d'une facture.

**8.** Le mauvais import : il faut `from azure.ai.textanalytics import TextAnalyticsClient` et `from azure.core.credentials import AzureKeyCredential`.

</details>
