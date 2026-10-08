# Lab — un agent de notes de frais avec Foundry IQ

## Objectif

Créer un agent qui conseille les employés sur les notes de frais, puis l'**ancrer** dans la politique de l'entreprise grâce à une base de connaissances Foundry IQ.

- **Durée** : environ 20 minutes.
- **Deux portails** : Foundry pour l'agent et la base, Azure pour les permissions.
- Le lab crée une ressource **Azure AI Search** payante (niveau **Basic**) : pense au nettoyage.

## Étape 1 — Créer le projet

`https://ai.azure.com` → active **New Foundry** → crée un projet (ressource Foundry, abonnement, groupe de ressources, région recommandée).

## Étape 2 — Créer l'agent

1. Page **Home**, tuile **Build an agent** → **Start building** (ou **Build → Agents**).
2. Crée un agent nommé **expenses-agent**. Si on te le demande, **Interaction mode** : **Text**.
3. Vérifie qu'un **modèle** est déployé et sélectionné.
4. **Instructions** :

```
You are an AI agent that advises employees on expenses policies and expense claim processes.
```

5. **Save**.
6. Teste : `What can you help me with?`
7. Puis : `How much can I claim for a taxi?`

**Ce que tu dois observer** : l'agent donne une réponse qui **semble** correcte. Mais il ne connaît pas la politique de **ton** entreprise : sa réponse **n'est pas ancrée** dans une information exacte.

C'est tout l'enjeu du module : une réponse plausible n'est pas une réponse fiable.

## Étape 3 — Télécharger la politique

Télécharge `https://microsoftlearning.github.io/mslearn-ai-fundamentals/data/expenses_policy.docx`.

Ce document est très petit, pour les besoins du lab. Une vraie base de connaissances d'entreprise contient un grand volume de données, souvent dans des bases ou d'autres systèmes.

## Étape 4 — Configurer Foundry IQ

1. Dans le portail Foundry, navigation de gauche : **Knowledge**. La page Foundry IQ s'ouvre.
2. En bas : **Create a new resource**, pour créer une ressource Foundry IQ (**Azure AI Search**).
3. Renseigne, accepte l'avertissement de coût, puis crée :

| Champ | Valeur |
|---|---|
| Resource name | Un nom unique |
| Subscription | Ton abonnement |
| Resource group | Celui de ta ressource Foundry |
| Region | Une région disponible |
| Pricing tier | **Basic** |

4. Attends la création. La page liste ensuite tes bases de connaissances (aucune pour l'instant).

## Étape 5 — Créer la base de connaissances

1. **Create a knowledge base**, avec :

| Champ | Valeur |
|---|---|
| Name | `expenses-documentation` |
| Description | Expense guidelines for employees |
| Chat completions model | Le déploiement de modèle existant |
| Retrieval reasoning effort | Low |
| Output mode | **Answer synthesis** |
| Answer instructions | Answer concisely, based on the available context |
| Retrieval instructions | Use the expenses-documentation source for all questions related to expense claim policies and procedures |

2. Dans **Add knowledge sources** : **Upload files**, charge `expenses_policy.docx`, nomme la source **expenses-policy**, garde le modèle d'embedding par défaut.
3. Attends le traitement, puis **enregistre** la base.

### Les réglages à comprendre

| Réglage | Ce qu'il fait |
|---|---|
| **Output mode : extractive data** | Renvoie le **texte tel quel** de la source |
| **Output mode : answer synthesis** | Un modèle génératif **compose** une réponse adaptée |
| **Answer instructions** | Agissent comme un **prompt système** : mise en forme de la réponse |
| **Retrieval instructions** | Guident la façon dont Foundry IQ **cherche** dans les bases disponibles |

Tu retrouves la structure du cours : la **base** (`expenses-documentation`) contient une **source** (`expenses-policy`).

## Étape 6 — Donner les permissions

1. Nouvel onglet : `https://portal.azure.com`.
2. Ouvre le **groupe de ressources**. Tu y vois la ressource Foundry IQ, la ressource Foundry et le projet.
3. Ouvre le **service de recherche** Foundry IQ, puis **Access control (IAM)**.
4. **Add** → **Add role assignment**.
5. Onglet **Role** : cherche et choisis le rôle de lecture des données d'index (écrit **Search Data Index Reader** dans le lab ; le cours l'appelle **Search Index Data Reader**). **Next**.
6. Onglet **Members** : **Managed identity**, puis **+Select members**, et choisis l'**identité de ton projet Foundry**.
7. **Review and assign**.

Ce que tu viens de faire : autoriser l'**identité managée** du projet à **lire** l'index. Sans cela, l'agent ne peut pas récupérer le contenu. C'est du **RBAC**, et c'est du moindre privilège : un rôle de **lecture**, pas d'écriture.

## Étape 7 — Utiliser la base dans l'agent

1. Reviens au portail Foundry, sur la page de ta base de connaissances.
2. Liste **Use in an agent** → choisis **expenses-agent**.
3. L'agent s'ouvre dans le playground, avec la base attachée.
4. Repose la question : `How much can I claim for a taxi?`

**Ce que tu dois observer** : la réponse s'appuie sur la politique, et une **citation** de la documentation apparaît en bas.

## Avant et après

| | Avant Foundry IQ | Après |
|---|---|---|
| Source de la réponse | Les connaissances générales du modèle | La politique de l'entreprise |
| Fiabilité | Plausible, non vérifiable | Ancrée |
| Citation | Aucune | La documentation de frais |

## Ce que montre le lab

Foundry IQ évite d'implémenter soi-même le pattern RAG. En **centralisant** l'accès aux connaissances dans un seul outil, on lui délègue le **choix de la source** et la **logique de récupération**, et on **réutilise** les sources dans plusieurs agents sans dupliquer le code.

## Nettoyage

`https://portal.azure.com` → groupe de ressources → **Delete resource group** → saisis le nom et confirme. Le service Azure AI Search en niveau Basic est facturé tant qu'il existe.

## Exercices rapides

**1.** Pourquoi la première réponse de l'agent sur le taxi n'est-elle pas fiable ?

**2.** Quel service Azure est créé quand tu crées la ressource Foundry IQ ?

**3.** Quelle différence entre les modes de sortie « extractive data » et « answer synthesis » ?

**4.** À quoi servent les Answer instructions ? Et les Retrieval instructions ?

**5.** Quel rôle donnes-tu, à qui, et dans quel portail ?

**6.** Qu'est-ce qui prouve, à la fin, que l'agent utilise la base de connaissances ?

**7.** Dans le lab, quel est le nom de la base et quel est le nom de la source ?

<details>
<summary>Voir le corrigé</summary>

**1.** Parce que l'agent ne connaît pas la politique de l'entreprise : sa réponse vient de ses connaissances générales et n'est pas ancrée dans une information exacte.

**2.** Une ressource Azure AI Search.

**3.** « Extractive data » renvoie le texte tel quel de la source ; « answer synthesis » fait composer une réponse par un modèle génératif.

**4.** Les Answer instructions agissent comme un prompt système pour la mise en forme de la réponse. Les Retrieval instructions guident la recherche dans les bases de connaissances.

**5.** Le rôle de lecture des données d'index (Search Index Data Reader), à l'identité managée du projet Foundry, dans le portail Azure, page Access control (IAM) du service de recherche.

**6.** La citation de la documentation de frais affichée en bas de la réponse.

**7.** La base s'appelle `expenses-documentation` et la source `expenses-policy`.

</details>
