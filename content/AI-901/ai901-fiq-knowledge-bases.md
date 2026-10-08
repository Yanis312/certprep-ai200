# Knowledge bases — bases et sources de connaissances

## L'essentiel

- Une **base de connaissances** donne à l'agent **une seule interface de récupération** sur une ou plusieurs sources.
- Elle représente un **domaine métier** utile : l'agent n'a pas à connaître l'emplacement de chaque document.
- Sa configuration inclut un **modèle d'IA générative** pour la récupération agentique, et des **prompts** qui guident la récupération et la réponse.
- Une **source de connaissances** décrit un contenu que Foundry IQ peut récupérer.
- Il ne faut **pas tout mettre** dans une seule base : un contenu sans rapport ou contradictoire rend la récupération moins précise.

## Créer une base de connaissances

Une fois la ressource Foundry IQ configurée avec Azure AI Search, on crée une ou plusieurs bases de connaissances, puis on y ajoute des sources.

> **Exemple.** Une base « Finance » combine la documentation des notes de frais sur **SharePoint** et des données financières dans une **base de données**. L'agent interroge la base de connaissances ; Foundry IQ **coordonne** la récupération dans les sources configurées.

### Ce que contient la configuration

| Élément | Rôle |
|---|---|
| **Un modèle d'IA générative** | Soutient la récupération agentique |
| **Des prompts de récupération** | Aident Foundry IQ à savoir **quelles sources privilégier** selon le type d'information |
| **Des prompts de réponse** | Guident les **réponses générées** à partir des connaissances récupérées |

Dans le lab, ces prompts s'appellent **Retrieval instructions** et **Answer instructions**.

## Les types de sources

| Type de source |
|---|
| Index **Azure AI Search** existants |
| Documents dans **Azure Blob Storage** |
| Contenu **Microsoft SharePoint** |
| Données dans **Microsoft OneLake** |
| Contenu **web public** |

Les options exactes peuvent changer à mesure que Foundry IQ évolue.

On choisit les sources selon trois critères :

- **où** se trouvent les données qui font autorité ;
- **à quel point** elles doivent être à jour ;
- **quelles permissions** doivent s'appliquer.

## Ne pas tout mélanger

Une base de connaissances doit contenir des sources **qui vont ensemble** et répondre à un **ensemble clair de questions**.

```
Mauvaise idée                       Bonne idée

Base « Tout »                       Base « Finance »      Base « Locaux »
├── notes de frais                  ├── notes de frais    ├── plans des étages
├── plans des étages                └── barèmes           └── procédures d'accès
├── menu de la cantine
└── anciens barèmes périmés
```

Mettre **toutes** les sources disponibles dans une base n'aide pas forcément : un contenu **sans rapport** ou **contradictoire** dégrade la précision.

## Les 6 points à examiner

| Point | La question à se poser |
|---|---|
| **Portée** (scope) | À quelles questions cette base doit-elle répondre ? |
| **Autorité** | Quels systèmes contiennent la **source de vérité** approuvée ? |
| **Fraîcheur** | À quelle vitesse les changements doivent-ils être disponibles ? |
| **Métadonnées** | Quels titres, dates, catégories, lieux ou identifiants aident la récupération et la citation ? |
| **Qualité du contenu** | Les documents sont-ils complets, à jour, lisibles, sans doublons inutiles ? |
| **Accès** | Quels utilisateurs et agents sont autorisés à récupérer chaque élément ? |

> **Exemple.** Pour la base « Notes de frais » : portée = remboursements et plafonds. Autorité = le site SharePoint de la direction financière, pas les copies qui traînent dans les boîtes mail. Fraîcheur = le nouveau barème doit être visible dès sa publication. Métadonnées = date d'effet et pays. Qualité = retirer l'ancien barème. Accès = tous les employés, sauf les annexes réservées aux managers.

## Base, source, récupération : qui fait quoi

| | Base de connaissances | Source de connaissances |
|---|---|---|
| Niveau | Le plus haut | En dessous |
| Contient | Une ou plusieurs **sources** + les **réglages** de récupération | Une **connexion** à un contenu |
| Exemple | « Finance » | Le site SharePoint des politiques de frais |

#### Point examen : question officielle du module — une base de connaissances Foundry IQ contient une ou plusieurs sources de connaissances et des réglages qui contrôlent le comportement de la récupération. Elle ne contient pas l'historique de conversation d'un agent.

## Exercices rapides

**1.** Que contient une base de connaissances ?

**2.** Cite quatre types de sources de connaissances.

**3.** Pourquoi ne pas mettre toutes les sources dans une seule base ?

**4.** Donne les 6 points à examiner en planifiant une base de connaissances.

**5.** À quoi servent les prompts définis dans la configuration d'une base ?

**6.** Deux versions d'un barème existent, dont une périmée. Quel point de planification est concerné, et que fais-tu ?

**7.** Quels trois critères guident le choix d'une source ?

<details>
<summary>Voir le corrigé</summary>

**1.** Une ou plusieurs sources de connaissances, et les réglages qui contrôlent le comportement de la récupération.

**2.** Quatre parmi : index Azure AI Search existants, documents Azure Blob Storage, contenu SharePoint, données OneLake, contenu web public.

**3.** Parce qu'un contenu sans rapport ou contradictoire rend la récupération moins précise.

**4.** Portée, autorité, fraîcheur, métadonnées, qualité du contenu, accès.

**5.** À indiquer quelles sources privilégier selon le type d'information, et à guider les réponses générées à partir des connaissances récupérées.

**6.** La qualité du contenu (et l'autorité) : on retire la version périmée pour éviter un contenu contradictoire.

**7.** L'endroit où se trouvent les données qui font autorité, leur besoin de fraîcheur et les permissions à appliquer.

</details>
