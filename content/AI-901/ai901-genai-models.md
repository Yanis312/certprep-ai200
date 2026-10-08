# Introduction et Generative AI models — les modèles dans Foundry

## L'essentiel

- L'**IA générative** est une branche de l'IA qui **crée du contenu nouveau**. Elle repose sur des **modèles de langage**.
- Le **catalogue de modèles** de Foundry est le point central pour **découvrir, filtrer, comparer et tester** des modèles de nombreux fournisseurs.
- Un **modèle de fondation** est un grand modèle **préentraîné**, aux capacités générales, utilisable tout de suite ou personnalisable.
- **Déployer** un modèle le rend disponible par un **endpoint** stable, évolutif et sécurisé.
- Le quota d'un déploiement se règle en **tokens par minute (TPM)** ; le dépasser provoque du **throttling**.

## Ce que permet l'IA générative aujourd'hui

| Usage | Exemple |
|---|---|
| Contenu marketing | Rédiger fiches produits, articles et publications avec Microsoft Copilot |
| Support client | Agents virtuels qui répondent 24 h/24 en langage naturel |
| Génération de code | GitHub Copilot propose des fonctions ou des modules entiers |
| Images et vidéos | Visuels de campagne à partir d'une description |
| Apprentissage personnalisé | Quiz, explications et guides adaptés à chaque élève |

## Le catalogue de modèles

Il faut un **abonnement Azure**, puis un **projet** Foundry.

On y **filtre** les modèles par source, capacités, tâches d'inférence, et plus.

### Deux catégories

| Catégorie | Caractéristiques |
|---|---|
| **Modèles vendus directement par Azure** | Hébergés par Microsoft, sous les **Microsoft Product Terms**. Forte intégration à Azure, **SLA** de niveau entreprise, sécurité préconfigurée, conformité |
| **Modèles de partenaires et de la communauté** | Open source ou hébergés par des éditeurs. Plus d'expérimentation et d'innovation rapide ; souvent adaptés aux tâches spécialisées ou propres à un domaine |

### Ce que contient la fiche d'un modèle

- Description et **capacités** : génération de texte, raisonnement, code, multimodal, embeddings ;
- Résultats de **benchmarks** et comparaisons ;
- **Tâches d'inférence** prises en charge et options de **fine-tuning** ;
- Documentation d'**IA responsable** : model cards, contraintes, mises en garde.

## Familles de modèles

Une **famille de modèles** regroupe des modèles apparentés, de même architecture ou lignée, qui diffèrent par la taille, les capacités, la spécialisation ou la version.

| Famille | Points forts | Bon pour |
|---|---|---|
| **GPT-5.x** | Raisonnement en plusieurs étapes, logique structurée, planification, workflows agentiques. **Niveaux de réflexion** réglables : on échange vitesse contre précision | Rapports techniques, analyse de code, orchestration d'agents multi-outils |
| **Claude Opus 4.5** (Anthropic) | Modèle de pointe pour agents sophistiqués, raisonnement complexe sur le code, usage de l'ordinateur ; grandes fenêtres de contexte et de sortie | Longues spécifications, diffs multi-fichiers, notes de recherche étendues |
| **Mistral Large 3** (Mistral AI) | Généraliste à l'état de l'art, bonne qualité avec un débit efficace | Rédaction multilingue, rapports structurés, tâches d'agent à latence moyenne, équilibre coût/performance |
| **GPT-4.1** | Optimisé pour la **vitesse**, l'efficacité et la faible latence | Chat en temps réel, support client, applications interactives à gros volume |

La famille GPT-5 demande actuellement une **inscription**, ce qui limite sa disponibilité. **GPT-4.1** est utilisable par tous les utilisateurs de Foundry.

## Modèle de fondation

Un **modèle de fondation** (GPT, Claude, Mistral...) est un grand modèle **préentraîné** qui fournit d'emblée des capacités générales de langage, de raisonnement ou multimodales. Il peut être **déployé tout de suite** ou **personnalisé par fine-tuning**, et sert de couche de base aux applications d'IA.

## Choisir un modèle selon la tâche

| Tâche | Types de modèles recommandés | Pourquoi |
|---|---|---|
| **Chat** | GPT-5.x chat, Claude Sonnet/Opus, Mistral-Large-3, DeepSeek V3.1, SLM comme Phi-4 ou Llama | Raisonnement solide, réglage conversationnel, sécurité |
| **Code** | GPT-5.1-codex, Claude-Sonnet | Prise en charge de flux d'agents complexes |
| **Résumé** | Modèles de raisonnement GPT-5.x, Claude Opus/Sonnet | Long contexte, compression de qualité |
| **Embeddings** | text-embedding-3-small et autres modèles d'embedding | Conçus pour les représentations vectorielles sémantiques |
| **Multimodal** | Phi-4-multimodal-instruct, GPT-5.x chat multimodal, Mistral-Large-3 | Images, audio et vidéo dans les échanges |
| **Secteur ou domaine** | Modèles ajustés à un domaine | Finance, santé, juridique |

Quand le cas d'usage est **bien défini**, on peut choisir un **Foundry Tool** plutôt qu'un modèle du catalogue : performance prévisible, conformité intégrée, mise en service rapide, sans modélisation sur mesure.

## Noter et comparer

- **Benchmarks** : résultats sur des jeux de données standards, avec des critères constants.
- **Model leaderboards** : classements par qualité, sécurité, débit.
- **Comparaisons et filtres** : côte à côte, par qualité et exactitude, coût, sécurité et conformité, performance.

