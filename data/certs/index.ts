import type { Cert, PlanModule } from "./types";
import { ai103 } from "./ai103";
import { ai200 } from "./ai200";

// La première certification de la liste est celle affichée par défaut.
export const certs: Cert[] = [ai103, ai200];

export const certCodes = certs.map((c) => c.code);

export const moduleLearnUrl = (pm: PlanModule) =>
  pm.learnUrl ?? `https://learn.microsoft.com/fr-fr/training/modules/${pm.learn}/`;

export type { Cert, Domain, LearningPath, PlanModule, Week } from "./types";
