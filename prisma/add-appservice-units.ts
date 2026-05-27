import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const mod = await prisma.module.findUnique({ where: { slug: "app-service-containers" } });
  if (!mod) throw new Error("Module app-service-containers introuvable");

  const units = [
    {
      slug: "appservice-deploy",
      title: "Unité 2 — Déployer des containers sur App Service",
      order: 2,
      questions: [
        {
          question: "Quelle est la différence entre system-assigned et user-assigned managed identity pour App Service ?",
          options: ["System-assigned : indépendante de l'app, réutilisable. User-assigned : liée au cycle de vie de l'app", "System-assigned : liée au cycle de vie de l'app, supprimée avec elle. User-assigned : ressource indépendante, assignable à plusieurs apps", "Elles sont identiques — deux noms pour la même fonctionnalité", "System-assigned est gratuite, user-assigned est payante"],
          correctAnswer: 1,
          explanation: "System-assigned identity est créée et supprimée avec la web app — simple pour un seul service. User-assigned identity existe indépendamment — idéal quand plusieurs apps partagent le même accès à un registry ACR.",
        },
        {
          question: "Tu pushes une nouvelle image avec le tag `latest` dans ACR. App Service met-il à jour le container automatiquement ?",
          options: ["Oui — App Service surveille les changements de tags en continu", "Non — App Service ne détecte pas le changement si le tag est identique. Il faut redémarrer manuellement ou activer le CD avec une webhook", "Oui — mais seulement avec le tier Premium", "Non — il faut toujours changer le tag pour déclencher une mise à jour"],
          correctAnswer: 1,
          explanation: "App Service ne poll pas le registry en continu. Avec le même tag, il ne sait pas que le contenu a changé. Solution : soit changer de tag (v1 → v2), soit activer le déploiement continu (webhook ACR → App Service restart).",
        },
        {
          question: "Quel rôle Azure doit avoir la managed identity pour qu'App Service puisse puller des images depuis ACR ?",
          options: ["AcrAdmin", "AcrPull", "Contributor", "Reader"],
          correctAnswer: 1,
          explanation: "AcrPull est le rôle minimal requis — il permet uniquement de télécharger (pull) des images. AcrAdmin donne trop de permissions. Contributor et Reader sont des rôles génériques Azure, pas spécifiques à ACR.",
        },
      ],
    },
    {
      slug: "appservice-runtime",
      title: "Unité 3 — Configurer le runtime du container",
      order: 3,
      questions: [
        {
          question: "Ton container Flask écoute sur le port 8000. Quelle app setting dois-tu configurer sur App Service ?",
          options: ["APP_PORT=8000", "WEBSITES_PORT=8000", "DOCKER_PORT=8000", "CONTAINER_PORT=8000"],
          correctAnswer: 1,
          explanation: "WEBSITES_PORT est la variable spécifique qu'App Service lit pour savoir vers quel port du container rediriger le trafic HTTP. Sans cette variable, App Service essaie le port 80 ou 8080 par défaut.",
        },
        {
          question: "Qu'est-ce que `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true` active sur App Service ?",
          options: ["Le stockage Azure Blob pour les uploads", "Le montage de `/home` en stockage persistant — partagé entre toutes les instances et survivant aux redémarrages", "Le stockage des logs dans Azure Storage", "L'accès au filesystem du container en mode lecture/écriture"],
          correctAnswer: 1,
          explanation: "Par défaut, tout ce qu'un container écrit est perdu au redémarrage. WEBSITES_ENABLE_APP_SERVICE_STORAGE=true monte /home comme stockage persistant. Toutes les instances d'une app scalée partagent ce /home — utile pour logs et fichiers partagés.",
        },
        {
          question: "Always-on est nécessaire pour quel cas d'usage ? Et quel tier minimum est requis ?",
          options: ["Pour les déploiements continus — requis sur tous les tiers", "Pour éviter les cold starts en maintenant l'app active en permanence — requis sur Basic minimum", "Pour activer le SSL/TLS — requis sur Standard minimum", "Pour les health checks — requis sur Premium minimum"],
          correctAnswer: 1,
          explanation: "Sans Always-on, l'app est mise en veille après ~20 minutes d'inactivité. La prochaine requête déclenche un cold start (démarrage du container). Always-on envoie des pings périodiques pour maintenir l'app chaude. Disponible à partir du tier Basic.",
        },
      ],
    },
    {
      slug: "appservice-settings",
      title: "Unité 4 — Configurer les App Settings",
      order: 4,
      questions: [
        {
          question: "Pourquoi les Connection Strings avec type SQLAzure sont-elles moins recommandées pour Python que pour .NET ?",
          options: ["Python ne supporte pas les connexions SQL Azure", "Le préfixe automatique (SQLAZURECONNSTR_) ajoute de la complexité sans bénéfice pour les frameworks qui n'attendent pas ce format", "Les Connection Strings ne sont pas chiffrées pour Python", "Python requiert le type Custom à la place"],
          correctAnswer: 1,
          explanation: "App Service préfixe automatiquement les Connection Strings (SQLAZURECONNSTR_, MYSQLCONNSTR_...). Ce comportement est pensé pour .NET qui cherche ces préfixes. Pour Python ou Node.js, une simple app setting avec le nom que tu veux est plus claire et plus simple.",
        },
        {
          question: "Qu'est-ce qu'un Slot Setting et pourquoi est-il important lors d'un swap staging → production ?",
          options: ["Un setting chiffré avec une clé différente par slot", "Un setting qui reste attaché au slot et ne swap pas avec le code — essentiel pour les identifiants d'environnement", "Un setting disponible uniquement dans le tier Standard et supérieur", "Un setting synchronisé entre tous les slots automatiquement"],
          correctAnswer: 1,
          explanation: "Sans Slot Setting, un swap échangerait aussi ENVIRONMENT=production et ENVIRONMENT=staging — la prod se retrouverait avec la config staging. Les Slot Settings restent sur leur slot — après le swap, chaque slot garde ses propres valeurs d'environnement.",
        },
        {
          question: "Comment fonctionne une Key Vault Reference dans App Service ? Quel est l'avantage pour l'application ?",
          options: ["L'app doit appeler Key Vault SDK au démarrage pour récupérer les secrets", "App Service résout la référence et injecte la valeur comme variable d'env normale — l'app ne sait pas que la valeur vient de Key Vault", "La référence expose l'URI Key Vault directement à l'application", "L'app reçoit un token Azure pour appeler Key Vault elle-même"],
          correctAnswer: 1,
          explanation: "Avec la syntaxe @Microsoft.KeyVault(...), App Service résout le secret et l'injecte comme variable d'environnement classique. L'application lit os.environ.get('API_KEY') normalement — zéro changement de code. La rotation est automatique (refresh dans les 24h).",
        },
      ],
    },
    {
      slug: "appservice-diagnostics",
      title: "Unité 5 — Observer et dépanner les containers",
      order: 5,
      questions: [
        {
          question: "Quelle commande CLI permet de voir les logs du container en temps réel ?",
          options: ["az webapp log show --live", "az webapp log tail", "az container logs --follow", "az webapp diagnostics stream"],
          correctAnswer: 1,
          explanation: "az webapp log tail streame les nouveaux logs en temps réel. Équivalent au 'Log stream' dans le portail Azure. Ctrl+C pour arrêter. Pour une app scalée, affiche les logs de toutes les instances avec leurs identifiants.",
        },
        {
          question: "Quelle est la limitation principale de Kudu (SCM) pour le troubleshooting de containers ?",
          options: ["Kudu n'est pas disponible sur le tier Basic", "Kudu n'est pas le même environnement que le container — impossible de voir le filesystem du container ou ses processus", "Kudu ne peut afficher que les 100 dernières lignes de logs", "Kudu nécessite SSH pour fonctionner"],
          correctAnswer: 1,
          explanation: "Kudu tourne comme un site séparé de ta web app. Il accède à /home (stockage partagé) mais pas au filesystem interne du container. Pour inspecter des processus ou fichiers dans le container, il faut activer SSH (port 2222, mot de passe root: Docker!).",
        },
        {
          question: "⭐ Microsoft — Une app déployée renvoie 404 après déploiement mais le container semble démarrer. Quelle est la cause la plus probable ?",
          options: ["L'image a été corrompue lors du push dans ACR", "Le container écoute sur localhost au lieu de 0.0.0.0, ou WEBSITES_PORT est incorrect", "Le DNS de l'app n'est pas encore propagé", "Le health check échoue et retire l'instance du load balancer"],
          correctAnswer: 1,
          explanation: "Si un container écoute sur localhost (127.0.0.1), il ne reçoit pas les requêtes venues de l'extérieur. Il faut bind sur 0.0.0.0 pour accepter les connexions externes. Autre cause fréquente : WEBSITES_PORT ne correspond pas au port réel du container.",
        },
      ],
    },
  ];

  for (const u of units) {
    const existing = await prisma.unit.findUnique({ where: { slug: u.slug } });
    if (existing) {
      console.log(`Unité ${u.slug} déjà présente — skip.`);
      continue;
    }
    const unit = await prisma.unit.create({
      data: { slug: u.slug, title: u.title, order: u.order, isLab: false, moduleId: mod.id },
    });
    await prisma.question.createMany({
      data: u.questions.map((q) => ({
        unitId: unit.id,
        question: q.question,
        options: JSON.stringify(q.options),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    });
    console.log(`✓ ${u.title} — ${u.questions.length} questions`);
  }

  console.log("Module App Service complet !");
}

main().catch(console.error).finally(() => prisma.$disconnect());
