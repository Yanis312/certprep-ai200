# Map potential harms — cartographier les préjudices

## L'essentiel

- Première étape du processus : **recenser les préjudices potentiels** de ta solution.
- Elle se déroule en **4 sous-étapes** : **identifier, prioriser, tester et vérifier, documenter et partager**.
- La priorité combine la **probabilité** et l'**impact**.
- Le test se fait souvent par **red teaming** : une équipe cherche volontairement les failles.
- Outil de documentation : le **Responsible AI Impact Assessment**.

## Les 4 sous-étapes

```
1. Identifier  →  2. Prioriser  →  3. Tester et vérifier  →  4. Documenter et partager
```

## 1. Identifier les préjudices potentiels

Ils dépendent des **services et modèles** utilisés, ainsi que des données de **fine-tuning** ou d'**ancrage** qui personnalisent les sorties.

Types courants :

- contenu **offensant, péjoratif ou discriminatoire** ;
- contenu comportant des **inexactitudes factuelles** ;
- contenu qui **encourage ou soutient** des comportements **illégaux ou contraires à l'éthique**.

### Où trouver l'information

| Source | Ce qu'elle apporte |
|---|---|
| **Transparency note** d'Azure OpenAI Service | Les considérations propres au service et à ses modèles |
| Documentation du développeur du modèle, comme la **system card** d'OpenAI pour GPT-4 | Les limites et comportements connus du modèle |
| **Microsoft Responsible AI Impact Assessment Guide** et son **modèle** (template) | Une méthode et un gabarit pour documenter les préjudices |

## 2. Prioriser

Pour chaque préjudice, on évalue :

- la **probabilité** qu'il se produise ;
- le **niveau d'impact** s'il se produit.

On traite d'abord les plus **probables et les plus graves**. La priorisation tient compte de l'**usage prévu** et du **risque de détournement**. Elle peut être **subjective**.

> **Exemple : le copilote de cuisine.**
>
> | Préjudice | Impact | Fréquence probable |
> |---|---|---|
> | Temps de cuisson inexacts → aliments mal cuits → maladie | Moyen | **Élevée** : c'est l'usage principal |
> | Recette d'un poison mortel à partir d'ingrédients courants | **Très élevé** | Faible : peu d'utilisateurs le demandent |
>
> Aucun des deux n'est acceptable. Le poison a l'impact le plus fort, mais les temps de cuisson faux arriveront bien plus souvent. Il n'y a pas de réponse automatique : c'est une **discussion d'équipe**, qui peut impliquer des experts en **politique** ou en **droit**.

## 3. Tester et vérifier

Avec la liste priorisée, on teste la solution pour **vérifier que les préjudices se produisent**, et dans quelles conditions. Les tests peuvent révéler des préjudices **non identifiés**, à ajouter à la liste.

### Le red teaming

Une équipe de testeurs **sonde volontairement** la solution pour trouver ses faiblesses et tente de **produire des résultats nuisibles**.

Pour le copilote de cuisine : demander des recettes de poison, ou des recettes rapides avec des ingrédients qui doivent être bien cuits.

Les **réussites** de l'équipe rouge sont **documentées et examinées**, pour estimer la probabilité réelle d'une sortie nuisible en usage normal.

Le red teaming vient de la **cybersécurité**, où il sert à trouver des vulnérabilités. L'étendre au contenu nuisible permet de bâtir un processus d'IA responsable qui **complète** les pratiques de sécurité existantes.

## 4. Documenter et partager

Une fois les preuves réunies, on **documente** les détails et on les **partage avec les parties prenantes**. La liste priorisée est ensuite **tenue à jour** et complétée quand de nouveaux préjudices apparaissent.

#### Point examen : question officielle du module — on crée une évaluation d'impact de l'IA (AI Impact Assessment) pour documenter l'objectif, l'usage prévu et les préjudices potentiels de la solution. Ce n'est ni un bouclier juridique ni une estimation des coûts cloud.

## Exercices rapides

**1.** Donne les 4 sous-étapes de la cartographie.

**2.** Quels deux critères servent à prioriser un préjudice ?

**3.** Qu'est-ce que le red teaming ?

**4.** Quel document Azure OpenAI consulter pour comprendre les limites du service ?

**5.** Un assistant bancaire peut (a) donner un taux d'intérêt périmé, (b) expliquer comment blanchir de l'argent. Lequel a l'impact le plus fort ? Lequel est le plus probable ?

**6.** Pourquoi les tests peuvent-ils allonger la liste des préjudices ?

**7.** À quoi sert le Responsible AI Impact Assessment ?

<details>
<summary>Voir le corrigé</summary>

**1.** Identifier, prioriser, tester et vérifier, documenter et partager.

**2.** La probabilité que le préjudice se produise et le niveau d'impact s'il se produit.

**3.** Une équipe de testeurs sonde volontairement la solution pour trouver ses faiblesses et tenter de produire des résultats nuisibles.

**4.** La transparency note.

**5.** (b) a l'impact le plus fort ; (a) est le plus probable, car lié à l'usage courant. La priorité finale se discute en équipe.

**6.** Parce qu'ils peuvent révéler des préjudices qui n'avaient pas été identifiés.

**7.** À documenter l'objectif, l'usage prévu et les préjudices potentiels de la solution.

</details>
