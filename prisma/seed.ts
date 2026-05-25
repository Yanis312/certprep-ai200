import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.progress.deleteMany();
  await prisma.question.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.module.deleteMany();

  // ── Module 1 : ACR Container Hosting ─────────────────────────────
  const m1 = await prisma.module.create({
    data: {
      slug: "container-hosting",
      title: "Azure Container Registry (ACR)",
      description: "Hébergement d'applications conteneurisées — Learning Path 1",
      category: "AI-200",
      order: 1,
      units: {
        create: [
          { slug: "acr-introduction", title: "Unité 1 — Introduction à ACR", order: 1 },
          { slug: "acr-repositories", title: "Unité 2 — Registries, repositories et artifacts", order: 2 },
          { slug: "acr-tasks-unit", title: "Unité 3 — ACR Tasks", order: 3 },
          { slug: "acr-tag-version", title: "Unité 4 — Tags et versioning des images", order: 4 },
        ],
      },
    },
    include: { units: true },
  });

  const u1 = m1.units.find((u) => u.slug === "acr-introduction")!;
  const u2 = m1.units.find((u) => u.slug === "acr-repositories")!;
  const u3 = m1.units.find((u) => u.slug === "acr-tasks-unit")!;
  const u4 = m1.units.find((u) => u.slug === "acr-tag-version")!;

  // Unité 1 — Introduction
  await prisma.question.createMany({
    data: [
      {
        unitId: u1.id,
        question: "Qu'est-ce qu'Azure Container Registry (ACR) ?",
        options: JSON.stringify(["Un service de déploiement de containers", "Un registre privé géré Azure pour stocker des images OCI", "Un orchestrateur de containers comme Kubernetes", "Un service de monitoring des containers"]),
        correctAnswer: 1,
        explanation: "ACR est un registre privé géré qui stocke et distribue des images OCI (Docker, Helm, etc.). Il est intégré nativement aux services Azure comme AKS, Container Apps et App Service.",
      },
      {
        unitId: u1.id,
        question: "Quelle est la différence principale entre ACR et Docker Hub ?",
        options: JSON.stringify(["ACR est gratuit, Docker Hub est payant", "ACR est privé et intégré nativement à Azure, Docker Hub est public par défaut", "ACR ne supporte que les images Windows", "Docker Hub supporte la géo-réplication"]),
        correctAnswer: 1,
        explanation: "ACR est un registre privé intégré nativement aux services Azure avec géo-réplication (Premium). Docker Hub est public par défaut et non lié à Azure.",
      },
      {
        unitId: u1.id,
        question: "Quel tier ACR offre la géo-réplication et les webhooks avancés ?",
        options: JSON.stringify(["Basic", "Standard", "Premium", "Enterprise"]),
        correctAnswer: 2,
        explanation: "Le tier Premium débloque la géo-réplication, les Private Endpoints, et les règles de rétention avancées. Basic et Standard couvrent les usages courants sans ces fonctionnalités.",
      },
      {
        unitId: u1.id,
        question: "Quelle est l'URL de login server pour un registry nommé 'myapp' ?",
        options: JSON.stringify(["docker.hub.com/myapp", "myapp.docker.io", "myapp.azurecr.io", "azure.com/registries/myapp"]),
        correctAnswer: 2,
        explanation: "Chaque registry ACR a une URL unique au format <nom>.azurecr.io. C'est l'adresse utilisée pour docker login, docker pull et docker push.",
      },
      {
        unitId: u1.id,
        question: "Comment s'authentifier à ACR en production sans stocker de mot de passe ?",
        options: JSON.stringify(["Utiliser admin user + password", "Utiliser un Service Principal Azure AD ou Managed Identity", "Passer les credentials en variable d'environnement", "Utiliser un token GitHub"]),
        correctAnswer: 1,
        explanation: "En production, on utilise un Service Principal Azure AD ou une Managed Identity pour s'authentifier à ACR sans mots de passe en clair. L'admin user est pratique pour les tests uniquement.",
      },
    ],
  });

  // Unité 2 — Repositories
  await prisma.question.createMany({
    data: [
      {
        unitId: u2.id,
        question: "Complète la hiérarchie ACR : Registry → _______ → Artifact",
        options: JSON.stringify(["Container", "Repository", "Image", "Namespace"]),
        correctAnswer: 1,
        explanation: "La hiérarchie est : Registry (myapp.azurecr.io) → Repository (groupe d'images du même nom, ex: api) → Artifact (image concrète avec tag ou digest).",
      },
      {
        unitId: u2.id,
        question: "En production, tu veux garantir exactement la même image sur tous les serveurs. Tu utilises :",
        options: JSON.stringify(["Le tag :latest", "Le tag :stable", "Le digest sha256", "Le namespace de production"]),
        correctAnswer: 2,
        explanation: "Le digest sha256 est immuable — il identifie toujours exactement la même image. Les tags sont mutables et peuvent pointer vers une nouvelle image si quelqu'un repousse.",
      },
      {
        unitId: u2.id,
        question: "10 images Docker partagent la même base python:3.11. Combien de copies ACR stocke ?",
        options: JSON.stringify(["10 copies complètes", "2 copies", "1 seule copie partagée", "Dépend du tier ACR"]),
        correctAnswer: 2,
        explanation: "ACR déduplique les layers communs. Si 10 images partagent python:3.11, une seule copie de cette couche est stockée — économie de stockage importante.",
      },
      {
        unitId: u2.id,
        question: "Comment isoler l'accès entre l'équipe 'frontend' et l'équipe 'ml' dans le même registry ?",
        options: JSON.stringify(["Créer deux registries séparés", "Utiliser des namespaces (frontend/image et ml/image)", "Utiliser des tags différents", "Utiliser des tiers différents"]),
        correctAnswer: 1,
        explanation: "Les namespaces (préfixes avec /) permettent d'organiser les repositories et de contrôler les accès. Ex: frontend/web-app vs ml/model-server dans le même registry.",
      },
      {
        unitId: u2.id,
        question: "Quelle propriété d'un artifact ne change jamais, même si on pousse une nouvelle image avec le même tag ?",
        options: JSON.stringify(["Le tag", "Le nom du repository", "Le digest sha256", "La date de création"]),
        correctAnswer: 2,
        explanation: "Le digest sha256 est calculé à partir du contenu de l'image. Il est immuable par définition — si le contenu change, le digest change. Un tag peut pointer vers n'importe quelle version.",
      },
    ],
  });

  // Unité 3 — ACR Tasks
  await prisma.question.createMany({
    data: [
      {
        unitId: u3.id,
        question: "Quelle commande Azure CLI lance un build immédiat depuis le dossier courant ?",
        options: JSON.stringify(["az acr run --registry myregistry .", "az acr build --registry myregistry --image api:v1 .", "az acr task create --registry myregistry .", "docker build -t myregistry.azurecr.io/api:v1 ."]),
        correctAnswer: 1,
        explanation: "az acr build est la quick task. Elle envoie le contexte (.) à Azure, build l'image dans le cloud et la pousse dans le registry. Pas besoin de Docker en local.",
      },
      {
        unitId: u3.id,
        question: "Quels sont les 3 types de triggers pour les ACR Tasks ?",
        options: JSON.stringify(["Pull request, push, merge", "Commit (source code), base image update, schedule (cron)", "Manuel, automatique, hybride", "GitHub, Azure DevOps, GitLab"]),
        correctAnswer: 1,
        explanation: "ACR Tasks supporte 3 triggers : commit Git (source code trigger), mise à jour de l'image de base (base image trigger), et planification cron (scheduled trigger).",
      },
      {
        unitId: u3.id,
        question: "À quoi sert {{.Run.ID}} dans une ACR Task ?",
        options: JSON.stringify(["Identifier le registry", "Générer un tag unique et traçable pour chaque build", "Authentifier la tâche", "Spécifier la région de build"]),
        correctAnswer: 1,
        explanation: "{{.Run.ID}} génère un identifiant unique pour chaque exécution (ex: ca3). Utilisé comme tag pour avoir des images traçables et uniques à chaque build.",
      },
      {
        unitId: u3.id,
        question: "Où stocker les tokens d'accès Git (PAT) pour les ACR Tasks ?",
        options: JSON.stringify(["Dans le Dockerfile", "Dans une variable d'environnement locale", "Dans Azure Key Vault", "Dans le fichier .env du repo"]),
        correctAnswer: 2,
        explanation: "Les Personal Access Tokens (PAT) doivent toujours être dans Azure Key Vault, jamais en dur dans les scripts ou fichiers de configuration versionnés.",
      },
      {
        unitId: u3.id,
        question: "Quelle commande permet d'exécuter une image existante dans ACR sans fichier source ?",
        options: JSON.stringify(["az acr build --test", "az acr run --registry myregistry --cmd 'api:v1 python --version' /dev/null", "az acr task run --registry myregistry", "docker run myregistry.azurecr.io/api:v1"]),
        correctAnswer: 1,
        explanation: "az acr run avec /dev/null comme contexte (pas de source nécessaire) exécute un container depuis ACR pour le tester — utile pour les smoke tests.",
      },
    ],
  });

  // Unité 4 — Tags et versioning
  await prisma.question.createMany({
    data: [
      {
        unitId: u4.id,
        question: "Quelle est la différence entre un tag 'stable' (:latest, :prod) et un tag 'unique' (:v1.0.3-abc123) ?",
        options: JSON.stringify(["Les tags stables sont immuables, les uniques sont mutables", "Les tags stables sont mutables (mis à jour à chaque release), les uniques pointent une version précise", "Il n'y a pas de différence pratique", "Les tags uniques ne fonctionnent qu'avec ACR Premium"]),
        correctAnswer: 1,
        explanation: "Tags stables (:latest, :prod) sont pratiques mais mutables — ils peuvent pointer vers une nouvelle image à tout moment. Tags uniques (:v1.0.3-abc123) identifient une version précise immuable.",
      },
      {
        unitId: u4.id,
        question: "Comment rendre un repository en lecture seule pour protéger les images de production ?",
        options: JSON.stringify(["az acr repository delete --name api --write-enabled false", "az acr repository update --name myregistry --repository api --write-enabled false", "az acr lock --repository api", "az acr tag --immutable api:prod"]),
        correctAnswer: 1,
        explanation: "az acr repository update --write-enabled false verrouille un repository en lecture seule. Plus aucun push ne peut remplacer les images existantes — protection des images de production.",
      },
      {
        unitId: u4.id,
        question: "Quelle commande supprime les images de plus de 30 jours non taguées 'important' ?",
        options: JSON.stringify(["az acr delete --old 30d", "az acr purge --registry myregistry --filter 'api:.*' --ago 30d --untagged", "az acr retention --days 30", "az acr clean --registry myregistry --days 30"]),
        correctAnswer: 1,
        explanation: "az acr purge (via acr run) filtre les images par regex et ancienneté. --untagged supprime les manifests sans tag. --dry-run permet de vérifier avant de supprimer.",
      },
      {
        unitId: u4.id,
        question: "Quelle est la bonne pratique de versioning pour une image prête pour production ?",
        options: JSON.stringify([":latest uniquement", ":v1.2.3 (semver) + :latest mis à jour", ":prod-build-$(date)", ":main-branch"]),
        correctAnswer: 1,
        explanation: "La bonne pratique est de taguer avec semver (:v1.2.3) pour la traçabilité ET mettre à jour le tag :latest pour faciliter les déploiements. On utilise souvent les deux en parallèle.",
      },
      {
        unitId: u4.id,
        question: "Qu'est-ce qu'une politique de rétention dans ACR ?",
        options: JSON.stringify(["Un quota de stockage maximum", "Une règle qui supprime automatiquement les manifests non-taguées après N jours", "Un système de sauvegarde des images", "Une limite sur le nombre de pulls par jour"]),
        correctAnswer: 1,
        explanation: "Les politiques de rétention (tier Premium) suppriment automatiquement les manifests non-taguées après un nombre de jours configuré. Évite l'accumulation de couches orphelines.",
      },
    ],
  });

  // ── Module 2 : React Hooks ────────────────────────────────────────
  const m2 = await prisma.module.create({
    data: {
      slug: "react-revision",
      title: "React — Révision TypeScript",
      description: "Hooks, state management et patterns React essentiels",
      category: "React",
      order: 1,
      units: {
        create: [
          { slug: "react-hooks-fondamentaux", title: "Unité 1 — Les Hooks fondamentaux", order: 1 },
        ],
      },
    },
    include: { units: true },
  });

  const rh = m2.units[0];

  await prisma.question.createMany({
    data: [
      {
        unitId: rh.id,
        question: "Quel hook utilises-tu pour stocker une valeur qui déclenche un re-render quand elle change ?",
        options: JSON.stringify(["useRef", "useMemo", "useState", "useEffect"]),
        correctAnswer: 2,
        explanation: "useState stocke une valeur dans le state. Quand elle change via le setter, React re-render le composant. Ex: const [count, setCount] = useState(0)",
      },
      {
        unitId: rh.id,
        question: "Quel hook utilises-tu pour exécuter du code après le rendu (appels API, subscriptions) ?",
        options: JSON.stringify(["useState", "useCallback", "useMemo", "useEffect"]),
        correctAnswer: 3,
        explanation: "useEffect s'exécute après chaque rendu. Avec [], il s'exécute une fois au montage — idéal pour les appels API initiaux. La fonction de cleanup évite les fuites mémoire.",
      },
      {
        unitId: rh.id,
        question: "Quelle est la différence entre useRef et useState ?",
        options: JSON.stringify(["useRef est pour les chaînes, useState pour les nombres", "useRef ne déclenche PAS de re-render quand sa valeur change, useState oui", "useState est plus rapide que useRef", "Il n'y a pas de différence pratique"]),
        correctAnswer: 1,
        explanation: "useRef stocke une valeur mutable (.current) qui persiste entre les renders SANS déclencher un re-render. Utile pour accéder au DOM ou stocker des timers et anciens états.",
      },
      {
        unitId: rh.id,
        question: "Quand utilises-tu useMemo ?",
        options: JSON.stringify(["Pour mémoriser une fonction callback", "Pour éviter de recalculer une valeur coûteuse à chaque render", "Pour stocker un état persistant entre pages", "Pour gérer les effets de bord"]),
        correctAnswer: 1,
        explanation: "useMemo mémoïse le résultat d'un calcul. Il ne recalcule que si les dépendances changent. Ex: const sorted = useMemo(() => items.sort(), [items])",
      },
      {
        unitId: rh.id,
        question: "useCallback sert à :",
        options: JSON.stringify(["Exécuter une fonction après le rendu", "Mémoriser une fonction pour éviter qu'elle soit recréée à chaque render", "Créer un état avec une fonction de mise à jour", "Gérer les erreurs dans les composants"]),
        correctAnswer: 1,
        explanation: "useCallback mémoïse une fonction. Sans useCallback, une nouvelle référence est créée à chaque render — problème si passée en prop à un composant enfant avec React.memo.",
      },
    ],
  });

  console.log("Seed terminé :", {
    modules: 2,
    units: 5,
    questions: 25,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
