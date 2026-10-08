# Introduction et plan — une IA générative responsable

## L'essentiel

- L'IA générative produit du contenu parfois **impossible à distinguer** de celui d'un humain. Cette puissance s'accompagne de **dangers**.
- Tous ceux qui construisent ces solutions doivent **identifier, mesurer et atténuer** les risques.
- Microsoft propose un processus en **4 étapes** : **Map, Measure, Mitigate, Manage**.
- Ces étapes correspondent de près aux fonctions du **NIST AI Risk Management Framework**.
- Ces lignes directrices s'appuient sur le **standard d'IA responsable** de Microsoft, adapté à l'IA générative.

## Les 4 étapes

```
1. MAP        →   2. MEASURE    →   3. MITIGATE    →   4. MANAGE
cartographier     mesurer           atténuer           gérer
les préjudices    leur présence     sur plusieurs      le déploiement
potentiels                          couches            et l'exploitation
```

| Étape | Ce qu'on fait | Résultat |
|---|---|---|
| **Map** (cartographier) | Recenser les préjudices potentiels pertinents pour la solution | Une liste priorisée de préjudices |
| **Measure** (mesurer) | Mesurer la présence de ces préjudices dans les sorties | Une **référence** chiffrée |
| **Mitigate** (atténuer) | Réduire les préjudices sur **plusieurs couches**, et communiquer avec transparence sur les risques | Une solution plus sûre |
| **Manage** (gérer) | Définir et suivre un plan de déploiement et de préparation opérationnelle | Une mise en service maîtrisée |

Moyen de retenir l'ordre : les quatre mots commencent par **M**, et suivent une logique simple. On **trouve** les problèmes, on les **compte**, on les **réduit**, on **exploite** proprement.

## Lien avec les 6 principes

Le module 1 présentait les **6 principes** d'IA responsable (équité, fiabilité, confidentialité, inclusion, transparence, responsabilité). Ce module donne la **méthode** pour les appliquer à une solution générative.

| | Module 1 | Ce module |
|---|---|---|
| Nature | Des **principes** | Un **processus** |
| Question | Que doit respecter une IA ? | Comment s'y prendre concrètement ? |

## Exemple fil rouge

Le cours utilise un **copilote de cuisine intelligent** qui aide des chefs et des amateurs avec des recettes.

| Étape | Appliquée au copilote de cuisine |
|---|---|
| Map | Risques : temps de cuisson faux, recette d'un poison |
| Measure | On envoie des prompts tests et on compte les réponses problématiques |
| Mitigate | Garde-fous, message système, interface limitée aux sujets culinaires |
| Manage | Revue juridique, lancement progressif, plan de réponse aux incidents |

#### Point examen : l'ordre des 4 étapes et ce que chacune produit. Le domaine « Implémenter l'IA responsable dans les systèmes d'IA et d'agent génératifs » fait partie des 25 à 30 % du premier domaine de l'examen.

## Exercices rapides

**1.** Donne les 4 étapes dans l'ordre.

**2.** À quel référentiel externe ces étapes correspondent-elles de près ?

**3.** À quelle étape appartient chaque action ? (a) rédiger un plan de retour arrière, (b) lister les préjudices possibles, (c) configurer un filtre de contenu, (d) compter les réponses nuisibles sur 200 prompts tests.

**4.** Quelle est la différence entre les 6 principes d'IA responsable et ce processus ?

<details>
<summary>Voir le corrigé</summary>

**1.** Map, Measure, Mitigate, Manage.

**2.** Le NIST AI Risk Management Framework.

**3.** (a) Manage, (b) Map, (c) Mitigate, (d) Measure.

**4.** Les principes disent ce qu'une IA doit respecter. Le processus dit comment procéder, étape par étape, pour une solution générative.

</details>
