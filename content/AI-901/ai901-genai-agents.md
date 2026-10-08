# Introduction, IA générative et agents

## L'essentiel

- Ce module donne une **vue d'ensemble** des capacités de l'IA et une intuition de leur fonctionnement. Pas de code, pas de maths.
- L'**IA générative** permet à une application de **générer du contenu nouveau** : dialogue, images, vidéo, code.
- Elle repose sur un **modèle de langage**, entraîné sur d'énormes volumes de données.
- L'utilisateur interagit par des **prompts** : des phrases ou des questions en langage naturel.
- Un **agent** = un **modèle** + des **instructions** + des **outils**.

## L'exemple fil rouge du module

Un **site sur l'histoire de l'informatique**. Tout le module l'enrichit, capacité après capacité :

| Capacité | Ce que le site sait faire |
|---|---|
| IA générative | Un chat qui répond aux questions sur les personnages et les machines |
| Texte | Résumer un article, en extraire noms, lieux et dates |
| Parole | Un bouton micro, et des réponses lues à voix haute |
| Vision | Analyser la photo d'un vieil ordinateur et l'identifier |
| Extraction | Lire un numéro de série sur la photo d'un composant |
| IA responsable | Refuser d'aider à une activité illégale |

## Comment marche l'IA générative

```
Utilisateur  ──  prompt  ──►  Modèle de langage  ──►  réponse générée
```

Le modèle a appris les **relations sémantiques** entre les éléments du langage. Dit simplement : il « sait » comment les mots se relient entre eux. C'est ce qui lui permet de produire une suite de texte qui a du sens.

## LLM ou SLM

| | LLM (grand modèle de langage) | SLM (petit modèle de langage) |
|---|---|---|
| Différence | Plus de données, plus de variables | Moins de données, moins de variables |
| Forces | Puissant, **généralise bien** | Bon sur des **sujets ciblés** |
| Limites | Plus coûteux à entraîner et à utiliser | Moins polyvalent |
| Usage type | Assistant généraliste | Petit modèle facile à déployer, pour des applications **locales** et des agents **sur appareil** |

> **Exemple.** Un assistant embarqué dans une montre connectée, sans réseau fiable : un SLM. Un assistant qui répond à toutes sortes de questions sur un site : un LLM.

## Les agents

Un agent est une application construite sur l'IA générative qui peut :

- **raisonner** sur le langage naturel et en générer ;
- **automatiser des tâches** avec des outils ;
- **réagir au contexte** pour agir de façon appropriée.

### Ses 3 éléments

| Élément | Rôle | Image |
|---|---|---|
| **Un grand modèle de langage** | Comprendre et raisonner | Le **cerveau** |
| **Des instructions** | Un prompt système qui définit le rôle et le comportement | La **fiche de poste** |
| **Des outils** | Ce qui lui permet d'interagir avec le monde | Les **mains** |

### Deux familles d'outils

| Type | Ce qu'il apporte | Exemples |
|---|---|---|
| **Outils de connaissance** | L'accès à l'information | Moteurs de recherche, bases de données |
| **Outils d'action** | La capacité d'exécuter des tâches | Envoyer un e-mail, mettre à jour un agenda, piloter un appareil |

> **Exemple.** Un agent « assistant de réunion ». Instructions : « Tu organises les réunions de l'équipe. » Outil de connaissance : consulter les agendas. Outil d'action : envoyer les invitations. Tu lui dis « trouve un créneau jeudi avec Léa et Karim », il cherche, choisit et envoie.

## Scénarios courants

- **Chatbots** qui répondent aux questions ou tiennent une conversation.
- **Assistants IA** qui aident en automatisant des tâches.
- **Création** de documents ou d'autres contenus, souvent comme point de départ à retravailler.
- **Traduction** automatique entre langues.
- **Résumé** ou explication de documents complexes.

#### Point examen : deux questions officielles du module — l'IA générative utilise un modèle de langage pour créer du contenu original en réponse à un prompt ; un agent IA est une application d'IA qui peut effectuer des tâches pour le compte d'un utilisateur.

## Exercices rapides

**1.** Qu'est-ce qu'un prompt ?

**2.** Quels sont les trois éléments d'un agent ?

**3.** Classe ces outils en « connaissance » ou « action » : (a) rechercher dans une base documentaire, (b) envoyer un e-mail, (c) interroger un moteur de recherche, (d) allumer un appareil.

**4.** Tu veux un petit modèle à faire tourner directement sur un téléphone. LLM ou SLM ?

**5.** Quelle différence entre un chatbot génératif et un agent ?

**6.** Cite trois usages courants de l'IA générative.

<details>
<summary>Voir le corrigé</summary>

**1.** Une phrase ou une question en langage naturel par laquelle l'utilisateur s'adresse au modèle.

**2.** Un grand modèle de langage, des instructions et des outils.

**3.** (a) connaissance, (b) action, (c) connaissance, (d) action.

**4.** Un SLM.

**5.** Le chatbot génère des réponses. L'agent, en plus, utilise des outils pour trouver de l'information et accomplir des tâches à ta place.

**6.** Trois parmi : chatbots, assistants qui automatisent des tâches, création de contenu, traduction, résumé de documents.

</details>
