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
      { title: "Get started with generative AI and agents in Azure", learn: "get-started-with-generative-ai-and-agents", site: "ai901-genai-agents-azure" },
      { title: "Get started with text analysis in Azure", learn: "get-started-text-analysis-azure", site: "ai901-text-analysis" },
      { title: "Get started with speech in Azure", learn: "get-started-speech-azure", site: "ai901-speech-azure" },
      { title: "Get started with computer vision in Azure", learn: "get-started-vision-azure", site: "ai901-vision-azure" },
      { title: "Get started with AI-powered information extraction in Azure", learn: "get-started-information-extraction", site: "ai901-info-extraction-azure" },
      { title: "Get started with Microsoft Foundry IQ", learn: "get-started-foundry-iq", site: "ai901-foundry-iq" },
    ],
  },
];

// Plan de révision : les deux parcours sont déjà terminés sur Microsoft Learn (8 oct. 2026).
// Il reste à consolider, s'entraîner à lire du code et passer l'examen.
const weeks: Week[] = [
  {
    id: "S1",
    dates: "8 – 14 oct.",
    title: "Consolider ce qui est déjà en fiches",
    lps: [],
    tasks: [
      "Quiz « Introduction to AI concepts » jusqu'à 70 % sur chaque unité",
      "Quiz « Get started with AI in Azure » (hiérarchie Azure, Foundry, endpoints REST)",
      "Quiz « Text analysis » et « Speech » : retenir les classes et paquets Python",
      "Quiz « Computer vision » et « Information extraction »",
      "Vérifier le statut étudiant dans le profil Learn pour obtenir le tarif étudiant",
    ],
    focus: "Les 6 principes d'IA responsable et la reconnaissance des charges de travail : c'est environ la moitié des questions d'après un retour d'expérience.",
  },
  {
    id: "S2",
    dates: "15 – 21 oct.",
    title: "Compléter les modules manquants",
    lps: [],
    tasks: [
      "Coller à Claude « Get started with generative AI and agents in Azure » (prompts, agent dans le portail, client léger)",
      "Coller « Get started with Microsoft Foundry IQ » et la fin du module extraction d'informations",
      "Coller les modules concepts restants : generative AI, NLP, speech, vision, extraction, RAG",
      "Premier Practice Assessment officiel sur AI Skills Navigator, sans préparation",
      "Noter les domaines faibles affichés à la fin du Practice Assessment",
    ],
    focus: "Le domaine Foundry pèse 55–60 % et c'est là que la plupart des candidats perdent des points.",
  },
  {
    id: "S3",
    dates: "22 – 28 oct.",
    title: "Lecture de code et examen",
    lps: [],
    tasks: [
      "Relire les blocs de code des fiches et dire à voix haute ce que fait chaque ligne",
      "S'entraîner aux pièges : nom du déploiement ≠ nom du modèle, ressource ≠ projet, rôle system ≠ user",
      "Refaire le Practice Assessment jusqu'à 85 % ou plus, deux fois de suite",
      "Essayer le bac à sable officiel (aka.ms/examdemo) pour connaître l'interface",
      "Réserver l'examen avec un compte Microsoft personnel, puis le passer",
    ],
    focus: "45 minutes pour 40 à 60 questions : moins d'une minute par question, et pas d'accès à Microsoft Learn pendant l'examen.",
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
  planSubtitle: "Du 8 au 28 octobre 2026 · parcours Learn déjà terminés, phase de consolidation",
  learningPaths,
  weeks,
  method,
};
