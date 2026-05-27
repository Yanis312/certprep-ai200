import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const mod = await prisma.module.findUnique({ where: { slug: "app-service-containers" } });
  if (!mod) throw new Error("Module app-service-containers introuvable");

  // ── UNITÉ LAB ──────────────────────────────────────────────────────────────
  let lab = await prisma.unit.findUnique({ where: { slug: "appservice-lab" } });
  if (!lab) {
    lab = await prisma.unit.create({
      data: { slug: "appservice-lab", title: "Lab — Deploy a container to Azure App Service", order: 6, isLab: true, moduleId: mod.id },
    });
  } else {
    await prisma.question.deleteMany({ where: { unitId: lab.id } });
  }

  await prisma.question.createMany({ data: [
    {
      unitId: lab.id,
      question: "Dans le lab, pourquoi assigne-t-on le rôle AcrPull à la managed identity plutôt que d'utiliser les admin credentials de l'ACR ?",
      options: JSON.stringify([
        "Les admin credentials ne fonctionnent pas avec App Service",
        "AcrPull est moins cher que les admin credentials",
        "Pour éliminer les credentials stockés dans la config — la managed identity s'authentifie automatiquement sans mot de passe",
        "Les admin credentials nécessitent une rotation mensuelle obligatoire"
      ]),
      correctAnswer: 2,
      explanation: "La managed identity + AcrPull élimine tout stockage de credentials. App Service s'authentifie auprès d'ACR via l'identité Azure — sans username, sans password dans les App Settings. Si la web app est supprimée, l'accès est automatiquement révoqué.",
    },
    {
      unitId: lab.id,
      question: "Quelle commande active la system-assigned managed identity sur une web app App Service ?",
      options: JSON.stringify([
        "az webapp identity assign --resource-group myRG --name myApp",
        "az identity create --resource-group myRG --name myApp-identity",
        "az webapp config identity --enable --resource-group myRG --name myApp",
        "az managed-identity assign --webapp myApp --resource-group myRG"
      ]),
      correctAnswer: 0,
      explanation: "az webapp identity assign active la system-assigned managed identity sur la web app. La commande retourne un JSON avec le principalId — nécessaire pour l'étape suivante (az role assignment create --assignee <principalId>).",
    },
    {
      unitId: lab.id,
      question: "Dans le lab, `az appservice plan create --is-linux --sku B1` — pourquoi ces deux flags sont-ils obligatoires ?",
      options: JSON.stringify([
        "--is-linux pour activer Docker, --sku B1 pour activer les containers",
        "--is-linux car les containers Linux sont requis pour Web App for Containers, --sku B1 car Free/Shared ne supportent pas la managed identity ni les containers custom",
        "--is-linux pour réduire les coûts, --sku B1 car c'est le seul tier compatible avec ACR",
        "--is-linux pour activer SSH, --sku B1 pour activer le déploiement continu"
      ]),
      correctAnswer: 1,
      explanation: "--is-linux crée un plan pour containers Linux (Web App for Containers est Linux uniquement). --sku B1 (Basic) est le tier minimal qui supporte les containers custom avec managed identity. Les tiers Free et Shared ne supportent ni les containers custom ni Always-on.",
    },
    {
      unitId: lab.id,
      question: "⭐ Microsoft — Une image container écoute sur le port 8000. Après déploiement sur App Service, les requêtes retournent des erreurs de connexion. Quelle config résout le problème ?",
      options: JSON.stringify([
        "Modifier le Dockerfile pour utiliser EXPOSE 80",
        "Activer le protocole HTTP/2 dans les paramètres de la plateforme",
        "Configurer WEBSITES_PORT=8000 dans les App Settings",
        "Redéployer l'image avec un tag différent"
      ]),
      correctAnswer: 2,
      explanation: "App Service route le trafic vers les ports 80 ou 8080 par défaut. Si le container écoute sur un autre port (ici 8000), il faut configurer WEBSITES_PORT=8000 dans les App Settings. EXPOSE dans le Dockerfile est une documentation, pas une configuration d'App Service.",
    },
    {
      unitId: lab.id,
      question: "⭐ Microsoft — Un développeur doit vérifier que les App Settings sont correctement injectés dans le container. Quel outil fournit cette information ?",
      options: JSON.stringify([
        "La page Environment de la console Kudu (SCM)",
        "Le log stream dans le portail Azure",
        "Le dashboard de métriques App Service",
        "La commande az webapp config appsettings list"
      ]),
      correctAnswer: 0,
      explanation: "La console Kudu (https://<app>.scm.azurewebsites.net/Env) affiche TOUTES les variables d'environnement injectées dans le container, y compris les App Settings et les variables système Azure. C'est l'outil de référence pour vérifier que les settings arrivent bien jusqu'au container.",
    },
  ]});
  console.log("✅ Lab App Service — 5 questions");

  // ── QUESTIONS SUPPLÉMENTAIRES sur les unités existantes ───────────────────
  const u2 = await prisma.unit.findUnique({ where: { slug: "appservice-deploy" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u2!.id,
      question: "⭐ Microsoft — Après un déploiement App Service, les requêtes retournent 404. Le container démarre correctement. Quelle est la cause la plus probable ?",
      options: JSON.stringify([
        "L'image est trop volumineuse pour App Service",
        "Le certificat SSL de l'app a expiré",
        "L'application écoute sur localhost au lieu de 0.0.0.0, ou WEBSITES_PORT est incorrect",
        "Le health check bloque le trafic entrant"
      ]),
      correctAnswer: 2,
      explanation: "Un container qui bind sur localhost (127.0.0.1) ne reçoit pas les connexions externes d'App Service. Il faut binder sur 0.0.0.0. Autre cause fréquente : WEBSITES_PORT qui ne correspond pas au port réel écouté par le container.",
    },
    {
      unitId: u2!.id,
      question: "Pour GitHub Container Registry, quelle server URL faut-il utiliser avec `az webapp create --docker-registry-server-url` ?",
      options: JSON.stringify([
        "https://docker.github.io",
        "https://registry.github.com",
        "https://ghcr.io",
        "https://packages.github.com"
      ]),
      correctAnswer: 2,
      explanation: "GitHub Container Registry utilise https://ghcr.io comme URL de registry. Docker Hub utilise https://index.docker.io/v1/. ACR utilise https://<nom>.azurecr.io.",
    },
  ]});
  console.log("✅ Unité 2 — 2 questions supplémentaires");

  const u3 = await prisma.unit.findUnique({ where: { slug: "appservice-runtime" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u3!.id,
      question: "⭐ Microsoft — Une app de traitement de documents écrit des fichiers output pendant le traitement. Après un redémarrage du container, les fichiers sont perdus. Comment configurer App Service pour les persister ?",
      options: JSON.stringify([
        "Utiliser une image plus grande avec plus d'espace disque",
        "Activer Always-on pour éviter les redémarrages",
        "Activer WEBSITES_ENABLE_APP_SERVICE_STORAGE=true et écrire les fichiers dans /home",
        "Configurer un Azure Blob Storage dans le Dockerfile"
      ]),
      correctAnswer: 2,
      explanation: "Par défaut, le filesystem du container est éphémère — perdu au redémarrage. WEBSITES_ENABLE_APP_SERVICE_STORAGE=true monte /home comme stockage persistant partagé entre toutes les instances. L'application doit écrire dans /home/ (ex: /home/output/) pour que les fichiers survivent aux redémarrages.",
    },
    {
      unitId: u3!.id,
      question: "⭐ Microsoft — Les health checks échouent et App Service retire des instances du load balancer. L'app a un endpoint /healthz qui retourne HTTP 200. Quelle est la cause la plus probable ?",
      options: JSON.stringify([
        "Les health checks nécessitent HTTPS mais le container ne sert que HTTP",
        "Le container manque de mémoire pour gérer les requêtes health check",
        "Le port configuré pour les health checks ne correspond pas au port du container",
        "Le chemin configuré dans App Service (/health) ne correspond pas au chemin réel de l'app (/healthz)"
      ]),
      correctAnswer: 3,
      explanation: "App Service envoie les pings de health check vers le chemin configuré. Si App Service est configuré pour /health mais que l'app répond sur /healthz, les pings reçoivent un 404 → App Service considère l'instance comme unhealthy. La config et le code doivent utiliser exactement le même chemin.",
    },
  ]});
  console.log("✅ Unité 3 — 2 questions supplémentaires");

  const u4 = await prisma.unit.findUnique({ where: { slug: "appservice-settings" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u4!.id,
      question: "⭐ Microsoft — Une app production nécessite des URLs d'endpoints API différentes pour staging et production. Comment éviter que l'URL staging swap vers la production ?",
      options: JSON.stringify([
        "Stocker l'URL dans l'image container pour chaque environnement",
        "Utiliser des Connection Strings au lieu des App Settings pour les URLs",
        "Configurer API_ENDPOINT comme Slot Setting",
        "Créer deux App Service Plans distincts pour staging et production"
      ]),
      correctAnswer: 2,
      explanation: "Un Slot Setting reste attaché au slot lors d'un swap — il ne suit pas le code. En configurant API_ENDPOINT comme Slot Setting sur chaque slot (staging et production), chaque slot garde sa propre URL après le swap. Le code change de slot, la config reste.",
    },
    {
      unitId: u4!.id,
      question: "Tu configures `LOG_LEVEL=DEBUG` en tant que Slot Setting sur le slot staging. En production, LOG_LEVEL=WARNING aussi en Slot Setting. Après un swap staging → production, que vaut LOG_LEVEL en production ?",
      options: JSON.stringify([
        "DEBUG — la valeur de staging a suivi le code swappé",
        "WARNING — le Slot Setting est resté attaché au slot production",
        "La variable est supprimée — les Slot Settings ne survivent pas au swap",
        "Ça dépend de l'ordre dans lequel le swap a été effectué"
      ]),
      correctAnswer: 1,
      explanation: "Les Slot Settings restent sur leur slot. Après le swap : la production garde WARNING (son Slot Setting), le staging garde DEBUG (son Slot Setting). Le code de staging est maintenant en production, mais chaque slot a conservé sa propre valeur de Slot Setting.",
    },
  ]});
  console.log("✅ Unité 4 — 2 questions supplémentaires");

  const u5 = await prisma.unit.findUnique({ where: { slug: "appservice-diagnostics" } });
  await prisma.question.createMany({ data: [
    {
      unitId: u5!.id,
      question: "Tu veux envoyer les logs App Service vers Log Analytics pour créer des alertes sur les erreurs. Quelle commande utilises-tu ?",
      options: JSON.stringify([
        "az webapp log config --destination log-analytics",
        "az webapp update --log-analytics-workspace <id>",
        "az monitor diagnostic-settings create avec les catégories AppServiceConsoleLogs",
        "az monitor log-analytics workspace link --webapp <app>"
      ]),
      correctAnswer: 2,
      explanation: "az monitor diagnostic-settings create configure le routage des logs App Service vers Log Analytics. Tu spécifies les catégories souhaitées : AppServiceConsoleLogs (stdout/stderr), AppServiceHTTPLogs (requêtes), AppServicePlatformLogs (lifecycle). Une fois dans Log Analytics, tu écris des requêtes Kusto et crées des alertes.",
    },
    {
      unitId: u5!.id,
      question: "Quelle est l'URL pour accéder aux variables d'environnement de ton app via Kudu ?",
      options: JSON.stringify([
        "https://<app>.azurewebsites.net/admin/env",
        "https://<app>.scm.azurewebsites.net/Env",
        "https://<app>.kudu.azure.com/environment",
        "https://<app>.azurewebsites.net/diagnostics/env"
      ]),
      correctAnswer: 1,
      explanation: "L'URL Kudu (SCM) est toujours https://<app>.scm.azurewebsites.net. La page /Env affiche toutes les variables d'environnement injectées dans le container — tes App Settings + les variables système Azure (WEBSITE_HOSTNAME, etc.).",
    },
  ]});
  console.log("✅ Unité 5 — 2 questions supplémentaires");

  console.log("\n🎉 Lab + questions supplémentaires ajoutés. Module App Service complet.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
