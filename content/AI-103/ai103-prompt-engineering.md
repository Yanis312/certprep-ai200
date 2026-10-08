# Optimize model output with prompt engineering

## L'essentiel

- Le **prompt engineering** consiste à concevoir et affiner les prompts pour améliorer la qualité, l'exactitude et la pertinence des réponses.
- C'est la stratégie la plus **accessible** : aucune infrastructure, aucune donnée d'entraînement, résultats immédiats.
- Trois leviers : le **message système**, les **patterns de prompt**, les **paramètres** du modèle.
- C'est **toujours le point de départ**. Sa limite : il ne donne pas au modèle une information qu'il n'a pas.

## Les composants d'un prompt

| Composant | Rôle |
|---|---|
| **Message système** | Instructions qui définissent le comportement, le rôle et les contraintes du modèle |
| **Message utilisateur** | La question ou l'entrée de l'utilisateur |
| **Message assistant** | Les réponses précédentes du modèle, dans une conversation à plusieurs tours |
| **Exemples** | Paires entrée/sortie qui montrent le format attendu |

## Le message système

Il apparaît en général en premier et sert de jeu d'instructions de plus haut niveau. Il permet de :

- définir le **rôle** et les **limites** de l'assistant ;
- fixer le **ton** et le style ;
- préciser le **format de sortie** (JSON, liste à puces...) ;
- ajouter des contraintes de **sécurité** et de **qualité**.

Version minimale :

```text
You are a helpful AI assistant.
```

Version détaillée pour l'agence de voyages :

```text
You are a friendly travel advisor for Margie's Travel.
Answer only questions related to travel, hotels, and trip planning.
Use a warm, conversational tone.
If you don't have enough information to answer, ask a clarifying question.
Format hotel recommendations as a bulleted list with the hotel name, location, and price range.
```

Un message système **influence** le modèle mais **ne garantit pas** qu'il obéisse. Il faut tester, itérer, et le compléter par d'autres protections comme le **filtrage de contenu** et l'**évaluation**.

### La checklist en 4 points

| Point | Dans l'exemple ci-dessus |
|---|---|
| **1. Le rôle** et le résultat attendu | « friendly travel advisor for Margie's Travel » |
| **2. Les limites** : sujets, actions, contenus à éviter | « Answer only questions related to travel... » |
| **3. Le format de sortie**, dit simplement et gardé constant | « bulleted list with the hotel name, location, and price range » |
| **4. La règle « en cas de doute »** | « If you don't have enough information... ask a clarifying question » |

## Les patterns de prompt

### Persona

On demande au modèle d'adopter un point de vue ou un rôle.

| | Sans persona | Avec persona |
|---|---|---|
| Message système | Aucun | You're a seasoned marketing professional writing for technical customers. |
| Prompt | Write a one-sentence description of a CRM product. | Le même |
| Réponse | A CRM product is a software tool designed to manage a company's interactions with customers. | Experience seamless customer relationship management with our CRM, designed to streamline operations and drive sales growth with robust analytics. |

### Format template (modèle de format)

On fournit la structure voulue :

```text
Format the result to show:
- Hotel name
- Location
- Star rating
- Price range per night
```

Résultat : des réponses organisées, constantes, faciles à analyser par ton application.

### Chain of thought (chaîne de pensée)

On demande au modèle d'expliquer son raisonnement **étape par étape**. Cela réduit le risque d'erreur et rend la logique vérifiable.

```text
Which hotel is best for a family of four? Take a step-by-step approach:
consider room size, amenities for children, location, and price.
```

Technique voisine : **décomposer** la tâche en sous-étapes explicites. Par exemple, un premier prompt extrait les faits clés d'un texte, un second répond à partir de ces faits.

La chaîne de pensée s'adresse aux modèles **sans raisonnement intégré**. Les modèles de raisonnement, comme la série o, gèrent la logique étape par étape en interne.

### Few-shot learning

On donne un ou plusieurs **exemples** d'entrée et de sortie.

| Nom | Nombre d'exemples |
|---|---|
| **Zero-shot** | Aucun |
| **One-shot** | Un seul |
| **Few-shot** | Plusieurs |

