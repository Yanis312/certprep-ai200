# Lab — extraction d'informations avec Content Understanding

## Objectif

Essayer trois analyseurs de **Content Understanding**, du plus simple au plus spécialisé : **OCR/Read**, **Layout**, **Receipt**. Puis lire le code Python d'exemple.

- **Durée** : environ 25 minutes.
- Tout se fait dans le **portail Foundry**.

## Étape 1 — Créer le projet

1. `https://ai.azure.com`, connecte-toi, active **New Foundry**.
2. Crée un projet (ou choisis-en un existant). Dans **Advanced options** :
   - **Foundry resource** : un nom valide ;
   - **Subscription** et **Resource group** ;
   - **Region** : **West US**, **Sweden Central**, **Australia East**, ou une autre région de la liste du lab.

Piège : Content Understanding n'est pas disponible dans toutes les régions. Choisis-en une de la liste.

Selon tes permissions, tu devras peut-être décocher l'option de création des ressources recommandées.

## Étape 2 — Ouvrir le playground

1. Barre du haut : **Build**.
2. Menu de gauche : **Services**.
3. Sélectionne **Content Understanding**.

Content Understanding transforme du contenu multimodal non structuré (documents, images, vidéo, audio) en sorties structurées comme du JSON. Il **extrait**, **classe** et **génère** des champs, avec des **scores de confiance** et un **ancrage dans la source**.

## Étape 3 — Lire du texte avec OCR/Read

1. Choisis **OCR/Read**. Vérifie que **Document** est sélectionné dans **Modality** et **OCR/Read** dans la liste des analyseurs.
2. Sélectionne une image d'exemple, puis **Run analysis**.
3. Dans le volet de droite, regarde les onglets **Markdown**, **Paragraphs** et **Result**.
4. Télécharge `https://aka.ms/pcb-images` et extrais l'archive : ce sont des photos de circuits imprimés avec du texte.
5. Charge une image de circuit, lance l'analyse, lis le résultat. Recommence avec les autres.

**Ce que tu dois observer** : le texte est lu, sans interprétation.

## Étape 4 — Capturer la mise en page avec Layout

1. Dans la liste des analyseurs, choisis **Layout**.
2. Sélectionne une image d'exemple, puis **Run analysis**.
3. Regarde les onglets **Markdown**, **Paragraphs**, **Tables** et **Result**.

**Ce que tu dois observer** : un onglet **Tables** apparaît. L'analyseur a compris la **structure** du document.

Extraire le texte et la mise en page suffit quand les documents ont une structure **constante et bien définie**. Souvent, il faut en plus savoir **quelle valeur correspond à quel champ** : il faut un analyseur plus spécifique.

## Étape 5 — Extraire des champs avec Receipt

Scénario : extraire les champs de reçus scannés pour automatiser des notes de frais.

1. Dans la liste des types d'analyseurs, choisis **Procurement**, puis l'analyseur **Receipt**.
2. Si on te propose de déployer des modèles, clique sur **Cancel**.
3. **Ne lance pas l'analyse** : on consulte les résultats déjà préparés.
4. Dans le volet de droite, regarde les onglets **Fields**, **Markdown**, **Paragraphs** et **Result**.

**Ce que tu dois observer** : l'onglet **Fields** présente les valeurs associées à des champs (nom du marchand, téléphone, dates, montants).

| Onglet | Ce qu'il montre |
|---|---|
| **Fields** | Une version **lisible** des informations |
| **Result** | Le **JSON brut**, tel qu'une application cliente le recevrait |

Comment ça marche : l'**OCR** repère le texte et sa position, puis un **modèle d'IA générative** associe chaque valeur à un champ.

## Les trois analyseurs, en escalier

| Analyseur | Ce qu'il fait | Ce qu'il ajoute |
|---|---|---|
| **Read** | Extrait le **texte brut**, sans interpréter la structure ni le sens | — |
| **Layout** | Capture la **structure** et la **hiérarchie** | Paragraphes, tableaux |
| **Receipt** | Extrait les valeurs et les **associe à des champs** | Le sens métier |

Chacun s'appuie sur le précédent.

## Étape 6 — Lire le code Python

En regardant les résultats de l'analyseur Receipt, ouvre l'onglet **Code**. L'essentiel :

```python
from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.ai.contentunderstanding.models import AnalysisInput, AnalysisResult
from azure.core.credentials import AzureKeyCredential
from azure.identity import DefaultAzureCredential

endpoint = "https://content-project-resource.services.ai.azure.com/"
key = ""
file_url = ""
analyzer_id = "prebuilt-receipt"
api_version = "2025-11-01"

# Clé d'API si elle est fournie, sinon identité Entra ID
credential = AzureKeyCredential(key) if key and "" not in key else DefaultAzureCredential()
client = ContentUnderstandingClient(endpoint=endpoint, credential=credential, api_version=api_version)

poller = client.begin_analyze(
    analyzer_id=analyzer_id,
    inputs=[AnalysisInput(url=file_url)],
)
result: AnalysisResult = poller.result()
```

| Élément | Rôle |
|---|---|
| `analyzer_id = "prebuilt-receipt"` | L'analyseur de reçus |
| `AzureKeyCredential(key)` ou `DefaultAzureCredential()` | Deux façons de s'authentifier : **clé** ou **Entra ID** |
| `client.begin_analyze(...)` | Lance l'analyse |
| `poller.result()` | Attend le résultat |

Le code se connecte à l'outil Content Understanding de ta ressource Foundry et envoie un document à l'analyseur. L'analyseur s'exécute de façon **asynchrone** et renvoie le résultat au format **JSON** vu dans l'onglet Result.

## Nettoyage

`https://portal.azure.com` → groupe de ressources → **Delete resource group** → saisis le nom pour confirmer.

## Exercices rapides

**1.** Où se trouve Content Understanding dans le portail Foundry ?

**2.** Classe les trois analyseurs du lab du plus simple au plus spécialisé.

**3.** Quel analyseur fait apparaître un onglet Tables ?

**4.** Quelle différence entre les onglets Fields et Result ?

**5.** Quel identifiant d'analyseur le code du lab utilise-t-il ?

**6.** Quelles deux méthodes d'authentification le code prévoit-il ?

**7.** Pourquoi le lab impose-t-il certaines régions ?

<details>
<summary>Voir le corrigé</summary>

**1.** Build, puis Services, puis Content Understanding.

**2.** Read, Layout, Receipt.

**3.** Layout.

**4.** Fields montre une version lisible des informations ; Result montre le JSON brut que recevrait une application cliente.

**5.** `prebuilt-receipt`.

**6.** Une clé d'API (`AzureKeyCredential`) ou une identité Entra ID (`DefaultAzureCredential`).

**7.** Parce que Content Understanding n'est disponible que dans certaines régions, comme West US, Sweden Central ou Australia East.

</details>
