# Lab — fine-tuner un modèle de langage

## Objectif

Fine-tuner un modèle pour un chat de voyage au ton amical et constant, puis le **comparer au modèle de base** pour voir lequel convient le mieux.

- **Durée** : environ 90 minutes, dont une longue attente. Le fine-tuning et le déploiement peuvent prendre **60 minutes ou plus**.
- **Prérequis** : un abonnement Azure avec le droit de créer des ressources d'IA.
- Tout se fait dans le **portail Foundry**, sans code.

Certaines étapes peuvent expirer ou sembler tourner indéfiniment. Les technologies sont en préversion.

## Avant de te lancer : le coût

Ce lab est le **plus coûteux** du parcours : le fine-tuning facture l'entraînement, puis l'hébergement du modèle personnalisé **à l'heure**. Avec un crédit étudiant limité, lis d'abord tout le lab, fais-le d'une traite, et **supprime le groupe de ressources dès la fin**.

## Étape 1 — Projet

1. `https://ai.azure.com`, active **New Foundry**, crée un projet.
2. **Region** : il faut une région qui prend en charge le fine-tuning des modèles gpt-5. Au moment de la rédaction du lab : **North Central US** ou **Sweden Central**.

Piège : dans une autre région, le fine-tuning ne sera pas proposé.

## Étape 2 — Déployer le modèle de base

**Discover → Models**, cherche **gpt-5**, déploie avec les paramètres par défaut. Il servira de **référence**.

## Étape 3 — Lancer le fine-tuning

On le lance tout de suite parce qu'il est long.

1. Télécharge le jeu de données : `https://microsoftlearning.github.io/mslearn-ai-studio/data/travel-finetune-hotel.jsonl`. Vérifie que le fichier garde l'extension **.jsonl** et non .txt.
2. Dans le portail, navigation de gauche : **Fine-tune**, puis le bouton **Fine-tune** en haut à droite.
3. Réglages :

| Réglage | Valeur |
|---|---|
| Base model | gpt-5 |
| Customization method | **Supervised** |
| Training type | Standard |
| Training data | Upload new dataset → ton fichier .jsonl |
| Suffix | `ft-travel` |
| Automatically deploy model after job completion | Coché |
| Deployment type | **Developer** |
| Hyperparamètres | Valeurs par défaut |

4. **Submit**.

Deux liens avec le cours : la méthode **Supervised** est le SFT (paires prompt/réponse), et le type de déploiement **Developer** est celui réservé à l'évaluation de modèles fine-tunés.

Pour suivre l'avancement : sélectionne le travail et ouvre son onglet **Monitor**.

## Étape 4 — Discuter avec le modèle de base

Pendant l'attente : **Deployments** → le modèle gpt-5 de base.

**Essai 1.** Demande `What can you do?`. Réponse plutôt générique.

**Essai 2.** Mets ces instructions, puis repose la question :

```
You are an AI assistant that helps people plan their travel.
```

L'assistant peut proposer de réserver vols, hôtels et voitures. On veut éviter ça.

**Essai 3.** Instructions plus précises :

```
You are an AI travel assistant that helps people plan their trips. Your objective is to offer support for travel-related inquiries, such as visa requirements, weather forecasts, local attractions, and cultural norms.
You should not provide any hotel, flight, rental car or restaurant recommendations.
Ask engaging questions to help someone plan their trip and think about what they want to do on their holiday.
```

Pose ces questions et note le **ton** et le **style** des réponses :

- `Where in Rome should I stay?`
- `I'm mostly there for the food. Where should I stay to be within walking distance of affordable restaurants?`
- `What are some local delicacies I should try?`
- `When is the best time of year to visit in terms of the weather?`
- `What's the best way to get around the city?`

C'est la progression du cours : un prompt simple, puis un message système détaillé avec rôle, limites et règle de conduite.

## Étape 5 — Lire le fichier d'entraînement

Ouvre le fichier JSONL dans un éditeur de texte. Premier exemple, mis en forme :

```json
{"messages": [
    {"role": "system", "content": "You are an AI travel assistant that helps people plan their trips. ... Ask engaging questions to help someone plan their trip and think about what they want to do on their holiday."},
    {"role": "user", "content": "What's a must-see in Paris?"},
    {"role": "assistant", "content": "Oh la la! You simply must twirl around the Eiffel Tower and snap a chic selfie! After that, consider visiting the Louvre Museum to see the Mona Lisa and other masterpieces. What type of attractions are you most interested in?"}
]}
```

Ce qu'il faut voir :

- chaque exemple contient le **même message système** que celui testé avec le modèle de base ;
- un prompt utilisateur lié au voyage ;
- une réponse dont le **style** (enjoué, avec une question à la fin) est ce que le modèle doit apprendre.

## Étape 6 — Tester le modèle fine-tuné

1. **Fine-tune** : vérifie l'état du travail. L'onglet **Logs** montre les tâches effectuées.
2. Quand c'est fini et déployé, vérifie dans **Deployments** que le modèle apparaît. Si le déploiement automatique a échoué, sélectionne le travail terminé et déploie le modèle depuis là.
3. Ouvre le modèle fine-tuné dans le playground.
4. Remets **les mêmes instructions** que pour le modèle de base (essai 3).
5. Repose les cinq mêmes questions.

**Ce que tu dois observer** : un comportement plus **constant**, dans le style des exemples d'entraînement.

Retiens le protocole : **mêmes instructions, mêmes questions**, pour une comparaison juste avec la référence.

## Nettoyage

Indispensable ici, car un modèle fine-tuné hébergé est facturé à l'heure.

1. **Portail Azure** → groupe de ressources du lab.
2. **Delete resource group**.
3. Saisis le nom et confirme.

## Exercices rapides

**1.** Pourquoi le lab impose-t-il de choisir North Central US ou Sweden Central ?

**2.** Quelle méthode de personnalisation le lab utilise-t-il, et à quel type du cours correspond-elle ?

**3.** Quel type de déploiement est choisi pour le modèle fine-tuné, et pourquoi est-ce cohérent ?

**4.** Pourquoi réutiliser les mêmes instructions et les mêmes questions avec le modèle fine-tuné ?

**5.** Qu'est-ce que les exemples d'entraînement ont tous en commun ?

**6.** Pourquoi faut-il supprimer les ressources rapidement après ce lab en particulier ?

<details>
<summary>Voir le corrigé</summary>

**1.** Parce que ces régions prenaient en charge le fine-tuning des modèles gpt-5 au moment de la rédaction du lab.

**2.** Supervised, c'est-à-dire le supervised fine-tuning (SFT) sur des paires prompt/réponse.

**3.** Developer. Ce type de déploiement est destiné à l'évaluation de modèles fine-tunés.

**4.** Pour comparer équitablement le modèle fine-tuné à la référence obtenue avec le modèle de base.

**5.** Le même message système, et des réponses dans le style que le modèle doit apprendre.

**6.** Parce que l'hébergement d'un modèle fine-tuné est facturé à l'heure.

</details>
