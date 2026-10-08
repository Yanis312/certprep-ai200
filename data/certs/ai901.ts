// Plan officiel AI-901 (Microsoft Learn, vérifié le 8 octobre 2026) + plan de révision.
// Compétences mesurées : version du 15 avril 2026. AI-901 remplace AI-900.
import type { Cert, LearningPath, Week } from "./types";

const learningPaths: LearningPath[] = [
  {
    id: "LP1",
    title: "AI concepts for developers and technology professionals",
    duration: "3h51",
    domains: [1],
    modules: [
      { title: "Introduction to AI concepts", learn: "get-started-ai-fundamentals", site: "ai901-ai-concepts" },
      { title: "Introduction to generative AI and agents", learn: "fundamentals-generative-ai" },
      { title: "Introduction to natural language processing concepts", learn: "introduction-language" },
      { title: "Introduction to AI speech concepts", learn: "introduction-ai-speech" },
      { title: "Introduction to computer vision concepts", learn: "introduction-computer-vision" },
      { title: "Introduction to AI-powered information extraction concepts", learn: "introduction-information-extraction" },
      { title: "Introduction to retrieval-augmented generation concepts", learn: "rag-fundamentals" },
    ],
  },
  {
    id: "LP2",
    title: "Get started with AI applications and agents on Azure",
    duration: "5h37",
    domains: [2],
    modules: [
      { title: "Get started with AI in Azure", learn: "get-started-with-ai-in-azure", site: "ai901-get-started-azure" },
      { title: "Get started with generative AI and agents in Azure", learn: "get-started-with-generative-ai-and-agents" },
      { title: "Get started with text analysis in Azure", learn: "get-started-text-analysis-azure", site: "ai901-text-analysis" },
      { title: "Get started with speech in Azure", learn: "get-started-speech-azure", site: "ai901-speech-azure" },
      { title: "Get started with computer vision in Azure", learn: "get-started-vision-azure" },
      { title: "Get started with AI-powered information extraction in Azure", learn: "get-started-information-extraction" },
      { title: "Get started with Microsoft Foundry IQ", learn: "get-started-foundry-iq" },
    ],
  },
];

// 4 semaines (≈ 9 h 30 de contenu Learn + fiches, quiz et exercices).
const weeks: Week[] = [
  {
    id: "S1",
    dates: "8 – 18 oct.",
    title: "Concepts : IA, générative, texte, parole",
    lps: [],
    tasks: [
      "Introduction to AI concepts (les 6 capacités + IA responsable)",
      "Introduction to generative AI and agents",
      "Introduction to natural language processing concepts",
      "Introduction to AI speech concepts",
    ],
    focus: "Reconnaître la capacité d'IA derrière un scénario, et associer un scénario à l'un des 6 principes d'IA responsable.",
  },
  {
    id: "S2",
    dates: "19 – 25 oct.",
    title: "Concepts : vision, extraction, RAG + Azure et Foundry",
    lps: [],
    tasks: [
      "Introduction to computer vision concepts",
      "Introduction to AI-powered information extraction concepts",
      "Introduction to retrieval-augmented generation concepts",
      "Get started with AI in Azure (tenant, abonnement, ressource Foundry, endpoints)",
      "Get started with generative AI and agents in Azure",
    ],
    focus: "La hiérarchie Azure (tenant, abonnement, groupe de ressources, ressource) et la différence ressource Foundry / projet Foundry.",
  },
  {
    id: "S3",
    dates: "26 oct. – 1 nov.",
    title: "Mettre en œuvre avec Foundry",
    lps: [],
    tasks: [
      "Get started with text analysis in Azure",
      "Get started with speech in Azure",
      "Get started with computer vision in Azure",
      "Get started with AI-powered information extraction in Azure",
      "Get started with Microsoft Foundry IQ",
    ],
    focus: "Ce domaine pèse 55–60 % : savoir lire un petit client Python qui appelle un modèle, un agent ou un Foundry Tool.",
  },
  {
    id: "S4",
    dates: "2 – 8 nov.",
    title: "Entraînement examen",
    lps: [],
    tasks: [
      "Faire le Practice Assessment officiel sur AI Skills Navigator",
      "Refaire tous les quiz sous 70 % jusqu'à passer au vert",
      "Relire le guide d'étude puce par puce",
      "Essayer le bac à sable officiel (aka.ms/examdemo)",
      "Réserver et passer l'examen",
    ],
    focus: "L'examen attend aussi de connaître REST, SDK et CLI : relis la fiche sur les endpoints.",
  },
];

const method = [
  "Lire l'unité sur Microsoft Learn",
  "Coller le texte à Claude pour créer la fiche, les exemples et le quiz",
  "Lire la fiche puis faire les exercices rapides sans regarder le corrigé",
  "Faire le quiz jusqu'à 70 % minimum",
  "Repasser les flashcards le lendemain",
];

export const ai901: Cert = {
  code: "AI-901",
  title: "Azure AI Fundamentals",
  icon: "🎓",
  exam: {
    duration: "≈ 45 min",
    passScore: "700 / 1000",
    price: "≈ 99 USD",
    status: "Disponible, remplace AI-900 ; la certification n'expire pas",
    languages: "Français disponible",
    studyGuide: "https://learn.microsoft.com/fr-fr/credentials/certifications/resources/study-guides/ai-901",
  },
  domains: {
    1: { label: "Concepts et capacités de l'IA", weight: "40–45 %", color: "bg-sky-100 text-sky-700 border-sky-200" },
    2: { label: "Mettre en œuvre avec Microsoft Foundry", weight: "55–60 %", color: "bg-violet-100 text-violet-700 border-violet-200" },
  },
  planSubtitle: "Du 8 octobre au 8 novembre 2026 · environ 5 h par semaine",
  learningPaths,
  weeks,
  method,
};
