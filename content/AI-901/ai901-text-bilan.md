# Bilan du module — analyse de texte dans Azure

## Le module en 10 lignes

1. L'**analyse de texte** tire de l'information d'un texte non structuré, grâce au **NLP**.
2. Deux approches dans Foundry : **modèle généraliste** (prompts) et **Azure Language** (analyseurs spécialisés).
3. Modèle généraliste : expressions clés, liaison d'entités, sentiment, résumé, traduction, à combiner librement.
4. Sa sortie **dépend du prompt** et peut **varier** d'un appel à l'autre.
5. Azure Language : techniques **statistiques**, sortie **structurée et déterministe**.
6. Deux analyseurs vus : **détection de langue** (code ISO 639-1 + confiance) et **détection des PII** (avec masquage).
7. API OpenAI : paquet `openai`, `client.responses.create(model, input)`.
8. SDK Azure Language : paquet `azure-ai-textanalytics`, `TextAnalyticsClient`, `detect_language`, `recognize_pii_entities`.
9. **MCP** : standard ouvert, client (l'agent) et serveur (le service).
10. Le **serveur MCP Azure Language** donne à un agent une analyse de texte précise, sans ressource Language séparée.

## Applications citées en introduction

| Secteur | Usage |
|---|---|
| Retours clients | Analyser avis, tickets et enquêtes pour repérer tendances et mécontentement |
| Santé | Extraire symptômes, médicaments et diagnostics de documents médicaux |
| Finance | Extraire taux d'intérêt, informations emprunteur et risques de conformité |
| Juridique | Résumer des textes, repérer les clauses importantes, classer par sujet |

## Choisir l'approche

```
As-tu besoin de la même sortie structurée à chaque appel ?
├── Oui → Azure Language
│         ├── depuis ton code : SDK azure-ai-textanalytics
│         └── depuis un agent : serveur MCP Azure Language
└── Non → modèle généraliste avec l'API Responses
```

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Tu dois analyser du texte et la même entrée doit renvoyer des résultats structurés fondés sur des techniques statistiques. Quelle approche ? | Le **SDK Azure Language**, car il renvoie une sortie **déterministe et structurée** |
| Quel est le rôle de l'objet client dans le SDK Azure Language ? | Il aide le code de l'application à **communiquer avec le service** Azure Language |
| Quel est le but principal du serveur MCP Azure Language ? | **Exposer les capacités d'Azure Language aux agents** par le Model Context Protocol |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

Les mauvaises réponses à écarter : l'API Responses suit bien des consignes en langage naturel, mais sa sortie n'est pas déterministe. L'objet client ne stocke ni les réglages d'interface ni le texte à analyser. Le serveur MCP ne remplace pas les modèles génératifs de l'agent.

#### Point examen : ce module couvre la puce « Créer une application légère qui inclut de l'analyse de texte » du domaine Foundry, qui pèse 55 à 60 % de l'AI-901.

## Exercices rapides

**1.** Écris de mémoire les deux commandes `pip install` du module.

**2.** Quelle classe crée le client Azure Language ?

**3.** Associe : (a) résumé libre d'un avis, (b) code de langue fiable pour router un ticket, (c) un agent qui masque des PII.

**4.** Que renvoie `recognize_pii_entities` ?

**5.** Pourquoi dit-on que MCP est un « adaptateur universel » ?

<details>
<summary>Voir le corrigé</summary>

**1.** `pip install openai` et `pip install azure-ai-textanalytics`.

**2.** `TextAnalyticsClient`.

**3.** (a) Modèle généraliste avec l'API Responses. (b) Azure Language, détection de langue. (c) Agent connecté au serveur MCP Azure Language.

**4.** Le texte masqué (`redacted_text`) et la liste des entités trouvées, avec catégorie et score de confiance.

**5.** Parce qu'au lieu d'écrire une intégration sur mesure pour chaque service, on connecte l'agent à un serveur MCP qui expose ses capacités de façon standard.

</details>
