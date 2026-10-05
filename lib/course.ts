import fs from "fs";
import path from "path";
import type { Module, ModuleSummary, Unit } from "./types";

// Source de vérité du contenu : un fichier JSON par module dans data/modules.
// Lu uniquement au build (export statique), jamais côté navigateur.
const modulesDir = path.join(process.cwd(), "data", "modules");

type RawModule = Omit<Module, "units"> & {
  units: (Omit<Unit, "questions"> & { questions: Omit<Unit["questions"][number], "id">[] })[];
};

let cache: Module[] | null = null;

export function getModules(): Module[] {
  if (cache) return cache;
  cache = fs
    .readdirSync(modulesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(modulesDir, f), "utf-8")) as RawModule)
    .map((m) => ({
      ...m,
      units: [...m.units]
        .sort((a, b) => a.order - b.order)
        .map((u) => ({ ...u, questions: u.questions.map((q, i) => ({ ...q, id: `${u.slug}-${i}` })) })),
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order);
  return cache;
}

export function getModule(slug: string): Module | undefined {
  return getModules().find((m) => m.slug === slug);
}

export function getUnit(slug: string): { unit: Unit; module: Module } | undefined {
  for (const mod of getModules()) {
    const unit = mod.units.find((u) => u.slug === slug);
    if (unit) return { unit, module: mod };
  }
  return undefined;
}

export function getAllUnitSlugs(): { slug: string }[] {
  return getModules().flatMap((m) => m.units.map((u) => ({ slug: u.slug })));
}

export function summarize(mod: Module): ModuleSummary {
  return {
    ...mod,
    units: mod.units.map(({ questions, ...u }) => ({ ...u, qCount: questions.length })),
  };
}
