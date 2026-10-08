# Bilan du module — IA générative et agents dans Azure

## Le module en 10 lignes

1. Le **catalogue de modèles** : découvrir, filtrer, comparer et tester des modèles de nombreux fournisseurs.
2. Deux catégories : **vendus directement par Azure** (SLA, intégration) et **partenaires et communauté**.
3. Un **modèle de fondation** est grand, **préentraîné**, utilisable tout de suite ou personnalisable.
4. Familles : **GPT-5.x** (raisonnement, agents), **Claude Opus 4.5**, **Mistral Large 3**, **GPT-4.1** (vitesse, gros volume).
5. Évaluer : benchmarks, leaderboards, comparaisons ; métriques **NLP** (F1...) et **assistées par IA** (groundedness...). Les évaluateurs **détectent** mais ne corrigent pas.
6. **Déployer** = un endpoint stable ; paramètres : type de déploiement, version, **TPM**. Dépassement = **throttling**.
7. Le **playground** sert à tester prompts et réglages avant de coder : temperature, max output tokens, instructions système.
8. **Client léger** : un petit script qui appelle l'API Responses avec endpoint, clé et **nom du déploiement**.
9. **Agent** = modèle + instructions + outils. **Outils = actions**, **connaissances = contexte** (RAG, avec citations).
10. Code agent : `AIProjectClient` → `agents.get` → `get_openai_client` → `responses.create` avec `extra_body`.

## De l'idée à l'agent publié

```
Catalogue        choisir un modèle (benchmarks, comparaison)
    │
    ▼
Déploiement      endpoint + TPM
    │
    ▼
Playground       prompts, temperature, instructions
    │
    ├──►  Client léger       responses.create(model=..., input=[...])
    │
    ▼
Agent            + outils + connaissances  →  Save as agent
    │
    ├──►  Client d'agent     responses.create(input=[...], extra_body={...})
    │
    ▼
Publication      ressource Azure managée, endpoint stable
```

## Les trois distinctions à maîtriser

| Distinction | Premier terme | Second terme |
|---|---|---|
| **Modèle / agent** | Intelligence brute, inférence pure | Composant empaqueté : rôle, outils, connaissances |
| **Prompt système / utilisateur** | Comportement, ton, garde-fous | La demande du moment |
| **Outils / connaissances** | Des actions | Du contexte |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Qu'est-ce qui décrit le mieux le catalogue de modèles de Foundry ? | Un **point central** pour découvrir, filtrer, comparer et tester de nombreux modèles génératifs de **plusieurs fournisseurs** |
| Qu'est-ce qu'un modèle de fondation dans Foundry ? | Un **grand modèle préentraîné** aux capacités générales, utilisable **immédiatement** ou **personnalisable** |
| Quel est le principal avantage du Model Playground avant d'écrire du code ? | Tester des prompts, comparer des modèles et **relever des réglages fonctionnels** à réutiliser dans le code |
| Quel est le résultat principal de la publication d'un agent ? | L'agent devient une **ressource Azure managée** avec un **endpoint stable**, à partager et intégrer sans exposer le projet ni le code source |
| Quelle ligne de l'exemple Python appelle l'agent publié ? | `response = openai_client.responses.create(input=[...], extra_body={'agent': {'name': agent.name, 'type': 'agent_reference'}})` |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

### Les mauvaises réponses à écarter

| Affirmation fausse | Pourquoi |
|---|---|
| Le catalogue ne contient que des modèles Microsoft | Il regroupe de nombreux fournisseurs |
| Le catalogue remplace l'abonnement Azure | Il faut un abonnement Azure pour utiliser Foundry |
| Un modèle de fondation est petit et doit être fine-tuné avant de servir | Il est grand et utilisable d'emblée |
| Le playground déploie le modèle et supprime le besoin d'une API | Il sert à tester ; l'application passe toujours par l'API |
| Le playground génère automatiquement le meilleur prompt système | C'est toi qui écris les instructions |
| Publier rend l'agent gratuit | Tokens, outils et services de données restent facturés |
| `agents.get(...)` appelle l'agent | Cette ligne ne fait que le **récupérer** |
| `get_openai_client()` appelle l'agent | Cette ligne ne fait qu'obtenir le **client** |

#### Point examen : la dernière question officielle est le modèle exact des questions de lecture de code. Trois lignes se ressemblent, une seule fait l'appel. Entraîne-toi à dire ce que fait chaque ligne d'un extrait.

## Exercices rapides

**1.** Dans cet extrait, quelle ligne se connecte au projet, laquelle récupère l'agent, laquelle l'appelle ?

```python
project_client = AIProjectClient(endpoint=myEndpoint, credential=DefaultAzureCredential())   # A
agent = project_client.agents.get(agent_name="learning-agent")                               # B
openai_client = project_client.get_openai_client()                                           # C
response = openai_client.responses.create(input=[...], extra_body={"agent": {...}})          # D
```

**2.** Quel paramètre de déploiement fixe la capacité en tokens par minute ?

**3.** Une règle « réponds toujours en français » : prompt système ou utilisateur ?

**4.** Un agent doit citer le manuel interne de l'entreprise. Outil ou connaissance ?

**5.** Que fait un évaluateur de sécurité quand il trouve du contenu nuisible ?

**6.** Cite les deux catégories de modèles du catalogue.

<details>
<summary>Voir le corrigé</summary>

**1.** A se connecte au projet. B récupère l'agent. C obtient le client compatible OpenAI. D appelle l'agent.

**2.** La limite de tokens par minute (TPM).

**3.** Prompt système : c'est une règle de comportement valable pour toute la conversation.

**4.** Une connaissance : du contexte fourni par RAG, avec citation.

**5.** Il le détecte et le note ; il ne le corrige pas.

**6.** Les modèles vendus directement par Azure, et les modèles de partenaires et de la communauté.

</details>
