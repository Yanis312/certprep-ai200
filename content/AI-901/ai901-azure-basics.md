# Introduction et Understand Azure — les bases d'Azure

## L'essentiel

- Une **application d'IA** utilise des techniques d'IA pour accomplir des tâches qui demandent d'ordinaire une intelligence humaine.
- Elle est propulsée par un **modèle de machine learning**. Quand tu l'utilises, le modèle fait de l'**inférence**.
- **Azure** est une plateforme cloud : des services utilisés par Internet, sans gérer de matériel.
- Azure s'organise en 4 niveaux : **tenant → abonnement → groupe de ressources → ressource**.
- Le **portail Azure** (`portal.azure.com`) est l'interface web pour tout gérer.

## Application d'IA, modèle, inférence

| Terme | Définition |
|---|---|
| **IA** | Des systèmes conçus pour des tâches qui demandent une intelligence humaine : raisonner, résoudre, percevoir, comprendre le langage |
| **Application d'IA** | Un logiciel qui utilise des techniques d'IA (vision, parole, extraction...) |
| **Modèle de machine learning** | Un système mathématique **entraîné** à reconnaître des schémas dans les données, pour prédire ou générer. C'est le **moteur** de l'application |
| **Inférence** | Le modèle **applique** à une nouvelle entrée ce qu'il a appris à l'entraînement |

```
ENTRAÎNEMENT (avant)                 INFÉRENCE (à chaque utilisation)
données  ──►  modèle entraîné        nouvelle entrée  ──►  modèle  ──►  résultat
```

Une application d'IA est :

- **propulsée par un modèle** : elle utilise un modèle entraîné pour produire du texte, des images ou des décisions ;
- **dynamique** : contrairement à un programme statique, elle peut s'améliorer par **réentraînement** ou **fine-tuning**.

### Exemples par secteur

| Secteur | Application |
|---|---|
| Santé | Outils de diagnostic qui analysent des radios ou des IRM |
| Finance | Détection de fraude qui surveille les transactions en temps réel |
| Commerce | Moteurs de recommandation personnalisés |
| Industrie | Maintenance prédictive qui anticipe les pannes |
| Éducation | Tutorat intelligent qui s'adapte au rythme de chaque élève |

Le modèle est le moteur, mais une application d'IA a aussi besoin de **sécurité, réseau, hébergement, stockage, logique applicative et interface**. C'est ce qu'Azure fournit.

## Azure : une plateforme cloud

Une **plateforme cloud** est un ensemble de services utilisés par Internet, au lieu de tout faire tourner sur son ordinateur ou son serveur. Les applications tournent dans des centres de données, qui stockent, exécutent et montent en charge sans que tu gères le matériel.

### Les 4 catégories de services

| Catégorie | Ce que c'est | Image |
|---|---|---|
| **Compute** (calcul) | Faire tourner des applications et des charges de travail dans le cloud | Louer des ordinateurs, à agrandir ou réduire à volonté |
| **Storage** (stockage) | Enregistrer et gérer des données : fichiers, bases, images, sauvegardes | Un entrepôt accessible de partout |
| **Networking** (réseau) | Relier les ressources entre elles, à Internet ou à ton organisation | Les routes entre tes services |
| **App Services** | Des plateformes prêtes à l'emploi pour créer, héberger et exécuter des applications sans gérer les serveurs | Un local déjà équipé |

## La hiérarchie Azure

```
Tenant                       l'organisation et son identité
└── Abonnement               le conteneur de facturation
    └── Groupe de ressources un dossier de ressources liées
        └── Ressource        un service : stockage, base, ressource Foundry...
```

| Niveau | Rôle | À retenir |
|---|---|---|
| **Tenant** | La base et l'**identité** d'une organisation dans le cloud Microsoft. Contient utilisateurs, groupes, identités et politiques | Créé quand une entreprise s'inscrit à Azure ou Microsoft 365. Isolé et sécurisé des autres |
| **Abonnement** | Un **conteneur de facturation**. Relie l'usage à un moyen de paiement ou à des crédits | Fixe des limites de coût, de quotas et d'accès. Un tenant peut en avoir **un ou plusieurs** |
| **Groupe de ressources** | Un **dossier** qui regroupe des ressources liées pour les gérer ensemble | Permissions et politiques possibles à ce niveau. Un abonnement peut en avoir plusieurs |
| **Ressource** | Tout service ou objet créé dans Azure | A un **type**, des réglages, un nom et un identifiant uniques |

> **Analogie du cours.** Le cloud Microsoft est un grand immeuble. Le **tenant** est ton appartement : tes serrures, tes pièces, tes règles, séparé des voisins.

Le **type de ressource** (par exemple `Microsoft.Storage/storageAccounts`) définit le comportement, les capacités et les réglages de la ressource.

En configurant une ressource, tu choisis notamment :

- la **région** (où elle est déployée) ;
- le **niveau de performance** (lié au coût) ;
- les **permissions et la sécurité**.

> **Exemple.** Pour un lab : ton compte étudiant est dans un **tenant**. Ton crédit de 100 $ est rattaché à un **abonnement**. Tu crées un **groupe de ressources** `rg-ai901-lab`, et dedans une **ressource** Foundry. À la fin, tu supprimes le groupe de ressources : tout ce qu'il contient disparaît d'un coup.

## Le portail Azure

Accessible sur `https://portal.azure.com`, c'est l'interface web centralisée pour tous les services Azure. Il sert à :

- créer et gérer des ressources cloud ;
- déployer et configurer des services ;
- surveiller l'usage, les performances et l'état ;
- gérer les identités, les rôles et les politiques d'accès ;
- consulter la **facturation** et les coûts ;
- accéder à des services spécialisés comme Microsoft Foundry.

### Créer des ressources par le code

On peut aussi créer des ressources **par programmation**, avec du code ou des scripts (par exemple **Azure CLI**), au lieu de cliquer. Avantages : **répéter** la même configuration dans plusieurs environnements, **automatiser** les déploiements, **réduire les erreurs** manuelles.

#### Point examen : l'ordre de la hiérarchie — tenant, abonnement, groupe de ressources, ressource — et le rôle de chacun. L'abonnement est le niveau de la facturation ; le groupe de ressources est le dossier.

## Exercices rapides

**1.** Comment appelle-t-on le fait, pour un modèle, d'appliquer à une nouvelle entrée ce qu'il a appris ?

**2.** Donne les 4 niveaux de la hiérarchie Azure, du plus large au plus précis.

**3.** À quel niveau est rattachée la facturation ?

**4.** Tu veux supprimer d'un coup toutes les ressources d'un lab. Que supprimes-tu ?

**5.** Associe : (a) louer de la puissance de calcul, (b) sauvegarder des images, (c) relier deux services de façon sécurisée, (d) héberger une application web sans gérer de serveur.

**6.** Cite trois choses que l'on peut faire dans le portail Azure.

**7.** Pourquoi créer des ressources par script plutôt que dans le portail ?

<details>
<summary>Voir le corrigé</summary>

**1.** L'inférence.

**2.** Tenant, abonnement, groupe de ressources, ressource.

**3.** À l'abonnement.

**4.** Le groupe de ressources.

**5.** (a) Compute, (b) Storage, (c) Networking, (d) App Services.

**6.** Trois parmi : créer et gérer des ressources, déployer et configurer des services, surveiller l'usage, gérer identités et accès, consulter la facturation, accéder à Foundry.

**7.** Pour répéter la même configuration, automatiser les déploiements et réduire les erreurs manuelles.

</details>
