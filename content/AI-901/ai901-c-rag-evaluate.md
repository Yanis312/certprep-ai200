# Evaluate a RAG solution — évaluer une solution RAG

## L'essentiel

- Une application RAG est un **pipeline** : une réponse qui sonne bien ne prouve pas que tout fonctionne.
- On évalue **séparément** la **récupération** et la **génération**.
- Si la bonne information n'est pas récupérée, changer le prompt **ne suffit pas**.
- Il faut équilibrer **qualité**, **latence** et **coût**.

## Évaluer la récupération

La question : le système de recherche renvoie-t-il un contenu source utile ?

| Critère | Question à se poser |
|---|---|
| **Pertinence** | Les chunks récupérés traitent-ils la question ? |
| **Couverture** | Toute l'information nécessaire à une réponse complète est-elle présente ? |
| **Classement** | Les meilleurs résultats sont-ils placés avant les plus faibles ? |
| **Sécurité et fraîcheur** | Le contenu est-il autorisé pour cet utilisateur, et toujours à jour ? |

Si la bonne information n'est pas récupérée, il faut améliorer : le contenu source, les **frontières des chunks**, les métadonnées, le traitement de la requête, la stratégie de recherche ou le classement.

## Évaluer la génération

La question : comment le modèle utilise-t-il le contexte récupéré ?

| Critère | Question à se poser |
|---|---|
| **Ancrage** (groundedness) | Chaque affirmation est-elle soutenue par le contenu récupéré ? |
| **Pertinence** | La réponse traite-t-elle directement la question ? |
| **Complétude** | La réponse reprend-elle l'information importante du contexte ? |
| **Qualité des citations** | Les citations pointent-elles vers des sources qui soutiennent les affirmations ? |
| **Incertitude appropriée** | L'application évite-t-elle de deviner quand le contexte est insuffisant ? |

## Où est le problème ?

| Symptôme | Cause probable | Que corriger |
|---|---|---|
| Le bon passage n'a **pas été récupéré** | **Récupération** | Sources, chunks, métadonnées, recherche, classement |
| Le bon passage a été récupéré mais la réponse est **fausse** | **Génération** | Prompt, consignes de réponse |
| Le passage récupéré est **périmé** | **Récupération** (fraîcheur) | Mettre à jour l'index |

> **Exemple du cours.** Une réponse RAG est fluide mais donne un plafond de dépense incorrect. La **première** chose à vérifier : le passage correct et à jour de la politique a-t-il été récupéré et fourni comme contexte ?

## Un bon jeu de test

Il contient :

- des **questions réalistes** ;
- les **passages sources attendus** ;
- des **critères** de réponse acceptable.

Et des **cas difficiles** :

- questions **ambiguës** ;
- questions **sans réponse** dans les données ;
- documents **périmés** ;
- tentatives de récupérer une information **non autorisée**.

## Équilibrer qualité, latence et coût

Récupérer plus de chunks peut améliorer la couverture, mais :

| Plus de chunks | Conséquence |
|---|---|
| Prompt plus long | **Coût** plus élevé |
| Traitement plus long | **Latence** plus élevée |
| Trop de contexte | Le modèle peine à se concentrer sur la preuve la plus pertinente |

```
        Qualité
        /     \
   Latence — Coût
```

## Surveiller en production

Le suivi de l'usage réel révèle : questions sans réponse, citations faibles, recherches lentes, baisse de qualité du contenu.

On **réévalue** le pipeline chaque fois que changent les **données**, les **modèles**, les **prompts** ou les **réglages de recherche**.

#### Point examen : question officielle du module — devant une réponse fluide mais avec une limite de politique incorrecte, on examine d'abord si le passage correct et à jour a été récupéré et fourni comme contexte. Allonger la réponse ou ajouter des documents sans rapport n'aide pas.

## Exercices rapides

**1.** Quelles deux parties d'une solution RAG évalue-t-on séparément ?

**2.** Cite les quatre critères d'évaluation de la récupération.

**3.** Que mesure l'ancrage (groundedness) ?

**4.** Le bon passage n'a pas été récupéré. Modifier le prompt de génération suffit-il ?

**5.** Récupération ou génération ? (a) Les meilleurs résultats sont mal classés. (b) Une citation pointe vers une source qui ne soutient pas l'affirmation. (c) Le modèle devine au lieu de dire qu'il ne sait pas.

**6.** Cite deux cas difficiles à inclure dans un jeu de test.

**7.** Quels trois facteurs faut-il équilibrer ?

**8.** Quand faut-il réévaluer le pipeline ?

<details>
<summary>Voir le corrigé</summary>

**1.** La récupération et la génération.

**2.** Pertinence, couverture, classement, sécurité et fraîcheur.

**3.** Si chaque affirmation de la réponse est soutenue par le contenu récupéré.

**4.** Non : il faut améliorer les sources, les chunks, les métadonnées, la recherche ou le classement.

**5.** (a) Récupération. (b) Génération. (c) Génération.

**6.** Deux parmi : questions ambiguës, questions sans réponse dans les données, documents périmés, tentatives d'accès non autorisé.

**7.** La qualité, la latence et le coût.

**8.** Chaque fois que changent les données, les modèles, les prompts ou les réglages de recherche.

</details>
