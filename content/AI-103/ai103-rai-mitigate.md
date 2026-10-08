# Mitigate potential harms — atténuer sur 4 couches

## L'essentiel

- L'atténuation suit une **approche en couches** : on agit à **4 niveaux** de la solution.
- Les 4 couches : **modèle**, **système de sécurité**, **message système et ancrage**, **expérience utilisateur**.
- Dans Foundry, la couche système de sécurité repose sur les **guardrails** : **filtres de contenu** et **prompt shields**.
- Filtres de contenu : **4 niveaux de gravité** × **5 catégories** de préjudice.
- Après chaque atténuation, on **reteste** et on compare à la **référence**.

## Les 4 couches

```
┌───────────────────────────────────────────────┐
│ 4. Expérience utilisateur   (interface, docs)  │
│  ┌──────────────────────────────────────────┐  │
│  │ 3. Message système et ancrage  (prompts) │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │ 2. Système de sécurité (guardrails)│  │  │
│  │  │  ┌──────────────────────────────┐  │  │  │
│  │  │  │ 1. Modèle                    │  │  │  │
│  │  │  └──────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└───────────────────────────────────────────────┘
```

Aucune couche ne suffit seule. Ce qu'une couche laisse passer, la suivante peut l'arrêter.

## Couche 1 — Le modèle

Le ou les modèles génératifs au cœur de la solution.

| Atténuation | Explication |
|---|---|
| **Choisir un modèle adapté** à l'usage prévu | GPT-4 est puissant et polyvalent. Mais pour seulement classer de petits textes précis, un modèle **plus simple** fait le travail avec **moins de risque** de contenu nuisible |
| **Fine-tuner** un modèle de fondation avec tes données | Les réponses ont plus de chances d'être pertinentes et **limitées à ton scénario** |

## Couche 2 — Le système de sécurité

Les configurations et capacités **au niveau de la plateforme**.

### Les guardrails de Foundry

Ils appliquent des critères pour **supprimer des prompts et des réponses**, à partir de **filtres de contenu**.

| | Valeurs |
|---|---|
| **4 niveaux de gravité** | safe, low, medium, high |
| **5 catégories de préjudice** | hate and fairness (haine et équité), sexual, violence, self-harm (automutilation), task-adherence (respect de la tâche) |

Les filtres s'appliquent aux **prompts** (entrées) et aux **réponses** (sorties).

### Les prompt shields

Ils utilisent des algorithmes de **détection d'abus** pour déterminer si la solution est **systématiquement détournée**, par exemple par un utilisateur qui tente de **contourner le prompt système**.

## Couche 3 — Message système et ancrage

Cette couche porte sur la **construction des prompts** envoyés au modèle.

- Définir des **entrées système** qui fixent les paramètres de comportement du modèle.
- Utiliser le **prompt engineering** pour ajouter des données d'ancrage aux prompts, ce qui maximise les chances d'une sortie pertinente et non nuisible.
- Utiliser le **RAG** pour récupérer des données de contexte dans des sources **de confiance** et les inclure dans les prompts.

C'est le lien avec le module précédent : un bon message système et un bon ancrage servent aussi la sécurité.

## Couche 4 — L'expérience utilisateur

Elle comprend l'**application** par laquelle les utilisateurs interagissent avec le modèle, et la **documentation** qui décrit la solution.

| Atténuation | Explication |
|---|---|
| **Contraindre les entrées** dans l'interface | Limiter à des sujets ou types précis |
| **Valider les entrées et les sorties** | Contrôler ce qui entre et ce qui s'affiche |
| **Documentation transparente** | Être clair sur les capacités et les limites du système, les modèles utilisés, et les préjudices que les mesures en place ne couvrent pas toujours |

## Le tableau à mémoriser

| Couche | Mot-clé | Exemples d'atténuation |
|---|---|---|
| **Modèle** | Le bon modèle | Choisir un modèle adapté, fine-tuner |
| **Système de sécurité** | La plateforme | **Guardrails**, filtres de contenu, prompt shields |
| **Message système et ancrage** | Le prompt | Message système, prompt engineering, RAG |
| **Expérience utilisateur** | L'application | Interface contrainte, validation, documentation transparente |

> **Exemple : le copilote de cuisine.**
>
> - **Modèle** : un modèle fine-tuné sur des recettes validées.
> - **Système de sécurité** : un guardrail qui bloque la violence et l'automutilation au niveau le plus strict.
> - **Message système et ancrage** : « Tu ne réponds qu'aux questions culinaires » + RAG sur une base de temps de cuisson vérifiés.
> - **Expérience utilisateur** : un champ de saisie limité aux ingrédients, et une mention « vérifiez toujours la cuisson des viandes ».

#### Point examen : question officielle du module — la capacité de Microsoft Foundry qui aide à atténuer la génération de contenu nuisible au niveau du système de sécurité, ce sont les guardrails. Le fine-tuning relève de la couche modèle.

## Exercices rapides

À quelle couche appartient chaque atténuation ?

**1.** Un filtre de contenu qui bloque les propos haineux.

**2.** Un menu déroulant qui remplace un champ de texte libre.

**3.** Le choix d'un petit modèle de classification plutôt que GPT-4.

**4.** Un message système qui limite l'assistant aux questions de voyage.

**5.** Une page « Limites connues de l'assistant » dans l'aide.

**6.** Du RAG sur une base documentaire validée.

Et aussi :

**7.** Donne les 4 niveaux de gravité des filtres de contenu.

**8.** Donne les 5 catégories de préjudice.

**9.** À quoi servent les prompt shields ?

**10.** Que fait-on après avoir appliqué une atténuation ?

<details>
<summary>Voir le corrigé</summary>

**1.** Système de sécurité.

**2.** Expérience utilisateur.

**3.** Modèle.

**4.** Message système et ancrage.

**5.** Expérience utilisateur (documentation transparente).

**6.** Message système et ancrage.

**7.** safe, low, medium, high.

**8.** Hate and fairness, sexual, violence, self-harm, task-adherence.

**9.** À détecter, par des algorithmes de détection d'abus, si la solution est systématiquement détournée, par exemple par une tentative de contourner le prompt système.

**10.** On reteste le système modifié et on compare les niveaux de préjudice à la référence.

</details>
