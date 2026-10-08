# Introduction et extraction depuis des documents — Content Understanding

## L'essentiel

- **Azure Content Understanding** (dans Foundry Tools) utilise l'IA pour extraire de l'information **structurée** d'un contenu **non structuré**.
- Il traite **documents et images**, **audio** et **vidéo**.
- Déroulement en 3 temps : **ingestion → analyse par IA → sortie structurée** (en JSON).
- Deux notions clés : le **schéma** (quoi extraire et sous quelle forme) et l'**analyseur** (l'unité qui applique le schéma).
- Sa différence avec un simple OCR : l'extraction est **pilotée par un schéma** et **sémantique**.

## À quoi ça sert

| Scénario | Besoin |
|---|---|
| Notes de frais | Extraire descriptions et montants de reçus scannés |
| Support client | Analyser des appels enregistrés pour repérer problèmes et solutions |
| Planification de capacité | Estimer la fréquentation à partir de vidéos et d'images |

Content Understanding identifie des **entités, des champs, des relations et du sens** dans le contenu, et le transforme en données **lisibles par une machine**, que l'on peut chercher et analyser.

| Type de contenu | Exemples |
|---|---|
| Documents et images | PDF, formulaires, factures, reçus, contrats |
| Audio | Enregistrements, appels |
| Vidéo | Réunions filmées, fichiers multimédias |

## Le déroulement en 3 temps

```
1. INGESTION          tu envoies le contenu
        │
        ▼
2. ANALYSE PAR IA     OCR + reconnaissance vocale + compréhension du langage
        │             + modèles multimodaux
        ▼
3. SORTIE STRUCTURÉE  des résultats (en JSON) conformes à ton modèle
```

**JSON** (JavaScript Object Notation) est un format texte pour stocker et échanger des données structurées, lisible par l'humain comme par la machine.

## OCR simple ou Content Understanding

| | OCR de base | Content Understanding |
|---|---|---|
| Ce qu'il fait | **Lit le texte** d'une image | Extrait des **champs et leurs valeurs** selon un schéma |
| Comprend le sens, le contexte, les relations | Non | **Oui** |
| Résultat | Du texte brut | Des données structurées |

## Le schéma

Un **schéma** décrit **quelle information** extraire et **comment** elle doit être structurée. Il liste les champs ou entités qui t'intéressent.

Exemple pour une facture :

- Vendor name, Invoice number, Invoice date
- Customer name, Customer address
- **Items**, chacun avec : description, unit price, quantity ordered, line item total
- Invoice subtotal, Tax, Shipping charge, Invoice total

### Champs imbriqués

Un schéma accepte des champs **structurés et imbriqués**, pas seulement du texte à plat. Ici, `Items` est une **collection**, et chaque élément a sa description, son prix, sa quantité et son total.

Cela permet de comprendre les **relations entre les valeurs**, ce que l'OCR seul ne sait pas faire.

```
Items:
  Item 1:  38" Racing Bike (Red)   | 1299.00 | 1 | 1299.00
  Item 2:  Cycling helmet (Black)  |   25.99 | 1 |   25.99
  Item 3:  Cycling shirt (L)       |   42.50 | 2 |   85.00
Invoice subtotal: 1409.99
Tax: 140.99
Shipping Charge: 35.00
Invoice total: 1585.98
```

### Extraction sémantique

Le schéma est appliqué **par le sens**, pas par l'étiquette :

- un champ est extrait **même si le libellé diffère** ;
- un champ est extrait **même si le libellé est absent**.

> **Exemple.** « Invoice No. », « Invoice # » ou un numéro sans libellé peuvent tous correspondre au champ `InvoiceNumber`, si l'analyseur juge qu'ils représentent la même notion.

## L'analyseur

Un **analyseur** est l'unité qui **prend l'entrée, applique l'analyse par IA et produit des résultats structurés**.

- Il applique **la même logique** d'extraction à tout le contenu.
- Une fois configuré, il garantit que le schéma est **réutilisé de façon constante**.
- Il produit des résultats **JSON prévisibles**, ce qui facilite le stockage, la recherche et l'automatisation.

| Type | Quand |
|---|---|
| **Analyseurs préconstruits** | Scénarios courants |
| **Analyseurs personnalisés** | Besoins propres |

Analyseurs préconstruits cités : `prebuilt-invoice`, `prebuilt-imageSearch`, `prebuilt-audioSearch`, `prebuilt-videoSearch`.

### Les 5 étapes

1. Tu **choisis ou crées** un analyseur.
2. L'analyseur **contient un schéma** (champs et structure).
3. Tu **envoies** le contenu.
4. Le service **applique** le schéma.
5. Tu **reçois** un JSON conforme au schéma.

## Dans le portail Foundry

