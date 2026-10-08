# Use the web_search tool — chercher sur le web

## L'essentiel

- `web_search` permet au modèle de récupérer des informations **fraîches** sur le web pendant qu'il génère sa réponse.
- Il sert surtout quand les faits **changent souvent** : prix, sorties de produits, réglementation, actualité.
- Le modèle **décide seul** quand chercher et comment formuler la requête.
- Déclaration la plus simple des quatre : `{"type": "web_search"}`.
- Contreparties : **latence** et **tokens** en plus, qualité des sources variable.

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| **Information en direct** | Des données récentes absentes de l'entraînement du modèle |
| **Réponses ancrées dans des sources** | La réponse se construit à partir du contenu web trouvé |
| **Moins de risque d'hallucination** | La vérification sur des sources externes améliore la fiabilité |
| **Génération automatique de requêtes** | Le modèle décide quand et comment chercher selon l'intention |
| **Expérience fluide** | Recherche et génération se font dans un même flux |

## Cas d'usage

| Cas | Exemple |
|---|---|
| Actualité | Résumer les points clés d'une annonce technologique récente |
| Étude de marché | Comparer les fonctions ou les prix récents de plusieurs fournisseurs |
| Veille réglementaire | Vérifier si une règle ou une recommandation a changé |
| Vérification de faits | Confronter une affirmation à des sources publiques sérieuses |

## Exemple de code

```python
response = client.responses.create(
    model={model_deployment},
    instructions="You are an AI assistant. Use web search when current information is required.",
    input="What are three major announcements from Microsoft Build this week?",
    tools=[{"type": "web_search"}]
)

print(response.output_text)
```

La sortie varie selon les résultats web du moment.

## Les 5 étapes

1. **Tu envoies la requête** avec l'outil de recherche web dans `tools`.
2. **Le modèle évalue la question** : a-t-il besoin de données fraîches ?
3. **La recherche s'exécute** : le modèle émet une ou plusieurs requêtes.
4. **Les résultats sont examinés** : les pages pertinentes sont retenues et résumées.
5. **La réponse est générée** en combinant les résultats.

## Bonnes pratiques

- **Formule clairement la dimension temporelle** : « latest », « current », ou une plage de dates.
- **Fixe tes attentes sur les sources** : demande des sources officielles ou réputées quand l'exactitude compte.
- **Demande des sorties concises** : résumés courts avec les points clés, pour réduire le bruit.
- **Vérifie les faits critiques** de façon indépendante dans les scénarios à fort enjeu.
- **Suis l'usage et la latence** : la récupération web allonge le temps de réponse et consomme des tokens.

## Limites

| Limite | Conséquence |
|---|---|
| Dépend de ce qui est **public et indexable** au moment de la requête | Pas d'accès aux contenus privés |
| **Qualité des sources variable** | Une relecture humaine peut rester nécessaire |
| Le contenu trouvé **change dans le temps** | Deux exécutions peuvent donner des réponses différentes |
| Restrictions **régionales, de politique ou de réseau** possibles | L'accès web peut être limité dans certains environnements |

## web_search ou file_search ?

| | web_search | file_search |
|---|---|---|
| Source | Le web public | **Tes** fichiers, chargés dans un vector store |
| Bon pour | L'information récente et générale | L'information interne et de confiance |
| Préparation | Aucune | Créer un vector store et y charger les fichiers |

> **Exemple.** Dans le lab, l'assistant de voyage répond à « Que se passe-t-il à San Francisco le mois prochain ? » avec `web_search`, puis à « Quels hôtels propose Margie's Travel là-bas ? » avec `file_search` sur les brochures de l'agence.

#### Point examen : web_search apporte de l'information publique et récente. Pour répondre à partir des documents de l'entreprise, la bonne réponse est file_search.

## Exercices rapides

**1.** Écris la définition d'outil pour activer la recherche web.

**2.** Qui formule la requête de recherche ?

**3.** Pourquoi deux exécutions du même prompt peuvent-elles donner des réponses différentes ?

**4.** Donne deux bonnes pratiques pour rédiger un prompt qui s'appuie sur `web_search`.

**5.** Un utilisateur demande le contenu du règlement intérieur de ton entreprise. `web_search` convient-il ?

<details>
<summary>Voir le corrigé</summary>

**1.** `{"type": "web_search"}`

**2.** Le modèle : il décide quand et comment chercher selon l'intention de l'utilisateur.

**3.** Parce que le contenu web récupéré change dans le temps.

**4.** Deux parmi : préciser le moment (« latest », plage de dates), demander des sources officielles, demander une sortie concise, faire vérifier les faits critiques.

**5.** Non. C'est un document interne, non public : il faut `file_search`.

</details>
