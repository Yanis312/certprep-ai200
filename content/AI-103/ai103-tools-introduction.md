# Introduction — pourquoi donner des outils à un modèle

## L'essentiel

- Un modèle génératif a une **frontière de connaissances** : il ne raisonne que sur ce qui était dans ses données d'entraînement.
- Les **outils** (tools) le relient au monde réel : informations fraîches, actions, données de l'entreprise.
- Dans ce module, c'est l'**application cliente** qui indique les outils dans le prompt envoyé au modèle.
- C'est la première marche vers les **agents**, où modèle, instructions et outils sont enregistrés sous un nom.
- Ne confonds pas ces outils avec les **Foundry Tools**.

## Attention au vocabulaire

| Terme | Ce que c'est |
|---|---|
| **Outils (tools) d'un modèle** | Des capacités que le modèle peut invoquer pendant une réponse : `code_interpreter`, `web_search`, `file_search`, `function` |
| **Foundry Tools** | Des API d'IA Azure (Language, Speech, Translator...) utilisables dans tes applications et agents |

Même mot, deux choses différentes. Ce module parle des premiers.

## Ce que les outils apportent

| Bénéfice | Exemple |
|---|---|
| **Accéder à l'information en temps réel** | Météo, cours de bourse, réponse d'une API absente des données d'entraînement |
| **Agir** | Envoyer un e-mail, créer un enregistrement en base, déclencher un workflow |
| **Ancrer les réponses dans des faits** | Récupérer une information précise et fiable pour réduire les erreurs |
| **Étendre les fonctionnalités** | Se connecter à tes systèmes, bases et règles métier |
| **Construire des workflows intelligents** | Enchaîner plusieurs opérations coordonnées par l'IA |

Sans outils, l'IA générative travaille **en vase clos**. Avec eux, elle devient un assistant qui peut **observer, raisonner et agir**.

## Outils à la demande ou agent ?

| | Outils dans le prompt (ce module) | Agent (parcours suivant) |
|---|---|---|
| Qui gère la configuration des outils | L'**application cliente**, à chaque appel | L'**agent**, où elle est **persistée** |
| Ce qui est enregistré | Rien : tout est dans le code | Modèle, instructions et outils, sous un **nom** |
| Image | Un assistant fabriqué dans la logique de ton application | Une entité autonome réutilisable |

## Exemple

Un utilisateur demande : « Quel temps fera-t-il demain à Lyon, et dois-je décaler ma livraison ? »

- **Sans outil** : le modèle ne connaît pas la météo de demain. Il répond de façon vague ou invente.
- **Avec outils** : il interroge un service météo (information en temps réel), consulte le planning de livraison (données de l'entreprise), puis propose de décaler et crée la demande (action).

#### Point examen : la compétence visée est « Concevoir des flux augmentés par des outils ». Retiens que le modèle décide d'utiliser un outil, mais que la configuration vient ici de l'application cliente.

## Exercices rapides

**1.** Que signifie la « frontière de connaissances » d'un modèle ?

**2.** Cite trois choses que les outils permettent à un modèle.

**3.** Quelle est la différence entre un outil de modèle et un Foundry Tool ?

**4.** Dans ce module, qui gère la configuration des outils ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le modèle ne peut raisonner que sur les informations présentes dans ses données d'entraînement.

**2.** Trois parmi : accéder à l'information en temps réel, agir, ancrer les réponses dans des faits, étendre les fonctionnalités, construire des workflows.

**3.** Un outil de modèle est une capacité que le modèle invoque pendant une réponse. Les Foundry Tools sont des API d'IA Azure préconstruites.

**4.** L'application cliente, dans le prompt qu'elle envoie. Dans un agent, cette configuration est persistée.

</details>
