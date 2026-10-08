# Bilan du module — applications génératives avec outils

## Le module en 10 lignes

1. Un modèle seul est limité à ses **données d'entraînement** ; les outils le relient au monde réel.
2. Outils de modèle ≠ **Foundry Tools** (API d'IA Azure).
3. Les outils se déclarent dans le paramètre **`tools`** de `responses.create()`, en liste JSON.
4. Le modèle doit avoir la capacité **tool calling** ; par défaut **il choisit** l'outil.
5. **`code_interpreter`** : Python dans un bac à sable, **sans réseau**, pour calculer et analyser.
6. **`web_search`** : information **publique et récente**.
7. **`file_search`** : tes **documents**, indexés dans un **vector store**, recherche sémantique.
8. **`function`** : le modèle **demande**, ton application **exécute** et renvoie un `function_call_output`.
9. On peut **combiner** plusieurs outils et guider leur usage avec `instructions`.
10. Étape suivante : les **agents**, où instructions, outils et orchestration sont **persistés**.

## Le tableau à connaître

| Outil | Source ou action | Réglage propre | Qui exécute |
|---|---|---|---|
| `code_interpreter` | Code Python généré par le modèle | `"container": {"type": "auto"}` | Le service (bac à sable) |
| `web_search` | Web public | aucun | Le service |
| `file_search` | Tes fichiers dans un vector store | `"vector_store_ids": [...]` | Le service |
| `function` | Ton code métier | `"name"`, `"description"` | **Ton application** |

## Choisir l'outil

```
La réponse dépend de documents internes ?            → file_search
La réponse dépend d'une information récente/publique ? → web_search
Il faut calculer ou analyser des données ?           → code_interpreter
Il faut agir ou lire dans tes propres systèmes ?     → function
```

## Le schéma commun à tous les outils

1. **Définir** l'outil dans la requête.
2. **Laisser le modèle décider** quand l'utiliser.
3. **Renvoyer la sortie de l'outil** quand c'est nécessaire (cas de `function`).
4. **Valider** les réponses : exactitude et sécurité.

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel outil quand le modèle doit répondre à partir de tes propres documents de politique chargés ? | **file_search** |
| Dans un workflow de function calling, que fait ton application après un `function_call` ? | Elle **exécute la fonction** dans son code et renvoie un **`function_call_output`** au modèle |
| Quelle affirmation sur `code_interpreter` est correcte ? | Il **exécute du code Python dans un environnement isolé** pour résoudre des tâches |

Les deux mauvaises réponses de la troisième question sont des pièges utiles : `code_interpreter` **ne navigue pas** sur le web, et il fait **bien des calculs**.

## Aide-mémoire de code

```python
# Deux outils dans le même appel
response = client.responses.create(
    model=model_deployment,
    instructions="Use the brochures for our services, the web for general information.",
    input=input_text,
    previous_response_id=last_response_id,
    tools=[
        {"type": "file_search", "vector_store_ids": [vector_store.id]},
        {"type": "web_search"}
    ]
)

# Function calling : renvoyer le résultat
for item in response.output:
    if item.type == "function_call":
        messages.append({"type": "function_call_output",
                         "call_id": item.call_id,
                         "output": resultat})
```

#### Point examen : ce module sert de base à toute la partie agents. La logique « le modèle demande, l'application exécute » revient avec les outils personnalisés des agents et avec MCP.

## Exercices rapides

**1.** Donne le réglage propre de `code_interpreter`, de `file_search` et de `function`.

**2.** Lequel des quatre outils demande à ton application d'exécuter quelque chose ?

**3.** Un assistant doit dire si un produit est en stock en interrogeant ton ERP. Quel outil ?

**4.** Un assistant doit tracer un graphique à partir d'un CSV fourni par l'utilisateur. Quel outil ?

**5.** Quelle différence entre déclarer des outils dans le prompt et créer un agent ?

**6.** Pourquoi `code_interpreter` ne peut-il pas remplacer `web_search` ?

<details>
<summary>Voir le corrigé</summary>

**1.** `container` pour `code_interpreter`, `vector_store_ids` pour `file_search`, `name` et `description` pour `function`.

**2.** `function`.

**3.** `function`, pour appeler ton système.

**4.** `code_interpreter` (avec matplotlib, préinstallé).

**5.** Dans le prompt, la configuration des outils est gérée par l'application cliente à chaque appel. Dans un agent, modèle, instructions et outils sont encapsulés et persistés sous un nom.

**6.** Parce que son bac à sable n'a pas d'accès réseau externe.

</details>
