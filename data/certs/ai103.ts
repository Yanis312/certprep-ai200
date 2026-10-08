// Plan officiel AI-103 (Microsoft Learn, vérifié le 8 octobre 2026) + plan de révision.
// Compétences mesurées : version du 16 avril 2026.
import type { Cert, LearningPath, Week } from "./types";

const visualPath = "https://learn.microsoft.com/fr-fr/training/paths/insight-visual-data/";

const learningPaths: LearningPath[] = [
  {
    id: "LP1",
    title: "Develop generative AI apps in Azure",
    duration: "6h52",
    domains: [1, 2],
    modules: [
      { title: "Plan and prepare to develop AI solutions on Azure", learn: "prepare-azure-ai-development", site: "ai103-prepare-ai-development" },
      { title: "Select, deploy, and evaluate Microsoft Foundry models", learn: "model-catalog-evaluate", site: "ai103-model-catalog-evaluate" },
      { title: "Develop a generative AI chat app with Microsoft Foundry", learn: "foundry-sdk" },
      { title: "Develop generative AI apps that use tools", learn: "use-generative-ai-tools" },
      { title: "Optimize generative AI model performance with Microsoft Foundry", learn: "optimize-generative-ai-model-performance" },
      { title: "Implement a responsible generative AI solution in Microsoft Foundry", learn: "responsible-ai-studio" },
    ],
  },
  {
    id: "LP2",
    title: "Develop AI agents on Azure",
    duration: "9h52",
    domains: [2, 1],
    modules: [
      { title: "Develop AI agents with Microsoft Foundry and Visual Studio Code", learn: "develop-ai-agents-azure-vs-code" },
      { title: "Integrate custom tools into your agent", learn: "build-agent-with-custom-tools" },
      { title: "Integrate MCP Tools with Azure AI Agents", learn: "connect-agent-to-mcp-tools" },
      { title: "Build knowledge-enhanced AI agents with Foundry IQ", learn: "introduction-foundry-iq" },
      { title: "Integrate your agent with Microsoft 365", learn: "integrate-foundry-agent-with-m365" },
      { title: "Build agent-driven workflows using Microsoft Foundry", learn: "build-agent-workflows-microsoft-foundry" },
      { title: "Develop an AI agent with Microsoft Agent Framework", learn: "develop-ai-agent-with-semantic-kernel" },
      { title: "Orchestrate a multi-agent solution using the Microsoft Agent Framework", learn: "orchestrate-semantic-kernel-multi-agent-solution" },
      { title: "Discover Azure AI Agents with A2A", learn: "discover-agents-with-a2a" },
    ],
  },
  {
    id: "LP3",
    title: "Develop natural language solutions in Azure",
    duration: "5h46",
    domains: [4],
    modules: [
      { title: "Analyze text with Azure Language in Foundry Tools", learn: "analyze-text-ai-language" },
      { title: "Develop a text analysis agent with the Azure Language MCP server", learn: "develop-text-analysis-agent-language-mcp" },
      { title: "Develop a speech-capable generative AI application", learn: "develop-generative-ai-audio-apps" },
      { title: "Create speech-enabled apps with Azure Speech in Microsoft Foundry Tools", learn: "create-speech-enabled-apps" },
      { title: "Develop a speech agent with the Azure Speech MCP server", learn: "develop-speech-agent-speech-mcp" },
      { title: "Develop an Azure Speech Voice Live Agent in Microsoft Foundry", learn: "develop-voice-live-agent" },
      { title: "Translate text and speech with Microsoft Foundry Tools", learn: "translate-text-speech" },
    ],
  },
  {
    id: "LP4",
    title: "Extract insights from visual data on Azure",
    duration: "7h06",
    domains: [3, 5],
    modules: [
      { title: "Develop a vision-enabled generative AI application", learnUrl: visualPath },
      { title: "Generate images with AI", learnUrl: visualPath },
      { title: "Generate videos with Microsoft Foundry", learnUrl: visualPath },
      { title: "Analyze images with Content Understanding", learnUrl: visualPath },
      { title: "Create a multimodal analysis solution with Azure Content Understanding", learnUrl: visualPath },
      { title: "Create an Azure Content Understanding client application", learnUrl: visualPath },
      { title: "Extract data with Azure Document Intelligence", learnUrl: visualPath },
      { title: "Create a knowledge mining solution with Azure AI Search", learnUrl: visualPath },
    ],
  },
];

