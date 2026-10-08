# Create a client application that analyzes text

## L'essentiel

- Une **application cliente** est un programme qui se connecte à un service ou à un modèle et utilise ses capacités.
- Deux voies : l'**API OpenAI** (API Responses) pour un modèle généraliste, ou le **SDK Azure Language** pour des résultats structurés.
- La configuration se range dans un fichier **`.env`** : endpoint, clé, nom du déploiement.
- Le **nom du déploiement** est celui que **tu** donnes au modèle ; par défaut, c'est le nom du modèle.
- API OpenAI = souple mais **résultats variables**. SDK Azure Language = **valeurs constantes et structurées**.

## Le vocabulaire

| Terme | Définition |
|---|---|
| **API** | Un ensemble de règles qui définit comment deux logiciels communiquent |
| **Bibliothèque cliente** | Du code prêt à l'emploi pour parler facilement à un service ou à une API |
| **SDK** | Un kit de développement : des bibliothèques pour un langage donné |
| **Éditeur de code** | L'outil où l'on écrit le code, comme Visual Studio Code |
| **Terminal** | La fenêtre de ligne de commande intégrée à l'éditeur |
| **Classe** | Un **plan** qui définit un type de chose : ses données et ses actions |
| **Objet** | Une **instance** créée à partir de ce plan |
| **Objet client authentifié** | Un objet qui peut faire des appels d'API autorisés sans que ton code gère lui-même les jetons ou secrets |

> **Exemple du cours.** La classe `Car` dit que toute voiture a une couleur et peut `drive()` ou `stop()`. Une voiture rouge précise est un **objet**.

## Voie 1 — l'API OpenAI

L'**API Responses** est l'API moderne et unifiée d'Azure OpenAI pour interagir avec les modèles de langage. Elle convient quand il faut une analyse souple, de style conversationnel, sans sortie structurée fixe.

### Étape 1 — installer

```bash
pip install openai
```

### Étape 2 — le fichier de configuration `.env`

```
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/openai/v1/
MODEL_DEPLOYMENT_NAME=gpt-4.1-mini
API_KEY=<your-foundry-key>
```

- L'endpoint contient le **nom de ta ressource Foundry** et `openai.azure.com/openai/v1`.
- La clé d'API est la **clé de ton projet Foundry**.
- Si tu déploies `gpt-4.1` en le nommant `gpt-demo-model`, le nom du déploiement est `gpt-demo-model`. Sans personnalisation, il est identique au nom du modèle.

### Étape 3 — le code

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

# Charger les variables du fichier .env
load_dotenv()
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("API_KEY")
deployment_name = os.getenv("MODEL_DEPLOYMENT_NAME")

# Créer l'objet client
client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

# Envoyer une requête
message = client.responses.create(
    model=deployment_name,
    input="",
)

# Afficher le résultat
print(f"Sentiment: {message.output[0]}")
```

| Ligne | Rôle |
|---|---|
| `load_dotenv()` | Lit le fichier `.env` et charge ses valeurs dans l'environnement |
| `os.getenv("...")` | Récupère une valeur par son **nom** |
| `OpenAI(base_url=..., api_key=...)` | Crée l'objet client authentifié |
| `client.responses.create(model=..., input=...)` | Envoie le prompt à un déploiement précis |

Chaque nom dans `.env` doit correspondre **exactement** au nom demandé dans le code. Si le fichier dit `API_KEY`, le code doit demander `API_KEY`.

On lance le programme avec `python <nom_du_fichier>.py`.

### La limite

L'API est simple, mais les résultats peuvent **varier d'un appel à l'autre**, car le modèle génère le texte de façon **probabiliste**. Deux appels avec le même prompt peuvent donner une formulation ou une mise en forme un peu différentes.

Quand l'application a besoin de valeurs **constantes et structurées** (un code de langue, un score de confiance, un texte masqué), le **SDK Azure Language** est le meilleur choix.

## Voie 2 — le SDK Azure Language

C'est la bibliothèque cliente d'Azure Language dans Foundry Tools. Il faut une **ressource Foundry**.

### Installer et configurer

```bash
pip install azure-ai-textanalytics
```

```
AZURE_LANGUAGE_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com/
API_KEY=<your-foundry-key>
```

### Créer le client

```python
import os
from dotenv import load_dotenv
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

