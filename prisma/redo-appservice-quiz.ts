import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const slugs = ["appservice-introduction", "appservice-deploy", "appservice-runtime", "appservice-settings", "appservice-diagnostics"];

  for (const slug of slugs) {
    const unit = await prisma.unit.findUnique({ where: { slug } });
    if (!unit) { console.log(`❌ ${slug} introuvable`); continue; }
    await prisma.question.deleteMany({ where: { unitId: unit.id } });
    console.log(`🗑️  Questions supprimées pour ${slug}`);
  }

  // ===== UNITÉ 1 — Introduction =====
  const u1 = await prisma.unit.findUnique({ where: { slug: "appservice-introduction" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u1!.id,
      question: "Qu'est-ce qu'Azure App Service dans le modèle PaaS — qu'est-ce que TU gères, et qu'est-ce qu'Azure gère ?",
      options: JSON.stringify([
        "Tu gères tout (OS, runtime, app) — Azure gère uniquement le hardware",
        "Tu gères uniquement l'app et les données — Azure gère l'OS, le runtime, le scaling et les patches",
        "Azure gère tout — tu n'as rien à configurer",
        "Tu gères l'OS et l'app — Azure gère uniquement le hardware et le réseau"
      ]),
      correctAnswer: 1,
      explanation: "En PaaS, tu te concentres sur ton application et tes données. Azure gère l'infrastructure complète : OS, runtime, load balancing, scaling automatique et patches de sécurité. C'est la différence fondamentale avec une VM (IaaS) où tu gères tout sauf le hardware.",
    },
    {
      unitId: u1!.id,
      question: "Dans le scénario du module, l'équipe veut utiliser la MÊME image Docker pour dev, staging et production avec des configs différentes. Comment App Service permet ça ?",
      options: JSON.stringify([
        "En buildant une image différente par environnement automatiquement",
        "En modifiant le Dockerfile à chaque déploiement",
        "Via les App Settings qui injectent des variables d'environnement différentes par environnement au démarrage du container",
        "En utilisant des branches Git différentes par environnement"
      ]),
      correctAnswer: 2,
      explanation: "Le principe de l'image immuable : on build une seule fois. La configuration (endpoints, clés API, niveau de logs) est externalisée dans des App Settings. App Service injecte ces valeurs comme variables d'environnement au démarrage — l'image est identique partout, seule la config change.",
    },
    {
      unitId: u1!.id,
      question: "À partir de quel tier App Service la fonctionnalité Always-on est-elle disponible ?",
      options: JSON.stringify([
        "Free",
        "Shared",
        "Basic",
        "Standard"
      ]),
      correctAnswer: 2,
      explanation: "Always-on est disponible à partir du tier Basic. Sans Always-on (tiers Free et Shared), l'app se met en veille après ~20 minutes d'inactivité et subit un cold start à la prochaine requête.",
    },
    {
      unitId: u1!.id,
      question: "Qu'est-ce qu'un 'cold start' dans le contexte d'Azure App Service ?",
      options: JSON.stringify([
        "Une erreur de démarrage causée par un Dockerfile incorrect",
        "Le temps de build de l'image Docker dans ACR",
        "Le délai de démarrage quand une app idle doit redémarrer ou quand de nouvelles instances sont créées au scale-out",
        "Le temps de connexion initial à la base de données"
      ]),
      correctAnswer: 2,
      explanation: "Un cold start survient quand l'app était en veille (idle) et doit redémarrer, ou quand App Service crée de nouvelles instances pour absorber une charge supplémentaire. Ce délai peut aller de quelques secondes à plusieurs minutes selon la taille de l'image et le temps de démarrage de l'application.",
    },
    {
      unitId: u1!.id,
      question: "Quel est l'avantage principal de Web App for Containers par rapport à déployer sur une VM Azure ?",
      options: JSON.stringify([
        "App Service est toujours moins cher qu'une VM",
        "App Service supporte plus de langages de programmation",
        "App Service gère l'infrastructure (OS, patches, scaling, load balancing) — tu fournis juste l'image Docker",
        "App Service permet de déployer sur plusieurs régions simultanément"
      ]),
      correctAnswer: 2,
      explanation: "L'avantage clé est l'élimination de la gestion d'infrastructure. Sur une VM, tu gères : l'OS, les patches, Docker, le load balancer, le scaling. Sur App Service, tu fournis l'image et Azure gère tout le reste. Cela réduit considérablement la charge opérationnelle.",
    },
  ]});
  console.log("✅ Unité 1 — 5 questions");

  // ===== UNITÉ 2 — Déployer =====
  const u2 = await prisma.unit.findUnique({ where: { slug: "appservice-deploy" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u2!.id,
      question: "Quelle est la différence entre system-assigned et user-assigned managed identity pour App Service ?",
      options: JSON.stringify([
        "System-assigned : ressource indépendante assignable à plusieurs apps. User-assigned : liée au cycle de vie de l'app",
        "Elles sont identiques — deux noms pour la même fonctionnalité",
        "System-assigned : liée au cycle de vie de la web app, supprimée avec elle. User-assigned : ressource Azure indépendante, assignable à plusieurs apps",
        "System-assigned est gratuite, user-assigned coûte selon le nombre d'apps"
      ]),
      correctAnswer: 2,
      explanation: "System-assigned identity est créée et supprimée avec la web app — simple pour un seul service. User-assigned identity existe comme ressource Azure indépendante — idéal quand plusieurs apps partagent le même accès ACR ou quand tu veux configurer les permissions avant de créer l'app.",
    },
    {
      unitId: u2!.id,
      question: "Tu pushes une nouvelle image avec le tag `latest` dans ACR. App Service met-il à jour le container automatiquement ?",
      options: JSON.stringify([
        "Oui — App Service surveille les changements de contenu des tags en continu",
        "Oui — mais seulement si le déploiement continu est activé sur le tag `latest` spécifiquement",
        "Non — App Service ne détecte pas le changement. Il faut redémarrer manuellement ou activer le CD avec une webhook",
        "Non — il faut impérativement changer le tag pour déclencher une mise à jour"
      ]),
      correctAnswer: 2,
      explanation: "App Service ne poll pas le registry. Il ne sait pas que le contenu sous un tag a changé. Deux solutions : soit utiliser un nouveau tag (v1 → v2) ce qui déclenche automatiquement le pull, soit activer le déploiement continu (webhook ACR → App Service restart).",
    },
    {
      unitId: u2!.id,
      question: "Quel rôle Azure RBAC minimal faut-il assigner à la managed identity pour qu'App Service puisse puller des images depuis ACR ?",
      options: JSON.stringify([
        "AcrPull",
        "Contributor",
        "AcrAdmin",
        "Reader"
      ]),
      correctAnswer: 0,
      explanation: "AcrPull est le rôle minimal requis — il permet uniquement de télécharger (pull) des images du registry. AcrAdmin donne trop de permissions (push, delete, admin). Contributor et Reader sont des rôles Azure génériques qui ne s'appliquent pas à ACR.",
    },
    {
      unitId: u2!.id,
      question: "Lors d'un scale-out (ajout de nouvelles instances), comment App Service gère-t-il l'image Docker sur les nouvelles instances ?",
      options: JSON.stringify([
        "Les nouvelles instances partagent l'image déjà chargée des instances existantes",
        "App Service pré-charge l'image sur toutes les instances avant d'accepter du trafic",
        "Chaque nouvelle instance pull l'image depuis le registry — peut être lent si l'image est volumineuse et les couches ne sont pas en cache",
        "App Service utilise uniquement les couches en cache — jamais de pull complet au scale-out"
      ]),
      correctAnswer: 2,
      explanation: "Chaque nouvelle instance doit puller l'image depuis le registry. Si les couches ne sont pas en cache sur la nouvelle infrastructure, un pull complet est nécessaire. C'est pourquoi optimiser la taille des images est important — une image de 2GB multipliée par 10 nouvelles instances = 20GB de téléchargement.",
    },
    {
      unitId: u2!.id,
      question: "Quelle commande CLI configure App Service pour puller automatiquement une nouvelle image à chaque push dans ACR ?",
      options: JSON.stringify([
        "az webapp config container set --auto-pull true",
        "az acr webhook create --actions push --uri <app-service-url>",
        "az webapp deployment container config --enable-cd true",
        "az webapp update --continuous-deployment true"
      ]),
      correctAnswer: 2,
      explanation: "az webapp deployment container config --enable-cd true retourne une webhook URL. Tu configures ensuite ACR pour appeler cette URL à chaque push. App Service reçoit la notification, redémarre et pull la nouvelle image automatiquement.",
    },
  ]});
  console.log("✅ Unité 2 — 5 questions");

  // ===== UNITÉ 3 — Runtime =====
  const u3 = await prisma.unit.findUnique({ where: { slug: "appservice-runtime" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u3!.id,
      question: "La startup command dans App Service remplace quelle instruction du Dockerfile ?",
      options: JSON.stringify([
        "ENTRYPOINT uniquement",
        "CMD uniquement — ENTRYPOINT reste inchangé",
        "À la fois ENTRYPOINT et CMD",
        "RUN — elle réexécute des commandes au démarrage"
      ]),
      correctAnswer: 1,
      explanation: "La startup command override uniquement CMD. ENTRYPOINT reste défini tel quel dans le Dockerfile. C'est le comportement standard Docker : CMD fournit les arguments par défaut, ENTRYPOINT définit l'exécutable. App Service suit cette même convention.",
    },
    {
      unitId: u3!.id,
      question: "Ton container Python Flask écoute sur le port 5000. Quelle app setting App Service faut-il configurer ?",
      options: JSON.stringify([
        "CONTAINER_PORT=5000",
        "APP_PORT=5000",
        "DOCKER_PORT=5000",
        "WEBSITES_PORT=5000"
      ]),
      correctAnswer: 3,
      explanation: "WEBSITES_PORT est la variable spécifique qu'App Service lit pour savoir vers quel port du container rediriger le trafic HTTP entrant. Sans cette variable, App Service tente le port 80 puis 8080 par défaut.",
    },
    {
      unitId: u3!.id,
      question: "Que se passe-t-il avec les données écrites dans `/home` sur une app scalée à 3 instances, avec WEBSITES_ENABLE_APP_SERVICE_STORAGE=true ?",
      options: JSON.stringify([
        "Chaque instance a son propre /home isolé — les données ne sont pas partagées",
        "Les 3 instances partagent le même /home — toutes lisent et écrivent au même endroit",
        "Seule l'instance primaire écrit dans /home — les autres lisent uniquement",
        "Les données dans /home sont répliquées entre instances toutes les 5 minutes"
      ]),
      correctAnswer: 1,
      explanation: "Avec WEBSITES_ENABLE_APP_SERVICE_STORAGE=true, le répertoire /home est monté depuis un stockage partagé commun à toutes les instances. Cela peut causer des conflits si plusieurs instances écrivent simultanément les mêmes fichiers. Pour les workloads à haute concurrence, Azure Blob Storage avec des noms de fichiers uniques est préférable.",
    },
    {
      unitId: u3!.id,
      question: "Un health check App Service envoie des pings toutes les minutes. Après combien d'échecs consécutifs l'instance est-elle retirée du load balancer ?",
      options: JSON.stringify([
        "3 échecs",
        "5 échecs",
        "10 échecs",
        "20 échecs"
      ]),
      correctAnswer: 2,
      explanation: "App Service retire une instance du load balancer après 10 pings échoués consécutifs. Si l'instance reste unhealthy pendant une période prolongée, App Service peut la remplacer. L'endpoint /health doit retourner HTTP 200 pour être considéré sain.",
    },
    {
      unitId: u3!.id,
      question: "Pourquoi Always-on est recommandé pour les apps qui chargent des modèles ML au démarrage ?",
      options: JSON.stringify([
        "Always-on accélère le chargement des modèles via un cache Azure",
        "Always-on désactive le garbage collector pour maintenir les modèles en mémoire",
        "Sans Always-on, l'app entre en veille après ~20 min d'inactivité — le prochain cold start inclut le rechargement du modèle, pouvant prendre plusieurs minutes",
        "Always-on pré-charge les modèles ML dans Azure CDN pour une distribution plus rapide"
      ]),
      correctAnswer: 2,
      explanation: "Les modèles ML peuvent peser plusieurs GB et prendre 2-5 minutes à charger. Sans Always-on, ce cold start se produit à chaque période d'inactivité (~20 min). Always-on maintient l'app active en permanence via des pings périodiques — le modèle reste chargé en mémoire.",
    },
  ]});
  console.log("✅ Unité 3 — 5 questions");

  // ===== UNITÉ 4 — Settings =====
  const u4 = await prisma.unit.findUnique({ where: { slug: "appservice-settings" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u4!.id,
      question: "Pourquoi les Connection Strings (type SQLAzure, MySQL, etc.) sont-elles moins recommandées pour Python que pour .NET ?",
      options: JSON.stringify([
        "Python ne supporte pas la lecture des variables d'environnement avec préfixes",
        "App Service n'injecte pas les Connection Strings dans les containers Linux",
        "Le préfixe automatique (SQLAZURECONNSTR_, MYSQLCONNSTR_...) ajoute de la complexité sans bénéfice — Python ne cherche pas ces préfixes",
        "Les Connection Strings sont chiffrées différemment pour Python"
      ]),
      correctAnswer: 2,
      explanation: "App Service préfixe automatiquement les Connection Strings (SQLAZURECONNSTR_ pour SQLAzure, etc.). .NET/Entity Framework cherche ces préfixes nativement. Python lit os.environ.get('MA_VAR') — le préfixe inattendu complique le code. Pour Python, utilise une simple App Setting avec le nom exact que tu veux.",
    },
    {
      unitId: u4!.id,
      question: "Tu fais un swap staging → production. `ENVIRONMENT=staging` était configuré comme Slot Setting sur le slot staging. Qu'est-ce qui se passe après le swap ?",
      options: JSON.stringify([
        "La prod reçoit ENVIRONMENT=staging — le slot setting suit le code",
        "La prod garde ENVIRONMENT=production — le slot setting reste attaché au slot, pas au code",
        "Les deux slots ont ENVIRONMENT=staging après le swap",
        "Le Slot Setting est supprimé lors du swap — il faut le reconfigurer"
      ]),
      correctAnswer: 1,
      explanation: "C'est exactement l'utilité des Slot Settings : ils restent attachés au slot, pas au code swappé. Après le swap, le slot production garde ENVIRONMENT=production, le slot staging garde ENVIRONMENT=staging. Le code a changé de slot, mais chaque slot conserve sa propre configuration.",
    },
    {
      unitId: u4!.id,
      question: "Une Key Vault Reference dans App Service est configurée sans numéro de version dans l'URI (`/secrets/api-key` sans `/<version>`). Comment App Service gère-t-il la rotation du secret ?",
      options: JSON.stringify([
        "App Service ne supporte pas la rotation automatique — il faut spécifier une version fixe",
        "La rotation est immédiate — App Service vérifie le secret à chaque requête",
        "App Service récupère toujours la dernière version et rafraîchit dans les 24h (ou immédiatement au prochain redémarrage)",
        "App Service utilise le secret au moment du déploiement et ne le met jamais à jour"
      ]),
      correctAnswer: 2,
      explanation: "Sans version dans l'URI, App Service résout toujours vers la dernière version du secret. Le refresh se fait dans les 24h après une rotation, ou immédiatement lors du prochain redémarrage de l'app. C'est pourquoi il est recommandé de ne pas spécifier de version — la rotation devient automatique.",
    },
    {
      unitId: u4!.id,
      question: "Quels prérequis sont nécessaires pour utiliser une Key Vault Reference dans App Service ?",
      options: JSON.stringify([
        "Un App Service Plan Premium et un Key Vault dans la même région",
        "Une managed identity activée sur la web app, avec le rôle 'Key Vault Secrets User' sur le Key Vault",
        "Un certificat SSL configuré sur la web app et le Key Vault en accès public",
        "Une connexion VNet entre App Service et Key Vault"
      ]),
      correctAnswer: 1,
      explanation: "Pour les Key Vault References : (1) activer une managed identity sur la web app, (2) assigner à cette identité le rôle 'Key Vault Secrets User' sur le Key Vault, (3) utiliser la syntaxe @Microsoft.KeyVault(...) dans la valeur de l'App Setting. App Service résout alors le secret et l'injecte comme variable d'environnement normale.",
    },
    {
      unitId: u4!.id,
      question: "Comment exporter tous les App Settings d'une web app pour les modifier en masse puis les réimporter ?",
      options: JSON.stringify([
        "az webapp config appsettings export → modifier le fichier → az webapp config appsettings import",
        "az webapp config appsettings list --output json > settings.json → modifier → az webapp config appsettings set --settings @settings.json",
        "Portail Azure → Configuration → Download → modifier → Upload",
        "az webapp backup create --include-configuration → az webapp backup restore"
      ]),
      correctAnswer: 1,
      explanation: "La commande 'list --output json' exporte les settings dans un tableau JSON avec name, value et slotSetting. Après modification, 'set --settings @settings.json' réimporte le fichier. Le @ indique à Azure CLI de lire depuis un fichier plutôt qu'une chaîne de caractères.",
    },
  ]});
  console.log("✅ Unité 4 — 5 questions");

  // ===== UNITÉ 5 — Diagnostics =====
  const u5 = await prisma.unit.findUnique({ where: { slug: "appservice-diagnostics" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u5!.id,
      question: "Quelle est la limitation fondamentale de Kudu (SCM) pour débugger un container App Service ?",
      options: JSON.stringify([
        "Kudu ne peut afficher que les 1000 dernières lignes de logs",
        "Kudu n'est pas disponible sur les tiers inférieurs à Standard",
        "Kudu tourne dans un environnement séparé du container — impossible de voir le filesystem du container ou ses processus internes",
        "Kudu nécessite SSH pour fonctionner et n'est pas disponible sans cette configuration"
      ]),
      correctAnswer: 2,
      explanation: "C'est la limite la plus importante à retenir : Kudu est un site séparé de ta web app. Il accède à /home (stockage partagé) mais PAS au filesystem interne du container ni aux processus qui tournent dedans. Pour l'inspection interne du container, il faut activer SSH (port 2222).",
    },
    {
      unitId: u5!.id,
      question: "Quelle commande CLI permet de voir les logs du container en temps réel ?",
      options: JSON.stringify([
        "az webapp log tail",
        "az webapp log stream --live",
        "az container logs --follow",
        "az webapp diagnostics stream"
      ]),
      correctAnswer: 0,
      explanation: "az webapp log tail streame les nouveaux logs en temps réel depuis App Service. Pour une app scalée, affiche les logs de toutes les instances avec un préfixe d'identification. Ctrl+C pour arrêter. Équivalent dans le portail : Monitoring → Log stream.",
    },
    {
      unitId: u5!.id,
      question: "Ton container démarre mais retourne 404 sur toutes les routes. Quelle est la première cause à vérifier ?",
      options: JSON.stringify([
        "Le health check est mal configuré et bloque le trafic",
        "L'image dans ACR est corrompue — il faut rebuilder",
        "L'application écoute sur localhost (127.0.0.1) au lieu de 0.0.0.0, ou WEBSITES_PORT ne correspond pas au port réel",
        "Le certificat SSL de la web app a expiré"
      ]),
      correctAnswer: 2,
      explanation: "Un container qui écoute sur localhost ne reçoit pas les requêtes externes — App Service ne peut pas router le trafic vers lui. L'app doit binder sur 0.0.0.0. Autre cause fréquente : WEBSITES_PORT mal configuré. Ces deux erreurs causent un 404 même si le container tourne correctement.",
    },
    {
      unitId: u5!.id,
      question: "Pour configurer SSH dans un container App Service, quels sont les deux paramètres obligatoires dans le Dockerfile ?",
      options: JSON.stringify([
        "Port SSH = 22 et mot de passe root = 'Azure!'",
        "Port SSH = 2222 et mot de passe root = 'Docker!'",
        "Port SSH = 2222 et clé SSH publique dans /root/.ssh/authorized_keys",
        "Port SSH = 22 et certificat SSL App Service monté dans /etc/ssh/"
      ]),
      correctAnswer: 1,
      explanation: "App Service exige exactement ces deux paramètres : le serveur SSH doit écouter sur le port 2222 (pas 22) et le mot de passe root doit être 'Docker!' (exact, avec majuscule et point d'exclamation). Ce sont des contraintes imposées par la plateforme App Service pour l'accès SSH.",
    },
    {
      unitId: u5!.id,
      question: "Tu veux envoyer les logs App Service vers Log Analytics pour créer des alertes sur les erreurs. Quelle est la bonne approche ?",
      options: JSON.stringify([
        "az webapp log config --destination log-analytics --workspace <id>",
        "az monitor diagnostic-settings create avec les catégories AppServiceConsoleLogs et AppServiceHTTPLogs",
        "az webapp update --log-analytics-workspace <id>",
        "Configurer Azure Monitor directement dans le Dockerfile avec une variable d'environnement"
      ]),
      correctAnswer: 1,
      explanation: "az monitor diagnostic-settings create permet de router les logs App Service vers Log Analytics. Les catégories disponibles incluent AppServiceConsoleLogs (stdout/stderr), AppServiceHTTPLogs (requêtes HTTP), AppServicePlatformLogs (événements cycle de vie). Une fois dans Log Analytics, tu peux écrire des requêtes Kusto et créer des alertes.",
    },
  ]});
  console.log("✅ Unité 5 — 5 questions");

  console.log("\n🎉 Tous les quiz App Service refaits — 25 questions au total, réponses bien réparties.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
