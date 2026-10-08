# Bilan du module — optimiser la performance d'un modèle

## Le module en 10 lignes

1. Trois stratégies **complémentaires**, pas concurrentes : prompt engineering, RAG, fine-tuning.
2. **Prompt engineering** : message système, patterns (persona, format, chain of thought, few-shot), paramètres.
3. Message système en 4 points : **rôle, limites, format, règle en cas de doute**.
4. **Temperature** basse = factuel ; haute = créatif. Ajuster temperature **ou** top_p, pas les deux.
5. **RAG** = Retrieve, Augment, Generate. Il donne au modèle des données qu'il n'a pas.
6. **Embeddings** + **similarité cosinus** pour retrouver par le sens ; **Azure AI Search** pour la récupération ; recherche **hybride** recommandée.
7. **Fine-tuning** = ajuster les poids (via **LoRA**) pour un comportement **constant**.
8. Types : **SFT** (exemples), **RFT** (grader), **DPO** (préférences). Données en **JSONL**.
9. RAG optimise le **contexte** → exactitude. Fine-tuning optimise le **modèle** → constance.
10. Cadre de décision : prompt engineering d'abord, RAG si l'exactitude compte, fine-tuning si la constance compte.

## Le tableau de synthèse

| | Prompt engineering | RAG | Fine-tuning |
|---|---|---|---|
| Change | La demande | Les connaissances disponibles | Le modèle lui-même |
| Répond à | « Comment répondre ? » | « Que savoir ? » | « Comment rester constant ? » |
| Coût | Faible | Moyen | Élevé |
| Délai | Immédiat | Moyen | Long |
| Infrastructure | Aucune | Recherche + index | Entraînement + hébergement |
| Données à jour | Non | **Oui** | Non |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel est le but principal d'un message système ? | Définir le **rôle**, le **comportement** et les **contraintes de sortie** du modèle |
| Quand utiliser le RAG plutôt que le seul prompt engineering ? | Quand le modèle a besoin de **données propres au domaine ou récentes** sur lesquelles il n'a pas été entraîné |
| Que contrôle le paramètre temperature ? | L'**aléa et la créativité** des réponses |
| Qu'optimise le fine-tuning ? | La **constance** du comportement, du style et du format de sortie |
| Chat avec catalogue produits **et** voix de marque : quelle combinaison ? | **RAG** pour le catalogue, **fine-tuning** pour la voix de marque, **prompt engineering** pour les consignes de conversation |

Le texte fourni ne contenait pas le corrigé de Microsoft. Ces réponses découlent directement du cours ; vérifie-les en faisant l'évaluation sur Learn.

## Les mauvaises réponses qui reviennent

| Affirmation fausse | Pourquoi |
|---|---|
| « Le message système fournit des données d'entraînement qui changent le modèle pour toujours » | C'est le fine-tuning qui modifie les poids |
| « Le message système récupère des données dans une source externe » | C'est le RAG |
| « Le RAG sert à avoir un style constant » | C'est le fine-tuning |
| « Le fine-tuning améliore l'exactitude en se connectant à des données externes » | C'est le RAG |
| « Temperature fixe le nombre maximal de tokens » | C'est max tokens |
| « Il suffit de mettre le catalogue dans les données de fine-tuning » | Le catalogue change ; il faut du RAG |

## La solution complète pour l'agence de voyages

```
Modèle fine-tuné        → garde la voix de la marque
      +
RAG (Azure AI Search)   → ancre les réponses dans le vrai catalogue d'hôtels
      +
Prompt engineering      → ajoute les consignes de la conversation et les garde-fous
```

#### Point examen : dans une question de scénario, repère le mot qui trahit le besoin. « Données à jour » ou « privées » appelle le RAG. « Constant », « style », « format » appelle le fine-tuning. « Rapide » et « sans infrastructure » appelle le prompt engineering.

## Exercices rapides

**1.** Complète : le RAG optimise ____ pour maximiser ____ ; le fine-tuning optimise ____ pour maximiser ____.

**2.** Donne les 4 patterns de prompt du module.

**3.** Quelle technique de recherche est recommandée pour l'IA générative ?

**4.** Cite deux coûts propres au fine-tuning.

**5.** Un collègue propose de fine-tuner le modèle chaque nuit avec les nouveaux prix. Que lui réponds-tu ?

**6.** Dans quel ordre essaies-tu les stratégies sur un nouveau projet ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le RAG optimise le contexte pour maximiser l'exactitude ; le fine-tuning optimise le modèle pour maximiser la constance.

**2.** Persona, format template, chain of thought, few-shot learning. S'y ajoute l'usage de délimiteurs.

**3.** La recherche hybride.

**4.** Le coût d'entraînement initial et le coût horaire d'hébergement du modèle personnalisé.

**5.** Que le RAG est fait pour ça : il lit les données courantes au moment de la requête, sans réentraînement. Le fine-tuning sert à la constance du style, pas aux faits qui changent.

**6.** Prompt engineering, puis RAG si l'exactitude l'exige, puis fine-tuning si la constance l'exige.

</details>
