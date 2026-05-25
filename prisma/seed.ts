import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Nettoyer
  await prisma.progress.deleteMany();
  await prisma.question.deleteMany();
  await prisma.module.deleteMany();

  // ── Module 1 : ACR Fondamentaux ──────────────────────────────────
  const acr = await prisma.module.create({
    data: {
      slug: "acr-fondamentaux",
      title: "Azure Container Registry — Fondamentaux",
      description: "Registres, repositories, artifacts, tags et digests",
      category: "AI-200",
      order: 1,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        moduleId: acr.id,
        question: "Quelle est la différence principale entre ACR et Docker Hub ?",
        options: JSON.stringify(["ACR est gratuit, Docker Hub est payant", "ACR est privé et intégré nativement à Azure, Docker Hub est public par défaut", "ACR ne supporte que les images Windows", "Docker Hub supporte la géo-réplication"]),
        correctAnswer: 1,
        explanation: "ACR est un registre privé intégré nativement aux services Azure (AKS, Container Apps, App Service) avec géo-réplication. Docker Hub est public par défaut et non lié à Azure.",
      },
      {
        moduleId: acr.id,
        question: "Complète la hiérarchie ACR : Registry → _______ → Artifact",
        options: JSON.stringify(["Container", "Repository", "Image", "Namespace"]),
        correctAnswer: 1,
        explanation: "La hiérarchie est : Registry (myapp.azurecr.io) → Repository (groupe d'images du même nom) → Artifact (image concrète avec tag ou digest).",
      },
      {
        moduleId: acr.id,
        question: "En production, tu veux garantir exactement la même image sur tous tes serveurs. Tu utilises :",
        options: JSON.stringify(["Le tag :latest", "Le tag :stable", "Le digest sha256", "Le namespace de production"]),
        correctAnswer: 2,
        explanation: "Le digest sha256 est immuable — il identifie toujours exactement la même image. Les tags sont mutables et peuvent pointer vers une nouvelle image si quelqu'un repousse.",
      },
      {
        moduleId: acr.id,
        question: "10 images Docker partagent la même base python:3.11. Combien de copies ACR stocke ?",
        options: JSON.stringify(["10 copies", "2 copies", "1 seule copie", "Dépend du tier ACR"]),
        correctAnswer: 2,
        explanation: "ACR déduplique les layers communs. Si 10 images partagent python:3.11 comme base, une seule copie de cette couche est stockée — économie de stockage importante.",
      },
      {
        moduleId: acr.id,
        question: "Quel tier ACR faut-il pour activer la géo-réplication ?",
        options: JSON.stringify(["Basic", "Standard", "Premium", "Enterprise"]),
        correctAnswer: 2,
        explanation: "La géo-réplication est une fonctionnalité du tier Premium. Elle permet de distribuer les images près des régions de déploiement pour réduire la latence.",
      },
      {
        moduleId: acr.id,
        question: "Quelle est l'URL de login server pour un registry nommé 'myapp' ?",
        options: JSON.stringify(["docker.hub.com/myapp", "myapp.docker.io", "myapp.azurecr.io", "azure.com/registries/myapp"]),
        correctAnswer: 2,
        explanation: "Chaque registry ACR a une URL unique au format <nom>.azurecr.io. Pour un registry nommé 'myapp', l'URL est myapp.azurecr.io.",
      },
      {
        moduleId: acr.id,
        question: "Comment isoler l'accès entre l'équipe 'frontend' et l'équipe 'ml' dans le même registry ?",
        options: JSON.stringify(["Créer deux registries séparés", "Utiliser des namespaces (frontend/image et ml/image)", "Utiliser des tags différents", "Utiliser des tiers différents"]),
        correctAnswer: 1,
        explanation: "Les namespaces (préfixes avec /) permettent d'organiser les repositories et de contrôler les accès par équipe. Ex: frontend/web-app et ml/model-server.",
      },
    ],
  });

  // ── Module 2 : ACR Tasks ────────────────────────────────────────
  const acrTasks = await prisma.module.create({
    data: {
      slug: "acr-tasks",
      title: "ACR Tasks — Builds dans le cloud",
      description: "Quick tasks, triggers automatiques, multi-step workflows",
      category: "AI-200",
      order: 2,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        moduleId: acrTasks.id,
        question: "Quelle commande Azure CLI lance un build immédiat depuis le dossier courant ?",
        options: JSON.stringify(["az acr run --registry myregistry .", "az acr build --registry myregistry --image api:v1 .", "az acr task create --registry myregistry .", "docker build -t myregistry.azurecr.io/api:v1 ."]),
        correctAnswer: 1,
        explanation: "az acr build est la commande quick task. Elle envoie le contexte (.) à Azure, build l'image dans le cloud et la pousse dans le registry. Pas besoin de Docker en local.",
      },
      {
        moduleId: acrTasks.id,
        question: "Quels sont les 3 types de triggers pour les ACR Tasks ?",
        options: JSON.stringify(["Pull request, push, merge", "Commit (source code), base image update, schedule (cron)", "Manuel, automatique, hybride", "GitHub, Azure DevOps, GitLab"]),
        correctAnswer: 1,
        explanation: "ACR Tasks supporte 3 triggers : commit Git (source code trigger), mise à jour de l'image de base (base image trigger), et planification cron (scheduled trigger).",
      },
      {
        moduleId: acrTasks.id,
        question: "À quoi sert {{.Run.ID}} dans une ACR Task ?",
        options: JSON.stringify(["Identifier le registry", "Générer un tag unique et traçable pour chaque build", "Authentifier la tâche", "Spécifier la région de build"]),
        correctAnswer: 1,
        explanation: "{{.Run.ID}} est une variable ACR qui génère un identifiant unique pour chaque exécution de tâche. Cela permet d'avoir des tags distincts et traçables pour chaque build.",
      },
      {
        moduleId: acrTasks.id,
        question: "Où stocker les tokens d'accès Git (PAT) pour les ACR Tasks ?",
        options: JSON.stringify(["Dans le Dockerfile", "Dans une variable d'environnement locale", "Dans Azure Key Vault", "Dans le fichier .env du repo"]),
        correctAnswer: 2,
        explanation: "Les Personal Access Tokens (PAT) doivent toujours être stockés dans Azure Key Vault, jamais en dur dans les scripts ou les fichiers de configuration versionnés.",
      },
      {
        moduleId: acrTasks.id,
        question: "Quelle commande permet de tester une image existante dans ACR sans fichier source ?",
        options: JSON.stringify(["az acr build --test", "az acr run --registry myregistry --cmd 'api:v1 python --version' /dev/null", "az acr task run --registry myregistry", "docker run myregistry.azurecr.io/api:v1"]),
        correctAnswer: 1,
        explanation: "az acr run avec /dev/null comme contexte (pas de source nécessaire) permet d'exécuter un container depuis ACR pour le tester. Utile pour les smoke tests et vérifications.",
      },
    ],
  });

  // ── Module 3 : React — Les Hooks essentiels ──────────────────────
  const react = await prisma.module.create({
    data: {
      slug: "react-hooks",
      title: "React — Les Hooks essentiels",
      description: "useState, useEffect, useRef, useMemo, useCallback et plus",
      category: "React / TypeScript",
      order: 1,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        moduleId: react.id,
        question: "Quel hook utilises-tu pour stocker une valeur qui déclenche un re-render quand elle change ?",
        options: JSON.stringify(["useRef", "useMemo", "useState", "useEffect"]),
        correctAnswer: 2,
        explanation: "useState stocke une valeur dans le state du composant. Quand la valeur change via le setter, React re-render le composant. Ex: const [count, setCount] = useState(0)",
      },
      {
        moduleId: react.id,
        question: "Quel hook utilises-tu pour exécuter du code après le rendu (appels API, subscriptions) ?",
        options: JSON.stringify(["useState", "useCallback", "useMemo", "useEffect"]),
        correctAnswer: 3,
        explanation: "useEffect s'exécute après chaque rendu. Avec un tableau de dépendances [], il s'exécute une seule fois au montage — idéal pour les appels API initiaux.",
      },
      {
        moduleId: react.id,
        question: "Quelle est la différence entre useRef et useState ?",
        options: JSON.stringify(["useRef est pour les chaînes, useState pour les nombres", "useRef ne déclenche PAS de re-render quand sa valeur change, useState oui", "useState est plus rapide que useRef", "Il n'y a pas de différence pratique"]),
        correctAnswer: 1,
        explanation: "useRef stocke une valeur mutable (.current) qui persiste entre les renders SANS déclencher un re-render. Utile pour accéder au DOM ou stocker des valeurs sans re-render.",
      },
      {
        moduleId: react.id,
        question: "Quand utilises-tu useMemo ?",
        options: JSON.stringify(["Pour mémoriser une fonction", "Pour éviter de recalculer une valeur coûteuse à chaque render", "Pour stocker un état persistant", "Pour gérer les effets de bord"]),
        correctAnswer: 1,
        explanation: "useMemo mémoïse le résultat d'un calcul coûteux. Il ne recalcule que si les dépendances changent. Ex: const result = useMemo(() => expensiveCalc(data), [data])",
      },
      {
        moduleId: react.id,
        question: "useCallback sert à :",
        options: JSON.stringify(["Exécuter une fonction après le rendu", "Mémoriser une fonction pour éviter qu'elle soit recréée à chaque render", "Créer un état avec une fonction de mise à jour", "Gérer les erreurs dans les composants"]),
        correctAnswer: 1,
        explanation: "useCallback mémoïse une fonction. Sans useCallback, une nouvelle référence de fonction est créée à chaque render — problème si passée en prop à un composant enfant optimisé.",
      },
    ],
  });

  console.log("✅ Seed terminé :", {
    modules: 3,
    questions: { "acr-fondamentaux": 7, "acr-tasks": 5, "react-hooks": 5 },
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
