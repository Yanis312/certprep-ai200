# Introduction — optimiser un modèle génératif

## L'essentiel

- Un modèle de base, seul, ne répond pas forcément à toutes tes exigences.
- La **qualité**, l'**exactitude** et la **constance** des réponses dépendent de la façon dont tu le **configures** et l'**enrichis**.
- Trois stratégies **complémentaires** : **prompt engineering**, **RAG**, **fine-tuning**.
- Elles vont de l'ajustement rapide et peu coûteux à la technique lourde qui demande du temps et des ressources.

## Le scénario fil rouge

Tu développes un chat pour une **agence de voyages**. Le modèle de base répond correctement, mais ton équipe veut trois choses :

| Exigence | Stratégie qui y répond |
|---|---|
| Respecter le **ton** de l'entreprise | Prompt engineering, puis fine-tuning si ça ne tient pas |
| Donner des informations **exactes** sur le catalogue d'hôtels | RAG |
| Garder un **format constant** d'une interaction à l'autre | Fine-tuning |

## Les trois stratégies en une ligne chacune

| Stratégie | Ce qu'elle change | Coût et effort |
|---|---|---|
| **Prompt engineering** | La façon de **demander** | Faible |
| **RAG** | Ce que le modèle **sait** au moment de répondre | Moyen |
| **Fine-tuning** | La façon dont le modèle **se comporte** | Élevé |

```
Faible coût, rapide ───────────────────────────────► Coût élevé, long

 Prompt engineering          RAG                 Fine-tuning
 (consignes)          (données ajoutées)     (modèle réentraîné)
```

## Ce que couvre le module

| Unité | Question |
|---|---|
| Prompt engineering | Comment bien formuler une demande ? |
| RAG | Comment donner au modèle des données qu'il ne connaît pas ? |
| Fine-tuning | Comment obtenir un comportement constant ? |
| Comparer et combiner | Laquelle choisir, et quand les empiler ? |

#### Point examen : la compétence visée est « Optimiser et opérationnaliser les systèmes d'IA générative », avec le prompt engineering et l'ajustement des paramètres de modèle. Les questions sont souvent des scénarios : quelle stratégie pour quel problème.

## Exercices rapides

**1.** Cite les trois stratégies d'optimisation.

**2.** Laquelle est la moins coûteuse ? Laquelle est la plus coûteuse ?

**3.** Le modèle invente des noms d'hôtels qui n'existent pas dans ton catalogue. Quelle stratégie vise ce problème ?

<details>
<summary>Voir le corrigé</summary>

**1.** Prompt engineering, RAG, fine-tuning.

**2.** Le prompt engineering est la moins coûteuse, le fine-tuning la plus coûteuse.

**3.** Le RAG : il fournit au modèle les données réelles du catalogue.

</details>
