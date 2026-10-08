# Using Microsoft Foundry endpoints — les endpoints

## L'essentiel

- Les ressources Foundry sont dans le cloud : on les consomme comme des **API**, par Internet.
- Un **endpoint** est le **point d'entrée** d'un service : une adresse HTTP unique, destinée au **code** et non aux humains.
- Les interfaces offertes à l'endpoint sont des interfaces **REST**.
- L'endpoint est **protégé** : il faut une **clé d'API** ou un **jeton** Microsoft Entra ID.
- La plupart des développeurs passent par un **SDK**, qui construit les appels REST à leur place.

## API, endpoint, REST

| Terme | Définition |
|---|---|
| **API** | Un ensemble de règles qui permet à une application de parler à une autre application ou à un service. Elle définit les requêtes possibles, les données renvoyées et le format à respecter |
| **Endpoint** | Le point d'entrée du service, avec une **adresse HTTP unique**. Comme un site web, mais pour du code client |
| **REST** | Representational State Transfer : le style des interfaces proposées à l'endpoint |
| **SDK** | Kit de développement : des bibliothèques qui cachent les appels REST derrière du code dans ton langage (Python, JavaScript, C#) |

Un endpoint de modèle ressemble à :

```
https://<foundry-project>-resource.cognitiveservices.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-05-01-preview
```

## Deux types d'endpoints

| Type | Sert à |
|---|---|
| **Endpoint de projet** | Travailler avec ton projet Foundry et ses ressources |
| **Endpoint de modèle** | Envoyer des prompts aux modèles déployés |

## Sécurité de l'endpoint

L'application n'y accède que si elle présente :

- la bonne **clé d'API**, ou
- un **jeton** confirmant que ses identifiants **Microsoft Entra ID** sont valides.

L'endpoint et la clé du modèle se trouvent sur la **page de détails** du playground Foundry.

## Une requête REST

Une requête REST comporte deux parties :

| Partie | Contenu |
|---|---|
| **En-têtes** (headers) | Des métadonnées : authentification, format des données |
| **Corps** (body) | Les données, au format **JSON** |

```bash
curl -X POST https://YOUR-FOUNDRY-RESOURCE-NAME.services.ai.azure.com/api/projects/YOUR-PROJECT-NAME/openai/responses?api-version=2025-11-15-preview \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
        "model": "gpt-4.1-mini",
        "input": "What is an AI application?"
}'
```

Lecture ligne par ligne :

| Élément | Rôle |
|---|---|
| `POST` + l'adresse | On **envoie** des données à l'endpoint |
| `Content-Type: application/json` | En-tête : le corps est du JSON |
| `Authorization: Bearer $AUTH_TOKEN` | En-tête : le **jeton** qui prouve l'identité |
| `"model"` | Le **déploiement** à interroger |
| `"input"` | Le **prompt** |

## La réponse

Elle revient aussi avec des en-têtes et un corps **JSON**.

```json
{
    "model": "gpt-4.1-mini",
    "object": "response",
    "status": "completed",
    "output": [
        {
            "type": "message",
            "status": "completed",
            "role": "assistant",
            "content": [
                {
                    "type": "output_text",
                    "text": "An AI application is a software program or system that..."
                }
            ]
        }
    ]
}
```

Le texte généré se trouve dans `output` → `content` → `text`. Le rôle `assistant` indique que c'est le modèle qui parle. `status: completed` confirme que la génération est terminée.

## REST ou SDK ?

| | REST direct | SDK |
|---|---|---|
| Ce que tu écris | Les en-têtes, le corps JSON, l'appel HTTP | Quelques lignes dans ton langage |
| Qui construit la requête | Toi | La bibliothèque |
| Préféré par | Peu de développeurs | **La plupart** |

La même requête avec le SDK Python :

```python
response = client.responses.create(
    model="gpt-4.1-mini",
    input="What is an AI application?"
)
print(response.output_text)
```

Le SDK construit l'appel REST et te donne directement le texte.

## L'endpoint, point central

L'endpoint de tes ressources Foundry est le **point de service central** des applications clientes. Il te permet de construire des solutions qui s'appuient sur la sécurité, la capacité de montée en charge et la fiabilité du cloud Azure.

#### Point examen : le guide d'étude AI-901 précise qu'il faut connaître REST, les SDK et les CLI. Sache qu'une requête REST a des en-têtes et un corps JSON, et que l'accès exige une clé d'API ou un jeton Entra ID.

## Exercices rapides

**1.** Qu'est-ce qu'un endpoint ?

**2.** De quelles deux parties se compose une requête REST ?

**3.** Dans quel format sont le corps de la requête et celui de la réponse ?

**4.** Quelles sont les deux façons de s'authentifier auprès d'un endpoint Foundry ?

**5.** Dans la requête d'exemple, à quoi servent les champs `model` et `input` ?

**6.** Pourquoi la plupart des développeurs préfèrent-ils un SDK ?

**7.** Quels sont les deux types courants d'endpoints dans Foundry ?

**8.** Où trouve-t-on l'endpoint et la clé d'un modèle dans le portail ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le point d'entrée d'un service : une adresse HTTP unique utilisée par le code des applications clientes.

**2.** Des en-têtes (métadonnées, dont l'authentification et le format) et un corps (les données).

**3.** En JSON.

**4.** Avec une clé d'API, ou avec un jeton Microsoft Entra ID.

**5.** `model` désigne le déploiement à interroger ; `input` contient le prompt.

**6.** Parce que le SDK construit les appels REST à leur place, avec des bibliothèques dans leur langage.

**7.** Les endpoints de projet et les endpoints de modèle.

**8.** Sur la page de détails du playground Foundry.

</details>
