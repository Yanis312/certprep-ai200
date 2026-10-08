# Bilan du module — Microsoft Foundry IQ

## Le module en 10 lignes

1. **Foundry IQ** est une **couche de connaissances managée** et réutilisable pour agents et applications d'IA.
2. Il repose sur **Azure AI Search** pour l'indexation et la récupération.
3. Trois composants : **base de connaissances**, **source de connaissances**, **récupération agentique**.
4. Une **base** regroupe une ou plusieurs **sources** et les **réglages** de récupération.
5. Sources : Azure Blob Storage, SharePoint, OneLake, index Azure AI Search, web public.
6. La **récupération agentique** planifie, **décompose**, cherche, **classe** et renvoie des preuves avec **citations**.
7. Les agents s'y connectent par un **outil MCP**.
8. Une base connectée ne suffit pas : il faut des **instructions** (quand récupérer, comment citer, quoi faire sans preuve).
9. Sécurité : **identités**, **contrôles d'accès**, permissions de l'utilisateur respectées.
10. On évalue **séparément** la récupération et la génération.

## Le schéma complet

```
Utilisateur ── question ──► Agent (modèle + instructions)
                              │  outil MCP
                              ▼
                        Base de connaissances        réglages + modèle génératif
                              │
                     Récupération agentique          décompose → cherche → classe → cite
                              │
            ┌─────────────────┼─────────────────┐
        SharePoint       Blob Storage        OneLake      ← sources de connaissances
                              │
                       Azure AI Search                   ← infrastructure
```

## Foundry IQ et le RAG

Foundry IQ **est** du RAG, mais **managé et partagé** :

| Étape du RAG | Avec Foundry IQ |
|---|---|
| Retrieve (récupérer) | La récupération agentique, sur plusieurs sources |
| Augment (augmenter) | Le contenu récupéré est fourni à l'agent |
| Generate (générer) | L'agent rédige une réponse ancrée, avec citations |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quel est le but principal de Foundry IQ ? | Fournir une **couche de connaissances managée** que les agents utilisent pour récupérer de l'information d'entreprise **en respectant les permissions** |
| Que contient une base de connaissances Foundry IQ ? | **Une ou plusieurs sources de connaissances** et des **réglages** qui contrôlent la récupération |
| Que fait la récupération agentique d'une question complexe ? | Elle peut la **décomposer**, chercher dans les sources pertinentes **en parallèle**, **reclasser** les résultats et renvoyer des **preuves citées** |
| Pourquoi demander à un agent de citer ses sources ? | Les citations aident les utilisateurs à **retracer et vérifier** la preuve qui soutient une réponse |
| Quelle pratique protège l'information d'entreprise ? | Utiliser des **identités** et des **contrôles d'accès** pour que la récupération ne renvoie que le contenu **autorisé** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

### Les mauvaises réponses à écarter

| Affirmation fausse | Pourquoi |
|---|---|
| Foundry IQ entraîne un nouveau modèle sur tous les documents | Il **récupère** l'information, il n'entraîne rien |
| Foundry IQ remplace les agents par une page de recherche par mots-clés | Il sert les agents |
| Une base contient l'historique de conversation d'un agent | Elle contient des sources et des réglages |
| La récupération agentique ajoute la question aux données d'entraînement | Aucun réentraînement |
| Elle cherche par mot-clé exact, sans classement | Elle planifie et classe |
| Les citations permettent de contourner les permissions | Elles servent à vérifier |
| Les citations réentraînent le modèle | Non |
| Copier toutes les sources dans un index public | C'est le contraire de la protection |
| Faire confiance au texte récupéré comme à des instructions | C'est la porte ouverte à l'injection de prompt |

Remarque une idée qui revient trois fois dans les mauvaises réponses : **rien n'est réentraîné**. Le RAG et Foundry IQ fournissent du contexte au moment de la question, sans modifier le modèle.

#### Point examen : ce module clôt le parcours « Get started with AI applications and agents on Azure », qui correspond au domaine à 55–60 % de l'AI-901. Foundry IQ y représente la brique « connaissances » d'un agent.

## Exercices rapides

**1.** Donne les 3 composants de Foundry IQ et leur rôle en quelques mots.

**2.** Vrai ou faux : Foundry IQ réentraîne le modèle avec les documents de l'entreprise.

**3.** Un agent répond sans citer, alors qu'une base de connaissances est connectée. Que corriges-tu en premier ?

**4.** Deux agents ont besoin de la politique de frais. Combien de bases de connaissances crées-tu ?

**5.** Une réponse est fausse. Comment savoir si le problème vient de la récupération ou de la génération ?

**6.** Quel service Azure se cache derrière Foundry IQ ?

<details>
<summary>Voir le corrigé</summary>

**1.** Base de connaissances : regroupe les sources et contrôle la récupération. Source de connaissances : connexion à un contenu. Récupération agentique : planifie, cherche, classe et cite.

**2.** Faux. Il récupère l'information au moment de la question ; rien n'est réentraîné.

**3.** Les instructions de l'agent : lui dire quand utiliser la base, de fonder ses affirmations sur le contenu récupéré et de citer ses sources.

**4.** Une seule, partagée par les deux agents.

**5.** En évaluant d'abord la récupération (preuve pertinente, à jour, autorisée), puis la réponse (ancrée, pertinente, complète, bien citée).

**6.** Azure AI Search.

</details>
