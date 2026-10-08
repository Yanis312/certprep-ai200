# What are tools? — déclarer des outils avec l'API Responses

## L'essentiel

- Certains modèles de Foundry Models savent **utiliser des outils**. Il faut en déployer un qui a la capacité **tool calling**.
- On indique les outils disponibles dans le paramètre **`tools`** de `responses.create()`, sous forme de **liste JSON**.
- Par défaut, **le modèle choisit** quand utiliser un outil et lequel, d'après le prompt.
- Quatre outils courants : `code_interpreter`, `web_search`, `file_search`, `function`.

## Le parcours

```
1. Chercher dans Foundry Models un modèle avec la capacité « tool calling »
2. Le déployer
3. Écrire une application cliente qui utilise l'API Responses
4. Envoyer le prompt en indiquant les outils autorisés
5. Le modèle décide d'en utiliser un, ou pas
```

## Les 4 outils du module

| Outil | Ce qu'il donne au modèle | En un mot |
|---|---|---|
| `code_interpreter` | Un environnement Python où il peut générer et exécuter du code | **Calculer** |
| `web_search` | La recherche d'informations générales sur Internet, plus récentes que ses données d'entraînement | **S'informer** |
| `file_search` | La recherche dans des fichiers que tu as chargés dans un index de recherche vectorielle | **Consulter tes documents** |
| `function` | L'appel de fonctions personnalisées de ton code | **Agir dans ton système** |

Ce ne sont que quelques-uns des outils existants : le domaine évolue vite.

## Qui choisit l'outil ?

Par défaut, le **modèle** décide quand utiliser un outil, et lequel. Tu peux l'orienter de deux façons :

- en configurant des **règles de sélection d'outil** ;
- avec le paramètre **`instructions`** (le prompt système).

> **Exemple.** Instruction : « Utilise la recherche web uniquement pour les questions d'actualité. » À « Bonjour », le modèle répond directement. À « Quelles sont les annonces de cette semaine ? », il lance une recherche.

## La forme du code

```python
from openai import OpenAI

client = OpenAI(
    base_url={openai_endpoint},
    api_key={auth_key_or_token}
)

response = client.responses.create(
    model={model_deployment},
    instructions="You are a helpful AI assistant.",
    input="Find me some information about vintage computers.",
    # La liste JSON des outils disponibles
    tools=[
        {
            "type": "{tool_type}",                    # quel outil
            "{tool-specific-setting}": "{value}",     # ses réglages propres
        },
        {
            "type": "{another_tool_type}",
            "{tool-specific-setting}": "{value}",
        }
    ]
)
print(response.output_text)
```

Trois points à retenir :

- `tools` est une **liste** : on peut déclarer **un ou plusieurs** outils dans le même appel ;
- chaque outil est un objet avec une clé **`type`** ;
- certains outils ont des **réglages propres** en plus du type.

## Les 4 déclarations côte à côte

```python
tools=[
    {"type": "code_interpreter", "container": {"type": "auto"}},
    {"type": "web_search"},
    {"type": "file_search", "vector_store_ids": [vector_store.id]},
    {"type": "function", "name": "get_time", "description": "Get the current time"},
]
```

| Outil | Réglage propre |
|---|---|
| `code_interpreter` | `container` |
| `web_search` | aucun |
| `file_search` | `vector_store_ids` |
| `function` | `name`, `description` |

#### Point examen : les outils se déclarent dans le paramètre tools de l'API Responses. Le modèle doit avoir la capacité tool calling, que tu retrouves avec le filtre Capabilities du catalogue.

## Exercices rapides

**1.** Dans quel paramètre de `responses.create()` déclare-t-on les outils ?

**2.** Quelle clé trouve-t-on dans chaque définition d'outil ?

**3.** Associe chaque besoin à un outil : (a) lire un PDF interne, (b) connaître l'actualité d'hier, (c) calculer une moyenne sur un CSV, (d) créer un ticket dans ton système.

**4.** Qui décide, par défaut, d'utiliser un outil ?

**5.** Comment orienter ce choix ?

<details>
<summary>Voir le corrigé</summary>

**1.** Dans `tools`, sous forme de liste JSON.

**2.** La clé `type`.

**3.** (a) `file_search`, (b) `web_search`, (c) `code_interpreter`, (d) `function`.

**4.** Le modèle, d'après le prompt.

**5.** Avec des règles de sélection d'outil et avec le paramètre `instructions`.

</details>
