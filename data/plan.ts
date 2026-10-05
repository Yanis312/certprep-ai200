// Plan officiel AI-200 (Microsoft Learn, vérifié le 5 octobre 2026) + plan de révision.

export const exam = {
  code: "AI-200",
  title: "Azure AI Cloud Developer Associate",
  duration: "120 min",
  passScore: "700 / 1000",
  price: "165 USD",
  status: "Disponible (sorti de beta en juillet 2026)",
  languages: "Français disponible",
  studyGuide: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200",
};

export type DomainId = 1 | 2 | 3 | 4;

export const domains: Record<DomainId, { label: string; weight: string; color: string }> = {
  1: { label: "Conteneurs", weight: "20–25 %", color: "bg-sky-100 text-sky-700 border-sky-200" },
  2: { label: "Données IA", weight: "25–30 %", color: "bg-violet-100 text-violet-700 border-violet-200" },
  3: { label: "Messagerie & Functions", weight: "20–25 %", color: "bg-amber-100 text-amber-700 border-amber-200" },
  4: { label: "Sécurité & observabilité", weight: "20–25 %", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export type PlanModule = {
  title: string;
  /** slug du module sur Microsoft Learn */
  learn: string;
  /** slug du module sur ce site (data/modules/<slug>.json) quand la fiche existe */
  site?: string;
  /** module ajouté après coup, absent de la liste officielle des compétences */
  bonus?: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  duration: string;
  domain: DomainId;
  modules: PlanModule[];
};

export const learningPaths: LearningPath[] = [
  {
    id: "LP1",
    title: "Implement container application hosting on Azure",
    duration: "3h45",
    domain: 1,
    modules: [
      { title: "Store and manage containers in Azure Container Registry", learn: "store-manage-containers-azure-container-registry", site: "container-hosting" },
      { title: "Deploy containers to Azure App Service", learn: "deploy-containers-azure-app-service", site: "app-service-containers" },
      { title: "Run sidecar-enabled AI applications on Azure App Service", learn: "deploy-sidecar-azure-app-service", bonus: true },
    ],
  },
  {
    id: "LP2",
    title: "Deploy and manage apps on Azure Container Apps",
    duration: "5h11",
    domain: 1,
    modules: [
      { title: "Deploy containers to Azure Container Apps", learn: "deploy-containers-azure-container-apps" },
      { title: "Manage containers in Azure Container Apps", learn: "manage-containers-azure-container-apps" },
      { title: "Scale containers in Azure Container Apps (KEDA)", learn: "scale-containers-azure-container-apps" },
      { title: "Run AI-generated code securely in Container Apps dynamic sessions", learn: "dynamic-sessions-azure-container-apps", bonus: true },
    ],
  },
  {
    id: "LP3",
    title: "Deploy and monitor applications on Azure Kubernetes Service",
    duration: "3h32",
    domain: 1,
    modules: [
      { title: "Deploy applications to Azure Kubernetes Service", learn: "deploy-apps-azure-kubernetes-service" },
      { title: "Configure applications on Azure Kubernetes Service", learn: "configure-apps-azure-kubernetes-service" },
      { title: "Monitor and troubleshoot applications on AKS", learn: "monitor-apps-azure-kubernetes-service" },
    ],
  },
  {
    id: "LP4",
    title: "Develop AI solutions with Azure Cosmos DB for NoSQL",
    duration: "4h12",
    domain: 2,
    modules: [
      { title: "Build queries for Azure Cosmos DB for NoSQL", learn: "build-query-azure-cosmos-db" },
      { title: "Implement vector search on Azure Cosmos DB for NoSQL", learn: "implement-vector-search-azure-cosmos-db" },
      { title: "Optimize query performance for Azure Cosmos DB for NoSQL", learn: "optimize-query-performance-azure-cosmos-db" },
    ],
  },
  {
    id: "LP5",
    title: "Develop AI solutions with Azure Database for PostgreSQL",
    duration: "4h54",
    domain: 2,
    modules: [
      { title: "Build and query with Azure Database for PostgreSQL", learn: "build-query-azure-database-postgresql" },
      { title: "Implement vector search with PostgreSQL (pgvector)", learn: "implement-vector-search-azure-database-postgresql" },
      { title: "Optimize vector search in Azure Database for PostgreSQL", learn: "optimize-vector-search-azure-database-postgresql" },
    ],
  },
  {
    id: "LP6",
    title: "Enhance AI solutions with Azure Managed Redis",
    duration: "3h42",
    domain: 2,
    modules: [
      { title: "Implement data operations in Azure Managed Redis", learn: "implement-data-operations-azure-managed-redis" },
      { title: "Implement event messaging with Azure Managed Redis", learn: "implement-event-messaging-azure-managed-redis" },
      { title: "Implement vector storage in Azure Managed Redis", learn: "implement-vector-storage-azure-managed-redis" },
    ],
  },
  {
    id: "LP7",
    title: "Integrate backend services for AI solutions",
    duration: "5h40",
    domain: 3,
    modules: [
      { title: "Queue and process AI operations with Azure Service Bus", learn: "queue-process-operations-service-bus" },
      { title: "Develop event-driven AI workflows with Azure Event Grid", learn: "event-driven-workflows-event-grid" },
      { title: "Build serverless AI backends with Azure Functions", learn: "build-backends-azure-functions" },
      { title: "Orchestrate durable AI workflows with Azure Durable Functions", learn: "orchestrate-durable-functions", bonus: true },
    ],
  },
  {
    id: "LP8",
    title: "Manage application secrets and configuration for AI solutions",
    duration: "~2h33",
    domain: 4,
    modules: [
      { title: "Manage application secrets with Azure Key Vault", learn: "manage-app-secrets-key-vault" },
      { title: "Manage application settings with Azure App Configuration", learn: "manage-app-settings-app-config" },
    ],
  },
  {
    id: "LP9",
    title: "Observe and troubleshoot apps on Azure",
    duration: "~2h41",
    domain: 4,
    modules: [
      { title: "Instrument an app with OpenTelemetry", learn: "instrument-app-opentelemetry" },
      { title: "Analyze app telemetry with logs and metrics (KQL)", learn: "analyze-telemetry-logs-metrics" },
    ],
  },
];

export const learnModuleUrl = (slug: string) => `https://learn.microsoft.com/fr-fr/training/modules/${slug}/`;

export type Week = {
  id: string;
  dates: string;
  title: string;
  lps: string[];
  tasks: string[];
  focus: string;
};

// 10 semaines à ~7-8 h/semaine (≈ 36 h de contenu Learn + fiches, quiz et labs).
export const weeks: Week[] = [
  {
    id: "S1",
    dates: "5 – 11 oct.",
    title: "Reprise : ACR + App Service",
    lps: ["LP1"],
    tasks: [
      "Refaire les 5 quiz ACR à froid, puis relire seulement les fiches ratées",
      "App Service : les 5 unités restantes + le lab (fiches et quiz déjà prêts)",
      "Refaire le lab ACR Tasks une fois sans regarder les commandes",
    ],
    focus: "Tag vs digest, les 3 types d'ACR Tasks, app settings et secrets sur App Service.",
  },
  {
    id: "S2",
    dates: "12 – 18 oct.",
    title: "Azure Container Apps",
    lps: ["LP2"],
    tasks: [
      "Deploy containers to Container Apps",
      "Manage containers (révisions, sondes de santé, logs)",
      "Scale containers : règles HTTP/TCP/CPU et scalers KEDA",
    ],
    focus: "Révisions et répartition du trafic, KEDA : c'est explicitement dans les compétences évaluées.",
  },
  {
    id: "S3",
    dates: "19 – 25 oct.",
    title: "Azure Kubernetes Service",
    lps: ["LP3"],
    tasks: [
      "Deploy : manifests Deployment et Service",
      "Configure : ConfigMaps, Secrets, stockage persistant",
      "Monitor : logs, events, kubectl describe, connectivité de bout en bout",
      "Mini-bilan domaine 1 : refaire tous les quiz conteneurs",
    ],
    focus: "Savoir lire et corriger un manifest YAML, diagnostiquer un pod qui ne démarre pas.",
  },
  {
    id: "S4",
    dates: "26 oct. – 1 nov.",
    title: "Cosmos DB for NoSQL",
    lps: ["LP4"],
    tasks: [
      "SDK Python : connexion, CRUD, requêtes SQL",
      "Recherche vectorielle : embeddings, VectorDistance, change feed",
      "Performance : politiques d'indexation, RU, niveaux de cohérence",
    ],
    focus: "Domaine le plus lourd (25–30 %). Retenir les 5 niveaux de cohérence et leur coût en RU.",
  },
  {
    id: "S5",
    dates: "2 – 8 nov.",
    title: "PostgreSQL + pgvector",
    lps: ["LP5"],
    tasks: [
      "Schémas, types de données, requêtes, connexion Python avec Entra ID",
      "pgvector : stocker des embeddings, opérateurs de distance, RAG avec filtre de métadonnées",
      "Optimisation : index HNSW vs IVFFlat, dimensionnement, pooling de connexions",
    ],
    focus: "6 puces du guide officiel portent sur PostgreSQL : c'est le service le plus détaillé de l'examen.",
  },
  {
    id: "S6",
    dates: "9 – 15 nov.",
    title: "Azure Managed Redis + bilan données",
    lps: ["LP6"],
    tasks: [
      "Opérations de données : cache, expiration (TTL), invalidation",
      "Messagerie : pub/sub et Redis Streams",
      "Index vectoriels et recherche de similarité",
      "Bilan domaine 2 : tableau comparatif Cosmos DB / pgvector / Redis",
    ],
    focus: "Savoir choisir entre les trois bases vectorielles selon le scénario.",
  },
  {
    id: "S7",
    dates: "16 – 22 nov.",
    title: "Service Bus, Event Grid, Functions",
    lps: ["LP7"],
    tasks: [
      "Service Bus : queues, topics, subscriptions, dead-letter queue",
      "Event Grid : filtres, événements personnalisés, politiques de retry",
      "Azure Functions : triggers, bindings, configuration et déploiement",
    ],
    focus: "Très proche de l'ancien AZ-204. Service Bus (messages) vs Event Grid (événements).",
  },
  {
    id: "S8",
    dates: "23 – 29 nov.",
    title: "Secrets, configuration, observabilité",
    lps: ["LP8", "LP9"],
    tasks: [
      "Key Vault : récupération par SDK avec identité managée, versions, rotation",
      "App Configuration : labels, feature flags, références Key Vault",
      "OpenTelemetry : traces distribuées, spans personnalisés, export vers Application Insights",
      "KQL : écrire des requêtes sur les logs et les métriques",
    ],
    focus: "Écrire du KQL à la main : where, summarize, project, join, bin().",
  },
  {
    id: "S9",
    dates: "30 nov. – 6 déc.",
    title: "Modules bonus + rattrapage",
    lps: [],
    tasks: [
      "Survol des 3 modules ajoutés : sidecars App Service, dynamic sessions, Durable Functions",
      "Refaire tous les quiz sous 70 % jusqu'à passer au vert",
      "Relire la vue globale et le lexique en entier",
    ],
    focus: "Ces 3 modules ne sont pas dans la liste officielle des compétences : priorité basse.",
  },
  {
    id: "S10",
    dates: "7 – 13 déc.",
    title: "Entraînement examen",
    lps: [],
    tasks: [
      "Lecture de code : snippets Python SDK, Azure CLI, JSON, SQL, KQL à trous",
      "Essayer le bac à sable officiel (aka.ms/examdemo) pour connaître l'interface",
      "Relire le guide d'étude puce par puce : chaque puce doit évoquer une commande ou un bout de code",
      "Réserver et passer l'examen",
    ],
    focus: "L'examen teste surtout la capacité à lire et compléter du code, pas la théorie.",
  },
];

export const method = [
  "Lire l'unité sur Microsoft Learn",
  "Coller le texte à Claude pour créer la fiche et le quiz",
  "Faire le quiz jusqu'à 70 % minimum",
  "Repasser les flashcards le lendemain",
  "Faire le lab à la main en fin de module",
];
