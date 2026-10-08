# Fine-tune a model for consistent behavior

## L'essentiel

- Le **fine-tuning** reprend un modèle préentraîné et poursuit son entraînement sur un **petit jeu de données spécifique** à ta tâche.
- Il ajuste les **poids internes** du modèle, qui reproduit alors les schémas de tes données.
- Il sert quand le modèle **ignore ou suit mal** tes consignes malgré un bon message système et des exemples few-shot.
- Il optimise la **constance** du comportement, du style et du format. Il n'apporte **pas** de connaissances à jour.
- C'est une capacité **avancée** : on mesure d'abord une **référence** (baseline) avec un modèle standard.

## Comprendre le fine-tuning

Un modèle de fondation comme GPT-4o est entraîné sur d'énormes volumes de données générales. Le fine-tuning **spécialise ce généraliste** : il garde ses capacités de langage et apprend à répondre comme le montrent tes exemples.

### LoRA

Le fine-tuning utilise **LoRA** (Low-Rank Adaptation), qui approxime les changements de poids par une représentation de rang inférieur. Au lieu de réentraîner **tous** les paramètres, LoRA n'en met à jour qu'un **petit sous-ensemble** important.

Résultat : un entraînement **plus rapide et moins coûteux**, sans perte de qualité.

Par rapport à un entraînement à partir de zéro, le fine-tuning demande **moins de temps, moins de calcul et beaucoup moins de données**.

## Quand fine-tuner

| Cas | Exemple |
|---|---|
| **Style et ton constants** | L'agence veut un ton chaleureux et encourageant, en paragraphes courts, dans chaque réponse |
| **Formats de sortie précis** | Produire de façon fiable du JSON conforme à un schéma, quand les exemples few-shot ne suffisent pas |
| **Réduire la longueur des prompts** | Les longs messages système avec beaucoup d'exemples coûtent des tokens et de la latence ; le fine-tuning intègre ces schémas au modèle |
| **Distillation** | Transférer les capacités d'un gros modèle coûteux vers un plus petit : on collecte ses sorties pour fine-tuner le petit |
| **Améliorer l'usage des outils** | Fine-tuner avec des exemples d'outils améliore le choix de l'outil et la génération des paramètres |

Toujours commencer par évaluer la **performance de référence** d'un modèle standard. Sans référence, impossible de savoir si le fine-tuning a amélioré ou dégradé le modèle.

## Les 3 types de fine-tuning

| Type | Principe | Idéal pour |
|---|---|---|
| **Supervised fine-tuning (SFT)** | Entraînement sur des paires **prompt/réponse** étiquetées | Les tâches avec des façons claires et bien définies de procéder |
| **Reinforcement fine-tuning (RFT)** | Retour itératif : un **grader** (évaluateur) récompense les meilleures réponses | Les tâches complexes ou dynamiques, avec beaucoup de solutions possibles ; améliorer la qualité du raisonnement |
| **Direct Preference Optimization (DPO)** | Paires de réponses **préférée / non préférée**, selon des préférences humaines | Aligner le modèle sur des préférences ; plus léger en calcul que l'apprentissage par renforcement classique |

On peut les **combiner** : d'abord un SFT pour créer un modèle personnalisé, puis un DPO pour affiner l'alignement sur tes préférences.

Moyen de s'en souvenir : SFT = **exemples**, RFT = **notes d'un évaluateur**, DPO = **préférences**.

## Préparer les données d'entraînement

Il faut un jeu d'exemples de qualité au format **JSONL** (JSON Lines) : **un objet JSON par ligne**. Pour un modèle de chat, chaque exemple est une conversation avec les messages `system`, `user` et `assistant`.

```json
{"messages": [{"role": "system", "content": "You are a friendly travel advisor for Margie's Travel."}, {"role": "user", "content": "What's a good beach destination in Europe?"}, {"role": "assistant", "content": "For a beautiful European beach experience, consider the Algarve in southern Portugal! ..."}]}
{"messages": [{"role": "system", "content": "You are a friendly travel advisor for Margie's Travel."}, {"role": "user", "content": "I need a budget hotel in Tokyo."}, {"role": "assistant", "content": "Here are some great budget-friendly options in Tokyo: ..."}]}
```

Les règles :

- un **message système identique** dans tous les exemples ;
- des exemples de qualité, **représentatifs** de tous les scénarios attendus ;
- viser **au moins des centaines** d'exemples ; plus, c'est généralement mieux ;
- des réponses `assistant` qui reflètent **exactement** le style, le format et le ton voulus.

Laisser le message système vide donne en général des modèles **moins précis**. Et il faut utiliser le **même message système** au moment de l'inférence avec le modèle fine-tuné.

## Les difficultés

| Difficulté | Détail |
|---|---|
| **Coûts** | Coût initial d'entraînement, puis coût **horaire** d'hébergement du modèle personnalisé |
| **Qualité des données** | Des données médiocres ou non représentatives mènent au **surapprentissage**, au **sous-apprentissage** ou à des **biais** |
| **Maintenance** | Réentraînement possible quand les données changent ou quand le modèle de base est mis à jour |
| **Expérimentation** | Trouver la bonne combinaison d'**hyperparamètres** : epochs, batch size, learning rate |
| **Dérive du modèle** | Trop spécialisé, le modèle devient moins bon sur les tâches de langage générales hors de son domaine |

> **Exemple.** L'agence fine-tune un modèle : chaque réponse a la voix de la marque et le bon format, même avec un message système très court. En échange, l'équipe a dû préparer des centaines d'exemples et devra réentraîner le modèle si la charte de ton change.

## Ce que le fine-tuning ne fait pas

Il n'ajoute pas de connaissances **à jour**. Mettre ton catalogue dans les données d'entraînement est une mauvaise idée : les prix changent, et il faudrait réentraîner à chaque fois. Pour les faits, c'est le **RAG**.

#### Point examen : question officielle du module — le fine-tuning optimise la constance du comportement, du style et du format de sortie du modèle. L'exactitude factuelle par connexion à des données externes, c'est le RAG.

## Exercices rapides

**1.** Que modifie le fine-tuning dans le modèle ?

**2.** Que signifie LoRA, et quel est son avantage ?

**3.** Associe : (a) paires prompt/réponse, (b) un grader récompense les bonnes réponses, (c) paires réponse préférée / non préférée.

**4.** Dans quel format prépare-t-on les données d'entraînement ?

**5.** Quels trois rôles trouve-t-on dans chaque exemple pour un modèle de chat ?

**6.** Pourquoi faut-il mesurer une référence avant de fine-tuner ?

**7.** Tu veux qu'un petit modèle peu coûteux imite un gros modèle. Comment s'appelle cette démarche ?

**8.** Cite trois hyperparamètres.

**9.** Ton modèle fine-tuné est excellent sur les voyages mais devient médiocre sur les questions générales. Quel phénomène ?

<details>
<summary>Voir le corrigé</summary>

**1.** Ses poids internes.

**2.** Low-Rank Adaptation. Elle ne met à jour qu'un petit sous-ensemble de paramètres, ce qui rend l'entraînement plus rapide et moins coûteux.

**3.** (a) SFT, (b) RFT, (c) DPO.

**4.** En JSONL : un objet JSON par ligne.

**5.** `system`, `user` et `assistant`.

**6.** Sans référence, on ne peut pas savoir si le fine-tuning a amélioré ou dégradé les performances.

**7.** La distillation.

**8.** Epochs, batch size, learning rate.

**9.** La dérive du modèle (model drift), due à une spécialisation trop étroite.

</details>
