# Ground your model with Retrieval Augmented Generation

## L'essentiel

- Le prompt engineering guide **comment** le modèle répond, mais ne lui donne pas de **connaissances** qu'il n'a pas.
- Les données d'entraînement ont une **date de coupure** et ne contiennent pas les **données privées** de ton organisation.
- **Ancrer** (ground) un modèle = lui fournir des données factuelles et pertinentes sur lesquelles fonder sa réponse.
- Le **RAG** est la technique d'ancrage la plus courante : **Retrieve, Augment, Generate**.
- Dans Foundry, la récupération repose sur **Azure AI Search** ; la **recherche hybride** est recommandée.

## Ancré ou non ancré

| | Non ancré | Ancré |
|---|---|---|
| Source d'information | Les données d'entraînement seulement | Tes données de confiance, ajoutées au prompt |
| Résultat | Correct grammaticalement, mais peut être faux ou inventé | Exact et adapté au contexte |
| Exemple | « Quels hôtels proposez-vous à Paris ? » → des noms d'hôtels **fictifs** | Les vrais hôtels du catalogue, avec prix et disponibilités |

Une réponse non ancrée peut **sembler plausible** tout en étant factuellement incorrecte. L'ancrage relie le modèle à une information **précise, actuelle et pertinente**.

## Les 3 étapes du RAG

```
Question de l'utilisateur
        │
        ▼
1. RETRIEVE   chercher dans une source de données l'information pertinente
        │
        ▼
2. AUGMENT    ajouter cette information au prompt, comme contexte
        │
        ▼
3. GENERATE   envoyer le prompt augmenté au modèle, qui répond de façon ancrée
```

| Étape | Action |
|---|---|
| **Retrieve** (récupérer) | Rechercher l'information pertinente pour la question |
| **Augment** (augmenter) | Ajouter l'information trouvée au prompt |
| **Generate** (générer) | Le modèle produit une réponse ancrée |

## Embeddings et recherche vectorielle

Pour retrouver efficacement la bonne information, le RAG s'appuie sur les **embeddings**.

Un **embedding** est une représentation mathématique d'un texte sous forme de **vecteur** : une liste de nombres à virgule flottante qui capture le **sens** de mots, de phrases ou de documents. On l'obtient en envoyant le contenu à un **modèle d'embedding**, par exemple un modèle d'embedding Azure OpenAI disponible dans Foundry.

> **Exemple.**
>
> - « The children played joyfully in the park. »
> - « Kids happily ran around the playground. »
>
> Les mots diffèrent, le sens est proche. Leurs vecteurs sont donc **proches** dans l'espace multidimensionnel.

La **similarité cosinus** mesure la proximité de deux vecteurs en calculant l'**angle** entre eux. Une valeur **proche de 1** signifie des vecteurs très similaires. On retrouve ainsi des documents pertinents **même sans mots en commun**.

## Azure AI Search pour la récupération

**Azure AI Search** fournit le composant de récupération des solutions RAG dans Foundry. Trois étapes :

1. **Ajouter tes données** à Foundry, depuis **Azure Blob Storage**, **Azure Data Lake Storage Gen2** ou **Microsoft OneLake**, ou en chargeant directement des fichiers.
2. **Créer un index** avec un modèle d'embedding qui génère les vecteurs du contenu. L'index est stocké dans Azure AI Search.
3. **Interroger l'index** quand un utilisateur pose une question : la question est convertie en embedding, le système cherche le contenu le plus similaire et renvoie les résultats.

### Les 4 techniques de recherche

| Technique | Principe |
|---|---|
| **Keyword search** (mots-clés) | Fait correspondre les termes exacts de la requête au texte de l'index |
| **Semantic search** (sémantique) | Utilise des modèles sémantiques pour faire correspondre le **sens** de la requête |
| **Vector search** (vectorielle) | Utilise les embeddings pour trouver du contenu sémantiquement similaire |
| **Hybrid search** (hybride) | **Combine** mots-clés, sémantique et vectorielle pour les résultats les plus précis |

