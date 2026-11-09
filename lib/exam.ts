import fs from "fs";
import path from "path";

// Examens blancs : un fichier JSON par certification dans data/exams.
// Les formats reprennent ceux de Microsoft : choix unique, choix multiple,
// série Oui / Non, remise en ordre, et étude de cas à la fin.

export type ExamQuestion = {
  type: "single" | "multi" | "yesno" | "order";
  /** clé du domaine de l'examen (voir Exam.domains) */
  domain: string;
  q: string;
  /** extrait de code affiché sous la question */
  code?: string;
  /** single et multi */
  options?: string[];
  /** single : un index ; multi : plusieurs index */
  answer?: number | number[];
  /** yesno : une affirmation par ligne */
  statements?: { text: string; answer: boolean }[];
  /** order : les étapes dans le bon ordre (affichées mélangées) */
  items?: string[];
  explanation: string;
  /** identifiant de l'étude de cas à laquelle la question appartient */
  case?: string;
};

export type Exam = {
  code: string;
  title: string;
  /** rappel des conditions réelles de l'examen */
  realExam: string;
  domains: Record<string, string>;
  cases?: Record<string, { title: string; text: string }>;
  questions: ExamQuestion[];
};

const examsDir = path.join(process.cwd(), "data", "exams");

// Les options sont rédigées avec la bonne réponse à une place quelconque ; on les mélange
// ici de façon stable (graine = texte de la question) pour répartir A, B, C, D sans biais.
function seedOf(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function shuffleOptions(q: ExamQuestion): ExamQuestion {
  if ((q.type !== "single" && q.type !== "multi") || !q.options) return q;
  const order = q.options.map((_, i) => i);
  let s = seedOf(q.q);
  for (let i = order.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  const newIndex = (old: number) => order.indexOf(old);
  return {
    ...q,
    options: order.map((i) => q.options![i]),
    answer: Array.isArray(q.answer) ? q.answer.map(newIndex) : newIndex(q.answer as number),
  };
}

export function getExams(): Exam[] {
  if (!fs.existsSync(examsDir)) return [];
  return fs
    .readdirSync(examsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(examsDir, f), "utf-8")) as Exam)
    .map((e) => {
      const qs = e.questions.map(shuffleOptions);
      // l'étude de cas vient toujours à la fin, comme à l'examen réel
      return { ...e, questions: [...qs.filter((q) => !q.case), ...qs.filter((q) => q.case)] };
    });
}
