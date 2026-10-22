import { certs } from "@/data/certs";
import type { Cert } from "@/data/certs/types";

// Ordre de révision d'une certification : sert à « Reprendre », « Unité suivante »
// et aux étiquettes « Paire 3 · LP1 ». Utilisable côté serveur comme côté client.

type ModuleLike = { slug: string; title: string; category: string; units: { slug: string; title: string }[] };

export type Step = { slug: string; title: string; moduleSlug: string; moduleTitle: string };

export const certOf = (category: string): Cert | undefined => certs.find((c) => c.code === category);

/** Les modules dans l'ordre de révision : les paires si elles existent, sinon les learning paths, puis le reste */
export function moduleOrder(cert: Cert, slugs: string[]): string[] {
  const planned = cert.pairs
    ? cert.pairs.flatMap((p) => p.sites)
    : cert.learningPaths.flatMap((lp) => lp.modules.flatMap((m) => (m.site ? [m.site] : [])));
  return [...planned.filter((s) => slugs.includes(s)), ...slugs.filter((s) => !planned.includes(s))];
}

/** Où se situe un module dans le parcours, par exemple « Paire 3 · LP1 » */
export function moduleLabel(cert: Cert, slug: string): string | null {
  const pairIdx = cert.pairs?.findIndex((p) => p.sites.includes(slug)) ?? -1;
  const pair = pairIdx >= 0 ? cert.pairs?.[pairIdx] : undefined;
  const lp = cert.learningPaths.find((l) => l.modules.some((m) => m.site === slug));
  const parts = [pair ? (pair.badge ?? `Paire ${pairIdx + 1}`) : null, lp?.id ?? null].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Toutes les unités d'une certification, dans l'ordre de révision */
export function unitSteps(modules: ModuleLike[], cert: Cert): Step[] {
  const own = modules.filter((m) => m.category === cert.code);
  const bySlug = new Map(own.map((m) => [m.slug, m]));
  return moduleOrder(cert, own.map((m) => m.slug)).flatMap((slug) => {
    const m = bySlug.get(slug)!;
    return m.units.map((u) => ({ slug: u.slug, title: u.title, moduleSlug: m.slug, moduleTitle: m.title }));
  });
}