```text
Classify the following customer messages:

Message: "I need to change my flight to Rome"
Category: Booking change

Message: "What's the weather like in Bali in March?"
Category: Travel information

Message: "Can I get a refund for my cancelled tour?"
Category:
```

Le modèle déduit le schéma de classification des deux exemples et complète la dernière ligne.

### Syntaxe claire et délimiteurs

Quand le prompt contient plusieurs sections (instructions, texte source, exemples), on les sépare avec des **délimiteurs** : `---`, titres Markdown ou balises XML. Le modèle distingue mieux les consignes du contenu.

```text
Résume le texte entre les balises en deux phrases.

<texte>
...le contenu à résumer...
</texte>
```

**Biais de récence** : le texte proche de la **fin** du prompt peut peser plus que celui du début. Si le modèle ne suit pas une consigne de façon constante, **répète-la à la fin**.

## Les paramètres du modèle

| Paramètre | Effet | Valeurs types |
|---|---|---|
| **Temperature** | Contrôle l'aléa de la sortie | 0,2 = ciblé et déterministe ; 0,7 = créatif et varié |
| **Top_p** | Limite le modèle à un sous-ensemble des tokens suivants les plus probables | 0,9 = seuls les 90 % de tokens les plus probables |

Règle : ajuster **soit** temperature **soit** top_p, **pas les deux** en même temps.

> **Exemple.** Pour l'agence de voyages : temperature **0,2** pour répondre aux questions factuelles sur les équipements d'un hôtel, **0,7** pour proposer des idées d'itinéraires créatives.

## Quand le prompt engineering suffit

Il est efficace pour :

- guider le **ton**, le **format** et le **comportement** ;
- donner des **instructions** précises pour une tâche ;
- **itérer vite**, sans toucher à l'infrastructure ;
- garder des **coûts bas** : ni entraînement ni stockage de données.

## Ses limites

| Symptôme | Stratégie suivante |
|---|---|
| Le modèle n'a **pas accès à l'information** nécessaire (ton catalogue d'hôtels) | RAG |
| Le modèle **ne tient pas un comportement** malgré des instructions détaillées | Fine-tuning |

#### Point examen : deux questions officielles du module — le but principal du message système est de définir le rôle, le comportement et les contraintes de sortie du modèle ; le paramètre temperature contrôle l'aléa et la créativité des réponses.

## Exercices rapides

**1.** Quels sont les 4 points de la checklist d'un message système ?

**2.** Tu donnes trois exemples de classification avant ta question. Comment s'appelle cette technique ? Et avec zéro exemple ?

**3.** Le modèle doit choisir le meilleur forfait parmi cinq, avec plusieurs critères. Quel pattern réduit le risque d'erreur ?

**4.** Tu veux des réponses factuelles et stables. Temperature à 0,2 ou à 0,9 ?

**5.** Vrai ou faux : il est conseillé de régler temperature et top_p en même temps.

**6.** Le modèle oublie ta consigne « réponds en français » sur les longs prompts. Que tentes-tu ?

**7.** Le modèle invente des prix d'hôtels malgré un excellent message système. Le prompt engineering peut-il régler ça ?

**8.** Rédige un message système en 4 lignes pour un assistant de support d'une banque, en suivant la checklist.

<details>
<summary>Voir le corrigé</summary>

**1.** Le rôle, les limites, le format de sortie, la règle « en cas de doute ».

**2.** Few-shot learning. Sans exemple : zero-shot.

**3.** Chain of thought : demander un raisonnement étape par étape.

**4.** 0,2.

**5.** Faux. On ajuste l'un ou l'autre, pas les deux.

**6.** Répéter la consigne à la fin du prompt, à cause du biais de récence.

**7.** Non. Le modèle n'a pas l'information : il faut l'ancrer avec du RAG.

**8.** Exemple : « Tu es un assistant de support pour la banque Contoso. Réponds uniquement aux questions sur les comptes, cartes et virements. Réponds en trois phrases maximum, puis propose une étape suivante. Si la demande est ambiguë ou hors sujet, pose une question de clarification ou oriente vers un conseiller. »

</details>
