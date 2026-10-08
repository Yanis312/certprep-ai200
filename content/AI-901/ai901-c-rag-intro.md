# Introduction et Understand RAG — comprendre le RAG

## L'essentiel

- Un LLM a trois limites : il ne connaît pas tes **données privées**, ses connaissances **vieillissent**, et il peut répondre avec assurance **sans source fiable**.
- Le **RAG** (retrieval-augmented generation) combine la **recherche** et l'**IA générative**.
- Avant de répondre, l'application **cherche** l'information utile et l'**ajoute au prompt**.
- La réponse est dite **ancrée** (grounded) : elle s'appuie sur un contenu source fourni.
- Le RAG **ne réentraîne pas** le modèle.

## Les 3 limites d'un modèle de langage

| Limite | Explication |
|---|---|
| **Frontières de la connaissance** | Le modèle ne connaît pas les informations privées : catalogue, articles de support, politiques internes |
| **Fraîcheur** | Ce qu'il a appris à l'entraînement peut être périmé |
| **Vérifiabilité** | Il peut produire une réponse assurée qu'aucune source fiable ne soutient |

## Le RAG en deux mots

| Mot | Signification |
|---|---|
| **Retrieval** (récupération) | Chercher, dans des sources choisies, l'information liée à la question |
| **Augmented generation** (génération augmentée) | Ajouter cette information au prompt comme contexte, puis demander au modèle de répondre à partir d'elle |

## L'exemple du cours : les notes de frais

Question d'un employé : « How much can I claim for a taxi ride? »

| | Sans RAG | Avec RAG |
|---|---|---|
| Ce que fait l'agent | Répond avec ses connaissances générales | Cherche dans la politique de frais de l'entreprise, récupère la section sur les taxis, l'ajoute au prompt |
| Réponse | **Générale** | **Propre à l'entreprise** |
| Source | Aucune | Citation de la politique |

Une application RAG peut aussi renvoyer des **citations** ou des liens, pour que l'utilisateur vérifie la source.

## RAG ou réentraînement

Le RAG **ne modifie pas les paramètres appris** par le modèle. Il fournit la connaissance **au moment de la requête** (run time).

| | Réentraîner le modèle | RAG |
|---|---|---|
| Ce qui change | Les paramètres du modèle | Rien dans le modèle |
| Quand la politique change | Il faut réentraîner | On met à jour les **documents et l'index** |
| Moment où la connaissance arrive | À l'entraînement | À l'exécution |

> **Une image pour retenir.** Le modèle est un étudiant brillant. Sans RAG, il passe l'examen de mémoire. Avec RAG, il a le droit d'ouvrir le bon manuel à la bonne page avant de répondre.

#### Point examen : question officielle du module — le but principal du RAG est d'ancrer les réponses générées dans des informations pertinentes récupérées d'une source de données. Il ne réentraîne pas le modèle et ne le remplace pas par un moteur de recherche.

## Exercices rapides

**1.** Que signifie RAG ?

**2.** Cite les trois limites d'un modèle de langage que le RAG aide à traiter.

**3.** Que désigne « retrieval » ?

**4.** Qu'est-ce qu'une réponse ancrée (grounded) ?

**5.** La politique de frais change. Que faut-il mettre à jour dans une solution RAG ?

**6.** Vrai ou faux : le RAG modifie les paramètres du modèle.

**7.** À quoi servent les citations ?

<details>
<summary>Voir le corrigé</summary>

**1.** Retrieval-augmented generation, génération augmentée par récupération.

**2.** Les frontières de la connaissance (données privées), la fraîcheur, la vérifiabilité.

**3.** La recherche, dans des sources choisies, de l'information liée à la question.

**4.** Une réponse fondée sur un contenu source fourni au modèle.

**5.** Les documents et l'index de recherche, pas le modèle.

**6.** Faux : il fournit la connaissance au moment de la requête.

**7.** À permettre à l'utilisateur de vérifier le contenu source.

</details>
