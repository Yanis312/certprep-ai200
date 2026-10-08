# Evaluate model performance — évaluer un modèle

## L'essentiel

- Évaluer vérifie que le modèle déployé est **de qualité, exact et sûr**, et le reste dans le temps.
- Trois familles d'approches : **manuelle**, **métriques assistées par IA**, **métriques NLP**.
- Les métriques assistées par IA utilisent un **modèle évaluateur** (un modèle GPT). Les métriques NLP sont des **calculs mathématiques** et demandent souvent une **vérité terrain** (ground truth).
- Le portail Foundry lance des évaluations complètes sur un **jeu de données de test** avec plusieurs métriques à la fois.
- Les résultats guident la suite : prompt engineering, autre modèle, RAG, fine-tuning, filtres de contenu.

## Pourquoi évaluer

| Objectif | Ce qu'on y gagne |
|---|---|
| **Assurance qualité** | Repérer les problèmes avant la production, protéger les utilisateurs et la réputation |
| **Satisfaction utilisateur** | Des réponses utiles et adaptées, de façon constante |
| **Amélioration continue** | Mesurer l'effet de chaque changement de prompt, de fonctionnalité ou de modèle |
| **Conformité et sécurité** | Respect des politiques, pas de contenu nuisible, protection des données |

## Évaluation manuelle

Des humains jugent les réponses. C'est long, mais ça capte ce que les métriques ne voient pas.

| Méthode | Principe |
|---|---|
| **Test interactif dans le playground** | Essayer des prompts variés, noter les erreurs, le ton inadapté, les consignes non suivies |
| **Comparaison côte à côte** | Tester plusieurs modèles dans le playground en **synchronisant** instructions système et prompts |
| **Revue structurée** | Un jeu de cas de test représentatifs, notés par des évaluateurs |
| **Études utilisateurs** | Retours d'utilisateurs réels ou représentatifs |

Critères de la revue structurée, souvent notés de **1 à 5** :

- **Pertinence** : la réponse traite-t-elle la question ?
- **Informativité** : assez de détails utiles ?
- **Engagement** : intéressante et conversationnelle comme il faut ?
- **Exactitude** : les faits sont-ils corrects ?
- **Sécurité** : pas de contenu nuisible, biaisé ou inapproprié ?

L'évaluation manuelle saisit les aspects **subjectifs** : satisfaction, adéquation au contexte, alignement avec la marque.

## Métriques automatiques assistées par IA

Elles passent à l'échelle et donnent des mesures constantes. Tu indiques un **modèle GPT évaluateur**, qui analyse les réponses de ton modèle et attribue des scores.

### Qualité de génération

| Métrique | Question posée |
|---|---|
| **Groundedness** | La réponse s'appuie-t-elle sur le **contexte fourni**, et non sur de la spéculation ? |
| **Relevance** | La réponse traite-t-elle la question ou la demande ? |
| **Coherence** | Les idées s'enchaînent-elles logiquement ? |
| **Fluency** | La langue est-elle correcte et naturelle ? |

**Groundedness Pro** donne un verdict **binaire** (ancré ou non ancré), utile quand l'exactitude factuelle est exigée.

> **Exemple.** Contexte fourni : « Les retours sont acceptés sous 30 jours. » Le modèle répond : « Vous avez 60 jours pour retourner un article. »
>
> - Fluency : **bonne**, la phrase est correcte.
> - Relevance : **bonne**, elle répond à la question.
> - Groundedness : **mauvaise**, le chiffre ne vient pas du contexte.
>
> Une réponse peut donc être fluide et pertinente tout en étant fausse. C'est pour ça qu'on mesure les métriques séparément.

### Risque et sécurité

| Métrique | Détecte |
|---|---|
| Self-harm content | Contenu évoquant ou encourageant l'automutilation |
| Hateful and unfair content | Biais, discrimination, propos haineux |
| Violent content | Contenu violent ou incitant à la violence |
| Sexual content | Contenu sexuel inapproprié |
| Protected material | Reproduction possible de contenu protégé ou propriétaire |
| Indirect attack (jailbreak) | Vulnérabilité aux tentatives de manipulation |

### Le taux de défaut (defect rate)

- Pour les **contenus nuisibles** : pourcentage de réponses qui **dépassent un seuil de gravité**, en général **Medium**.
- Pour **protected material** et **indirect attack** : (instances vraies / instances totales) × 100.

> **Exemple.** Sur 200 réponses évaluées, 6 dépassent le seuil Medium pour le contenu violent. Taux de défaut = 6 / 200 × 100 = **3 %**.

## Métriques NLP

Calcul purement mathématique, **sans modèle évaluateur**. Elles demandent souvent une **vérité terrain** : la réponse attendue.

| Métrique | Principe | Usage typique |
|---|---|---|
| **F1-score** | Proportion de mots partagés entre la réponse générée et la vérité terrain ; équilibre **précision** et **rappel** | Classification de texte, recherche d'information |
| **BLEU** | Compare les **n-grammes** (suites de mots) avec un texte de référence | **Traduction** automatique |
| **METEOR** | Étend BLEU : tient compte des synonymes, des racines de mots et des paraphrases | Traduction, comparaison plus souple |
| **ROUGE** | Privilégie le **rappel** sur la précision | **Résumé** |
| **GLEU** | Variante de BLEU (Google-BLEU) pour l'évaluation **phrase par phrase** | Évaluation au niveau de la phrase |

- **Précision** : éviter les mots incorrects.
- **Rappel** : inclure les mots importants.

