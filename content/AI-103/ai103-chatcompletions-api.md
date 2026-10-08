# Generate responses with the ChatCompletions API

## L'essentiel

- L'**API ChatCompletions** est très répandue sur les modèles et plateformes d'IA générative.
- L'API Responses est recommandée pour un **nouveau** projet. ChatCompletions reste utile pour la **maintenance de code existant** et la **compatibilité entre plateformes**.
- Elle utilise une **liste de messages** au format JSON, chacun avec un **rôle**.
- Elle est **sans état** : c'est **ton code** qui doit conserver l'historique.

## Envoyer un prompt

```python
completion = openai_client.chat.completions.create(
    model="gpt-4o",                       # nom de ton déploiement
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "When was Microsoft founded?"}
    ]
)

print(completion.choices[0].message.content)
```

Deux choses à retenir : le paramètre **`messages`**, et le chemin pour lire la réponse, **`completion.choices[0].message.content`**.

## Les trois rôles

| Rôle | Qui parle | Contenu |
|---|---|---|
| `system` | Le développeur | Les consignes données au modèle |
| `user` | L'utilisateur | La question ou la demande |
| `assistant` | Le modèle | Une réponse précédente, qu'on remet dans l'historique |

## Garder le contexte

Contrairement à l'API Responses, ChatCompletions **ne suit pas** les réponses pour toi. Il faut ajouter à la main chaque prompt et chaque réponse à la liste.

```python
conversation_messages = [
    {"role": "system", "content": "You are a helpful AI assistant that answers questions and provides information."}
]

# 1. On ajoute le message utilisateur
conversation_messages.append({"role": "user", "content": "When was Microsoft founded?"})

# 2. On appelle le modèle avec TOUTE la liste
completion = openai_client.chat.completions.create(model="gpt-4o", messages=conversation_messages)
assistant_message = completion.choices[0].message.content

# 3. On ajoute la réponse du modèle à l'historique
conversation_messages.append({"role": "assistant", "content": assistant_message})

# 4. Tour suivant
conversation_messages.append({"role": "user", "content": "Who founded it?"})
completion = openai_client.chat.completions.create(model="gpt-4o", messages=conversation_messages)
```

Si tu oublies l'étape 3, le modèle ne saura pas à quoi « it » fait référence.

### La boucle de chat

```python
conversation_messages = [
    {"role": "system", "content": "You are a helpful AI assistant that answers questions and provides information."}
]

while True:
    input_text = input('\nYou: ')
    if input_text.lower() == "quit":
        break

    conversation_messages.append({"role": "user", "content": input_text})

    completion = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_messages
    )
    assistant_message = completion.choices[0].message.content
    print("\nAssistant:", assistant_message)

    conversation_messages.append({"role": "assistant", "content": assistant_message})
```

Chaque nouveau prompt et chaque réponse s'ajoutent à la conversation, et **tout l'historique est renvoyé à chaque tour**.

## Responses ou ChatCompletions : le comparatif

| | Responses | ChatCompletions |
|---|---|---|
| Méthode | `client.responses.create()` | `client.chat.completions.create()` |
| Prompt utilisateur | `input="..."` | `messages=[{"role": "user", ...}]` |
| Prompt système | `instructions="..."` | Message de rôle `system` |
| Lire la réponse | `response.output_text` | `completion.choices[0].message.content` |
| État de la conversation | **Avec état** : `previous_response_id` | **Sans état** : historique géré à la main |
| Recommandée pour | Les nouveaux projets | Maintenance, compatibilité multiplateforme |

## Le même appel, écrit des deux façons

```python
# ChatCompletions
completion = client.chat.completions.create(
    model="mon-deploiement",
    messages=[
        {"role": "system", "content": "Réponds en une phrase."},
        {"role": "user", "content": "C'est quoi un token ?"}
    ]
)
print(completion.choices[0].message.content)

# Responses
response = client.responses.create(
    model="mon-deploiement",
    instructions="Réponds en une phrase.",
    input="C'est quoi un token ?"
)
print(response.output_text)
```

La version Responses est plus courte : le message système va dans `instructions`, le prompt dans `input`.

## Quand garder ChatCompletions

- tu **maintiens** une application qui l'utilise déjà ;
- ton code doit tourner sur **plusieurs plateformes ou modèles** qui ne prennent en charge que cette API ;
- tu réutilises des bibliothèques ou des exemples écrits pour elle.

Elle est moins complète que l'API Responses, mais bien installée dans l'écosystème : il faut savoir la lire.

#### Point examen : si un extrait de code montre messages=[...] et choices[0].message.content, c'est ChatCompletions. S'il montre input=... et output_text, c'est Responses.

## Exercices rapides

**1.** Quel chemin donne le texte de la réponse avec ChatCompletions ?

**2.** Quel rôle porte le message qui donne les consignes au modèle ?

**3.** Après avoir reçu une réponse, que dois-tu faire pour que le tour suivant garde le contexte ?

**4.** Ce code oublie quelque chose. Quoi ?

```python
msgs = [{"role": "system", "content": "Tu es un assistant."}]
msgs.append({"role": "user", "content": "Qui a fondé Microsoft ?"})
c = client.chat.completions.create(model="gpt-4o", messages=msgs)
msgs.append({"role": "user", "content": "En quelle année ?"})
c = client.chat.completions.create(model="gpt-4o", messages=msgs)
```

**5.** Nouveau projet de chatbot dans Foundry : quelle API choisis-tu ?

**6.** Traduis en API Responses :

```python
client.chat.completions.create(model="d1", messages=[
    {"role": "system", "content": "Sois bref."},
    {"role": "user", "content": "Bonjour"}])
```

<details>
<summary>Voir le corrigé</summary>

**1.** `completion.choices[0].message.content`.

**2.** Le rôle `system`.

**3.** Ajouter la réponse à la liste des messages avec le rôle `assistant`, puis ajouter le nouveau message `user`.

**4.** La réponse du premier appel n'est pas ajoutée à `msgs` avec le rôle `assistant`. Le modèle ne verra pas sa propre réponse précédente.

**5.** L'API Responses.

**6.** `client.responses.create(model="d1", instructions="Sois bref.", input="Bonjour")`.

</details>
