export type Domain = { label: string; weight: string; color: string };

export type PlanModule = {
  title: string;
  /** slug du module sur Microsoft Learn */
  learn?: string;
  /** lien direct quand le slug Learn du module n'est pas connu */
  learnUrl?: string;
  /** slug du module sur ce site (data/modules/<slug>.json) quand la fiche existe */
  site?: string;
  /** module ajouté après coup, absent de la liste officielle des compétences */
  bonus?: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  duration: string;
  /** domaines de l'examen couverts par ce parcours (clés de Cert.domains) */
  domains: number[];
  modules: PlanModule[];
};

export type Week = {
  id: string;
  dates: string;
  title: string;
  lps: string[];
  tasks: string[];
  focus: string;
};

export type Cert = {
  /** code de l'examen, identique au champ "category" des modules (ex. "AI-103") */
  code: string;
  title: string;
  icon: string;
  /** page de synthèse propre à la certification, si elle existe */
  overviewHref?: string;
  exam: {
    duration: string;
    passScore: string;
    price: string;
    status: string;
    languages: string;
    studyGuide: string;
  };
  domains: Record<number, Domain>;
  planSubtitle: string;
  learningPaths: LearningPath[];
  weeks: Week[];
  method: string[];
};