> **Mini-exemple F1.** Vérité terrain : « retour sous 30 jours ». Réponse : « retour possible sous 30 jours ouvrés ».
>
> Mots communs : retour, sous, 30, jours = 4. Précision = 4/6, rappel = 4/4. F1 = 2 × (0,67 × 1) / (0,67 + 1) = **0,80**.

Ces métriques conviennent quand il existe une **bonne réponse définie**. Elles conviennent mal à la génération ouverte, où beaucoup de réponses sont valables.

## Assistée par IA ou NLP ?

| | Assistée par IA | NLP |
|---|---|---|
| Qui juge | Un modèle GPT évaluateur | Une formule mathématique |
| Vérité terrain | Pas forcément | Souvent nécessaire |
| Exemples | Groundedness, Relevance, Coherence, Fluency | F1, BLEU, METEOR, ROUGE, GLEU |
| Bon pour | Génération ouverte, qualité perçue | Tâches à réponse de référence |

## Créer une évaluation dans le portail

### Sur quoi porte l'évaluation

| Cible | Fonctionnement |
|---|---|
| **Model** | Un modèle déployé reçoit tes prompts ; les sorties sont générées pendant l'évaluation |
| **Agent** | On évalue les réponses d'un agent à des prompts définis |
| **Dataset** | On évalue des sorties **déjà générées**, présentes dans le jeu de données |

### D'où vient le jeu de données

- **Upload new dataset** : un fichier **CSV** ou **JSONL** local.
- **Use existing dataset** : un jeu déjà chargé dans le projet.
- **Generate synthetic dataset** : sans données de test, le système en génère à partir d'une description du sujet. Tu précises la ressource, le nombre de lignes et un prompt. Tu peux ajouter des fichiers pour améliorer la pertinence.

Exemple de fichier JSONL, une ligne par cas de test :

```json
{"query": "Quel est le délai de retour ?", "ground_truth": "30 jours"}
{"query": "Livrez-vous en Belgique ?", "ground_truth": "Oui, sous 5 jours ouvrés"}
```

### Lancer

Tu configures les **métriques**, le **mappage des champs** des données et le **prompt système**, puis tu lances le travail. Il s'exécute de façon **asynchrone**, ligne par ligne.

Les résultats donnent les **scores agrégés** par métrique et le **détail de chaque prompt** de test.

## La bibliothèque d'évaluateurs

Accès : page **Evaluation** du projet, onglet **Evaluator library**. On y peut :

- voir les évaluateurs fournis par Microsoft (qualité, sécurité, performance) ;
- lire le détail d'un évaluateur : nom, description, paramètres, fichiers ;
- consulter les **prompts d'annotation** des évaluateurs de qualité, pour comprendre le calcul ;
- voir les définitions et **niveaux de gravité** des évaluateurs de sécurité ;
- gérer ses **évaluateurs personnalisés**, avec gestion des **versions** (comparer, restaurer).

## Agir selon les résultats

### Scores de qualité trop bas

Du plus simple au plus lourd :

1. **Prompt engineering** : affiner instructions et messages système.
2. **Autre modèle** : en essayer un mieux adapté.
3. **RAG** : ancrer les réponses dans tes données.
4. **Fine-tuning** : entraîner le modèle sur ton domaine, s'il le permet.

Chaque étape augmente la complexité et parfois le coût.

### Problèmes de sécurité

- **Filtres de contenu** : services Azure AI Content Safety.
- **Durcissement du prompt** : consignes de sécurité dans le message système.
- **Validation des sorties** : vérifier les réponses avant affichage.

### La bonne habitude

Fixer des **références d'évaluation tôt**, puis **relancer** après chaque modification pour mesurer l'effet et éviter les régressions.

#### Point examen : question officielle du module — la métrique qui mesure la correction linguistique et la qualité de la langue est Fluency. Groundedness = ancrage dans le contexte. Relevance = répond à la question.

## Exercices rapides

**1.** Quelle métrique vérifie qu'une réponse s'appuie sur les documents fournis ?

**2.** Tu évalues un système de résumé automatique. Quelle métrique NLP est la plus adaptée, et pourquoi ?

**3.** Tu évalues un système de traduction. Quelle métrique NLP ?

**4.** Sur 500 réponses, 10 dépassent le seuil Medium pour le contenu haineux. Quel est le taux de défaut ?

**5.** Tu n'as aucune donnée de test. Quelle option du portail te dépanne ?

**6.** Tes scores de groundedness sont mauvais car le modèle ne connaît pas tes documents internes. Quelle amélioration cibles-tu ?

**7.** Quelle différence entre évaluer un « Model » et évaluer un « Dataset » ?

**8.** Qu'est-ce qui distingue les métriques NLP des métriques assistées par IA ?

<details>
<summary>Voir le corrigé</summary>

**1.** Groundedness.

**2.** ROUGE : elle privilégie le rappel, ce qui convient au résumé, où couvrir les points clés compte plus qu'éviter des mots en trop.

**3.** BLEU, ou METEOR si tu veux tenir compte des synonymes et paraphrases.

**4.** 10 / 500 × 100 = 2 %.

**5.** Generate synthetic dataset.

**6.** Le RAG, pour ancrer les réponses dans tes données.

**7.** Model : les sorties sont générées pendant l'évaluation à partir de tes prompts. Dataset : les sorties sont déjà dans le fichier, on se contente de les noter.

**8.** Les métriques NLP sont des calculs mathématiques sans modèle évaluateur, et demandent souvent une vérité terrain. Les métriques assistées par IA font juger les réponses par un modèle GPT.

</details>
