# Choose an endpoint and SDK — endpoint, SDK, authentification

## L'essentiel

- Chaque projet Foundry a **deux endpoints** : l'endpoint du **projet** et l'endpoint **Azure OpenAI**.
- Deux SDK : le **SDK Foundry** (`azure-ai-projects`) et le **SDK OpenAI** (`openai`). Les deux donnent un client compatible OpenAI pour envoyer des prompts.
- En production : authentification **Microsoft Entra ID**. Les clés d'API sont possibles, avec prudence.
- **SDK Foundry** si tu as besoin d'agents, d'évaluations, de traçage, de connexions. **SDK OpenAI** pour de l'inférence simple et un code portable.
- On peut **combiner** les deux dans la même application.

## Les deux endpoints

On les trouve sur la page **Overview** du projet, dans le portail Foundry (`https://ai.azure.com`).

| Endpoint | Format |
|---|---|
| **Projet** | `https://{resource-name}.services.ai.azure.com/api/projects/<project-name>` |
| **Azure OpenAI** | `https://{resource-name}.openai.azure.com/openai/v1` |

Moyen de les reconnaître : `services.ai.azure.com` + `/api/projects/` = projet. `openai.azure.com` + `/openai/v1` = Azure OpenAI.

## Option A — SDK Foundry + endpoint du projet

Le SDK Foundry existe pour **Python**, **.NET** et **JavaScript**, sous le nom *Azure AI Projects*. Chaque version évolue séparément : une fonction peut exister dans l'une et pas encore dans l'autre.

### Installation

```bash
pip install azure-ai-projects azure-identity openai
```

Trois paquets, chacun a son rôle :

| Paquet | Rôle |
|---|---|
| `azure-ai-projects` | Le SDK Foundry |
| `azure-identity` | L'authentification par identifiants Azure |
| `openai` | Nécessaire car le client de chat du SDK Foundry **dérive du SDK OpenAI** |

### Connexion

```python
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project_endpoint = "https://{resource-name}.services.ai.azure.com/api/projects/<project-name>"
project_client = AIProjectClient(
    credential=DefaultAzureCredential(),
    endpoint=project_endpoint
)
```

Le code doit s'exécuter dans une **session Azure authentifiée**. En local, tu te connectes d'abord avec `az login`.

### Ce que fait AIProjectClient

Il donne accès aux opérations **propres à Foundry**, sans équivalent OpenAI :

- récupérer les **connexions** aux ressources ;
- lire la **configuration** du projet ;
- activer le **traçage** ;
- gérer les **jeux de données** et les **index**.

### Obtenir un client de chat

```python
openai_client = project_client.get_openai_client(api_version="2024-10-21")
```

La méthode **`get_openai_client()`** renvoie un client compatible OpenAI. C'est avec lui qu'on envoie des prompts.

## Option B — SDK OpenAI + endpoint Azure OpenAI

Le SDK OpenAI est la bibliothèque cliente officielle de l'API OpenAI. Il gère les requêtes HTTP, l'authentification, les nouvelles tentatives et l'analyse des réponses. Il fonctionne de la même façon avec les modèles hébergés par OpenAI, les déploiements Azure OpenAI et les modèles Foundry.

### Installation

```bash
pip install openai azure-identity
```

`azure-identity` n'est requis que pour l'authentification par jeton avec Entra ID.

### Trois façons de s'authentifier

**1. Microsoft Entra ID (recommandé)**

```python
from openai import OpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

token_provider = get_bearer_token_provider(
    DefaultAzureCredential(), "https://ai.azure.com/.default"
)

openai_client = OpenAI(
    base_url="https://{resource-name}.openai.azure.com/openai/v1/",
    api_key=token_provider,
)
```

À remarquer : le fournisseur de jeton est passé dans le paramètre **`api_key`**, et le périmètre demandé est `https://ai.azure.com/.default`.

**2. Clé d'API**

```python
import os
from openai import OpenAI

openai_client = OpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    base_url="https://{resource-name}.openai.azure.com/openai/v1/"
)
```

Les clés se stockent dans **Azure Key Vault** et ne s'écrivent **jamais** directement dans le code.

**3. Variables d'environnement**

Si `OPENAI_BASE_URL` et `OPENAI_API_KEY` sont définies, le client les lit tout seul :

```python
from openai import OpenAI

openai_client = OpenAI()   # utilise les variables d'environnement
```

