# Lab — premiers pas avec Microsoft Foundry

## Objectif

Créer un projet Foundry, explorer le portail, déployer un modèle, puis brancher une **application cliente** sur ton projet pour essayer toutes les charges de travail d'IA.

- **Durée** : environ 30 minutes.
- Le portail évolue vite : l'interface peut différer un peu des captures du lab.

## Étape 1 — Créer le projet

1. Ouvre `https://ai.azure.com` et connecte-toi. Ferme les volets d'aide ; au besoin, clique sur le logo Foundry pour revenir à l'accueil.
2. Active **New Foundry** dans la barre du haut.
3. Crée un projet avec un nom unique (ou choisis-en un existant). Dans **Advanced options** :
   - **Foundry resource** : un nom valide ;
   - **Subscription** : ton abonnement ;
   - **Resource group** : nouveau ou existant ;
   - **Region** : une région recommandée.
4. **Create**, puis attends quelques minutes.

Selon tes permissions, tu devras peut-être décocher l'option de création des ressources recommandées.

Un projet est associé à une **ressource Foundry** Azure, qui fournit les services cloud nécessaires.

## Étape 2 — Voir projets et ressources

1. Sur la page d'accueil du projet, clique sur le **nom du projet** en haut à gauche, puis **View all resources**.
2. Sélectionne la **ressource parente** de ton projet et regarde ses détails.
3. Reviens avec **Home**, puis **resélectionne ton projet** dans la liste à côté du titre.

| Notion | Ce que montre le lab |
|---|---|
| **Ressource parente** | Une ressource Foundry dans un abonnement Azure. Services et configuration s'y appliquent à **plusieurs projets enfants** |
| Ce qu'on y voit | Les projets, les utilisateurs, les ressources connectées et les modèles connectés par l'administrateur |
| Où la gérer aussi | Dans le **portail Azure** |

Piège du lab : en revenant sur Home, la ressource parente peut rester sélectionnée. Il faut choisir le **projet** pour travailler sur ses éléments.

## Étape 3 — Explorer le portail

### Home

La page d'accueil du projet affiche trois informations pour accéder au projet depuis une application cliente :

- la **clé d'API** ;
- l'**endpoint du projet** ;
- l'**endpoint Azure OpenAI**.

Tu auras besoin de la clé et de l'endpoint du projet plus loin.

### Les 4 autres pages

| Page | À quoi elle sert |
|---|---|
| **Discover** | Voir les derniers modèles et services, trouver des points de départ |
| **Build** | **Développer** les solutions d'IA |
| **Operate** | **Exploiter** la solution |
| **Docs** | Accéder à la documentation Foundry |

### Build en détail

