# Use the code_interpreter tool — exécuter du Python

## L'essentiel

- `code_interpreter` donne au modèle un **environnement d'exécution Python**.
- Le modèle **écrit puis exécute** du code pendant la conversation, au lieu de seulement en parler.
- Le code tourne dans un **bac à sable** (sandbox), **sans accès réseau externe**.
- Bibliothèques courantes préinstallées : **pandas, numpy, matplotlib, math**.
- Usages : analyse de données, calculs, conversion de fichiers, prototypage.

## Ce que ça change

Sans cet outil, un modèle « devine » le résultat d'un calcul, ce qui donne parfois des erreurs. Avec lui, il **calcule vraiment**. Le cours le résume ainsi : le modèle passe de penseur à **exécutant**.

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| **Exécution Python dynamique** | Le modèle écrit et lance du code dans un environnement isolé |
| **Gestion de fichiers** | Charger, traiter et télécharger des fichiers (CSV, JSON, images...) |
| **Analyse de données** | Calculs, statistiques, transformations à la volée |
| **Retour en temps réel** | Le modèle voit le résultat et peut itérer ou corriger ses erreurs |
| **Résolution de problèmes complexes** | Maths, simulations, énigmes logiques par du code exécutable |

## Cas d'usage

| Cas | Exemple |
|---|---|
| Analyse de données | Lire un CSV et produire des statistiques de synthèse |
| Maths et physique | Résoudre des équations différentielles, simuler un scénario physique |
| Conversion de fichiers | Passer de JSON à CSV et inversement |
| Prototypage | Tester un algorithme avant de l'implémenter pour de bon |

## Exemple de code

```python
response = client.responses.create(
    model={model_deployment},
    instructions="You are an AI assistant that provides information. Use the python tool to run code for math problems.",
    input="What is the square root of 16?",
    tools=[{"type": "code_interpreter",
            "container": {"type": "auto"}}]
)
print(response.output_text)
```

Sortie : `The square root of 16 is 4.`

En inspectant l'objet réponse, on voit que le résultat vient d'un code Python généré par le modèle :

```python
import math

# Calculate the square root of 16
square_root = math.sqrt(16)
square_root
```

À retenir dans la déclaration : `"type": "code_interpreter"` et le réglage **`"container": {"type": "auto"}`**.

## Les 5 étapes

1. **Tu envoies la requête** avec `code_interpreter` dans `tools`.
2. **Le modèle analyse la tâche** et décide si exécuter du code est utile.
3. **Le modèle génère le code** Python.
4. **Le code s'exécute** dans le bac à sable, avec les bibliothèques courantes.
5. **Le résultat revient** au modèle, qui l'intègre à sa réponse.

Tu n'exécutes rien toi-même : contrairement à l'outil `function`, tout se passe côté service.

## Bonnes pratiques

- **Sois précis** : décris le format des données et la sortie attendue.
- **Parle de « python tool »** dans tes instructions : beaucoup de modèles désignent `code_interpreter` par ce nom en interne.
- **Donne du contexte** métier dans le prompt.
- **Valide les résultats** : relis le code généré avant tout usage en production.
- **Surveille les coûts** : l'exécution de code ajoute des tokens.
- **Appuie-toi sur les bibliothèques** préinstallées.
- **Laisse le modèle corriger** : il voit les erreurs et tente de les réparer seul.

## Limites

| Limite | Conséquence |
|---|---|
| Bac à sable **sans accès réseau externe** | Le code ne peut pas appeler un site ou une API |
| Certaines bibliothèques absentes | Préviens le modèle si une bibliothèque échoue |
| **Délais d'expiration** | Les opérations trop longues sont coupées |
| **Mémoire limitée** | Un jeu de données massif demande un traitement par flux ou par morceaux |

> **Exemple.** Tu charges `ventes_2025.csv` et tu demandes « Quel mois a eu le plus gros chiffre d'affaires ? ». Le modèle écrit trois lignes de pandas, les exécute, lit le résultat et répond « Novembre, avec 482 300 € ». Si tu lui demandes ensuite de télécharger les taux de change du jour, il ne pourra pas : le bac à sable n'a pas Internet. C'est le rôle de `web_search`.

#### Point examen : question officielle du module — code_interpreter exécute du code Python dans un environnement isolé pour résoudre des tâches. Il ne navigue pas sur des sites externes pendant l'exécution, et il fait bien des calculs, pas seulement des chargements de fichiers.

## Exercices rapides

**1.** Écris la définition d'outil à placer dans `tools` pour activer `code_interpreter`.

**2.** Vrai ou faux : le code généré peut appeler une API REST sur Internet.

**3.** Sous quel nom désigner l'outil dans les instructions pour que le modèle le reconnaisse bien ?

**4.** Cite trois bibliothèques préinstallées.

**5.** Un utilisateur demande la médiane d'une colonne d'un fichier de 300 lignes. Pourquoi `code_interpreter` vaut-il mieux qu'une réponse directe du modèle ?

**6.** Qui exécute le code : ton application ou le service ?

<details>
<summary>Voir le corrigé</summary>

**1.** `{"type": "code_interpreter", "container": {"type": "auto"}}`

**2.** Faux. L'exécution se fait dans un bac à sable sans accès réseau externe.

**3.** « python tool ».

**4.** Trois parmi : pandas, numpy, matplotlib, math.

**5.** Parce qu'il calcule réellement la valeur avec du code au lieu de l'estimer, ce qui évite les erreurs de calcul.

**6.** Le service, dans l'environnement isolé. C'est l'outil `function` qui demande à ton application d'exécuter le code.

</details>
