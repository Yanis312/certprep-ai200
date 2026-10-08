# Creating a speech-capable agent — Voice Live

## L'essentiel

- Le **speech-to-speech** prend de la **parole en entrée** et produit de la **parole en sortie**, sans que l'utilisateur lise ou tape.
- C'est un **pipeline en 3 étapes** : speech-to-text → traitement ou raisonnement → text-to-speech.
- **Azure Speech Voice Live** réunit ces trois étapes dans **un seul service**, entièrement **managé**.
- Voice Live utilise un **modèle d'IA générative** en plus de ses propres modèles acoustiques.
- On peut activer le **Voice mode** d'un agent Foundry : la configuration vocale est alors **encapsulée dans l'agent**.

## Le pipeline speech-to-speech

```
Utilisateur parle
      │
      ▼
1. Speech-to-text          la voix devient du texte
      │
      ▼
2. Traitement / raisonnement   analyser, traduire, résumer,
      │                        ou laisser un agent décider quoi dire
      ▼
3. Text-to-speech          la réponse redevient de la voix
      │
      ▼
Utilisateur entend
```

Le système peut ainsi **écouter**, **comprendre ou transformer**, puis **répondre** par une voix synthétique.

## Scénarios

| Scénario | Exemple |
|---|---|
| Assistants vocaux et agents | L'utilisateur parle à un agent et entend la réponse |
| **Traduction vocale** | Parler dans une langue, entendre la réponse dans une autre |
| Applications **mains libres** | Navigation, bornes, outils industriels où taper n'est pas pratique |
| **Accessibilité** | Interaction vocale pour ceux qui la préfèrent ou en ont besoin |
| Bots de support client | L'appelant parle naturellement et reçoit une réponse parlée |

## Azure Speech — Voice Live

L'**API Voice Live** permet à une application d'avoir des **conversations vocales en temps réel** : l'agent écoute quelqu'un et répond à l'oral, vite et naturellement.

| Sans Voice Live | Avec Voice Live |
|---|---|
| Construire et relier soi-même speech-to-text, raisonnement et text-to-speech | **Tout est combiné** dans un service |
| Gérer les modèles et l'infrastructure | **Azure gère** les modèles et l'infrastructure |
| Plus long à développer | Plus simple et plus rapide |

Voice Live est **entièrement managé**. Tu envoies de l'audio, il renvoie des réponses parlées. Il peut aussi renvoyer des éléments **visuels**, comme des **avatars**, et **déclencher des actions**.

### Les composants d'une solution

- **Azure Speech** : speech-to-text et text-to-speech.
- **Des agents ou une logique applicative** : décident des réponses.
- **Des Foundry Tools ou des serveurs MCP** : exposent la parole comme des outils appelables, pour que l'agent ne gère pas lui-même les SDK ou les API.

## Dans le portail Foundry

Le playground Voice Live propose des exemples préconfigurés, ou la création de ta propre solution.

Point important : il faut **choisir un modèle d'IA générative** pour l'agent. Voice Live l'utilise **avec ses propres modèles acoustiques** pour tenir la conversation.

Parmi les réglages : l'**engagement proactif**, qui permet à l'agent de **lancer** la conversation.

### Le Voice mode d'un agent

On peut activer le **Voice mode** d'un agent Foundry dans le playground. Voice Live est alors intégré à la **définition de l'agent**.

Conséquence : la configuration vocale est **encapsulée dans l'agent**, ce qui **réduit le code client** nécessaire.

## Dans une application

```bash
pip install azure-ai-voicelive
```

Il faut aussi installer `pyaudio`, `python-dotenv` et `azure-identity`.

Le portail fournit un **code d'exemple** qui gère déjà toute la logique :

- ouvrir la session ;
- se connecter aux périphériques audio (micro, haut-parleurs) ;
- traiter les flux audio entrants et sortants ;
- gérer les **interruptions**.

À l'exécution, l'application envoie l'audio du micro en flux à Voice Live, reçoit la réponse parlée et la joue.

## Les deux paquets du module

| Besoin | Paquet |
|---|---|
| Speech-to-text et text-to-speech | `azure-cognitiveservices-speech` |
| Conversation vocale en temps réel | `azure-ai-voicelive` |

> **Exemple.** Une borne d'accueil dans un hôpital. Le visiteur demande « Où se trouve la radiologie ? ». Voice Live transcrit la question, le modèle génératif prépare la réponse, et la borne répond à voix haute. Si le visiteur coupe la parole pour préciser « non, la radiologie pédiatrique », l'interruption est gérée et la réponse s'adapte.

#### Point examen : Voice Live combine speech-to-text, raisonnement et text-to-speech en un seul service managé. Retiens aussi qu'il faut choisir un modèle génératif, et que le Voice mode intègre la voix dans la définition de l'agent.

## Exercices rapides

**1.** Donne les 3 étapes du pipeline speech-to-speech.

**2.** Quel est l'avantage principal de Voice Live par rapport à un assemblage maison ?

**3.** Que faut-il obligatoirement choisir en créant une solution Voice Live dans le playground ?

**4.** Qu'apporte le Voice mode d'un agent Foundry ?

**5.** Quel paquet Python pour une application Voice Live ?

**6.** Cite trois scénarios de speech-to-speech.

**7.** Que permet le réglage « engagement proactif » ?

**8.** En plus de l'audio, que peut renvoyer ou déclencher Voice Live ?

<details>
<summary>Voir le corrigé</summary>

**1.** Speech-to-text, traitement ou raisonnement, text-to-speech.

**2.** Il combine tout en un seul service entièrement managé : pas de composants à relier ni d'infrastructure à maintenir.

**3.** Un modèle d'IA générative pour l'agent.

**4.** Il intègre Voice Live dans la définition de l'agent : la configuration vocale est encapsulée et le code client nécessaire diminue.

**5.** `azure-ai-voicelive`.

**6.** Trois parmi : assistants vocaux et agents, traduction vocale, applications mains libres, accessibilité, bots de support client.

**7.** Il permet à l'agent de lancer lui-même la conversation.

**8.** Des éléments visuels comme des avatars, et des actions.

</details>
