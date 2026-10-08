# Lab et bilan — concepts du RAG

## Le lab : explorer le RAG

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne dans le navigateur.
- But : comparer les réponses d'un modèle **sans** puis **avec** une source de connaissances.

### Partie 1 — Discuter avec le modèle seul

1. Ouvre `https://aka.ms/chat-playground` et attends le chargement du modèle (**Microsoft Phi 3.5 Mini**).
2. Dans **Instructions** :

```
You are an AI assistant that provides succinct answers to business expense-related questions.
```

3. Envoie :

```
Tell me about per-diem allowances.
```

4. Puis la question de suivi :

```
How are they reimbursed?
```

« they » est compris comme les indemnités journalières : l'**historique de la conversation** est inclus dans le prompt.

5. Clique sur **New chat** (💬), puis envoie :

```
If I take a taxi to meet a customer, how much can I claim for it?
```

**Ce que tu dois observer** : une réponse **générale**. Le modèle ne connaît pas la politique de l'entreprise.

### Partie 2 — Ajouter une source de connaissances

1. Ouvre `https://aka.ms/expenses-txt` et enregistre le fichier `expenses.txt`.
2. Dans le panneau de gauche, section **Tools**, choisis **Upload files** et charge `expenses.txt`. La conversation redémarre.
3. Renvoie la même question sur le taxi.

**Ce que tu dois observer** : la réponse s'appuie sur le document et affiche une **citation** vers `expenses.txt`.

4. Essaie aussi :

```
Can I buy the customer lunch?
```

```
What is a purchase order?
```

Le fichier est cité quand il contient un contexte utile, et pas quand la recherche n'y trouve rien.

### Ce qu'il faut retenir du lab

| | Sans fichier | Avec fichier |
|---|---|---|
| Réponse sur le taxi | Générale | Propre à la politique |
| Citation | Aucune | `expenses.txt` |

- Au chargement du fichier, l'application crée un **simple index par mots-clés**.
- Une vraie solution RAG utilise un index plus complet, le plus souvent **vectoriel**, avec recherche sémantique en plus des mots-clés.
- Dans Microsoft Foundry, **Foundry IQ** est une couche de connaissances gérée qui facilite le RAG à l'échelle de l'entreprise.

## Le module en 10 lignes

1. Un LLM ne connaît pas tes données privées, vieillit, et peut répondre sans source.
2. Le **RAG** combine **recherche** et **IA générative**.
3. Il **ancre** la réponse dans un contenu récupéré, sans **réentraîner** le modèle.
4. Indexation : **extraire**, **découper** en chunks, créer des **embeddings**, **indexer**.
5. Les chunks permettent de récupérer des passages ciblés qui tiennent dans le prompt.
6. Un **embedding** est un vecteur numérique qui capture le sens.
7. Recherche par **mots-clés** (termes exacts), **vectorielle** (sens), **hybride** (les deux).
8. Exécution : **récupérer**, **augmenter** le prompt, **générer** avec citations.
9. Le contenu récupéré est une **donnée**, pas une instruction.
10. On évalue **récupération** et **génération** séparément, en équilibrant **qualité, latence et coût**.

## Le schéma complet

```
AVANT (indexation)
Documents → extraire → chunks → embeddings → INDEX

À CHAQUE QUESTION (exécution)
Question → recherche dans l'INDEX → chunks pertinents
                                        ↓
              instructions + question + chunks → modèle → réponse + citations
```

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel est le but principal du RAG ? | **Ancrer les réponses générées** dans des informations pertinentes récupérées d'une source de données |
| Pourquoi divise-t-on les gros documents en chunks avant de les indexer ? | Pour récupérer des **passages ciblés** qui tiennent efficacement dans un prompt |
| Que représente un embedding dans une solution RAG ? | Un **vecteur numérique** qui capture les caractéristiques sémantiques du contenu |
| Quelle recherche trouve « company travel costs » pour une requête sur « business trip expenses » ? | La **recherche vectorielle sémantique** |
| Une réponse est fluide mais donne une limite de politique incorrecte. Que vérifier d'abord ? | Si le **passage correct et à jour** a été récupéré et fourni comme contexte |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : le RAG ne réentraîne pas le modèle et ne le remplace pas par un moteur de recherche. Les chunks ne servent pas à entraîner des modèles séparés, et les documents d'origine restent utiles. Un embedding n'est ni une instruction ni une réponse finale.

#### Point examen : le RAG revient dans tout l'examen (agents, Foundry IQ, IA générative). Les mots-clés à reconnaître : grounding, chunks, embeddings, index, recherche vectorielle, citations.

## Exercices rapides

**1.** Dans le lab, pourquoi la première réponse sur le taxi est-elle générale ?

**2.** Dans le lab, quelle option du panneau Tools ajoute la source de connaissances ?

**3.** Quel type d'index le lab crée-t-il, et quel type utilise une vraie solution ?

**4.** Quel service Foundry facilite le RAG à l'échelle de l'entreprise ?

**5.** Indexation ou exécution ? (a) Découper en chunks. (b) Convertir la question en vecteur. (c) Ajouter les chunks au prompt. (d) Créer les embeddings des documents.

<details>
<summary>Voir le corrigé</summary>

**1.** Parce que le modèle n'a que ses connaissances d'entraînement et ignore la politique de l'entreprise.

**2.** Upload files.

**3.** Un simple index par mots-clés ; une vraie solution utilise le plus souvent un index vectoriel avec recherche sémantique.

**4.** Foundry IQ.

**5.** (a) Indexation. (b) Exécution. (c) Exécution. (d) Indexation.

</details>