Une façon courante d'évaluer : choisir un modèle dans le catalogue, puis **Benchmarks → Try with your own data**.

| Famille de métriques | Exemples |
|---|---|
| **Métriques NLP classiques** | Accuracy, précision, rappel, F1 |
| **Métriques assistées par IA** | Groundedness, relevance, coherence, fluency, GPT similarity |

Les métriques assistées par IA servent à une notation **qualitative**, au-delà des métriques traditionnelles.

### Les évaluateurs

Un **évaluateur** mesure la qualité, la sécurité et l'efficacité des sorties d'un modèle ou d'un agent. Les **évaluateurs de sécurité** recherchent le contenu nuisible, les biais, la violence, l'automutilation. L'**Evaluator Library** propose des évaluateurs réutilisables.

À eux seuls, les évaluateurs **détectent, analysent et notent** les problèmes ; ils **ne les corrigent pas**.

## Déployer un modèle

Déployer rend le modèle disponible en production par un **endpoint** stable, évolutif et sécurisé. Le modèle devient un **service** que les applications appellent, en général par une API.

### Paramètres de déploiement

| Paramètre | Rôle |
|---|---|
| **Type de déploiement** | Standard, global batch, regional provisioned throughput... Détermine **où et comment** l'inférence est traitée |
| **Version du modèle** | La version déployée |
| **Limite de tokens par minute (TPM)** | La capacité du déploiement |

### Tokens, TPM, RPM, throttling

| Terme | Définition |
|---|---|
| **Token** | La plus petite unité de texte ou de données qu'un modèle traite : mot, sous-mot, caractère, ponctuation |
| **TPM** (tokens par minute) | La vitesse et l'échelle auxquelles le déploiement traite les entrées |
| **RPM** (requêtes par minute) | Une limite de débit liée au TPM |
| **Throttling** | Ralentir ou limiter volontairement le travail, pour garder le système stable quand il approche de ses limites |

- **TPM plus élevé** = plus de capacité par minute. **TPM plus bas** = consommation de tokens ralentie.
- Les **quotas du déploiement** fixent combien de tokens ou de requêtes passent avant le throttling.
- Des **prompts plus longs** et un **max output tokens** plus élevé consomment plus de TPM.
- En cas de throttling : **baisser max tokens** ou **réduire les requêtes simultanées** dans le code.
- Les modèles spécialisés ou d'image fonctionnent souvent en **unités de capacité** plutôt qu'en TPM.

> **Exemple.** Ton déploiement a 30 000 TPM. Dix utilisateurs envoient en même temps un prompt de 2 000 tokens en demandant jusqu'à 2 000 tokens de réponse : 40 000 tokens demandés dans la minute. Tu dépasses la limite et certaines requêtes reçoivent une erreur de limite de débit. Solutions : baisser la longueur maximale des réponses, étaler les requêtes, ou augmenter le TPM.

### Ce qui se passe au déploiement

1. Des **ressources de calcul** sont allouées : CPU, GPU, mémoire, réseau, règles de mise à l'échelle.
2. Un **endpoint d'API** est créé : le modèle s'appelle par l'API Responses.
3. La **configuration** est figée : version du modèle, style de réponse, réglages de sécurité.
4. La **supervision et la journalisation** démarrent : usage, performance, latence, erreurs, coûts.

#### Point examen : deux questions officielles du module — le catalogue de modèles est un point central pour découvrir, filtrer, comparer et tester de nombreux modèles génératifs de plusieurs fournisseurs ; un modèle de fondation est un grand modèle préentraîné aux capacités générales, utilisable immédiatement ou personnalisable.

## Exercices rapides

**1.** Comment le cours décrit-il le catalogue de modèles ?

**2.** Qu'est-ce qu'un modèle de fondation ?

**3.** Quel modèle recommander pour un chat de support en temps réel à gros volume, accessible à tous les utilisateurs de Foundry ?

**4.** Quel type de modèle pour des représentations vectorielles sémantiques ?

**5.** Que signifient TPM et RPM ?

**6.** Ton application reçoit des erreurs de limite de débit. Cite deux actions possibles dans le code.

**7.** Vrai ou faux : un évaluateur de sécurité corrige automatiquement le contenu nuisible.

**8.** Cite deux des quatre choses qui se produisent quand tu déploies un modèle.

**9.** Dans quel cas choisir un Foundry Tool plutôt qu'un modèle du catalogue ?

<details>
<summary>Voir le corrigé</summary>

**1.** Un point central pour découvrir, filtrer, comparer et tester de nombreux modèles d'IA générative de plusieurs fournisseurs.

**2.** Un grand modèle préentraîné aux capacités générales, utilisable immédiatement ou personnalisable par fine-tuning.

**3.** GPT-4.1, optimisé pour la vitesse et la faible latence.

**4.** Un modèle d'embedding, comme text-embedding-3-small.

**5.** Tokens par minute et requêtes par minute.

**6.** Baisser max tokens et réduire le nombre de requêtes simultanées.

**7.** Faux. Les évaluateurs détectent, analysent et notent, mais ne corrigent pas.

**8.** Deux parmi : allocation des ressources de calcul, création d'un endpoint d'API, configuration figée, activation de la supervision et de la journalisation.

**9.** Quand le cas d'usage est bien défini : performance prévisible, conformité intégrée, mise en service rapide.

</details>
