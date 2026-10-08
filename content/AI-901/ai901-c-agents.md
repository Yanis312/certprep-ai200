# AI agents — les agents et les systèmes multi-agents

## L'essentiel

- Un **agent** ne se contente pas de répondre : il **fait** des choses.
- C'est une application construite sur l'IA générative qui **raisonne**, **automatise des tâches avec des outils** et **réagit au contexte**.
- Trois éléments : un **LLM**, des **instructions**, des **outils**.
- Deux familles d'outils : **connaissance** (accéder à l'information) et **action** (exécuter une tâche).
- Dans un **système multi-agents**, plusieurs agents spécialisés collaborent. Ils communiquent par des **prompts**.

## Les 3 éléments d'un agent

| Élément | Rôle | Image |
|---|---|---|
| **Un grand modèle de langage** | Comprendre le langage et raisonner | Le **cerveau** |
| **Des instructions** | Un prompt système qui définit le rôle et le comportement | La **fiche de poste** |
| **Des outils** | Ce qui permet d'interagir avec le monde | Les **mains** |

## Les deux familles d'outils

| Type | Ce qu'il apporte | Exemples |
|---|---|---|
| **Outils de connaissance** | L'accès à l'information | Moteurs de recherche, bases de données |
| **Outils d'action** | La capacité d'exécuter des tâches | Envoyer des e-mails, mettre à jour un agenda, piloter des appareils |

## Chatbot ou agent

| | Chatbot génératif | Agent |
|---|---|---|
| Ce qu'il fait | Répond à des questions | Répond **et agit** |
| Outils | Aucun, ou très peu | Connaissance et action |
| Exemple | « Voici comment poser un congé » | Il **pose le congé** pour toi |

## Les systèmes multi-agents

Au lieu d'un seul agent qui fait tout, **plusieurs agents collaborent**, chacun avec sa **spécialité**.

```
              Demande de l'utilisateur
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
  Agent collecte   Agent analyse    Agent action
  (rassemble les   (analyse les     (exécute la
   données)         données)         décision)
```

Dans l'exemple du cours : un agent **rassemble** les données, un autre les **analyse**, un troisième **agit**. Ensemble, ils forment une équipe capable de gérer des workflows complexes, comme une équipe humaine.

### Comment ils se parlent

Les agents communiquent entre eux par des **prompts**. Ils utilisent l'IA générative pour déterminer **quelles tâches** sont nécessaires et **quels agents** en sont responsables.

> **Exemple.** Préparer un rapport de ventes mensuel. L'agent « collecte » interroge la base des ventes. Il envoie les chiffres, sous forme de prompt, à l'agent « analyse », qui repère une baisse dans une région. Celui-ci transmet sa conclusion à l'agent « action », qui rédige le rapport et l'envoie au directeur.

## Pourquoi plusieurs agents

| Un seul agent | Plusieurs agents |
|---|---|
| Doit tout savoir faire | Chacun est spécialisé |
| Instructions longues et complexes | Instructions courtes et ciblées |
| Difficile à faire évoluer | On remplace ou on ajoute un agent |

L'IA agentique est présentée comme la prochaine étape dans la façon d'utiliser la technologie pour trouver de l'information et accomplir un travail.

#### Point examen : question officielle du module — un agent est un système d'IA qui peut effectuer des tâches pour le compte d'un utilisateur. Ce n'est ni un modèle secret, ni un opérateur humain.

## Exercices rapides

**1.** Quels sont les 3 éléments d'un agent ?

**2.** Classe : (a) interroger une base de données, (b) envoyer un e-mail, (c) chercher sur le web, (d) régler un thermostat.

**3.** Quelle est la différence entre un chatbot génératif et un agent ?

**4.** Qu'est-ce qu'un système multi-agents ?

**5.** Par quoi les agents communiquent-ils entre eux ?

**6.** Dans l'exemple du cours, quels sont les rôles des trois agents ?

<details>
<summary>Voir le corrigé</summary>

**1.** Un grand modèle de langage, des instructions et des outils.

**2.** (a) connaissance, (b) action, (c) connaissance, (d) action.

**3.** Le chatbot répond ; l'agent, en plus, utilise des outils pour trouver de l'information et accomplir des tâches.

**4.** Un système où plusieurs agents, chacun avec sa spécialité, collaborent pour traiter des workflows complexes.

**5.** Par des prompts.

**6.** Un agent rassemble les données, un autre les analyse, un troisième agit.

</details>
