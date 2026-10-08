# Lab et bilan — IA générative et agents (concepts)

## Le lab : explorer l'IA générative

- **Durée** : environ 15 minutes.
- **Aucun compte Azure nécessaire** : tout tourne **dans ton navigateur**, avec un petit modèle local.
- **Machine conseillée** : processeur 64 bits à 8 cœurs, 8 Go de RAM ou plus, navigateur récent. Sur une machine modeste, l'application propose un **mode Basic** sans modèle.

### Partie 1 — Discuter avec un modèle

1. Ouvre `https://aka.ms/chat-playground` et attends le téléchargement du modèle.
2. `Who was Ada Lovelace?`
3. `Tell me more about her work with Charles Babbage.`

Si ton navigateur prend en charge WebGPU, le modèle est **Microsoft Phi 3.5 Mini**, un **petit modèle de langage** adapté au matériel limité.

**Ce que tu dois observer** : « her » est compris, car l'**historique** est inclus dans le prompt.

4. **New chat** (💬) pour effacer l'historique.
5. `List three facts about Ada Lovelace.`

| | Mode Basic (sans modèle) | Avec le modèle Phi |
|---|---|---|
| Fonctionnement | Cherche des **mots-clés** dans Wikipédia | **Génère** la réponse |
| Effet du prompt | Aucun : même réponse | Le prompt influence le **style** de la réponse |
| Historique | Non conservé | Conservé |

C'est la leçon du lab : un LLM **génère** sa réponse de façon dynamique, alors qu'une recherche classique **retrouve un texte statique**. Le LLM est plus souple, mais sa réponse **n'est pas forcément ancrée dans des faits qui font autorité**.

### Partie 2 — Donner des instructions

1. **New chat**.
2. Dans **Instructions** :

```
You are an expert in the history of computing and AI. You provide succinct and concise responses.
```

3. `What can you tell me about ELIZA?` puis `How did it compare to modern LLMs?`

Les instructions donnent au modèle un **rôle**, un **format**, un **style** et des **contraintes**.

### Partie 3 — Ajouter un outil de recherche web

1. Section **Tools** → liste **Add** → **Web search** (pas File_search).
2. `Find a vintage computer store near Seattle`

**Ce que tu dois observer** : le modèle a cherché sur le web. Un outil lui donne accès à des données **externes** et **à jour**.

### Partie 4 — Ajouter des connaissances

1. Enregistre le fichier `https://aka.ms/pcb_info` (`pcb_info.txt`).
2. Section **Tools** → ajoute **File search** (ou **Upload files**) et charge le fichier.
3. `I have a printed circuit board with the "ASSY 250425" on it. What can you tell me about it?`
4. Essaie aussi : `What kind of computer does a PCB with "820-001A" come from?`, `What about "i386"?`

**Ce que tu dois observer** : la réponse s'appuie sur le fichier. Sans information pertinente, le modèle utilise ses connaissances d'entraînement.

C'est le **RAG** : récupérer une information de contexte, l'ajouter au prompt, générer une réponse fondée sur ces données.

Dans une vraie solution d'entreprise, l'accès à plusieurs sources de connaissances se centralise avec **Foundry IQ**, construit sur Azure AI Search.

### Partie 5 — Lire du code client

1. Ouvre `https://aka.ms/model-coder`.
2. Choisis le modèle d'exemple **Simple chat (Responses API)**.
3. Modifie les instructions, puis lance avec le bouton ▶.

```python
from openai import OpenAI

endpoint = "https://local/openai"
key = "key123"
model_name = "phi"

openai_client = OpenAI(
    base_url=endpoint,
    api_key=key
)

response = openai_client.responses.create(
    model=model_name,
    instructions="You are an expert in the history of computing and AI. You provide succinct and concise responses.",
    input=input_text
)
print(response.output_text)
```

| Élément | Correspondance |
|---|---|
| `instructions=...` | Le **prompt système** |
| `input=...` | Le **prompt utilisateur** |
| `response.output_text` | La **complétion** |

