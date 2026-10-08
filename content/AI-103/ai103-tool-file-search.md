# Use the file_search tool — répondre à partir de tes documents

## L'essentiel

- `file_search` permet au modèle de retrouver l'information utile dans **tes propres documents** chargés.
- Les fichiers sont indexés dans un **vector store** ; la recherche est **sémantique** (par le sens).
- Deux temps : **préparer** (créer le vector store, charger les fichiers), puis **interroger** (déclarer l'outil avec les identifiants du vector store).
- Réglage propre : **`vector_store_ids`**.
- Pour de gros volumes répartis dans plusieurs sources, préférer **Foundry IQ** avec un agent.

## À quoi il sert

Répondre à partir de fichiers **privés ou propres à un domaine** : politiques internes, manuels, contrats, bases de connaissances. Le modèle ne s'appuie plus seulement sur ses données d'entraînement générales.

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| **Réponses ancrées dans les documents** | Fondées sur les fichiers que tu as chargés |
| **Recherche sémantique** | Trouve les passages par le sens, pas seulement par mots-clés exacts |
| **Intégration aux vector stores** | Recherche dans une ou plusieurs collections de documents indexés |
| **Citations et transparence** | On peut inclure les résultats trouvés, pour le débogage et la traçabilité |
| **Pertinence pour l'entreprise** | Les connaissances de l'organisation entrent dans les réponses |

## Cas d'usage

| Cas | Exemple |
|---|---|
| Questions sur les politiques | Répondre aux employés à partir des PDF de politique RH |
| Assistants de support | Retrouver les étapes d'un guide de dépannage interne |
| Revue juridique | Localiser des clauses précises dans des contrats |
| Découverte de connaissances | Résumer des réponses issues d'une documentation technique |

## Exemple de code

```python
# 1. PRÉPARER : créer le vector store et y charger un fichier
vector_store = client.vector_stores.create(name="policy-docs")
client.vector_stores.files.upload_and_poll(
    vector_store_id=vector_store.id,
    file=open("expenses_policy.pdf", "rb")
)

# 2. INTERROGER : déclarer l'outil avec l'identifiant du vector store
response = client.responses.create(
    model=model_deployment,
    instructions="You are an AI assistant that provides information from HR policy documents.",
    input="What's the maximum amount I can claim for a taxi ride?",
    tools=[{
        "type": "file_search",
        "vector_store_ids": [vector_store.id]
    }],
    include=["file_search_call.results"]
)
print(response.output_text)
```

Les éléments à connaître :

| Élément | Rôle |
|---|---|
| `client.vector_stores.create(name=...)` | Crée le vector store |
| `client.vector_stores.files.upload_and_poll(...)` | Charge un fichier et **attend** la fin de l'indexation |
| `"vector_store_ids": [vector_store.id]` | Indique à l'outil où chercher ; c'est une **liste** |
| `include=["file_search_call.results"]` | Renvoie aussi les passages trouvés, pour diagnostiquer |

Pour charger **plusieurs fichiers** d'un coup, le lab utilise `client.vector_stores.file_batches.upload_and_poll(vector_store_id=..., files=...)`.

## Les 5 étapes

1. **Tu prépares les fichiers** : chargement dans un vector store.
2. **Tu envoies la requête** avec `file_search` dans `tools` et les identifiants du vector store.
3. **Le modèle fait la récupération** : il cherche les morceaux (chunks) indexés pertinents.
4. **Les résultats sont injectés** : les passages trouvés sont fournis au modèle.
5. **La réponse est générée** à partir de ce contexte.

C'est du **RAG** prêt à l'emploi : retrouver, puis générer.

## Bonnes pratiques

- **Des fichiers de qualité** : propres et à jour, ils améliorent la récupération.
- **Des prompts ciblés** : une question précise réduit les correspondances ambiguës.
- **Des vector stores bien délimités** : sépare les domaines (RH, juridique, finance) quand c'est utile.
- **Inclure les résultats de récupération en développement** : le paramètre `include` aide au dépannage.
- **Faire relire les réponses** dans les processus critiques.

## Limites

| Limite | Conséquence |
|---|---|
| La qualité dépend des documents, de leur couverture et de la pertinence des morceaux | Mauvais documents, mauvaises réponses |
| Un store très gros ou mêlant plusieurs domaines | Contexte moins ciblé |
| Un fichier source mis à jour | Peut demander une **réindexation** avant d'être trouvable |
| La récupération améliore l'ancrage | Mais ne remplace pas la relecture humaine pour les décisions sensibles |

## file_search ou Foundry IQ ?

| | file_search | Foundry IQ |
|---|---|---|
| Échelle | Un ensemble précis de documents | **Gros volumes**, plusieurs magasins de données |
| Utilisé avec | Un modèle, via l'API Responses | Un **agent** Microsoft Foundry |
| Cas type | Ancrer un assistant dans quelques fichiers | Agents à l'échelle de l'entreprise |

> **Exemple.** Un assistant RH qui répond à partir de 12 PDF de politique interne : `file_search`. Un agent qui doit puiser dans SharePoint, une base produit et des milliers de contrats : Foundry IQ.

#### Point examen : question officielle du module — quand un modèle doit répondre à partir de tes propres documents de politique chargés, l'outil est file_search. Retiens aussi le réglage vector_store_ids.

## Exercices rapides

**1.** Quelles sont les deux étapes de préparation avant de pouvoir utiliser `file_search` ?

**2.** Complète : `tools=[{"type": "file_search", "________": [vector_store.id]}]`

**3.** À quoi sert `include=["file_search_call.results"]` ?

**4.** Tu as remplacé le PDF de la politique de frais par une nouvelle version, mais le modèle cite encore l'ancien montant. Pourquoi ?

**5.** La recherche trouve un passage qui parle de « remboursement des courses en VTC » pour une question sur les « taxis ». Quelle propriété de `file_search` l'explique ?

**6.** Ton agent doit interroger de très gros volumes répartis dans plusieurs systèmes. Que recommande Microsoft ?

<details>
<summary>Voir le corrigé</summary>

**1.** Créer un vector store, puis y charger les fichiers.

**2.** `vector_store_ids`.

**3.** À renvoyer les passages trouvés par la recherche, pour le dépannage et la traçabilité.

**4.** Le fichier mis à jour doit être réindexé avant que son nouveau contenu soit trouvable.

**5.** La recherche sémantique : elle trouve par le sens, pas seulement par mots-clés exacts.

**6.** Foundry IQ avec un agent Microsoft Foundry.

</details>
