# Lab — un agent vocal avec Voice Live

## Objectif

Créer un agent dans Foundry, lui activer le **Voice mode** (Azure Speech Voice Live), puis lui parler.

- **Durée** : environ 25 minutes.
- **Matériel** : un micro ou un casque, dans un endroit calme.
- Tout se fait dans le **portail Foundry**.

## Étape 1 — Créer le projet

1. `https://ai.azure.com`, connecte-toi, active **New Foundry** si besoin.
2. Crée un projet (ou choisis-en un existant) : ressource Foundry, abonnement, groupe de ressources, région recommandée.
3. **Create**.

Selon tes permissions, tu devras peut-être décocher l'option de création des ressources recommandées.

## Étape 2 — Créer l'agent

1. Page **Home**, tuile **Build an agent** → **Start building** (ou page **Build**, onglet **Agents**).
2. Crée un agent nommé **speech-agent**. Si on te le demande, mets **Interaction mode** sur **Text**.
3. L'agent s'ouvre dans le playground. Vérifie qu'un **modèle** est déployé et sélectionné.
4. Donne-lui ces **Instructions** :

```
You are an AI agent that provides information about AI and related topics. You answer questions concisely and precisely.
```

5. **Save**.
6. Teste dans le volet **Chat** :

```
What can you help me with?
```

Si une erreur de quota apparaît, ouvre la liste **Model** → **Browse more models** et déploie un modèle gpt-5 ou plus récent disponible.

Tu retrouves les trois éléments d'un agent : un **modèle**, des **instructions**, et bientôt un **outil** vocal.

## Étape 3 — Activer Voice Live

1. Dans le volet de gauche, sous la liste des modèles, active **Voice mode**.
2. Si le volet **Configuration** ne s'ouvre pas, clique sur l'icône d'engrenage au-dessus du chat.
3. Sous **Voice mode**, regarde la configuration d'entrée et de sortie vocale. Essaie plusieurs voix en les préécoutant.
4. Ferme le volet et **Save**.

## Étape 4 — Parler à l'agent

1. Dans le volet **Chat**, clique sur **Start session**. Autorise l'accès au micro.
2. Quand l'état affiche **Listening…**, dis par exemple : « How does speech recognition work? »
3. L'état passe à **Processing…**, parfois trop vite pour être vu.
4. L'état passe à **Speaking…** : l'agent lit sa réponse.
5. Clique sur le bouton **cc** en bas du chat pour voir le prompt et la réponse en texte.
6. Pose une autre question, comme « How does speech synthesis work? ».
7. Clique sur l'icône **X** pour terminer. Une **transcription** de la conversation s'affiche.

### Ce que montrent les trois états

| État | Étape du pipeline |
|---|---|
| **Listening…** | Speech-to-text : l'agent écoute |
| **Processing…** | Raisonnement : le modèle prépare la réponse |
| **Speaking…** | Text-to-speech : l'agent parle |

C'est exactement le pipeline speech-to-speech du cours.

## Étape 5 — Voir le code client

1. Clique sur **Call agent** en haut du chat.
2. Lis le code. Il gère :
   - la **connexion** au projet pour accéder à l'agent ;
   - le **streaming audio** en entrée et en sortie ;
   - l'usage des **périphériques audio** : micro et haut-parleurs.

Pour utiliser l'agent dans une application à toi, il faut du code qui s'appuie sur le **SDK Azure Speech Voice Live**.

## Nettoyage

`https://portal.azure.com` → groupe de ressources du lab → **Delete resource group** → saisis le nom pour confirmer.

## Exercices rapides

**1.** Quel réglage ajoute la voix à l'agent ?

**2.** À quelles étapes du pipeline correspondent les états Listening, Processing et Speaking ?

**3.** À quoi sert le bouton **cc** ?

**4.** Que gère le code d'exemple affiché par **Call agent** ?

**5.** Que s'affiche-t-il à la fin de la session ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le Voice mode, qui intègre Azure Speech Voice Live.

**2.** Listening : speech-to-text. Processing : raisonnement. Speaking : text-to-speech.

**3.** À afficher en texte le prompt et la réponse (sous-titres).

**4.** La connexion au projet, le streaming audio en entrée et en sortie, et l'usage du micro et des haut-parleurs.

**5.** Une transcription de la conversation.

</details>
