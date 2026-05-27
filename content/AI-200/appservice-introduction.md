> **Dans cette unité on va parler de :**
> - Ce qu'est Azure App Service et pourquoi l'utiliser pour des containers
> - La différence entre PaaS et IaaS dans le contexte des containers
> - Le scénario réel d'un service de traitement de documents
> - Les problèmes que App Service résout (config par env, logging, scaling, cold starts)
> - Les objectifs d'apprentissage du module

---

## Le problème que App Service résout

Imagine que ton équipe a packagé un service de traitement de documents dans un container Docker. Le container tourne bien en local. Mais maintenant il faut le mettre en production. Voilà ce qui attend ton équipe sans App Service :

- **Provisionner des VMs** — choisir la taille, installer l'OS, configurer le réseau
- **Installer Docker** sur chaque machine
- **Configurer un load balancer** pour répartir le trafic
- **Gérer le scaling** — surveiller la charge, ajouter/supprimer des instances manuellement
- **Patcher l'OS** régulièrement pour la sécurité
- **Configurer les logs** et les exporter vers un système centralisé

C'est des semaines de travail avant même de deployer ton container.

**Azure App Service élimine tout ça.** Tu fournis l'image Docker. Azure gère le reste.

---

## App Service — Plateforme managée (PaaS)

App Service est une plateforme **PaaS (Platform as a Service)** :

| | IaaS (VM) | PaaS (App Service) |
|--|-----------|-------------------|
| Tu gères | OS, runtime, app, data | App, data |
| Azure gère | Hardware, réseau | Hardware, réseau, OS, runtime, scaling |
| Flexibilité | Totale | Limitée mais suffisante pour la plupart des apps |
| Complexité opérationnelle | Élevée | Faible |

Avec **Web App for Containers**, tu apportes ton image Docker depuis n'importe quel registry (ACR, Docker Hub, GitHub Container Registry) et App Service :
- Provisonne l'infrastructure
- Gère le load balancing
- Scale automatiquement selon la charge
- Applique les patches de sécurité de l'OS

---

## Le scénario du module — Service de traitement de documents

Le module utilise ce scénario concret tout au long des unités :

**Le service :**
- Accepte des documents uploadés
- Extrait le texte et les métadonnées
- Retourne des résultats structurés aux applications clientes
- Packagé en container Docker pour la cohérence entre les environnements

**Les 4 problèmes à résoudre :**

**1. Configuration par environnement**
Dev utilise des endpoints de stockage local et des logs verbeux. La prod se connecte à Azure Storage avec des clés API réelles. L'équipe veut **une seule image** qui s'adapte via des variables d'environnement — sans rebuild.

**2. Observabilité**
Quand un document échoue à être traité, l'équipe doit savoir si c'est :
- Un échec de démarrage du container
- Une variable d'environnement mal configurée
- Une erreur applicative

**3. Scaling automatique**
Les uploads de documents explosent en heures ouvrables et chutent la nuit. L'équipe veut que la plateforme scale sans intervention manuelle.

**4. Cold starts**
Les utilisateurs remarquent les délais quand l'app reprend après une période d'inactivité, ou quand de nouvelles instances démarrent au scale-out.

---

#### ⭐ STAR — Une image, plusieurs environnements

**Situation :** L'équipe buildait une image Docker différente pour dev, staging et prod. Chaque build prenait 15 minutes et les configurations hardcodées causaient des bugs quand une valeur était oubliée.

**Tâche :** Déployer la même image dans tous les environnements sans rebuild, avec des configs différentes.

**Action :** Externaliser toute la configuration dans des variables d'environnement. Sur App Service, injecter ces variables via les **App Settings** :
```
STORAGE_ACCOUNT_NAME=mystorageaccount  # prod
LOG_LEVEL=INFO                          # prod
STORAGE_ACCOUNT_NAME=devlocal          # dev
LOG_LEVEL=DEBUG                         # dev
```

**Résultat :** Une seule image buildée une fois, déployée dans tous les environnements. Les bugs de configuration entre envs ont été éliminés. Le temps de déploiement est passé de 15 minutes à moins de 1 minute.

---

## Ce que tu vas apprendre dans ce module

| Unité | Contenu |
|-------|---------|
| **Unité 2** | Déployer un container depuis ACR ou Docker Hub, gérer l'authentification |
| **Unité 3** | Startup commands, port config, stockage persistant, always-on, health checks |
| **Unité 4** | App settings, connection strings, slot settings, Key Vault references |
| **Unité 5** | Logs, log stream, Kudu, Azure Monitor, SSH, dépannage des problèmes courants |
| **Lab** | Déployer le service de traitement de documents complet sur App Service |

---

## Prérequis importants

- **App Service Plan** — L'unité de facturation. Il définit la région, la capacité et le prix. Plusieurs apps peuvent partager un même plan.
- **Always-on** — Disponible à partir du tier **Basic**. Sans ça, l'app se met en veille après ~20 minutes d'inactivité.
- **Deployment slots** — Disponibles à partir du tier **Standard**. Permettent d'avoir staging + production en parallèle.
- **Linux containers** — App Service for Containers fonctionne sur Linux. Un seul port HTTP exposé par container.
