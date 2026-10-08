# Lab — préparer un projet de développement d'IA

## Objectif

Explorer Microsoft Foundry par toi-même : créer un projet et repérer où se trouve chaque élément vu dans le module.

- **Durée** : environ 30 minutes.
- **Prérequis** : un abonnement Azure. Sans abonnement, tu peux créer un compte d'essai avec des crédits valables 30 jours.
- **Où** : bouton « Launch the exercise » sur la page de l'unité Microsoft Learn. Suis les instructions officielles, elles sont à jour avec l'interface.

Cette fiche ne remplace pas les instructions du lab. Elle te donne une liste de choses à repérer pendant que tu le fais.

## Ce que tu dois savoir retrouver

| À repérer dans le portail Foundry | Lien avec le cours |
|---|---|
| La **ressource Foundry** et son **projet par défaut** | Un projet appartient à une seule ressource |
| Le **catalogue de modèles** | Foundry Models |
| Un **déploiement de modèle** et le playground pour le tester | Élément « Models » du projet |
| L'**endpoint du projet** | API et SDK propres à Foundry, agents |
| L'**endpoint Azure OpenAI** | API et SDK OpenAI |
| Les **clés** d'accès | Authentification des applications clientes |
| La gestion des **accès utilisateurs** | Configuration de la ressource |

## Pendant le lab, pose-toi ces questions

- Quelle différence vois-tu entre le **portail Azure** et le **portail Foundry** pour la même ressource ?
- Où lis-tu le **nom du déploiement** ? C'est lui que le code utilisera, pas forcément le nom du modèle.
- Quel endpoint te faudrait-il pour un **agent** ?

## Bonnes pratiques

- Note dans un fichier l'endpoint du projet et le nom du déploiement : tu en auras besoin dans les modules suivants.
- **Supprime les ressources** à la fin si tu ne continues pas tout de suite, pour éviter des coûts.
- Ne colle jamais une clé dans du code que tu publies sur GitHub.

## Exercices rapides

À faire après le lab, sans regarder le portail.

**1.** Dans quel portail as-tu créé et testé le déploiement du modèle ?

**2.** Quelles deux informations minimales ton code doit-il connaître pour appeler un modèle déployé ?

**3.** Pourquoi supprimer les ressources après le lab ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le portail Microsoft Foundry.

**2.** L'endpoint et le nom du déploiement. Il faut aussi de quoi s'authentifier : une clé ou un jeton.

**3.** Parce que les ressources Azure laissées actives peuvent continuer à générer des coûts.

</details>