load_dotenv()
endpoint = os.getenv("AZURE_LANGUAGE_ENDPOINT")
key = os.getenv("API_KEY")

client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))
```

### Détecter la langue

`detect_language()` prend une **liste** de textes et renvoie la langue détectée, son code **ISO 639-1** et un score de confiance entre 0 et 1.

```python
text = "¡Hola! Me llamo Josefina y vivo en Madrid, España."
result = client.detect_language([text])[0]

print(f"Language      : {result.primary_language.name}")
print(f"ISO code      : {result.primary_language.iso6391_name}")
print(f"Confidence    : {result.primary_language.confidence_score:.2f}")
```

### Détecter les PII

`recognize_pii_entities()` renvoie le **texte masqué** et la **liste des entités** trouvées, avec leur catégorie et leur score de confiance.

```python
text = "Maria Garcia called from 020 7946 0958 and asked to send documents to 42 Market Road, London, UK, SW1A 1AA."

result = client.recognize_pii_entities([text])[0]

print("Redacted text:", result.redacted_text)
for entity in result.entities:
    print(f"  {entity.text} | category={entity.category} | confidence={entity.confidence_score}")
```

## Les deux voies côte à côte

| | API OpenAI | SDK Azure Language |
|---|---|---|
| Paquet | `openai` | `azure-ai-textanalytics` |
| Classe du client | `OpenAI` | `TextAnalyticsClient` |
| Endpoint | `...openai.azure.com/openai/v1/` | `...cognitiveservices.azure.com/` |
| Appel | `client.responses.create(...)` | `client.detect_language([...])`, `client.recognize_pii_entities([...])` |
| Résultat | Texte libre, **variable** | Valeurs **structurées et constantes** |

Deux détails à remarquer : les méthodes Azure Language prennent une **liste** (d'où les crochets et le `[0]`), et l'identifiant passe par `AzureKeyCredential`.

#### Point examen : deux questions officielles du module — quand la même entrée doit renvoyer des résultats structurés fondés sur des techniques statistiques, on choisit le SDK Azure Language ; l'objet client sert à faire communiquer le code de l'application avec le service Azure Language.

## Exercices rapides

**1.** Quel paquet pip pour l'API OpenAI ? Et pour Azure Language ?

**2.** À quoi sert `load_dotenv()` ?

**3.** Tu as déployé `gpt-4.1-mini` sous le nom `analyse-avis`. Que mets-tu dans `MODEL_DEPLOYMENT_NAME` ?

**4.** Quelle méthode détecte la langue d'un texte ? Quelle méthode masque les données personnelles ?

**5.** Complète : `result = client.detect_language(____)[0]` pour analyser la variable `text`.

**6.** Pourquoi les résultats de l'API OpenAI peuvent-ils varier entre deux appels identiques ?

**7.** Ton `.env` contient `FOUNDRY_KEY=...` mais ton code fait `os.getenv("API_KEY")`. Que se passe-t-il ?

**8.** Quelle propriété contient le texte dont les PII ont été masquées ?

<details>
<summary>Voir le corrigé</summary>

**1.** `openai` ; `azure-ai-textanalytics`.

**2.** À lire le fichier `.env` et à charger ses valeurs dans l'environnement de l'application.

**3.** `analyse-avis`, le nom du déploiement.

**4.** `detect_language()` ; `recognize_pii_entities()`.

**5.** `[text]` : la méthode attend une liste.

**6.** Parce que le modèle génère le texte de façon probabiliste.

**7.** La valeur n'est pas trouvée : les noms doivent correspondre exactement entre le fichier et le code.

**8.** `result.redacted_text`.

</details>
