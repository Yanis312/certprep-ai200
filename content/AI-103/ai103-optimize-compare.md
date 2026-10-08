# Compare and combine optimization strategies

## L'essentiel

- Prompt engineering, RAG et fine-tuning ne s'excluent pas : ils sont **complémentaires**.
- **RAG** = optimiser le **contexte** (ce que le modèle sait) → **exactitude**.
- **Fine-tuning** = optimiser le **modèle** (comment il se comporte) → **constance**.
- **Prompt engineering** = la **base** qui soutient les deux.
- Règle de décision : **commencer simple**, n'ajouter de la complexité que si c'est nécessaire.

## Le spectre d'optimisation

```
                    Optimiser le CONTEXTE
                    (ce que le modèle sait)
                            ▲
                            │   RAG
                            │
   Prompt engineering ──────┼──────────────►  Optimiser le MODÈLE
   (le point de départ)     │   Fine-tuning   (comment il se comporte)
```

| Direction | Problème | Solution | Maximise |
|---|---|---|---|
| **Optimiser le contexte** | Le modèle manque de connaissances du domaine | RAG | L'**exactitude** des réponses |
| **Optimiser le modèle** | Tu veux améliorer le format, le style ou le ton | Fine-tuning | La **constance** du comportement |

## Le tableau comparatif

| Stratégie | Temps de mise en œuvre | Complexité | Coût | Idéale pour |
|---|---|---|---|---|
| **Prompt engineering** | Faible | Faible | Faible (au token seulement) | Guider ton, format et comportement ; itérer vite ; donner instructions et exemples |
| **RAG** | Moyen | Moyenne | Moyen (infrastructure de recherche + stockage + tokens) | Exactitude factuelle, connaissances du domaine, données dynamiques ou qui changent souvent |
| **Fine-tuning** | Élevé | Élevée | Élevé (calcul d'entraînement + hébergement du modèle + tokens) | Constance du comportement, respect d'un style, prompts plus courts, distillation |

## Les compromis

| Stratégie | Avantage | Inconvénient |
|---|---|---|
| **Prompt engineering** | La plus rapide et la moins chère ; aucun changement d'infrastructure | Les longs prompts consomment des tokens ; les consignes complexes ne sont pas toujours suivies ; ne donne pas accès à une information absente de l'entraînement |
| **RAG** | Données à jour et pertinentes au moment de la requête ; meilleure exactitude | Il faut un service de recherche, un index à créer et maintenir, des embeddings ; la qualité dépend de l'index et du découpage (chunking) des données |
| **Fine-tuning** | Le comportement le plus constant, car inscrit dans les poids ; peut réduire le coût par requête en raccourcissant les prompts | L'investissement initial le plus élevé ; réentraînement possible quand le modèle de base ou tes besoins changent |

## Les combinaisons

### Prompt engineering + RAG

La combinaison **la plus courante**. Elle traite à la fois **comment** le modèle doit agir et **ce qu'il doit savoir**.

- Le message système demande d'agir en conseiller de voyage et impose un format.
- Le RAG récupère les détails du catalogue d'hôtels : vrais noms, vrais prix.

### Prompt engineering + fine-tuning

Quand le modèle doit suivre un style ou un format de façon constante.

- Le modèle fine-tuné répond toujours dans la voix de la marque.
- Le message système ajoute des consignes **propres à la session**, comme mettre en avant une promotion saisonnière.

### RAG + fine-tuning

Quand il faut à la fois un ancrage factuel et un comportement constant.

- Le modèle fine-tuné garantit le style et le format structuré.
- Le RAG récupère les prix et disponibilités à jour.

### Les trois ensemble

Pour les applications les plus exigeantes, chaque couche a son rôle :

| Couche | Rôle |
|---|---|
| **Fine-tuning** | Style et format constants |
| **RAG** | Connaissances du domaine exactes et à jour |
| **Prompt engineering** | Consignes propres à la conversation et garde-fous |

## Le cadre de décision

1. **Commencer par le prompt engineering** : tester messages système, exemples few-shot, réglage des paramètres. Évaluer si le résultat suffit.
2. **Ajouter le RAG si l'exactitude compte** : le modèle a besoin de données précises, récentes ou privées → RAG avec Azure AI Search.
3. **Ajouter le fine-tuning si la constance compte** : le modèle ne tient pas le style, le ton ou le format malgré des prompts détaillés.
4. **Combiner selon les besoins** : toutes les applications n'ont pas besoin des trois.

Cette démarche progressive évite les coûts et la complexité inutiles.

## Le réflexe pour les questions de scénario

| Si l'énoncé dit... | Réponse |
|---|---|
| « données de l'entreprise », « catalogue », « à jour », « change souvent », « après la date de coupure » | **RAG** |
| « ton de la marque », « format constant », « malgré des instructions détaillées », « réduire la longueur du prompt » | **Fine-tuning** |
| « rapidement », « sans infrastructure », « rôle », « exemples dans le prompt » | **Prompt engineering** |
| Deux besoins à la fois | Une **combinaison** |

> **Exemple.** Un chat doit répondre à partir du catalogue produits de l'entreprise tout en gardant une voix de marque précise. Réponse : **RAG** pour le catalogue, **fine-tuning** pour la voix de marque, **prompt engineering** pour les consignes propres à la conversation.

#### Point examen : question officielle du module — pour un chat qui répond avec le catalogue produits et garde une voix de marque, la combinaison appropriée est RAG + fine-tuning + prompt engineering. Mettre le catalogue dans les données de fine-tuning est le mauvais choix.

## Exercices rapides

Quelle stratégie ou combinaison ?

**1.** Le modèle doit citer les tarifs du jour de ta boutique en ligne.

**2.** Malgré un message système de 40 lignes, le modèle ne respecte pas toujours ton format JSON.

**3.** Tu veux tester en une heure si un assistant de rédaction est faisable.

**4.** Un assistant juridique doit citer tes contrats internes et toujours répondre selon un plan en trois parties, très strict.

**5.** Tes prompts sont très longs à cause de 30 exemples few-shot, et la latence est trop élevée.

Et aussi :

**6.** Quelle stratégie optimise le contexte, et laquelle optimise le modèle ?

**7.** Quelle est la combinaison la plus courante ?

**8.** Dans quel ordre le cadre de décision propose-t-il d'ajouter les stratégies ?

<details>
<summary>Voir le corrigé</summary>

**1.** RAG : données qui changent souvent.

**2.** Fine-tuning : constance du format malgré des prompts détaillés.

**3.** Prompt engineering : rapide, sans infrastructure.

**4.** RAG pour les contrats, fine-tuning pour le plan strict, avec du prompt engineering pour les consignes de la conversation.

**5.** Fine-tuning : il intègre les schémas au modèle et raccourcit les prompts.

**6.** Le RAG optimise le contexte ; le fine-tuning optimise le modèle.

**7.** Prompt engineering + RAG.

**8.** Prompt engineering d'abord, puis RAG si l'exactitude compte, puis fine-tuning si la constance compte, et on combine selon les besoins.

</details>
