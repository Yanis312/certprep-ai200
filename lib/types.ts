export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type Unit = {
  slug: string;
  title: string;
  order: number;
  isLab: boolean;
  questions: Question[];
};

export type Module = {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  units: Unit[];
};

// Version allégée envoyée aux composants client (sans le texte des questions)
export type UnitSummary = Omit<Unit, "questions"> & { qCount: number };
export type ModuleSummary = Omit<Module, "units"> & { units: UnitSummary[] };
