# Use the function tool — appeler ton propre code

## L'essentiel

- L'outil `function` (function calling) permet au modèle de **demander** l'appel d'une fonction que tu as définie.
- Le modèle **n'exécute pas** ta logique métier. Il renvoie un **appel de fonction structuré**.
- **Ton application** exécute la fonction, puis renvoie le résultat au modèle dans un élément **`function_call_output`**.
- Il faut donc **deux appels** au modèle : un qui produit la demande, un qui produit la réponse finale.
- C'est le schéma idéal pour relier le modèle à des API, des bases de données et des workflows.

## Le principe en un schéma

```
Utilisateur : « Quelle heure est-il ? »
      │
      ▼
1er appel  ──►  Modèle : « j'ai besoin de get_time »   (item de type function_call)
                    │
                    ▼
            TON CODE exécute get_time()
                    │
                    ▼
            Tu ajoutes un function_call_output avec le résultat
                    │
2e appel   ──►  Modèle : « Il est 17 h 17. »           (réponse finale)
```

## Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| **Appels d'outils structurés** | Le modèle émet une demande explicite d'appel de fonction |
| **Exécution contrôlée par le développeur** | Ton application décide comment et où la fonction s'exécute |
| **Schéma d'intégration fiable** | Appeler des API, des services internes ou des utilitaires de façon sûre |
| **Orchestration sur plusieurs tours** | Tu renvoies la sortie et le modèle poursuit son raisonnement |
| **Réponses ancrées** | Les réponses peuvent contenir des données réelles produites par tes systèmes |

## Cas d'usage

| Cas | Exemple |
|---|---|
| Intégration de systèmes | Appeler une API interne pour les détails d'un compte ou d'une commande |
| Automatisation de tâches | Déclencher la création d'un ticket ou une notification |
| Recherche de données | Consulter des règles métier ou des tables de référence avant de répondre |

## Le code, étape par étape

**1. La fonction et sa déclaration**

```python
import time

def get_time():
    return f"The time is {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}"

function_tools = [
    {
        "type": "function",
        "name": "get_time",
        "description": "Get the current time"
    }
]
```

La **description** compte : c'est elle que le modèle lit pour décider si la fonction répond au besoin.

**2. L'historique et le premier appel**

```python
messages = [
    {"role": "developer", "content": "You are an AI assistant that provides information."},
]

messages.append({"role": "user", "content": prompt})

response = client.responses.create(
    model=model_deployment,
    input=messages,
    tools=function_tools
)

messages += response.output        # on garde la sortie du modèle dans l'historique
```

Ici le message système porte le rôle **`developer`**.

**3. Détecter l'appel, exécuter, renvoyer le résultat**

```python
for item in response.output:
    if item.type == "function_call" and item.name == "get_time":
        current_time = get_time()                      # TON code exécute la fonction
        messages.append({
            "type": "function_call_output",
            "call_id": item.call_id,                   # relie le résultat à la demande
            "output": current_time
        })

        # 2e appel : le modèle rédige la réponse finale avec le résultat
        response = client.responses.create(
            model=model_deployment,
            instructions="Answer only with the tool output.",
            input=messages,
            tools=function_tools
        )

print(response.output_text)
```

Les quatre noms à connaître par cœur :

| Nom | Rôle |
|---|---|
| `item.type == "function_call"` | Le modèle demande l'appel d'une fonction |
| `item.name` | Le nom de la fonction demandée |
| `item.call_id` | L'identifiant de la demande, à **recopier** dans le résultat |
| `"type": "function_call_output"` | L'élément que tu renvoies, avec `call_id` et `output` |

## Ce que donne l'exécution

```
Enter a prompt (or type 'quit' to exit)
Hello

Hello! How can I help you today?

Enter a prompt (or type 'quit' to exit)
What time is it?

The time is 2026-03-19 17:17:41.
```

- « Hello » ne demande pas d'outil : le modèle répond normalement.
- « What time is it? » déclenche le choix de `get_time`. L'application exécute la fonction et renvoie le résultat, puis le modèle envoie une seconde réponse.

