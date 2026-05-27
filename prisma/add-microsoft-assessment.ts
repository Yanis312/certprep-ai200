import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.unit.findUnique({ where: { slug: "acr-tasks-unit" } });
  const tagVersion = await prisma.unit.findUnique({ where: { slug: "acr-tag-version" } });
  const lab = await prisma.unit.findUnique({ where: { slug: "acr-lab-tasks" } });

  if (!tasks) throw new Error("Unité acr-tasks introuvable");
  if (!tagVersion) throw new Error("Unité acr-tag-version introuvable");
  if (!lab) throw new Error("Unité acr-lab-tasks introuvable");

  // Q1 + Q3 → ACR Tasks unit
  await prisma.question.createMany({
    data: [
      {
        unitId: tasks.id,
        question: "⭐ Microsoft — Ton équipe build les images sur les postes des développeurs, ce qui donne des résultats incohérents. Quelle fonctionnalité ACR résout ce problème ?",
        options: JSON.stringify([
          "ACR Tasks quick build",
          "Geo-replication",
          "Repository namespaces"
        ]),
        correctAnswer: 0,
        explanation: "ACR Tasks quick build (az acr build) exécute le build dans le cloud Azure, dans un environnement standardisé et contrôlé. Tous les membres de l'équipe obtiennent exactement le même résultat, peu importe leur machine locale.",
      },
      {
        unitId: tasks.id,
        question: "⭐ Microsoft — Ton application IA dépend d'une image de base contenant PyTorch. Tu veux que ton image se rebuilde automatiquement quand PyTorch publie des patches de sécurité. Quel type de trigger ACR Tasks faut-il utiliser ?",
        options: JSON.stringify([
          "Base image update trigger",
          "Source code commit trigger",
          "Scheduled trigger"
        ]),
        correctAnswer: 0,
        explanation: "Le base image update trigger surveille l'image de base (ici PyTorch) dans le registry. Quand une nouvelle version est publiée, ACR Tasks rebuild automatiquement toutes les images qui en dépendent — sans intervention manuelle.",
      },
    ],
  });

  // Q2 + Q4 → Tags & versioning unit
  await prisma.question.createMany({
    data: [
      {
        unitId: tagVersion.id,
        question: "⭐ Microsoft — Tu dois déployer une image en production et t'assurer que tous les nœuds Kubernetes tournent exactement la même version, même si quelqu'un pushe une nouvelle image avec le même tag. Comment référencer l'image ?",
        options: JSON.stringify([
          "Par manifest digest (sha256:...)",
          "Par le tag latest",
          "Par un tag de version sémantique comme v1.0.0"
        ]),
        correctAnswer: 0,
        explanation: "Un tag comme v1.0.0 ou latest peut être réassigné à une nouvelle image à tout moment. Le manifest digest (sha256:abc123...) est calculé depuis le contenu exact de l'image et est immuable — tous les nœuds téléchargeront exactement la même image, même si le tag change.",
      },
      {
        unitId: tagVersion.id,
        question: "⭐ Microsoft — Tu implémentes une stratégie de tags pour la production. Tes besoins : traçabilité jusqu'au commit Git et capacité de rollback vers n'importe quelle version précédente. Quel pattern choisir ?",
        options: JSON.stringify([
          "Tags uniques avec le SHA du commit Git",
          "Tags stables comme v1 et v2",
          "Uniquement le tag latest"
        ]),
        correctAnswer: 0,
        explanation: "Les tags avec SHA de commit (ex: myapi:a3f8c2d) sont uniques et immuables — chaque commit produit un tag différent. Tu peux identifier exactement quel code est dans quelle image, et faire un rollback précis vers n'importe quel commit. Les tags stables (v1) peuvent être réassignés, latest ne permet aucun rollback.",
      },
    ],
  });

  // Q5 → Lab unit
  await prisma.question.createMany({
    data: [
      {
        unitId: lab.id,
        question: "⭐ Microsoft — Tu as déployé une API d'inférence critique en production et tu dois empêcher que l'image soit accidentellement supprimée ou modifiée. Quelle fonctionnalité ACR utiliser ?",
        options: JSON.stringify([
          "Image locking avec write-enabled false",
          "Repository namespaces",
          "Geo-replication"
        ]),
        correctAnswer: 0,
        explanation: "az acr repository update --write-enabled false verrouille l'image en lecture seule. Toute tentative de push ou de suppression est refusée. C'est exactement ce qu'on a fait dans le lab sur inference-api:v1.0.0 — writeEnabled: false confirmé dans la sortie.",
      },
    ],
  });

  console.log("Questions Microsoft ajoutées : 2 dans acr-tasks, 2 dans acr-tag-version, 1 dans acr-lab-tasks.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