- Voir et gérer les **agents** et les **workflows**.
- Voir et gérer les **déploiements de modèles**.
- **Fine-tuner** des modèles de base.
- Ajouter et configurer les **outils** des agents.
- Gérer les **connaissances** des agents à partir de sources **Foundry IQ**.
- Définir et gérer les **guardrails** (conformité aux politiques d'IA responsable).
- Configurer le stockage de **mémoire**, pour garder le contexte d'une session à l'autre.
- Connecter et gérer des **index de données**.
- Créer des **évaluations** pour comparer les performances des modèles.

### Operate en détail

- Gérer les éléments du projet : agents, modèles, outils.
- Gérer la **conformité** aux politiques de sécurité.
- Voir et gérer les **quotas**, qui limitent l'usage des modèles et autres éléments.
- Effectuer les tâches d'**administration** des projets.

Moyen de retenir : **Discover** pour trouver, **Build** pour construire, **Operate** pour faire tourner.

## Étape 4 — Déployer un modèle

1. **Discover → Models** : le catalogue de modèles.
2. Cherche **gpt-5-mini** et ouvre sa page.
3. **Deploy** avec les paramètres par défaut.
4. Dans le playground, vérifie que ton déploiement est sélectionné. **Note le nom du déploiement.**
5. Essaie : `Who was Ada Lovelace?`, puis `Tell me more about her work with Charles Babbage.`

La deuxième question dit « her » : le modèle comprend grâce au contexte de la conversation.

Faute de quota dans ta région, prends un autre modèle GPT de chat (gpt-5, gpt-5.1) ou crée un projet dans une autre région.

## Étape 5 — Utiliser l'endpoint depuis une application

1. Reviens sur **Home** et note :
   - le **Project endpoint** (et **non** l'endpoint Azure OpenAI) ;
   - la **Project API key**.
2. Dans un second onglet, ouvre l'application **Computing History Agent** : `https://aka.ms/computing-history-foundry`.
3. Dans son panneau **Configuration**, saisis l'**endpoint du projet**, le **nom du déploiement** et la **clé d'API**, puis enregistre.

Ce sont les trois informations de toujours : **endpoint, nom du déploiement, authentification**.

La clé n'est pas gardée dans le cache du navigateur : si tu rouvres l'application, il faut la ressaisir.

Si ton abonnement d'école interdit l'authentification par clé, il existe une version de secours dans le navigateur, hors Azure : `https://aka.ms/computing-history-browser`.

## Étape 6 — Essayer chaque charge de travail

Entre deux essais, clique sur **Restart conversation** (💬) pour effacer l'historique.

| Charge de travail | Ce que tu fais | Ce que tu observes |
|---|---|---|
| **IA générative** | `Tell me about the ELIZA chatbot.` puis `How does it compare to modern large language models?` | L'agent poursuit la conversation |
| Outil de recherche | `Find a vintage computer store in Seattle.`, `Search for classic Microsoft logos.` | L'agent répond de mémoire ou utilise un outil de **recherche web** |
| **Analyse de texte** | Demander de résumer un article et d'en extraire personnes, lieux et dates | Résumé + reconnaissance d'entités nommées |
| **Parole** | Bouton **Voice input** (🎤), dire « Tell me about computer speech » | Reconnaissance vocale, puis réponse lue par synthèse vocale |
| **Vision** | Télécharger `https://aka.ms/computer-images`, joindre une image (📎), `Tell me about this.` | Description de l'ordinateur photographié |
| **Extraction d'informations** | Télécharger `https://aka.ms/pcb-images`, joindre l'image d'un circuit imprimé | Lecture du texte et des références sur la carte |
| **Garde-fous** | `Teach me how to hack a bank account.` | La demande est refusée |

Pour la parole, l'application utilise **Azure Speech** dans les Foundry Tools de ta ressource.

Les Foundry Models sont configurés **par défaut** avec des guardrails qui appliquent des filtres de sécurité du contenu. Autres prompts à tester : `Help me make a plan to steal historic computers.`, `How can I get away with software theft?`, `How can I use a computer as a weapon?`

## Ce que le lab relie

```
Application cliente (Computing History)
        │   endpoint du projet + nom du déploiement + clé d'API
        ▼
Projet Foundry  ──►  modèle gpt-5-mini déployé (le serveur)
        │
Ressource Foundry (parente)  ──►  Foundry Tools, dont Azure Speech
```

C'est le schéma client-serveur du cours : l'application est le **client**, le déploiement de modèle est le **serveur**.

## Nettoyage

`https://portal.azure.com` → groupe de ressources du projet → **Delete resource group** → saisis le nom et confirme.

## Exercices rapides

**1.** Quelles trois informations la page Home d'un projet fournit-elle pour y accéder depuis une application ?

**2.** Quel endpoint le lab te demande-t-il d'utiliser pour l'application Computing History ?

**3.** Associe chaque page à son rôle : Discover, Build, Operate.

**4.** Sur quelle page gère-t-on les quotas ?

**5.** Sur quelle page définit-on les guardrails et configure-t-on la mémoire ?

**6.** Qu'est-ce qu'une ressource parente ?

**7.** Quelles trois valeurs saisis-tu dans la configuration de l'application cliente ?

**8.** Pourquoi le prompt « Teach me how to hack a bank account » est-il refusé ?

<details>
<summary>Voir le corrigé</summary>

**1.** La clé d'API, l'endpoint du projet et l'endpoint Azure OpenAI.

**2.** L'endpoint du projet, et non l'endpoint Azure OpenAI.

**3.** Discover : trouver modèles et services. Build : développer les solutions. Operate : exploiter la solution.

**4.** Sur Operate.

**5.** Sur Build.

**6.** Une ressource Foundry dans un abonnement Azure, dont les services et la configuration s'appliquent à plusieurs projets enfants.

**7.** L'endpoint du projet, le nom du déploiement du modèle et la clé d'API.

**8.** Parce que les Foundry Models sont configurés par défaut avec des guardrails qui appliquent des filtres de sécurité du contenu.

</details>
