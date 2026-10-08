# Lab — choisir, déployer et évaluer un modèle

## Objectif

Refaire dans le portail Foundry tout le parcours du module : explorer le catalogue, comparer, déployer, tester, évaluer.

- **Durée** : environ 20 minutes.
- **Prérequis** : un abonnement Azure sur lequel tu as un **accès administrateur**.
- **Où** : bouton « Launch the exercise » sur la page de l'unité Microsoft Learn. Suis les instructions officielles.

Cette fiche ne remplace pas les instructions du lab. Elle te sert de liste de contrôle.

## Liste de contrôle

| Étape | Où dans le portail | À observer |
|---|---|---|
| Explorer | **Discover → Models** | Les filtres, une model card |
| Comparer | **Model leaderboard**, onglet **Benchmarks** | Qualité, sécurité, coût estimé, débit |
| Comparer deux modèles | Cocher 2 ou 3 modèles → **Compare** | Fenêtre de contexte, fonctionnalités |
| Déployer | **Deploy** sur la model card | Le type de déploiement proposé, le nom du déploiement |
| Vérifier | **Build → Models** | État **Succeeded**, endpoint, clés |
| Tester | Playground | Message système, temperature, onglet **Code** |
| Évaluer | Page **Evaluation** | Choix des métriques, jeu de données, résultats |

## Trois petites expériences à faire

1. **Temperature.** Pose trois fois la même question avec temperature à 0, puis trois fois à 1. Compare la variété des réponses.
2. **Message système.** Ajoute « Réponds en une seule phrase, sans emoji ». Vérifie que le modèle obéit sur plusieurs questions.
3. **Onglet Code.** Repère dans l'exemple Python où apparaissent l'endpoint, l'authentification et le nom du déploiement.

## Bonnes pratiques

- Note le **nom de ton déploiement** et l'**endpoint** : tu les réutiliseras au module suivant.
- **Supprime le déploiement et les ressources** à la fin si tu ne continues pas, pour ne pas consommer ton crédit.

## Exercices rapides

**1.** Où gères-tu les modèles déjà déployés : Discover ou Build ?

**2.** Quel état confirme qu'un déploiement a réussi ?

**3.** Quel onglet du playground donne du code prêt à copier ?

<details>
<summary>Voir le corrigé</summary>

**1.** Build → Models. Discover sert à chercher dans le catalogue.

**2.** Succeeded.

**3.** L'onglet Code.

</details>
