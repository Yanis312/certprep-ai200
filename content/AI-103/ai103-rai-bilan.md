# Bilan du module — IA générative responsable

## Le module en 10 lignes

1. Processus Microsoft en 4 étapes : **Map, Measure, Mitigate, Manage**, proche du **NIST AI RMF**.
2. **Map** : identifier, prioriser, tester et vérifier, documenter et partager.
3. Priorité selon la **probabilité** et l'**impact**, en tenant compte de l'usage prévu et du détournement possible.
4. **Red teaming** : une équipe cherche volontairement à faire produire du contenu nuisible.
5. **Measure** : prompts de test → sorties → critères stricts ; établir une **référence**.
6. Test **manuel** d'abord, **automatisé** ensuite, manuel **périodique** toujours.
7. **Mitigate** sur 4 couches : **modèle**, **système de sécurité**, **message système et ancrage**, **expérience utilisateur**.
8. **Guardrails** Foundry : filtres de contenu (4 niveaux de gravité, 5 catégories) et **prompt shields**.
9. **Manage** : revues (juridique, confidentialité, sécurité, accessibilité), **livraison par phases**, plans d'**incident** et de **retour arrière**.
10. Prévoir le **blocage** rapide, le **signalement** par les utilisateurs et une **télémétrie** respectueuse de la vie privée.

## La carte complète

```
MAP                 MEASURE              MITIGATE                    MANAGE
────                ───────              ────────                    ──────
Identifier          Préparer prompts     1. Modèle                   Revues de conformité
Prioriser           Générer sorties      2. Système de sécurité      Livraison par phases
Tester (red team)   Évaluer (critères)   3. Message système/ancrage  Réponse aux incidents
Documenter          → référence          4. Expérience utilisateur   Retour arrière
                                                                     Blocage, signalement
                                                                     Télémétrie
```

## Les chiffres à connaître

| Quoi | Combien | Lesquels |
|---|---|---|
| Étapes du processus | 4 | Map, Measure, Mitigate, Manage |
| Sous-étapes de Map | 4 | Identifier, prioriser, tester et vérifier, documenter et partager |
| Étapes de Measure | 3 | Préparer, soumettre, évaluer |
| Couches d'atténuation | 4 | Modèle, système de sécurité, message système et ancrage, expérience utilisateur |
| Niveaux de gravité | 4 | safe, low, medium, high |
| Catégories de préjudice | 5 | hate and fairness, sexual, violence, self-harm, task-adherence |
| Revues de conformité | 4 | Juridique, confidentialité, sécurité, accessibilité |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Pourquoi créer une évaluation d'impact de l'IA en concevant une solution générative ? | Pour **documenter l'objectif, l'usage prévu et les préjudices potentiels** de la solution |
| Quelle capacité de Foundry atténue la génération de contenu nuisible au niveau du système de sécurité ? | Les **guardrails** |
| Pourquoi un plan de livraison par phases ? | Pour **recueillir des retours et repérer les problèmes** avant une diffusion plus large |

Le texte fourni ne contenait pas le corrigé de Microsoft. Ces réponses découlent directement du cours ; vérifie-les en faisant l'évaluation sur Learn.

Les mauvaises réponses à écarter :

- l'évaluation d'impact ne sert **pas** à se dégager de sa responsabilité juridique, ni à estimer les coûts cloud ;
- le **fine-tuning** est une atténuation de la couche **modèle**, pas du système de sécurité ;
- la livraison par phases **ne supprime pas** le besoin de cartographier, mesurer, atténuer et gérer.

## Fin du parcours LP1

Tu as terminé « Develop generative AI apps in Azure ». Le fil du parcours :

| Module | Question |
|---|---|
| 1. Plan and prepare | Quels services et outils ? |
| 2. Select, deploy, evaluate | Quel modèle, comment le déployer et le mesurer ? |
| 3. Chat app | Comment l'appeler depuis du code ? |
| 4. Tools | Comment lui donner des capacités d'action ? |
| 5. Optimize | Comment améliorer ses réponses ? |
| 6. Responsible AI | Comment le faire de façon sûre ? |

Suite : le parcours **Develop AI agents on Azure**, qui reprend les outils du module 4 dans des agents persistés.

#### Point examen : sache placer une action dans la bonne étape (Map, Measure, Mitigate, Manage) et une atténuation dans la bonne couche. Ce sont les deux classements que l'examen aime tester.

## Exercices rapides

**1.** Place chaque action dans son étape : (a) red teaming, (b) plan de retour arrière, (c) guardrail, (d) calcul d'une référence.

**2.** Place chaque atténuation dans sa couche : (a) prompt shields, (b) RAG sur des sources de confiance, (c) choix d'un modèle plus simple, (d) validation des sorties dans l'application.

**3.** Combien de niveaux de gravité et de catégories de préjudice les filtres de contenu utilisent-ils ?

**4.** Cite trois éléments du plan de mise en service.

**5.** Pourquoi le filtrage de contenu ne suffit-il pas à lui seul ?

<details>
<summary>Voir le corrigé</summary>

**1.** (a) Map, (b) Manage, (c) Mitigate, (d) Measure.

**2.** (a) Système de sécurité, (b) message système et ancrage, (c) modèle, (d) expérience utilisateur.

**3.** 4 niveaux de gravité et 5 catégories.

**4.** Trois parmi : livraison par phases, plan de réponse aux incidents, plan de retour arrière, blocage des réponses nuisibles, blocage d'utilisateurs ou d'adresses IP, signalement par les utilisateurs, télémétrie.

**5.** Parce qu'il ne couvre qu'une couche, le système de sécurité. L'atténuation repose sur quatre couches qui se complètent.

</details>
