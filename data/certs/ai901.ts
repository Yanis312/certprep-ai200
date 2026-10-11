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
      { title: "Introduction to generative AI and agents", learn: "fundamentals-generative-ai", site: "ai901-concepts-genai" },
      { title: "Introduction to natural language processing concepts", learn: "introduction-language", site: "ai901-concepts-nlp" },
      { title: "Introduction to AI speech concepts", learn: "introduction-ai-speech", site: "ai901-concepts-speech" },
      { title: "Introduction to computer vision concepts", learn: "introduction-computer-vision", site: "ai901-concepts-vision" },
      { title: "Introduction to AI-powered information extraction concepts", learn: "introduction-information-extraction", site: "ai901-concepts-extraction" },
      { title: "Introduction to retrieval-augmented generation concepts", learn: "rag-fundamentals", site: "ai901-concepts-rag" },
    ],
  },
  {
    id: "LP2",
    title: "Get started with AI applications and agents on Azure",
    duration: "5h37",
    domains: [2],
    modules: [
      { title: "Get started with AI in Azure", learn: "get-started-with-ai-in-azure", site: "ai901-get-started-azure" },
      { title: "Get started with generative AI and agents in Azure", learn: "get-started-with-generative-ai-and-agents", site: "ai901-genai-agents-azure" },
      { title: "Get started with text analysis in Azure", learn: "get-started-text-analysis-azure", site: "ai901-text-analysis" },
      { title: "Get started with speech in Azure", learn: "get-started-speech-azure", site: "ai901-speech-azure" },
      { title: "Get started with computer vision in Azure", learn: "get-started-vision-azure", site: "ai901-vision-azure" },
      { title: "Get started with AI-powered information extraction in Azure", learn: "get-started-information-extraction", site: "ai901-info-extraction-azure" },
      { title: "Get started with Microsoft Foundry IQ", learn: "get-started-foundry-iq", site: "ai901-foundry-iq" },
    ],
  },
];

// Plan de révision en paires (décidé le 11 oct. 2026) : chaque module de concepts du LP1
// est suivi de son jumeau pratique du LP2, dans l'ordre 1 à 7 depuis le début.
// Les identifiants P1–P3 remplacent les anciens pour que les cases cochées ne se reportent pas.
const weeks: Week[] = [
  {
    id: "P1",
    dates: "11 – 16 oct.",
    title: "Paires 1 à 4 : le concept, puis le service Azure",
    lps: [],
    tasks: [
      "Paire 1 · Bases : « Introduction to AI concepts » (LP1) puis « Get started with AI in Azure » (LP2)",
      "Paire 2 · IA générative : « Generative AI and agents » (LP1) puis « Generative AI and agents in Azure » (LP2)",
      "Paire 3 · Texte : « Natural language processing concepts » (LP1) puis « Text analysis in Azure » (LP2)",
      "Paire 4 · Parole : « AI speech concepts » (LP1) puis « Speech in Azure » (LP2)",
      "Créer le compte gratuit Azure (crédit de 200 USD valable 30 jours) pour les labs du LP2",
    ],
    focus: "Pour chaque module : lire « L'essentiel » et le « Point examen », faire le quiz, puis relire seulement ce qui a été raté.",
  },
  {
    id: "P2",
    dates: "17 – 21 oct.",
    title: "Paires 5 à 7, puis premier test officiel",
    lps: [],
    tasks: [
      "Paire 5 · Vision : « Computer vision concepts » (LP1) puis « Computer vision in Azure » (LP2)",
      "Paire 6 · Extraction : « Information extraction concepts » (LP1) puis « Information extraction in Azure » (LP2)",
      "Paire 7 · RAG : « Retrieval-augmented generation concepts » (LP1) puis « Microsoft Foundry IQ » (LP2)",
      "Premier Practice Assessment officiel sur AI Skills Navigator",
      "Noter les domaines faibles affichés à la fin du Practice Assessment",
    ],
    focus: "Le domaine Foundry pèse 55–60 % : hiérarchie Azure, endpoints, nom du déploiement, classes et paquets Python.",
  },
  {
    id: "P3",
    dates: "22 – 28 oct.",
    title: "Lecture de code et examen",
    lps: [],
    tasks: [
      "Refaire les quiz des domaines faibles jusqu'à 80 %",
      "Relire les blocs de code des fiches LP2 et dire à voix haute ce que fait chaque ligne",
      "S'entraîner aux pièges : nom du déploiement ≠ nom du modèle, ressource ≠ projet, rôle system ≠ user",
      "Refaire le Practice Assessment jusqu'à 80 % ou plus, deux fois de suite",
      "Essayer le bac à sable officiel (aka.ms/examdemo) pour connaître l'interface",
      "Supprimer les ressources Azure créées pendant les labs",
      "Réserver l'examen avec un compte Microsoft personnel, puis le passer",
    ],
    focus: "45 minutes pour 40 à 60 questions à choix : moins d'une minute par question, et pas d'accès à Microsoft Learn pendant l'examen.",
  },
];

const method = [
  "Travailler en paires : un module de concepts (LP1), puis son jumeau Azure (LP2)",
  "Lire « L'essentiel » et le « Point examen » de chaque fiche",
  "Faire le quiz tout de suite",
  "Relire seulement la partie de la fiche liée aux questions ratées",
  "Viser 80 % avant de passer à la paire suivante",
];

export const ai901: Cert = {
  code: "AI-901",
  title: "Azure AI Fundamentals",
  icon: "🎓",
  exam: {
    duration: "45 min",
    passScore: "700 / 1000",
    price: "84 USD (Canada)",
    status: "Disponible, remplace AI-900 ; la certification n'expire pas",
    languages: "Français disponible",
    studyGuide: "https://learn.microsoft.com/fr-fr/credentials/certifications/resources/study-guides/ai-901",
  },
  domains: {
    1: { label: "Concepts et capacités de l'IA", weight: "40–45 %", color: "bg-sky-100 text-sky-700 border-sky-200" },
    2: { label: "Mettre en œuvre avec Microsoft Foundry", weight: "55–60 %", color: "bg-violet-100 text-violet-700 border-violet-200" },
  },
  planSubtitle: "Du 11 au 28 octobre 2026 · révision en paires : concept (LP1) puis pratique Azure (LP2)",
  learningPaths,
  weeks,
  method,
};
