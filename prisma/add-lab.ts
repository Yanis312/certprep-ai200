import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const mod = await prisma.module.findUnique({ where: { slug: "container-hosting" } });
  if (!mod) throw new Error("Module container-hosting introuvable");

  const existing = await prisma.unit.findUnique({ where: { slug: "acr-lab-tasks" } });
  if (existing) {
    console.log("Lab déjà présent, rien à faire.");
    return;
  }

  const lab = await prisma.unit.create({
    data: {
      slug: "acr-lab-tasks",
      title: "Lab — Build and manage images with ACR Tasks",
      order: 5,
      isLab: true,
      moduleId: mod.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        unitId: lab.id,
        question: "Dans le lab, quelle commande déploie un ACR et retourne son login server URL ?",
        options: JSON.stringify([
          "az acr create --name <registry> --resource-group <rg> --sku Basic --query loginServer",
          "az acr deploy --name <registry> --sku Basic",
          "az container create --name <registry>",
          "az acr build --registry <registry> --image base ."
        ]),
        correctAnswer: 0,
        explanation: "az acr create crée le registry et --query loginServer extrait directement l'URL (ex: myregistry.azurecr.io). Le SKU Basic est suffisant pour ce lab.",
      },
      {
        unitId: lab.id,
        question: "Le lab demande de builder une image sans Docker local. Quelle commande utilise-t-on ?",
        options: JSON.stringify([
          "docker build -t myregistry.azurecr.io/sample-app:v1 .",
          "az acr build --registry myregistry --image sample-app:v1 .",
          "az container build --registry myregistry --image sample-app:v1",
          "az acr task run --registry myregistry --image sample-app:v1"
        ]),
        correctAnswer: 1,
        explanation: "az acr build envoie le contexte (.) vers Azure qui fait le build dans le cloud. Aucun Docker local nécessaire — c'est l'avantage principal d'ACR Tasks.",
      },
      {
        unitId: lab.id,
        question: "Pour protéger les images de production contre les modifications, quelle commande du lab utilises-tu ?",
        options: JSON.stringify([
          "az acr repository lock --name myregistry --repository sample-app",
          "az acr repository update --name myregistry --repository sample-app --write-enabled false",
          "az acr tag --immutable --name myregistry --image sample-app:v1",
          "az acr policy --name myregistry --readonly sample-app"
        ]),
        correctAnswer: 1,
        explanation: "az acr repository update --write-enabled false verrouille le repository en lecture seule. C'est exactement ce que le lab te demande de faire pour protéger les images de production.",
      },
      {
        unitId: lab.id,
        question: "Le lab utilise {{.Run.ID}} comme tag. Quel est l'avantage ?",
        options: JSON.stringify([
          "C'est un tag stable qui ne change pas",
          "Ça génère un identifiant unique par build pour tracer exactement quelle exécution a produit quelle image",
          "C'est requis par ACR pour les builds automatiques",
          "Ça rend l'image immuable automatiquement"
        ]),
        correctAnswer: 1,
        explanation: "{{.Run.ID}} génère un ID unique par exécution (ex: ca3, ca4...). Ainsi chaque build est traçable — tu sais exactement quelle image correspond à quelle exécution ACR Task.",
      },
      {
        unitId: lab.id,
        question: "Pourquoi ce lab nécessite un abonnement Azure payant (pas le crédit gratuit) ?",
        options: JSON.stringify([
          "ACR est un service Premium uniquement",
          "Les ACR Task runs sont temporairement suspendus pour les crédits Azure gratuits",
          "Python 3.12 n'est pas supporté en version gratuite",
          "Le SKU Basic n'est pas disponible avec un essai gratuit"
        ]),
        correctAnswer: 1,
        explanation: "Microsoft a temporairement suspendu les ACR Task runs (builds dans le cloud) pour les crédits Azure gratuits. Il faut un abonnement pay-as-you-go pour exécuter az acr build dans ce lab.",
      },
    ],
  });

  console.log(`Lab ajouté : ${lab.title} (id: ${lab.id}), 5 questions créées.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
