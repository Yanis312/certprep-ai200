# Bilan du module — Get started with AI in Azure

## Le module en 10 lignes

1. L'**IA** est l'objectif : des systèmes au comportement intelligent. Le **machine learning** est une **méthode** pour y arriver, en apprenant des schémas dans les données.
2. Un modèle est **entraîné**, puis fait de l'**inférence** à chaque utilisation.
3. Azure offre 4 catégories de services : **Compute, Storage, Networking, App Services**.
4. Hiérarchie : **tenant → abonnement → groupe de ressources → ressource**.
5. Sécurité : **Entra ID** et **RBAC** pour les accès, **Key Vault** pour les secrets, récupérés par **identité managée**.
6. Hébergement : **AKS** (conteneurs), **App Service** (web). **Scale out** = plus d'instances, **scale up** = instance plus puissante.
7. **Foundry** est **construit sur Azure** : une PaaS avec **Models, Agents, Tools, Knowledge**.
8. **Ressource Foundry** = capacités de la plateforme ; **projet Foundry** = espace de travail à l'intérieur.
9. **Client** = le programme que l'utilisateur manipule ; **serveur** = le déploiement de modèle.
10. Un **endpoint** est une URL pour appeler un modèle ; la **clé** authentifie la requête. **REST** : en-têtes + corps JSON.

## IA et machine learning

| | IA | Machine learning |
|---|---|---|
| Nature | L'**objectif** d'ensemble | Une **méthode** pour l'atteindre |
| Définition | Créer des systèmes qui montrent une intelligence proche de l'humain | Apprendre des schémas **à partir de données** |
| Relation | Englobe le ML | Fait partie de l'IA |

Les deux termes ne sont **pas** interchangeables. Et le ML ne se limite **pas** aux tâches génératives.

## Foundry et Azure

```
┌─────────────────────────────────────────────┐
│  Microsoft Foundry                          │
│  modèles · agents · outils · connaissances  │
├─────────────────────────────────────────────┤
│  Azure                                      │
│  calcul · réseau · identité · sécurité      │
└─────────────────────────────────────────────┘
```

Foundry est **construit au-dessus d'Azure** et utilise ses ressources (calcul, réseau, identité, sécurité) pour héberger et exploiter les applications d'IA. Il ne tourne **pas** indépendamment d'Azure et ne le **remplace pas**.

## Clé, secret, endpoint

| Élément | Rôle |
|---|---|
| **Endpoint** | L'**URL** pour appeler un modèle déployé |
| **Clé** | **Authentifie** la requête envoyée à l'endpoint |
| **Secret** | Toute valeur sensible ; la clé en est une |
| **Azure Key Vault** | L'endroit où la clé est **stockée**, comme secret |

Les confusions à éviter : l'endpoint ne **stocke** rien de sensible, et la clé n'est ni un lieu de stockage des réponses ni une limite de volume de données.

## Client et serveur

| | Client | Serveur |
|---|---|---|
| Ce que c'est | Un programme que l'utilisateur manipule : application web ou mobile | Le **déploiement de modèle** dans Foundry |
| Ce qu'il fait | Envoie des requêtes à l'endpoint et **affiche** la réponse | **Héberge** le modèle, exécute l'**inférence**, renvoie le résultat |

## Les questions officielles du module

| Question | Réponse |
|---|---|
| Quelle affirmation explique le mieux la relation entre IA et ML ? | L'IA est l'**objectif global** de créer des systèmes à l'intelligence proche de l'humain ; le ML est une **méthode fondée sur les données** pour y parvenir, en apprenant des schémas |
| Quel est le lien entre Microsoft Foundry et Azure ? | Foundry est **construit sur Azure** et utilise ses ressources (calcul, réseau, identité, sécurité) pour héberger et exploiter les applications d'IA |
| Comment clés, secrets et endpoints fonctionnent-ils ensemble ? | L'**endpoint** est une URL pour appeler un modèle déployé ; la **clé**, stockée comme secret dans **Azure Key Vault**, authentifie la requête |
| Qu'est-ce qu'une application cliente dans une solution Foundry ? | Un programme avec lequel l'utilisateur interagit (application web ou mobile), qui **envoie des requêtes** à l'endpoint d'un modèle et **affiche la réponse** |

Le texte fourni ne contenait pas le corrigé de Microsoft ; ces réponses découlent directement du cours.

## Ce que dit le résumé officiel

L'infrastructure évolutive d'Azure et la plateforme unifiée de Foundry accélèrent le développement et le lancement d'applications d'IA générative et d'agents. La collection de **modèles prêts à l'emploi**, les **outils intégrés** et les fonctions de **gouvernance** de Foundry aident à créer des solutions **sûres, responsables et performantes**.

#### Point examen : les quatre questions officielles portent chacune sur une relation entre deux notions — IA et ML, Foundry et Azure, clé et endpoint, client et serveur. Sache formuler chaque relation en une phrase.

## Exercices rapides

**1.** Complète : l'IA est ____, le machine learning est ____.

**2.** Vrai ou faux : Foundry peut déployer des modèles sans aucune ressource Azure.

**3.** Dans une application de chat, qui exécute l'inférence ?

**4.** Où est stockée la clé qui authentifie les appels à l'endpoint ?

**5.** Donne la hiérarchie Azure du plus large au plus précis.

**6.** Cite trois ressources Azure sur lesquelles Foundry s'appuie.

<details>
<summary>Voir le corrigé</summary>

**1.** L'IA est l'objectif global de créer des systèmes à l'intelligence proche de l'humain ; le machine learning est une méthode fondée sur les données pour y parvenir.

**2.** Faux. Foundry est construit sur Azure et utilise ses ressources.

**3.** Le serveur, c'est-à-dire le déploiement de modèle.

**4.** Dans Azure Key Vault, comme secret.

**5.** Tenant, abonnement, groupe de ressources, ressource.

**6.** Trois parmi : calcul, réseau, identité, sécurité.

</details>
