# Prompts — bien s'adresser à un LLM

## L'essentiel

- Un **prompt** est l'entrée que tu donnes à un LLM. Le modèle répond par une **complétion**.
- Deux types : le **prompt système** (comportement, ton, contraintes) et le **prompt utilisateur** (la demande précise).
- L'**historique de conversation** est renvoyé au modèle pour garder le contexte.
- Le **RAG** ajoute au prompt des informations récupérées, pour une réponse **ancrée**.
- Quatre conseils : être **clair et précis**, ajouter du **contexte**, donner des **exemples**, demander une **structure**.

## Les deux types de prompts

| | Prompt système | Prompt utilisateur |
|---|---|---|
| Rôle | Fixe le **comportement** et le **ton** du modèle, et ses **contraintes** | Demande une réponse à une **question ou consigne précise** |
| Qui le définit | En général l'**application** qui utilise le modèle | Un **humain** dans un chat, ou l'application pour son compte |
| Exemple | « You're a helpful assistant that responds in a cheerful, friendly manner. » | « Summarize the key considerations for adopting generative AI described in GenAI_Considerations.docx for a corporate executive. Format the summary as no more than six bullet points with a professional tone. » |

Le modèle répond aux prompts utilisateur **en respectant** la consigne générale du prompt système.

```
Prompt système      « Tu es un assistant joyeux et amical. »        ← fixé par l'application
        +
Prompt utilisateur  « Résume ce document en six puces. »            ← la demande
        ▼
Complétion          la réponse du modèle
```

## L'historique de conversation

Pour garder une conversation cohérente, les applications **conservent l'historique** et en incluent des versions **résumées** dans les prompts suivants. Le modèle dispose ainsi d'un contexte continu.

> **Exemple.** Le modèle vient de lister six points sur l'adoption de l'IA générative. Tu demandes ensuite : « What are common privacy-related risks? ». Le prompt envoyé contient ta nouvelle question, **mais aussi** les prompts et réponses précédents. Le modèle comprend donc que la question porte sur l'adoption de l'IA générative.

Le modèle **ne se souvient de rien** tout seul : c'est l'application qui lui renvoie l'historique à chaque tour.

## Le RAG

Le **RAG** (retrieval augmented generation) ajoute encore plus de contexte.

1. **Récupérer** de l'information : documents, e-mails...
2. **Augmenter** le prompt avec ces données.
3. La réponse **générée** est alors **ancrée** dans l'information fournie.

> **Exemple du cours.** « What's the maximum I can claim for travel expenses on a business trip? »
>
> - **Sans RAG** : une réponse générique, qui te renvoie probablement vers la politique de frais de ton entreprise.
> - **Avec RAG** : l'application interroge d'abord la politique de frais, récupère les passages sur les « travel expenses », les joint au prompt avec ta question. Le modèle répond avec le vrai plafond.

## Les 4 conseils

| Conseil | Ce que ça veut dire | Exemple |
|---|---|---|
| **Sois clair et précis** | Des consignes ou questions explicites marchent mieux qu'un langage vague | « Résume en 5 puces » plutôt que « parle-moi de ça » |
| **Ajoute du contexte** | Mentionne le sujet, le public ou le format voulu | « pour un dirigeant d'entreprise » |
| **Utilise des exemples** | Pour un style précis, montre ce que tu veux | Une puce modèle déjà rédigée |
| **Demande une structure** | Listes à puces, tableaux, listes numérotées | « sous forme de tableau à deux colonnes » |

### Avant, après

```
Vague
  Parle-moi de l'IA générative.

Mieux
  Résume les points clés de l'adoption de l'IA générative pour un dirigeant
  d'entreprise. Maximum six puces, ton professionnel.
  Exemple de puce : « Gouvernance : définir des règles d'usage claires. »
```

La seconde version applique les quatre conseils : précise, avec un public, un exemple et une structure.

La qualité des réponses dépend du modèle, **et aussi** des prompts qu'on lui envoie.

#### Point examen : question officielle du module — le but d'un prompt système est de fournir du contexte et des instructions au modèle. Il n'a rien à voir avec un système d'exploitation et ne stocke pas de préférences.

## Exercices rapides

**1.** Comment appelle-t-on la réponse d'un modèle à un prompt ?

**2.** Prompt système ou utilisateur ? (a) « Réponds toujours en trois phrases, sur un ton neutre. » (b) « Quelle est la capitale du Canada ? »

**3.** Qui définit en général le prompt système ?

**4.** Comment le modèle comprend-il une question de suivi comme « Et pour les enfants ? »

**5.** Que signifie RAG, et que fait cette technique ?

**6.** Cite les 4 conseils pour de meilleurs prompts.

**7.** Améliore ce prompt : « Écris quelque chose sur les vacances. »

<details>
<summary>Voir le corrigé</summary>

**1.** Une complétion.

**2.** (a) Prompt système. (b) Prompt utilisateur.

**3.** L'application qui utilise le modèle.

**4.** Parce que l'application inclut l'historique de la conversation, souvent résumé, dans le prompt.

**5.** Retrieval augmented generation : on récupère de l'information et on l'ajoute au prompt, pour que la réponse soit ancrée dans ces données.

**6.** Être clair et précis, ajouter du contexte, utiliser des exemples, demander une structure.

**7.** Par exemple : « Propose trois idées de vacances d'été au Québec pour une famille avec deux enfants de 6 et 9 ans, budget modéré. Présente-les dans un tableau : lieu, activité principale, durée conseillée. »

</details>