La recherche **hybride** est **recommandée** pour les applications d'IA générative.

## Implémenter le RAG avec le SDK

Une fois l'index créé, on le relie à un modèle par le projet Foundry. Le SDK `azure-ai-projects` fournit un client OpenAI authentifié, puis on utilise l'API Responses.

```python
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project = AIProjectClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

client = project.get_openai_client()

response = client.responses.create(
    model="gpt-4o",
    input=[
        {"role": "system", "content": "You are a helpful travel advisor. "
         "Use the following hotel data to answer: " + retrieved_context},
        {"role": "user", "content": "Which hotels do you offer in Paris?"},
    ],
)

print(response.output_text)
```

`retrieved_context` contient les documents renvoyés par l'index Azure AI Search. On les **injecte dans le message système** : c'est l'étape **Augment**. La réponse s'appuie alors sur tes données réelles et non sur les connaissances générales du modèle.

## Quand utiliser le RAG

| Situation | Exemple |
|---|---|
| Le modèle a besoin de **connaissances propres au domaine** | Catalogue produits, documents de politique, base de connaissances interne |
| L'information **change souvent** | Stocks, prix, actualités : le RAG lit les données courantes **sans réentraînement** |
| L'**exactitude factuelle** est critique | Réponses fondées sur des données réelles |
| Les données d'entraînement ont une **date de coupure** | Événements postérieurs à l'entraînement |

Pour l'agence de voyages : les clients interrogent des hôtels, des destinations et des conditions de réservation précis, le tout ancré dans le vrai catalogue.

## RAG, file_search et Foundry IQ

| Solution | Quand |
|---|---|
| **RAG avec Azure AI Search** | Tu gères ton index et ta recherche, avec le plus de contrôle |
| **Outil `file_search`** | Tu veux ancrer un modèle dans quelques fichiers, sans infrastructure |
| **Foundry IQ** | Tu construis des **agents** et veux un magasin de connaissances **managé**, sans gérer ta propre infrastructure de recherche |

#### Point examen : question officielle du module — on utilise le RAG plutôt que le seul prompt engineering quand le modèle a besoin de données propres au domaine ou récentes sur lesquelles il n'a pas été entraîné. Retiens aussi que la recherche hybride est la technique recommandée.

## Exercices rapides

**1.** Que signifient les trois lettres de RAG, et que fait chaque étape ?

**2.** Qu'est-ce qu'un embedding ?

**3.** Deux vecteurs ont une similarité cosinus de 0,97. Que peux-tu en conclure ?

**4.** Quelle technique de recherche Microsoft recommande-t-il pour les applications d'IA générative, et que combine-t-elle ?

**5.** Cite deux sources de données d'où l'on peut ajouter des données à Foundry pour créer un index.

**6.** Dans le code d'exemple, à quelle étape du RAG correspond la ligne qui concatène `retrieved_context` au message système ?

**7.** Tes prix changent tous les jours. Pourquoi le RAG convient-il mieux que le fine-tuning ?

**8.** Pourquoi un modèle non ancré peut-il inventer des noms d'hôtels ?

<details>
<summary>Voir le corrigé</summary>

**1.** Retrieval Augmented Generation. Retrieve : chercher l'information pertinente. Augment : l'ajouter au prompt. Generate : faire générer la réponse ancrée.

**2.** Une représentation mathématique d'un texte sous forme de vecteur de nombres, qui capture son sens.

**3.** Les deux textes ont un sens très proche.

**4.** La recherche hybride, qui combine recherche par mots-clés, sémantique et vectorielle.

**5.** Deux parmi : Azure Blob Storage, Azure Data Lake Storage Gen2, Microsoft OneLake, ou un chargement direct de fichiers.

**6.** À l'étape Augment.

**7.** Parce que le RAG récupère les données courantes au moment de la requête, sans réentraîner le modèle.

**8.** Parce qu'il ne dispose que de ses données d'entraînement : il produit un texte plausible sans avoir tes données réelles.

</details>
