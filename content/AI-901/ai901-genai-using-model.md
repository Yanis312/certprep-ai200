# Using a generative AI model — playground et client léger

## L'essentiel

- Le **model playground** est le moyen le plus simple d'interagir avec un modèle déployé : on teste des prompts, on compare des modèles, on **relève les réglages qui marchent** avant de coder.
- Trois réglages clés : **temperature**, **max output tokens**, **instructions système**.
- **Prompt système** = le comportement de l'assistant. **Prompt utilisateur** = la demande de l'utilisateur.
- Un **client léger** est une petite application qui recueille l'entrée, appelle une API distante et affiche le résultat.
- **Modèle** = intelligence brute. **Agent** = travailleur empaqueté, orienté tâche.

## Les réglages du playground

| Paramètre | Effet |
|---|---|
| **Temperature** | Créativité contre déterminisme |
| **Max output tokens** | Plafonne la longueur de la réponse ; influe sur la consommation de tokens et le throttling |
| **System instructions** | Fixe le comportement et le rôle du modèle |

## Prompt système et prompt utilisateur

| | Prompt système | Prompt utilisateur |
|---|---|---|
| Qui l'écrit | Le développeur | L'utilisateur final |
| Ce qu'il fait | Fixe le **comportement, le ton, les outils et les garde-fous** de l'assistant | Porte la **demande** ou la question |
| Exemple | « You are a helpful, step-by-step tutor. Cite sources. Decline medical advice. » | « Where should I travel? » |

C'est l'un des pièges signalés à l'examen : savoir où va chaque consigne. Une règle valable pour **toute** la conversation va dans le prompt **système**.

> **Exemple.** Tu veux que l'assistant réponde toujours en trois puces et refuse les questions médicales. C'est une règle permanente : prompt système. La question « Quels vaccins pour voyager au Pérou ? » est la demande du moment : prompt utilisateur.

## Du playground au code

Le playground est un **pont entre Foundry et le code**. Après avoir testé des prompts représentatifs, tu réutilises dans ton code les **mêmes** prompts système et utilisateur et les **mêmes** valeurs de paramètres.

Le playground fournit le code qui appelle ton déploiement par l'**API Responses compatible OpenAI**. C'est, en gros, ce qui s'exécute quand tu utilises l'interface de chat.

## Le client léger

Un **client léger** est une application minimale. Son travail : recueillir l'entrée, appeler un service ou une API distante, afficher le résultat. Pas de gros framework d'interface, pas de logique serveur complexe.

En pratique :

- il tourne en **ligne de commande** (CLI), en petit utilitaire ou en simple page web ;
- l'état et le calcul restent **côté serveur** : le modèle tourne à distance ;
- peu de code et peu de configuration : souvent des **variables d'environnement** et un court script ;
- facile à prototyper, à lancer en local et à étendre.

Pour Foundry, c'est souvent **un seul fichier Python** qui se connecte à l'endpoint d'un projet et envoie des messages à un modèle déployé.

### Les deux clients du SDK Foundry

| Client | Sert à |
|---|---|
| **Client de projet** | Les opérations propres à Foundry |
| **Client compatible OpenAI** | Appeler les modèles par l'API Responses |

La plupart des applications utilisent **les deux**.

## Le code

```python
# pip install azure-ai-projects azure-identity openai

import os
from openai import OpenAI

client = OpenAI(
    base_url=f"{os.environ['AZURE_OPENAI_ENDPOINT']}/openai",
    api_key=os.environ["AZURE_OPENAI_API_KEY"]
)

response = client.responses.create(
    model=os.environ["DEPLOYMENT_NAME"],          # le nom du déploiement
    input=[{"role": "system", "content": "You're a helpful assistant."},
           {"role": "user", "content": "Summarize the key points from our release notes in 3 bullets."}],
    max_output_tokens=300,
    temperature=0.7
)

print(response.output_text)
```

Lecture ligne par ligne :

| Ligne | Rôle |
|---|---|
| `OpenAI(base_url=..., api_key=...)` | Crée le client, avec l'**endpoint** et la **clé** lus dans les variables d'environnement |
| `model=os.environ["DEPLOYMENT_NAME"]` | Le **nom du déploiement**, pas le nom du modèle |
| `{"role": "system", ...}` | Le prompt **système** |
| `{"role": "user", ...}` | Le prompt **utilisateur** |
| `max_output_tokens=300` | Réponse de 300 tokens au plus |
| `temperature=0.7` | Réponse plutôt créative |
| `response.output_text` | Le texte généré |

### Trois questions types sur ce code

- **Quelle ligne fixe le comportement de l'assistant ?** Le message de rôle `system`.
- **Que se passe-t-il si `DEPLOYMENT_NAME` contient le nom du modèle au lieu du nom du déploiement ?** L'appel échoue si aucun déploiement ne porte ce nom.
- **Comment raccourcir les réponses ?** En baissant `max_output_tokens`.

## Modèle ou agent

| | Modèle | Agent |
|---|---|---|
| Image | L'**intelligence brute** | Un **travailleur empaqueté**, orienté tâche, construit sur cette intelligence |
| Ce qu'il fait | Reçoit un prompt, génère une sortie | Applique un rôle, utilise des outils et des connaissances |

On utilise un modèle **seul** quand :

- on veut de l'**inférence pure** : « prends ce prompt et génère une sortie » ;
- on **expérimente** dans le playground ;
- on appelle le modèle par l'**API Responses**.

#### Point examen : question officielle du module — le principal avantage du playground avant d'écrire du code est de tester des prompts, comparer des modèles et relever des réglages fonctionnels à réutiliser dans le code. Il ne déploie pas le modèle à ta place et ne génère pas le prompt système automatiquement.

## Exercices rapides

**1.** Quel est l'avantage principal du playground avant d'écrire du code ?

**2.** Prompt système ou prompt utilisateur ? (a) « Tu es un tuteur patient, cite tes sources. » (b) « Explique-moi les fractions. »

**3.** Quel paramètre plafonne la longueur de la réponse ?

**4.** Qu'est-ce qu'un client léger ?

**5.** Dans le code d'exemple, que contient `model` ?

**6.** Où le modèle s'exécute-t-il quand on utilise un client léger ?

**7.** Résume en une phrase la différence entre un modèle et un agent.

**8.** Quels sont les deux clients exposés par le SDK Foundry ?

<details>
<summary>Voir le corrigé</summary>

**1.** Tester des prompts, comparer des modèles et relever des réglages qui fonctionnent, à réutiliser dans le code.

**2.** (a) Prompt système. (b) Prompt utilisateur.

**3.** `max_output_tokens`.

**4.** Une petite application dont le rôle est de recueillir l'entrée de l'utilisateur, d'appeler un service ou une API distante et d'afficher le résultat.

**5.** Le nom du déploiement du modèle.

**6.** Côté serveur, à distance.

**7.** Le modèle est l'intelligence brute ; l'agent est un travailleur empaqueté, orienté tâche, construit sur cette intelligence.

**8.** Un client de projet, pour les opérations propres à Foundry, et un client compatible OpenAI, pour appeler les modèles par l'API Responses.

</details>
