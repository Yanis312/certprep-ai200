# Introduction et What is Foundry IQ?

## L'essentiel

- Un modèle génératif n'a pas accès aux informations **privées ou récentes** d'une organisation.
- Le **RAG** règle ce problème en récupérant l'information utile et en l'ajoutant au contexte du modèle. Mais construire un système de récupération **par agent** demande beaucoup de travail.
- **Foundry IQ** est une **couche de connaissances managée** pour les agents et les applications d'IA.
- Il repose sur une ressource **Azure AI Search** et sur 3 composants : **base de connaissances**, **source de connaissances**, **récupération agentique**.
- Plusieurs agents s'y connectent par **MCP** : une seule couche de connaissances, gérée de façon centrale.

## Le problème de départ

> **Exemple du cours.** Un assistant de notes de frais doit s'appuyer sur les **politiques approuvées** de l'entreprise, pas sur une réponse générale tirée d'Internet.

Dans Foundry, chaque brique a son rôle :

| Brique | Ce qu'elle donne à l'agent |
|---|---|
| **Modèles** | Le langage et le raisonnement |
| **Outils** | La capacité d'**agir** |
| **Connaissances** | L'information **absente de l'entraînement** du modèle |

Foundry IQ est la brique « connaissances ». Il relie des données **structurées et non structurées**, venant de systèmes d'entreprise et du web, et les met à disposition des agents par des **bases de connaissances réutilisables**.

## Les 3 composants

| Composant | Rôle |
|---|---|
| **Base de connaissances** (knowledge base) | La ressource de plus haut niveau. Elle regroupe des sources liées et **contrôle le comportement de la récupération** |
| **Source de connaissances** (knowledge source) | Une **connexion** à du contenu indexé ou distant : SharePoint, bases Azure SQL, documents dans Azure Storage, web public, Microsoft 365 Copilot Work IQ... |
| **Récupération agentique** (agentic retrieval) | Le processus qui **planifie** les recherches, **trouve** le contenu, **classe** les résultats et renvoie une réponse unifiée avec **références** aux sources |

```
        Agent finance      Agent RH       Agent support
              │               │                │
              └───────── MCP ─┴────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Foundry IQ         │  ← repose sur Azure AI Search
                    │  Base de            │
                    │  connaissances      │
                    └─────────┬──────────┘
              ┌───────────────┼───────────────┐
         SharePoint       Azure SQL       Azure Storage
        (sources de connaissances)
```

## Pourquoi Foundry IQ

Une organisation veut trois agents :

- un agent **finance** : règles et procédures de notes de frais ;
- un agent **environnement de travail** : demandes liées aux locaux ;
- un agent **congés** : jours fériés et réservation de congés.

| | Un pipeline RAG par agent | Foundry IQ |
|---|---|---|
| Travail | Traitement des documents, embeddings, index, logique de récupération, permissions et supervision, **à refaire pour chaque agent** | Des bases de connaissances par **domaine métier**, connectées aux agents qui en ont besoin |
| Risque | Travail dupliqué, résultats **incohérents** | — |
| Amélioration | À répercuter partout | Une amélioration de la connaissance partagée **profite à tous** les agents connectés |

## Ce que fait Foundry IQ

- **Connecter** les bases de connaissances à des sources indexées et distantes.
- **Préparer** le contenu indexé : **chunking** (découpage), génération d'**embeddings**, extraction de **métadonnées**.
- **Récupérer** l'information par recherche **par mots-clés, vectorielle ou hybride**.
- **Planifier et coordonner** la récupération sur plusieurs sources.
- **Renvoyer** le contenu pertinent avec des **citations**.
- **Appliquer les permissions** des utilisateurs, pour les sources et configurations prises en charge.

## Créer une ressource Foundry IQ

**Azure AI Search** fournit l'infrastructure d'indexation et de récupération. La première étape est donc de configurer une ressource Foundry IQ avec une instance Azure AI Search.

### Le rôle à attribuer

Après la création, il faut ajouter l'**identité managée** du projet Foundry au rôle **Search Index Data Reader** sur la ressource Azure AI Search. Sans cela, on ne peut pas tester la récupération dans le playground de l'agent.

Les identités managées des **agents de production** qui utiliseront Foundry IQ doivent aussi avoir ce rôle.

Le lab écrit ce rôle « Search Data Index Reader ». C'est le même rôle : un lecteur des données d'index.

## Foundry IQ et file_search

| | Fichier attaché à un agent | Foundry IQ |
|---|---|---|
| Portée | Un agent | **Plusieurs agents** |
| Sources | Les fichiers chargés | SharePoint, SQL, Storage, OneLake, web... |
| Gestion | Par agent | **Centralisée** |
| Permissions | — | Appliquées selon l'utilisateur |

#### Point examen : question officielle du module — le but principal de Foundry IQ est de fournir une couche de connaissances managée que les agents utilisent pour récupérer de l'information d'entreprise en respectant les permissions. Retiens aussi qu'il repose sur Azure AI Search.

## Exercices rapides

**1.** Quel problème le RAG résout-il ?

**2.** Sur quel service Azure Foundry IQ repose-t-il ?

**3.** Cite les 3 composants d'une solution Foundry IQ.

**4.** Par quel protocole les agents se connectent-ils à Foundry IQ ?

**5.** Pourquoi éviter de construire un pipeline RAG par agent ?

**6.** Quel rôle faut-il donner à l'identité managée du projet sur la ressource Azure AI Search ?

**7.** Cite trois opérations de préparation du contenu que Foundry IQ prend en charge.

**8.** Quelles techniques de recherche Foundry IQ peut-il utiliser ?

<details>
<summary>Voir le corrigé</summary>

**1.** Le modèle n'a pas accès aux informations privées ou récentes ; le RAG récupère l'information pertinente et l'ajoute au contexte fourni au modèle.

**2.** Azure AI Search.

**3.** La base de connaissances, la source de connaissances et la récupération agentique.

**4.** Par MCP, le Model Context Protocol.

**5.** Parce que cela duplique le travail et peut donner des résultats incohérents.

**6.** Search Index Data Reader.

**7.** Le chunking, la génération d'embeddings et l'extraction de métadonnées.

**8.** La recherche par mots-clés, vectorielle ou hybride.

</details>
