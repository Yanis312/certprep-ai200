# Developing AI apps on Azure — ce qu'il faut autour du modèle

## L'essentiel

- Une application d'IA fiable repose sur 4 piliers : **sécurité et réseau**, **hébergement et mise à l'échelle**, **stockage des données**, **capacités d'IA**.
- **Microsoft Entra ID** contrôle qui accède à quoi, avec le **RBAC**.
- Les **secrets** (clés, mots de passe) se rangent dans **Azure Key Vault**, jamais dans le code ni sur GitHub.
- Hébergement : **AKS** pour les conteneurs, **App Service** pour les applications web.
- Mise à l'échelle : **scale out** (plus d'instances) ou **scale up** (instance plus puissante).

## 1. Sécurité et réseau

C'est la **fondation**. Azure est sécurisé par conception : identité, contrôle d'accès et isolation réseau intégrés.

| Notion | Définition |
|---|---|
| **Microsoft Entra ID** | Garantit que seules les bonnes personnes et les bons services accèdent à tes ressources d'IA |
| **RBAC** (contrôle d'accès basé sur les rôles) | Limite l'accès aux déploiements de modèles, aux ressources et aux données |
| **Secret** | Toute valeur sensible que l'application doit garder cachée, car elle donne accès à un système, un service ou des données |
| **Clé** | Un type de secret : une longue chaîne aléatoire qui **authentifie** ta requête quand tu appelles un endpoint |
| **Azure Key Vault** | L'endroit où l'on stocke les secrets |

Exemples de secrets : clés d'API, chaînes de connexion à une base, jetons OAuth, mots de passe.

### Le parcours d'une clé

```
1. Ton application appelle l'endpoint du modèle
2. La requête contient une clé qui l'authentifie
3. La clé est stockée dans Azure Key Vault, comme secret
4. L'application la récupère à l'exécution, par une méthode sûre : l'identité managée
```

À retenir : la clé n'est **jamais écrite dans le code**. L'application va la chercher au moment où elle en a besoin.

Les outils de sécurité d'Azure couvrent l'identité, les secrets, la protection des données, la conformité, la détection des menaces, la supervision et les contrôles comme les **pare-feu**.

## 2. Hébergement et mise à l'échelle

Une application tourne sur un **hôte** (host). Dans le cloud, ce peut être une **machine virtuelle (VM)**, qui fournit calcul, mémoire et réseau.

| Service | Pour quoi |
|---|---|
| **Azure Kubernetes Service (AKS)** | Les charges **conteneurisées**. AKS **orchestre** (gère) un grand nombre de conteneurs |
| **Azure App Service** | Héberger des **applications web**, des **API** et des tâches de fond |

Un **conteneur** contient ce dont ton code a besoin pour s'exécuter.

### Mettre à l'échelle

Mettre à l'échelle, c'est ajuster la puissance de calcul utilisée, automatiquement ou à la main. Une **instance** est une copie de ton application qui tourne en même temps que les autres.

| Type | Autre nom | Ce qu'on fait | Image |
|---|---|---|---|
| **Scale out** | Horizontal | **Ajouter des instances** | Ouvrir plus de caisses au supermarché |
| **Scale up** | Vertical | **Augmenter le CPU ou la mémoire** de l'instance existante | Remplacer la caisse par une plus rapide |

Le cloud peut mettre à l'échelle **automatiquement** selon l'usage du CPU, le nombre de requêtes ou des métriques personnalisées.

> **Exemple.** Ton chatbot reçoit 10 fois plus de visiteurs le lundi matin. Avec le scale out automatique, Azure passe de 2 à 8 instances à 9 h, puis revient à 2 l'après-midi.

## 3. Stockage des données

Une application d'IA manipule plusieurs types de données :

| Type de données | Rôle |
|---|---|
| **Données d'entraînement** | Apprennent des schémas au modèle |
| **Données d'entrée d'inférence** | L'entrée en temps réel de l'utilisateur ou du système |
| **Données de sortie du modèle** | Prédictions ou réponses générées |
| **État de l'application** | Assure la continuité propre à chaque utilisateur |
| **Données système et de configuration** | Règlent le comportement de l'application |
| **Journaux et télémétrie** | Supervision et optimisation |
| **Données de sécurité et d'accès** | Authentification et autorisation |

Le **stockage** est tout système qui sert à enregistrer, organiser et retrouver des données. Il donne à l'application un endroit **persistant**.

| Service | Pour quoi |
|---|---|
| **Azure SQL Database** | Les charges **critiques** |
| **Azure Cosmos DB** | Les données **temps réel, distribuées mondialement** |
| **Azure Database for PostgreSQL** | Des solutions **intelligentes et évolutives** |

## 4. Capacités d'IA

Pour donner vie à tes agents : **Microsoft Foundry**, une plateforme de niveau entreprise pour développer et exploiter des agents IA de façon sécurisée sur Azure.

Les administrateurs gèrent toutes ces ressources dans le **portail Azure**, ou par **scripts shell et modèles** (templates) pour automatiser le déploiement et la configuration.

## L'ensemble, pour un chatbot

| Pilier | Dans le chatbot |
|---|---|
| Sécurité et réseau | Entra ID pour les accès, la clé du modèle dans Key Vault |
| Hébergement | L'interface web sur App Service, avec scale out automatique |
| Stockage | L'historique des conversations dans Cosmos DB |
| Capacités d'IA | Le modèle et l'agent dans Microsoft Foundry |

#### Point examen : les secrets vont dans Azure Key Vault, récupérés par identité managée. Scale out = plus d'instances (horizontal), scale up = plus de ressources sur la même instance (vertical). AKS = conteneurs, App Service = applications web.

## Exercices rapides

**1.** Où stocke-t-on une clé d'API dans Azure ?

**2.** Par quelle méthode sûre l'application récupère-t-elle un secret à l'exécution ?

**3.** Scale out ou scale up ? (a) Passer de 2 à 6 copies de l'application. (b) Passer de 4 à 16 Go de mémoire sur le même serveur.

**4.** Quel service pour orchestrer des conteneurs ? Et pour héberger une API web ?

**5.** Quel service de base de données pour des données temps réel distribuées dans le monde entier ?

**6.** Que signifie RBAC, et à quoi sert-il ?

**7.** Dans quelle catégorie de données ranges-tu la question que tape l'utilisateur dans le chat ?

**8.** Donne deux exemples de secrets.

<details>
<summary>Voir le corrigé</summary>

**1.** Dans Azure Key Vault.

**2.** Par identité managée.

**3.** (a) Scale out, horizontal. (b) Scale up, vertical.

**4.** Azure Kubernetes Service (AKS) pour les conteneurs ; Azure App Service pour une API web.

**5.** Azure Cosmos DB.

**6.** Role-based access control, contrôle d'accès basé sur les rôles. Il limite l'accès aux déploiements de modèles, aux ressources et aux données.

**7.** Les données d'entrée d'inférence.

**8.** Deux parmi : clé d'API, chaîne de connexion à une base, jeton OAuth, mot de passe.

</details>