L'une des API les plus utilisées pour développer avec des LLM est l'**API OpenAI**, en particulier son **SDK Python**. L'**API Responses** sert à envoyer des prompts à des modèles et à des agents. L'**API ChatCompletions** est plus ancienne, mais encore très utilisée.

On utilise le même SDK OpenAI pour se connecter aux endpoints de **Microsoft Foundry**.

## Le module en 10 lignes

1. Un **LLM** génère une **complétion** à partir d'un **prompt** : une saisie prédictive très puissante.
2. **Tokenisation** : découper le texte en **tokens**, chacun avec un identifiant.
3. Un token peut être un mot, un sous-mot ou de la ponctuation.
4. **Embedding** : un vecteur qui capture le **sens** d'un token.
5. Des tokens de sens proche ont des vecteurs proches (**similarité cosinus**).
6. **Transformer** : un **encodeur** crée les embeddings, un **décodeur** prédit le token suivant.
7. **Attention** : examine la relation entre chaque token et ceux qui l'entourent.
8. **Prompt système** = comportement ; **prompt utilisateur** = demande. L'**historique** garde le contexte.
9. **RAG** : récupérer, augmenter le prompt, générer une réponse ancrée.
10. **Agent** = LLM + instructions + outils. Les agents d'un système multi-agents se parlent par des **prompts**.

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Qu'est-ce qu'un grand modèle de langage (LLM) ? | Un type de modèle d'IA conçu pour **générer du texte proche du langage humain** |
| À quoi sert la tokenisation ? | À **découper le texte en unités plus petites** |
| Que sont les embeddings ? | Des **représentations vectorielles** des tokens, qui capturent leur **sens** |
| Que fait une couche d'attention dans un transformer ? | Elle **examine les relations** entre chaque token et les tokens qui l'entourent |
| À quoi sert un prompt système ? | À fournir du **contexte et des instructions** au modèle |
| Qu'est-ce qu'un agent, en IA ? | Un système d'IA qui peut **effectuer des tâches pour le compte d'un utilisateur** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

### Les mauvaises réponses à écarter

| Affirmation fausse | Pourquoi |
|---|---|
| Un LLM ne traite que des images | Il traite et génère du langage |
| Un LLM est un petit modèle pour mobile | C'est la description d'un SLM |
| La tokenisation trie les mots par ordre alphabétique | Elle découpe, elle ne trie pas |
| La tokenisation convertit le texte en binaire | Elle produit des tokens avec des identifiants |
| Les embeddings sont des mots ajoutés par le transformer | Ce sont des vecteurs |
| L'attention supprime les mots inutiles | Elle pondère, elle ne supprime rien |
| L'attention signale le contenu inapproprié | C'est le rôle des filtres de contenu |
| Le prompt système configure le système d'exploitation | Il guide le comportement du modèle |

#### Point examen : ce module est le plus théorique du parcours. Les six questions officielles portent chacune sur une définition : entraîne-toi à définir LLM, tokenisation, embedding, attention, prompt système et agent en une phrase.

## Exercices rapides

**1.** Définis en une phrase : LLM, token, embedding.

**2.** Quelle différence entre le mode Basic et le mode avec modèle, dans le lab ?

**3.** Dans le code du lab, quelle ligne porte le prompt système ?

**4.** Quel nom porte le schéma « récupérer, augmenter le prompt, générer » ?

**5.** Quel bloc du transformer crée les embeddings ?

**6.** Donne les deux familles d'outils d'un agent, avec un exemple chacune.

<details>
<summary>Voir le corrigé</summary>

**1.** LLM : un modèle d'IA conçu pour générer du texte proche du langage humain. Token : une unité de texte, mot, sous-mot ou ponctuation. Embedding : un vecteur qui capture le sens d'un token.

**2.** Le mode Basic retrouve un texte statique par mots-clés ; avec le modèle, la réponse est générée et le prompt influence son style.

**3.** `instructions="You are an expert in the history of computing and AI. ..."`.

**4.** Le RAG, retrieval augmented generation.

**5.** L'encodeur.

**6.** Outils de connaissance, comme un moteur de recherche ; outils d'action, comme l'envoi d'un e-mail.

</details>
