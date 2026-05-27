import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.module.findUnique({ where: { slug: "app-service-containers" } });
  if (existing) {
    console.log("Module déjà présent.");
    return;
  }

  const mod = await prisma.module.create({
    data: {
      slug: "app-service-containers",
      title: "Deploy containers to Azure App Service",
      description: "Déployer et configurer des containers sur App Service — settings, diagnostics, scaling",
      category: "AI-200",
      order: 2,
    },
  });

  const intro = await prisma.unit.create({
    data: {
      slug: "appservice-introduction",
      title: "Unité 1 — Introduction à Azure App Service pour containers",
      order: 1,
      isLab: false,
      moduleId: mod.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: intro.id,
        question: "Quel est l'avantage principal d'Azure App Service pour les containers par rapport à une VM ?",
        options: JSON.stringify([
          "App Service est moins cher qu'une VM dans tous les cas",
          "App Service est une plateforme managée — pas besoin de gérer l'infrastructure sous-jacente",
          "App Service supporte uniquement les containers Linux",
          "App Service inclut Docker automatiquement sur la machine du développeur"
        ]),
        correctAnswer: 1,
        explanation: "Azure App Service est une plateforme PaaS (Platform as a Service) — tu apportes ton image container et Azure gère le système d'exploitation, les patches, la disponibilité et le scaling. Aucune gestion d'infrastructure requise.",
      },
      {
        unitId: intro.id,
        question: "Dans le scénario du module, pourquoi l'équipe utilise-t-elle des variables d'environnement plutôt que de rebuilder l'image pour chaque environnement ?",
        options: JSON.stringify([
          "Docker ne supporte pas le rebuild multiple",
          "Pour éviter de reconstruire l'image à chaque changement de config — une même image tourne partout avec des configs différentes",
          "Les variables d'environnement sont obligatoires sur App Service",
          "Pour réduire la taille de l'image Docker"
        ]),
        correctAnswer: 1,
        explanation: "Le principe de l'image immuable : on build une seule fois et on déploie partout. La configuration (endpoints de stockage, clés API, niveau de logs) est injectée via des variables d'environnement au runtime — sans toucher à l'image.",
      },
      {
        unitId: intro.id,
        question: "Qu'est-ce qu'un 'cold start' sur Azure App Service ?",
        options: JSON.stringify([
          "Une erreur de démarrage du container due à un Dockerfile incorrect",
          "Le délai de démarrage quand l'app était idle et doit redémarrer, ou quand de nouvelles instances démarrent au scale-out",
          "Le temps de build de l'image Docker dans ACR",
          "Le délai de connexion à la base de données au premier démarrage"
        ]),
        correctAnswer: 1,
        explanation: "Le cold start arrive quand l'app s'est mise en veille (idle) et doit redémarrer, ou quand App Service crée de nouvelles instances pour absorber une charge supplémentaire. Les utilisateurs perçoivent ce délai — c'est un critère de design important pour les apps à fort trafic variable.",
      },
    ],
  });

  console.log(`Module créé : ${mod.title}`);
  console.log(`Unité créée : ${intro.title} — 3 questions`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
