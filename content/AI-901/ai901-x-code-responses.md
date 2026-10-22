# Lecture de code 2 — modèles, agents, images

## L'essentiel

- Pour parler à un modèle ou à un agent, on appelle `client.responses.create(...)`.
- `model=` reçoit le **nom du déploiement**, pas le nom du modèle.
- `input=` peut être un **texte simple** ou une **liste de messages** avec des **rôles** (`system`, `user`).
- Un **agent** s'appelle **sans** `model=`, avec une **référence d'agent** dans `extra_body`.
- La réponse se lit avec `response.output_text`.

## L'appel de base

```python
response = client.responses.create(
    model="gpt-4.1-mini",                 # nom du DÉPLOIEMENT
    input="What is an AI application?"    # le prompt
)
print(response.output_text)              # le texte de la réponse
```

## Les paramètres à reconnaître

```python
response = client.responses.create(
    model=os.environ["DEPLOYMENT_NAME"],
    input=[{"role": "system", "content": "You're a helpful assistant."},
           {"role": "user", "content": "Summarize the release notes in 3 bullets."}],
    max_output_tokens=300,
    temperature=0.7
)
```

| Paramètre | Rôle |
|---|---|
| `model` | Le nom du **déploiement** |
| `input` | Le prompt, ou la liste des messages |
| `role: "system"` | Les **instructions** : comportement, ton, limites |
| `role: "user"` | La **question** de l'utilisateur |
| `max_output_tokens` | La **longueur maximale** de la réponse |
| `temperature` | Le degré de **créativité** : bas = plus prévisible, haut = plus varié |

> **Piège classique.** Ton modèle s'appelle `gpt-4.1-mini` mais tu l'as déployé sous le nom `chat-prod`. Dans le code : `model="chat-prod"`.

## Modèle ou agent

```python
# Un MODÈLE : on donne le nom du déploiement
client.responses.create(model="mon-deploiement", input=[...])

# Un AGENT : pas de model, une référence d'agent
client.responses.create(
    input=[...],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}}
)
```

L'agent a déjà son modèle, ses instructions et ses outils, configurés dans Foundry. Le code se contente de le **référencer**.

```python
agent = project_client.agents.get(agent_name="learning-agent")   # récupérer un agent existant
openai_client = project_client.get_openai_client()
response = openai_client.responses.create(
    input=[{"role": "user", "content": "Tell me what you can help with."}],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
)
```

## Envoyer une image (multimodal)

```python
response = client.responses.create(
    model=os.getenv("MODEL_NAME"),
    input=[{
        "role": "user",
        "content": [
            {"type": "input_text", "text": "What is in this image?"},
            {"type": "input_image", "image_url": image_url}
        ],
    }],
)
```

| Type de contenu | Ce qu'il contient |
|---|---|
| `input_text` | Le texte de la question |
| `input_image` | L'image (`image_url`) |

## Générer une image

Deux façons :

```python
# 1) L'API Responses avec l'outil de génération d'images
response = client.responses.create(
    model=os.environ["MODEL_NAME"],
    input="A robot holding a potted plant, pastel colors.",
    tools=[{"type": "image_generation"}],
)
image_base64 = next(item.result for item in response.output
                    if item.type == "image_generation_call")
```

```python
# 2) L'API Images
img = client.images.generate(model=deployment_name, prompt="A cute baby polar bear",
                             n=1, size="1024x1024")
image_bytes = base64.b64decode(img.data[0].b64_json)
```

| Élément | Signification |
|---|---|
| `tools=[{"type": "image_generation"}]` | Donne au modèle l'outil de génération d'images |
| `n=1` | Nombre d'images |
| `size="1024x1024"` | Taille de l'image |
| `base64.b64decode(...)` | L'image revient **encodée en base64** : on la décode avant de l'enregistrer |

La vidéo (Sora) se génère en REST : un `POST` sur `/videos` pour lancer, un `GET` sur `/videos/{video_id}` pour suivre l'état, puis un `GET` sur `/content` pour télécharger.

#### Point examen : `model=` = nom du déploiement ; agent = `extra_body` avec `agent_reference` et pas de `model` ; image en entrée = `input_image` ; image en sortie = outil `image_generation` ou `images.generate`, résultat en base64.

## Exercices rapides

**1.** Que contient `response.output_text` ?

**2.** Tu as déployé `gpt-4.1` sous le nom `assistant-v2`. Que mets-tu dans `model=` ?

**3.** Dans une liste de messages, quel rôle porte les instructions de comportement ?

**4.** Tu veux des réponses plus prévisibles. Tu montes ou tu baisses `temperature` ?

**5.** Ce code appelle-t-il un modèle ou un agent ?

```python
client.responses.create(input=[...], extra_body={"agent": {"name": "hr-bot", "type": "agent_reference"}})
```

**6.** Quel `type` de contenu faut-il pour joindre une photo à la question ?

**7.** Pourquoi appelle-t-on `base64.b64decode` après une génération d'image ?

**8.** Trouve l'erreur : on veut appeler l'agent `hr-bot`.

```python
client.responses.create(model="hr-bot", input=[{"role": "user", "content": "Hi"}])
```

<details>
<summary>Voir le corrigé</summary>

**1.** Le texte de la réponse du modèle.

**2.** `model="assistant-v2"`.

**3.** `system`.

**4.** Tu la baisses.

**5.** Un agent : il y a une référence d'agent et pas de `model`.

**6.** `input_image`, à côté d'un `input_text`.

**7.** Parce que l'image revient encodée en base64 ; il faut la décoder pour obtenir les octets du fichier.

**8.** Un agent ne s'appelle pas avec `model=` : il faut `extra_body={"agent": {"name": "hr-bot", "type": "agent_reference"}}`.

</details>