Après avoir créé une ressource Foundry, tu testes Content Understanding dans le nouveau portail, avec les exemples fournis ou tes propres fichiers. Sur l'image d'un document, le service renvoie le **texte** et sa **mise en page**. Sur une facture, il renvoie les **champs** (comme *Vendor address*) et leurs **valeurs**. On peut aussi afficher le **JSON** du résultat.

## Par le code

### Une analyse asynchrone

L'analyse est **asynchrone** : le résultat arrive plus tard. Il faut **interroger** l'URL `Operation-Location` (ou `analyzerResults`) jusqu'à la réussite du travail. Le SDK Python le fait pour toi.

### Le SDK Python

```bash
python -m pip install azure-ai-contentunderstanding
```

L'endpoint ressemble à `https://<your-resource-name>.services.ai.azure.com/`. L'authentification se fait par **clé d'API** ou **Microsoft Entra ID**.

```python
import os
from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.core.credentials import AzureKeyCredential

endpoint = os.environ["FOUNDRY_ENDPOINT"]
key = os.environ["FOUNDRY_KEY"]

client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))

# 1) lancer l'analyse : identifiant d'analyseur + entrées
analyzer_id = "prebuilt-invoice"
inputs = [{"url": "https://.../invoice.pdf"}]

# 2) attendre la fin de l'opération longue (LRO)
poller = client.begin_analyze(analyzer_id=analyzer_id, inputs=inputs)
result = poller.result()          # le SDK gère l'interrogation

# 3) lire le markdown et les champs
for content in result.contents:
    print(content.markdown)
    print(content.fields)
```

| Élément | Rôle |
|---|---|
| `ContentUnderstandingClient` | Le client du service |
| `analyzer_id` | L'identifiant de l'analyseur, ici préconstruit |
| `begin_analyze(...)` | **Lance** l'opération longue (LRO) |
| `poller.result()` | **Attend** la fin ; l'interrogation est gérée par le SDK |
| `content.markdown` | Le contenu rendu en **Markdown** |
| `content.fields` | Les **champs** extraits |

### Le résultat

```json
{
  "status": "Succeeded",
  "result": {
    "analyzerId": "prebuilt-invoice",
    "contents": [
      {
        "markdown": "# INVOICE\n\nCONTOSO LTD.\n...",
        "fields": {
          "CustomerName": {
            "type": "string",
            "valueString": "MICROSOFT CORPORATION",
            "confidence": 0.95
          },
          "InvoiceDate": {
            "type": "date",
            "valueDate": "2019-11-15",
            "confidence": 0.994
          }
        }
      }
    ]
  }
}
```

Chaque champ a un **type**, une **valeur** et un **score de confiance**. Le nom de la propriété de valeur dépend du type : `valueString` pour du texte, `valueDate` pour une date.

#### Point examen : retiens schéma (quoi extraire) et analyseur (l'unité qui l'applique), la différence avec l'OCR de base, le paquet azure-ai-contentunderstanding, et le fait que l'analyse est asynchrone avec begin_analyze puis poller.result().

## Exercices rapides

**1.** Donne les 3 temps du fonctionnement de Content Understanding.

**2.** Qu'est-ce qu'un schéma ?

**3.** Qu'est-ce qu'un analyseur ?

**4.** Quelle est la différence entre un OCR de base et Content Understanding ?

**5.** Une facture écrit « N° facture » et une autre « Réf. ». Le champ `InvoiceNumber` sera-t-il extrait dans les deux cas ? Pourquoi ?

**6.** Quel analyseur préconstruit pour une facture ?

**7.** Quelles deux lignes de code lancent l'analyse puis attendent son résultat ?

**8.** Quelles trois informations accompagnent chaque champ extrait dans le JSON ?

**9.** Pourquoi dit-on que `Items` est un champ imbriqué ?

<details>
<summary>Voir le corrigé</summary>

**1.** Ingestion du contenu, analyse par IA, sortie structurée.

**2.** La description de l'information à extraire et de sa structure : la liste des champs voulus.

**3.** L'unité qui prend l'entrée, applique l'analyse par IA selon un schéma et produit des résultats structurés.

**4.** L'OCR lit le texte sans en comprendre le sens. Content Understanding extrait des champs et leurs valeurs selon un schéma, en comprenant le contexte et les relations.

**5.** Oui. Le schéma est appliqué de façon sémantique : un champ est reconnu même si son libellé diffère ou manque.

**6.** `prebuilt-invoice`.

**7.** `poller = client.begin_analyze(analyzer_id=..., inputs=...)` puis `result = poller.result()`.

**8.** Son type, sa valeur et son score de confiance.

**9.** Parce que c'est une collection dont chaque élément contient lui-même plusieurs champs : description, prix unitaire, quantité, total.

</details>