// 9 semaines (≈ 30 h de contenu Learn + fiches, quiz et exercices).
const weeks: Week[] = [
  {
    id: "S1",
    dates: "8 – 18 oct.",
    title: "Bases Foundry : préparer, choisir un modèle, premier chat",
    lps: [],
    tasks: [
      "Plan and prepare to develop AI solutions on Azure (9 unités)",
      "Select, deploy, and evaluate Microsoft Foundry models (8 unités)",
      "Develop a generative AI chat app : Responses API et ChatCompletions API (8 unités)",
    ],
    focus: "Hub vs projet Foundry, types de déploiement, différence entre Responses API et ChatCompletions API.",
  },
  {
    id: "S2",
    dates: "19 – 25 oct.",
    title: "Outils, optimisation et IA responsable",
    lps: [],
    tasks: [
      "Develop generative AI apps that use tools (9 unités)",
      "Optimize model performance : prompt engineering, RAG, fine-tuning (8 unités)",
      "Implement a responsible generative AI solution (9 unités)",
      "Bilan LP1 : refaire tous les quiz sous 70 %",
    ],
    focus: "Savoir quand choisir prompt engineering, RAG ou fine-tuning ; filtres de contenu et étapes de l'IA responsable.",
  },
  {
    id: "S3",
    dates: "26 oct. – 1 nov.",
    title: "Agents : premiers agents et outils",
    lps: [],
    tasks: [
      "Develop AI agents with Microsoft Foundry and VS Code",
      "Integrate custom tools into your agent (function calling)",
      "Integrate MCP Tools with Azure AI Agents",
    ],
    focus: "Rôle, instructions et schémas d'outils d'un agent ; outil intégré vs fonction personnalisée vs serveur MCP.",
  },
  {
    id: "S4",
    dates: "2 – 8 nov.",
    title: "Agents : connaissances, Microsoft 365 et workflows",
    lps: [],
    tasks: [
      "Build knowledge-enhanced AI agents with Foundry IQ",
      "Integrate your agent with Microsoft 365",
      "Build agent-driven workflows using Microsoft Foundry",
    ],
    focus: "RAG appliqué aux agents, réponses citées, workflows avec étapes de validation humaine.",
  },
  {
    id: "S5",
    dates: "9 – 15 nov.",
    title: "Agents : Agent Framework, multi-agents, A2A",
    lps: [],
    tasks: [
      "Develop an AI agent with Microsoft Agent Framework",
      "Orchestrate a multi-agent solution",
      "Discover Azure AI Agents with A2A",
      "Bilan LP2 : tableau des patterns d'orchestration multi-agents",
    ],
    focus: "Le domaine génératif + agents pèse 30–35 % : c'est le plus gros bloc de l'examen.",
  },
  {
    id: "S6",
    dates: "16 – 22 nov.",
    title: "Texte, parole et traduction",
    lps: ["LP3"],
    tasks: [
      "Azure Language : analyse de texte + agent avec le serveur MCP Language",
      "Parole : app générative vocale, Azure Speech, agent MCP Speech",
      "Voice Live Agent",
      "Translate text and speech",
    ],
    focus: "Quand utiliser un outil Foundry (Language, Speech, Translator) plutôt qu'un prompt sur un LLM.",
  },
  {
    id: "S7",
    dates: "23 – 29 nov.",
    title: "Vision : comprendre et générer",
    lps: [],
    tasks: [
      "Develop a vision-enabled generative AI application",
      "Generate images with AI (édition, inpainting, masques)",
      "Generate videos with Microsoft Foundry",
      "Analyze images with Content Understanding",
    ],
    focus: "Légendes, texte alternatif, questions sur image, injection de prompt cachée dans une image.",
  },
  {
    id: "S8",
    dates: "30 nov. – 6 déc.",
    title: "Extraction d'informations",
    lps: [],
    tasks: [
      "Multimodal analysis solution with Content Understanding",
      "Content Understanding client application (analyseurs, sorties JSON ou Markdown)",
      "Extract data with Azure Document Intelligence",
      "Knowledge mining with Azure AI Search (recherche vectorielle, hybride, sémantique)",
    ],
    focus: "Pipeline d'ingestion RAG : OCR, mise en page, enrichissement par compétences, indexation.",
  },
  {
    id: "S9",
    dates: "7 – 13 déc.",
    title: "Entraînement examen",
    lps: [],
    tasks: [
      "Faire le Practice Assessment officiel sur AI Skills Navigator",
      "Refaire tous les quiz sous 70 % jusqu'à passer au vert",
      "Relire le guide d'étude puce par puce, surtout « Planifier et gérer » (25–30 %)",
      "Essayer le bac à sable officiel (aka.ms/examdemo)",
      "Réserver et passer l'examen",
    ],
    focus: "Quotas, coûts, identité managée, réseau privé, supervision : transversal et rarement dans un seul module.",
  },
];

const method = [
  "Lire l'unité sur Microsoft Learn",
  "Coller le texte à Claude pour créer la fiche, les exemples et le quiz",
  "Lire la fiche puis faire les exercices rapides sans regarder le corrigé",
  "Faire le quiz jusqu'à 70 % minimum",
  "Repasser les flashcards le lendemain",
];

export const ai103: Cert = {
  code: "AI-103",
  title: "Azure AI Apps and Agents Developer Associate",
  icon: "🤖",
  exam: {
    duration: "120 min",
    passScore: "700 / 1000",
    price: "165 USD",
    status: "Disponible, Practice Assessment sur AI Skills Navigator",
    languages: "Français disponible",
    studyGuide: "https://learn.microsoft.com/fr-fr/credentials/certifications/resources/study-guides/ai-103",
  },
  domains: {
    1: { label: "Planifier et gérer une solution IA", weight: "25–30 %", color: "bg-sky-100 text-sky-700 border-sky-200" },
    2: { label: "IA générative et agents", weight: "30–35 %", color: "bg-violet-100 text-violet-700 border-violet-200" },
    3: { label: "Vision par ordinateur", weight: "10–15 %", color: "bg-rose-100 text-rose-700 border-rose-200" },
    4: { label: "Analyse de texte et parole", weight: "10–15 %", color: "bg-amber-100 text-amber-700 border-amber-200" },
    5: { label: "Extraction d'informations", weight: "10–15 %", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  },
  planSubtitle: "Du 8 octobre au 13 décembre 2026 · environ 7 h par semaine",
  learningPaths,
  weeks,
  method,
};
