import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const unit = await prisma.unit.findUnique({ where: { slug: "acr-lab-tasks" } });
  if (!unit) throw new Error("Unité acr-lab-tasks introuvable");

  // Supprimer les anciennes questions
  await prisma.question.deleteMany({ where: { unitId: unit.id } });

  await prisma.question.createMany({
    data: [
      {
        unitId: unit.id,
        question: "Pourquoi faut-il exécuter `az provider register --namespace Microsoft.ContainerRegistry` avant de créer un ACR ?",
        options: JSON.stringify([
          "Pour mettre à jour Azure CLI vers la dernière version",
          "Pour activer le service Container Registry sur ta subscription — nouveau sur chaque subscription",
          "Pour créer les permissions administrateur sur le registry",
          "Pour télécharger les images Docker de base"
        ]),
        correctAnswer: 1,
        explanation: "Azure organise ses services en Resource Providers. Une nouvelle subscription n'a pas tous les providers activés par défaut. Il faut enregistrer Microsoft.ContainerRegistry une seule fois avant de pouvoir créer un ACR.",
      },
      {
        unitId: unit.id,
        question: "Dans le lab, pourquoi utilise-t-on `. .env.ps1` (avec un point devant) plutôt que `.\\.env.ps1` ?",
        options: JSON.stringify([
          "C'est une faute de frappe — les deux font la même chose",
          "Le point (dot-sourcing) exécute le script dans le terminal courant, les variables restent disponibles après",
          "Le point permet d'exécuter le script en mode administrateur",
          "C'est requis uniquement sur Windows PowerShell"
        ]),
        correctAnswer: 1,
        explanation: "Sans le dot-sourcing, les variables $env:ACR_NAME, $env:RESOURCE_GROUP disparaissent dès que le script se termine. Le dot-sourcing exécute le script dans le contexte courant — les variables persistent dans ton terminal.",
      },
      {
        unitId: unit.id,
        question: "Quelle commande a été utilisée dans le lab pour builder `inference-api:v1.0.0` sans Docker installé localement ?",
        options: JSON.stringify([
          "docker build -t acrf1450915.azurecr.io/inference-api:v1.0.0 ./api",
          "az acr build --registry $env:ACR_NAME --image inference-api:v1.0.0 ./api",
          "az container build --registry $env:ACR_NAME --image inference-api:v1.0.0",
          "az acr task run --registry $env:ACR_NAME --image inference-api:v1.0.0"
        ]),
        correctAnswer: 1,
        explanation: "az acr build envoie le contexte (./api) vers Azure qui fait le build entièrement dans le cloud. Le Run ID ca1 a été généré et l'image pushée directement dans acrf1450915.azurecr.io sans aucune installation Docker locale.",
      },
      {
        unitId: unit.id,
        question: "Lors du build de v1.1.0, `python:3.11-slim` avait le même digest que pour v1.0.0. Qu'est-ce que ça démontre ?",
        options: JSON.stringify([
          "Les deux images sont identiques — le tag ne change rien",
          "La déduplication des couches — la couche de base était en cache et n'a pas été re-téléchargée",
          "Azure a fait une erreur et n'a pas mis à jour Python",
          "Le digest est le même pour toutes les images basées sur Python"
        ]),
        correctAnswer: 1,
        explanation: "Docker (et ACR) réutilise les couches identiques. python:3.11-slim avait déjà été téléchargée pour v1.0.0. Pour v1.1.0, seules les couches modifiées ont été reconstruites — c'est la déduplication des couches qui rend les builds rapides.",
      },
      {
        unitId: unit.id,
        question: "Dans le lab, quelle est la différence entre le tag `v1.0.0` et le digest `sha256:72d64d59...` ?",
        options: JSON.stringify([
          "Le tag identifie le repository, le digest identifie l'image",
          "Le tag est mutable (peut pointer vers une autre image), le digest est immuable (lié à ce contenu exact pour toujours)",
          "Le digest est créé manuellement, le tag est automatique",
          "Ils sont identiques — deux façons de désigner la même chose"
        ]),
        correctAnswer: 1,
        explanation: "Un tag comme v1.0.0 peut être réassigné — quelqu'un peut pusher une nouvelle image avec le même tag. Le digest sha256:72d64d59... est calculé depuis le contenu de l'image et ne peut jamais changer. En production, déployer via digest garantit qu'on tourne exactement la même image.",
      },
      {
        unitId: unit.id,
        question: "La commande `az acr run --cmd '...inference-api:v1.0.0 python -c ...' /dev/null` — pourquoi `/dev/null` à la fin ?",
        options: JSON.stringify([
          "Pour rediriger les erreurs vers null et les ignorer",
          "Pour indiquer qu'il n'y a pas de fichiers sources à envoyer — l'image est déjà dans le registry",
          "C'est le nom du container à exécuter",
          "Pour exécuter la commande en mode silencieux"
        ]),
        correctAnswer: 1,
        explanation: "/dev/null comme contexte source signifie 'pas de fichiers à uploader'. Contrairement à az acr build qui envoie du code source, az acr run utilise une image déjà présente dans le registry — pas besoin d'envoyer quoi que ce soit.",
      },
      {
        unitId: unit.id,
        question: "Après `az acr repository update --write-enabled false` sur `inference-api:v1.0.0`, que se passe-t-il si quelqu'un essaie de pusher une nouvelle image avec ce même tag ?",
        options: JSON.stringify([
          "La nouvelle image écrase l'ancienne normalement",
          "Azure demande une confirmation avant d'écraser",
          "Le push est refusé avec une erreur 403 Forbidden — l'image est protégée",
          "Le tag est automatiquement renommé en v1.0.0-backup"
        ]),
        correctAnswer: 2,
        explanation: "writeEnabled: false verrouille l'image en lecture seule. Toute tentative de push sur inference-api:v1.0.0 renvoie une erreur 403. C'est la façon standard de protéger les images de production contre les écrasements accidentels.",
      },
      {
        unitId: unit.id,
        question: "Dans le lab, `az acr task list-runs` a montré 3 runs : ca1, ca2, ca3. Quel run correspondait au test Flask (`az acr run`) ?",
        options: JSON.stringify([
          "ca1 — le premier build",
          "ca2 — le run de test Flask avec /dev/null",
          "ca3 — le build v1.1.0",
          "Aucun — az acr run n'apparaît pas dans l'historique"
        ]),
        correctAnswer: 1,
        explanation: "ca1 = build inference-api:v1.0.0 (22s), ca2 = az acr run test Flask (6s — beaucoup plus rapide car pas de build), ca3 = build inference-api:v1.1.0 (22s). az acr run crée aussi un run ID dans l'historique ACR Tasks.",
      },
    ],
  });

  console.log("Quiz lab mis à jour : 8 questions créées.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