### À quoi sert le client OpenAI

- générer des réponses avec l'**API Responses** ;
- les **chat completions** et la **génération d'images** ;
- accéder aux **modèles directs Foundry** (ceux qui ne sont pas des modèles Azure OpenAI).

### Le client AzureOpenAI

En règle générale, on utilise le client **`OpenAI`** avec l'endpoint Azure OpenAI v1. Le client **`AzureOpenAI`** reste disponible si tu as besoin d'une **version précise** de l'API Azure OpenAI. Il faut alors indiquer la version et l'endpoint Azure :

```python
import os
from openai import AzureOpenAI

openai_client = AzureOpenAI(
    azure_endpoint="https://{resource-name}.openai.azure.com",
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version="2024-10-21",
)
```

| | `OpenAI` | `AzureOpenAI` |
|---|---|---|
| Paramètre d'adresse | `base_url` (se termine par `/openai/v1/`) | `azure_endpoint` (sans `/openai/v1`) |
| Version d'API | Non précisée | `api_version` **obligatoire** |
| Usage | Le cas général | Besoin d'une version précise de l'API |

## Quel SDK choisir ?

| Besoin | SDK |
|---|---|
| **Foundry Agent Service** : créer et gérer des agents | Foundry |
| Invocation d'outils et **workflows d'approbation** | Foundry |
| **Évaluations** dans le cloud | Foundry |
| **Traçage** et observabilité | Foundry |
| Modèles directs Foundry | Foundry |
| Métadonnées du projet, **connexions**, gouvernance | Foundry |
| Compatibilité totale avec l'API OpenAI, code et outils existants | OpenAI |
| **Portabilité** entre OpenAI et Azure OpenAI | OpenAI |
| API Chat Completions, Responses, Images | OpenAI |
| Dépendre le moins possible des notions propres à Foundry | OpenAI |

Le SDK OpenAI convient à l'**inférence** quand on veut que du code OpenAI existant marche presque sans modification. En contrepartie, il **ne donne pas** accès aux agents ni aux évaluations.

Microsoft recommande le SDK Foundry pour les applications avec **agents, évaluations ou fonctions propres à Foundry**.

> **Exemple 1.** Ton équipe a un chatbot écrit avec le SDK OpenAI et veut le brancher sur un modèle déployé dans Foundry en changeant le moins de code possible : **SDK OpenAI**, endpoint Azure OpenAI.
>
> **Exemple 2.** Tu construis un agent qui appelle des outils et tu veux tracer chaque exécution : **SDK Foundry**.
>
> **Exemple 3.** Tu veux les deux : le SDK Foundry pour les fonctions du projet, le SDK OpenAI pour l'inférence. C'est permis dans la même application.

#### Point examen : le paquet Python du SDK Foundry est azure-ai-projects, la classe est AIProjectClient et le client de chat s'obtient avec get_openai_client(). Les noms azure-foundry et microsoft-foundry-sdk n'existent pas.

## Exercices rapides

**1.** Cette adresse est-elle l'endpoint du projet ou l'endpoint Azure OpenAI ? `https://contoso.openai.azure.com/openai/v1`

**2.** Complète : `pip install azure-ai-projects ____ openai` pour pouvoir utiliser `DefaultAzureCredential`.

**3.** Quelle méthode de `AIProjectClient` renvoie un client pour discuter avec un modèle ?

**4.** Pourquoi faut-il installer `openai` quand on utilise le SDK Foundry pour une application de chat ?

**5.** Dans quel paramètre du client `OpenAI` passe-t-on le fournisseur de jeton Entra ID ?

**6.** Tu veux tracer les appels et gérer des agents. SDK Foundry ou SDK OpenAI ?

**7.** Quelle commande lances-tu en local avant d'exécuter du code qui utilise `DefaultAzureCredential` ?

**8.** Où stocke-t-on une clé d'API ?

<details>
<summary>Voir le corrigé</summary>

**1.** L'endpoint Azure OpenAI.

**2.** `azure-identity`.

**3.** `get_openai_client()`.

**4.** Parce que le client de chat du SDK Foundry est dérivé du SDK OpenAI.

**5.** Dans `api_key`.

**6.** SDK Foundry.

**7.** `az login`.

**8.** Dans Azure Key Vault, jamais directement dans le code.

</details>