Comme l'utilisateur peut écrire n'importe quoi, c'est le modèle qui détermine **quand** la fonction est nécessaire.

L'exemple utilise une fonction sans paramètre. On peut déclarer plusieurs fonctions, avec ou sans paramètres.

## Les 6 étapes

1. **Tu définis les outils** : une ou plusieurs définitions de fonction dans `tools`.
2. **Le modèle évalue le prompt** : un appel de fonction est-il nécessaire ?
3. **Le modèle émet un appel de fonction** : nom de la fonction et métadonnées d'appel.
4. **Ton application exécute la logique** : la fonction correspondante dans ton code.
5. **Tu renvoies la sortie** : un élément `function_call_output` avec le résultat.
6. **Le modèle termine la réponse** en intégrant le résultat.

## Bonnes pratiques

- **Des outils ciblés** : de petites fonctions à usage unique sont plus faciles à contrôler et à tester.
- **Valider les entrées** : ne jamais faire confiance aveuglément aux arguments d'un outil en production.
- **Gérer les erreurs proprement** : renvoyer des erreurs claires sur lesquelles le modèle peut raisonner.
- **Journaliser l'usage des outils** : appels, latence, taux d'échec, pour le débogage et la gouvernance.
- **Limiter les opérations sensibles** : exiger une **autorisation explicite** pour les actions à fort impact.

## Limites

| Limite | Conséquence |
|---|---|
| Le modèle **demande** les appels, ton application doit les **exécuter** | Rien ne se passe si ton code ne traite pas le `function_call` |
| Arguments incorrects ou inattendus possibles | Il faut les valider |
| La latence de l'outil s'ajoute | Le temps de réponse total augmente |
| Les sorties finales restent à relire pour les décisions critiques | Le function calling améliore la fiabilité, sans la garantir |

## function ou code_interpreter ?

| | function | code_interpreter |
|---|---|---|
| Qui écrit le code | **Toi**, à l'avance | Le **modèle**, à la volée |
| Qui l'exécute | **Ton application** | Le **service**, dans un bac à sable |
| Accès à tes systèmes | Oui : API, bases, workflows | Non : pas d'accès réseau |
| Usage | Agir dans ton système | Calculer, analyser des données |

> **Exemple.** « Annule ma commande 4821 » : le modèle renvoie un `function_call` vers `cancel_order` avec le numéro. Ton code vérifie que l'utilisateur a le droit, annule la commande dans ta base, renvoie « commande annulée ». Le modèle rédige alors la confirmation. L'annulation réelle a eu lieu dans **ton** code, sous **ton** contrôle.

#### Point examen : question officielle du module — après un function_call renvoyé par le modèle, ton application doit exécuter la fonction dans son code et renvoyer un function_call_output au modèle. Le modèle n'exécute jamais la fonction lui-même.

## Exercices rapides

**1.** Vrai ou faux : le modèle exécute lui-même la fonction `get_time`.

**2.** Quel type d'élément ton code doit-il ajouter à l'historique après avoir exécuté la fonction ?

**3.** Quel champ relie le résultat à la demande d'appel ?

**4.** Combien d'appels à `responses.create()` faut-il pour un tour où une fonction est utilisée ?

**5.** Complète la déclaration :

```python
{"type": "________", "name": "get_stock", "description": "Get the stock level for a product"}
```

**6.** Le modèle renvoie un appel `delete_account` avec un identifiant inattendu. Quelles deux bonnes pratiques s'appliquent ?

**7.** Pourquoi le champ `description` est-il important ?

<details>
<summary>Voir le corrigé</summary>

**1.** Faux. Il renvoie un appel de fonction structuré ; c'est ton application qui exécute.

**2.** Un élément de type `function_call_output`.

**3.** `call_id`.

**4.** Deux : le premier renvoie le `function_call`, le second produit la réponse finale à partir du résultat.

**5.** `function`.

**6.** Valider les entrées (ne pas faire confiance aux arguments) et exiger une autorisation explicite pour les opérations à fort impact.

**7.** Parce que le modèle s'en sert pour décider si la fonction correspond à la demande.

</details>
