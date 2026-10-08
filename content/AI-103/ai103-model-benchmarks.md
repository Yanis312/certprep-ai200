# Select models using benchmarks — comparer avec les benchmarks

## L'essentiel

- Les **benchmarks** donnent des données objectives et mesurables pour comparer les modèles **avant** de déployer.
- Quatre familles : **qualité, sécurité, coût, performance**.
- Deux endroits où les voir : le **Model leaderboard** (classement global) et l'onglet **Benchmarks** d'une model card (détail d'un modèle).
- Piège principal : le **sens** de chaque métrique. Parfois plus haut est mieux, parfois plus bas.

## Où voir les benchmarks

| Vue | Où | Sert à |
|---|---|---|
| **Model leaderboard** | Dans le catalogue de modèles | Classer tous les modèles par qualité, sécurité, coût estimé, débit |
| **Onglet Benchmarks** | Sur la model card d'un modèle | Voir le détail d'un modèle par métrique et jeu de données, comparé à des modèles similaires |

## Qualité

Mesure si le modèle produit des réponses **exactes, cohérentes et adaptées au contexte**, à partir de jeux de données publics et de méthodes standardisées.

Le **Quality index** est la moyenne des scores d'exactitude sur plusieurs jeux de données : raisonnement, connaissances, questions-réponses, mathématiques, code. **Plus haut = meilleur**.

| Jeu de données | Ce qu'il teste |
|---|---|
| Arena-Hard | Questions-réponses adverses |
| BIG-Bench Hard | Raisonnement |
| GPQA | Questions pluridisciplinaires de niveau master/doctorat |
| HumanEval+ et MBPP+ | Génération de code |
| MATH | Raisonnement mathématique |
| MMLU-Pro | Connaissances générales |
| IFEval | Respect des instructions |

Les scores sont des **index normalisés de 0 à 1**.

## Sécurité

Vérifie que le modèle ne produit pas de contenu nuisible, biaisé ou inapproprié. Crucial pour une application exposée au public ou dans un secteur réglementé.

| Benchmark | Ce qu'il mesure | Métrique | Sens |
|---|---|---|---|
| **HarmBench** | Résistance à la génération de contenu dangereux | Attack Success Rate (**ASR**) | **Plus bas = plus sûr** |
| **ToxiGen** | Détection des discours de haine adverses et implicites | Score **F1** | Plus haut = meilleure détection |
| **WMDP** | Connaissances en biosécurité, cybersécurité, sécurité chimique | Score WMDP | Plus haut = **plus de connaissances dangereuses** |

HarmBench teste trois zones :

- comportements nuisibles **standard** : cybercriminalité, activités illégales ;
- comportements nuisibles **contextuels** : désinformation, harcèlement ;
- **violations de droits d'auteur**.

WMDP signifie Weapons of Mass Destruction Proxy. Attention : un score WMDP élevé n'est **pas** une bonne nouvelle.

## Coût

Les benchmarks de coût affichent les prix des déploiements **serverless API** et des modèles **Azure OpenAI**.

| Métrique | Définition |
|---|---|
| **Coût par tokens d'entrée** | Prix pour traiter **1 million** de tokens d'entrée (le texte envoyé) |
| **Coût par tokens de sortie** | Prix pour générer **1 million** de tokens de sortie (le texte produit) |
| **Coût estimé** | Combine entrée et sortie selon un ratio typique de **3 pour 1** (3 tokens d'entrée pour 1 de sortie). **Plus bas = plus économique** |

> **Exemple.** Un modèle coûte 2 $ par million de tokens d'entrée et 8 $ par million en sortie. Avec le ratio 3:1, sur 4 millions de tokens on a 3 millions en entrée (6 $) et 1 million en sortie (8 $), soit 14 $, donc environ **3,50 $ par million** de tokens en moyenne. Ce chiffre unique sert à comparer les modèles entre eux.

## Performance

Mesure la **rapidité** et l'efficacité. Décisif pour le temps réel.

### Latence

| Métrique | Signification |
|---|---|
| Latency mean | Temps moyen (en secondes) pour traiter une requête |
| P50 (médiane) | 50 % des requêtes finissent plus vite que cette valeur |
| P90 / P95 / P99 | 90 %, 95 %, 99 % des requêtes finissent plus vite que cette valeur |
| **TTFT** (Time to first token) | Temps avant l'arrivée du premier token, en streaming |

> **Lire un percentile.** « P95 = 2 s » veut dire que 95 % des requêtes répondent en moins de 2 secondes, et que 5 % sont plus lentes. La moyenne cache ces cas lents, le P95 et le P99 les révèlent.

### Débit (throughput)

| Métrique | Signification |
|---|---|
| **GTPS** (Generated tokens per second) | Tokens de **sortie** générés par seconde |
| **TTPS** (Total tokens per second) | Tokens d'entrée **et** de sortie traités par seconde |
| Time between tokens | Intervalle entre deux tokens consécutifs |

Le leaderboard résume la performance par :

- le **TTFT moyen** : **plus bas = mieux** ;
- le **GTPS moyen** : **plus haut = mieux**.

Pour un traitement **par lots** (batch), la vitesse compte moins : on peut privilégier le coût.

## Le sens des métriques, en un tableau

| Métrique | Mieux quand elle est |
|---|---|
| Quality index | Haute |
| ASR (HarmBench) | **Basse** |
| F1 (ToxiGen) | Haute |
| Coût estimé | **Bas** |
| Latence, TTFT | **Basse** |
| Débit, GTPS | Haut |

## Outils de comparaison

| Outil | Ce qu'il fait |
|---|---|
| **Model leaderboard** | Trie les meilleurs modèles par qualité, sécurité, coût estimé, débit |
| **Scenario leaderboards** | Classements par cas d'usage : raisonnement, code, maths, questions-réponses, groundedness |
| **Trade-off charts** | Affiche deux métriques à la fois : qualité contre coût, débit ou sécurité |
| **Side-by-side comparison** | Compare **2 ou 3** modèles en détail |

- Si ton application correspond à un scénario précis, **commence par le scenario leaderboard** plutôt que par le seul Quality index global.
- Sur un trade-off chart, les modèles proches du **coin supérieur droit** sont bons sur les deux métriques.
- Un modèle un peu moins précis mais beaucoup plus rapide ou moins cher peut mieux convenir.

La comparaison côte à côte porte sur : les benchmarks (qualité, sécurité, débit), les détails du modèle (fenêtre de contexte, données d'entraînement, langues), les endpoints pris en charge, et les fonctionnalités (function calling, sortie structurée, vision). On coche les modèles puis on choisit **Compare**.

#### Point examen : question officielle du module — le benchmark qui indique la capacité à traiter les prompts et renvoyer des réponses complètes rapidement est le débit (throughput), pas le Quality index ni le coût.

## Exercices rapides

**1.** Modèle A : ASR de 0,05. Modèle B : ASR de 0,30. Lequel est le plus sûr ?

**2.** Ton chatbot doit afficher le début de la réponse le plus vite possible. Quelle métrique regardes-tu ?

**3.** Un modèle coûte 1 $ par million de tokens en entrée et 5 $ en sortie. Quel est son coût estimé par million de tokens avec le ratio 3:1 ?

**4.** Tu construis un assistant de programmation. Par quel classement commences-tu ?

**5.** « P99 = 6 s » : que signifie cette valeur ?

**6.** Combien de modèles peut-on comparer côte à côte ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le modèle A. Pour l'Attack Success Rate, plus la valeur est basse, plus le modèle résiste.

**2.** Le Time to first token (TTFT).

**3.** (3 × 1 + 1 × 5) / 4 = 8 / 4 = 2 $ par million de tokens.

**4.** Le scenario leaderboard « coding », plutôt que le Quality index global.

**5.** 99 % des requêtes se terminent en moins de 6 secondes ; 1 % sont plus lentes.

**6.** Deux ou trois.

</details>
