import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllUnitSlugs, getModules, getUnit } from "@/lib/course";
import { getMarkdownContent } from "@/lib/markdown";
import { certOf, moduleLabel, unitSteps } from "@/lib/path";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllUnitSlugs();
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = getUnit(slug);
  if (!found) notFound();
  const unit = { ...found.unit, module: found.module };

  const { content } = getMarkdownContent(unit.module.category, slug);
  const qCount = unit.questions.length;

  // Position dans le parcours de révision
  const cert = certOf(unit.module.category);
  const steps = cert ? unitSteps(getModules(), cert) : [];
  const idx = steps.findIndex((s) => s.slug === slug);
  const prev = idx > 0 ? steps[idx - 1] : null;
  const next = idx >= 0 && idx + 1 < steps.length ? steps[idx + 1] : null;
  const label = cert ? moduleLabel(cert, unit.module.slug) : null;
  const unitPos = unit.module.units.findIndex((u) => u.slug === slug) + 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/module/${unit.module.slug}`} className="hover:text-indigo-600 transition-colors">{unit.module.title}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{unit.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Contenu */}
        <article className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
              <p className="text-xs text-indigo-200 font-medium uppercase tracking-widest">
                {label ? `${label} · ` : `${unit.module.category} · `}Unité {unitPos} sur {unit.module.units.length}
              </p>
              <p className="text-sm text-indigo-100 mt-1">{unit.module.title}</p>
              <h1 className="text-2xl font-bold text-white mt-2">{unit.title}</h1>
            </div>
            <div className="px-5 sm:px-8 py-8">
              <MarkdownRenderer content={content} />
            </div>
          </div>

          {/* Étape suivante */}
          <div className="mt-6 space-y-3">
            {qCount > 0 && (
              <Link href={`/quiz/${slug}`} className="flex items-center justify-between gap-3 w-full bg-violet-600 hover:bg-violet-700 text-white px-5 py-4 rounded-2xl transition-colors shadow-sm">
                <span>
                  <span className="block text-xs text-violet-200">Étape suivante</span>
                  <span className="block font-semibold">🧠 Faire le quiz de cette unité ({qCount} questions)</span>
                </span>
                <span className="text-xl">→</span>
              </Link>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/unit/${prev.slug}`} className="bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl px-4 py-3 transition-colors">
                  <span className="block text-xs text-slate-400">← Unité précédente</span>
                  <span className="block text-sm font-medium text-slate-700 leading-snug">{prev.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link href={`/unit/${next.slug}`} className="bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl px-4 py-3 transition-colors sm:text-right">
                  <span className="block text-xs text-slate-400">
                    Unité suivante →{next.moduleSlug !== unit.module.slug && " · nouveau module"}
                  </span>
                  <span className="block text-sm font-medium text-slate-700 leading-snug">{next.title}</span>
                </Link>
              )}
            </div>
          </div>
        </article>

        {/* Barre latérale : le module en cours */}
        <aside className="lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-20 space-y-3">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Dans ce module</p>
              <Link href={`/module/${unit.module.slug}`} className="block text-sm font-semibold text-indigo-700 hover:underline leading-snug mb-3">
                {unit.module.title}
              </Link>
              <ol className="space-y-1">
                {unit.module.units.map((u, i) => {
                  const current = u.slug === slug;
                  return (
                    <li key={u.slug}>
                      <Link
                        href={`/unit/${u.slug}`}
                        className={`flex gap-2 text-xs leading-snug px-2 py-1.5 rounded-lg transition-colors ${current ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        <span className="shrink-0 w-4 text-right">{i + 1}.</span>
                        <span>{u.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </div>

            {qCount > 0 && (
              <Link href={`/flashcards/${slug}`} className="flex items-center gap-3 w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl transition-colors">
                <span className="text-xl">🃏</span>
                <span className="font-semibold text-sm">Flashcards ({qCount})</span>
              </Link>
            )}

            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-semibold text-indigo-700 mb-1">La méthode</p>
              <p className="text-xs text-indigo-500 leading-relaxed">« L&apos;essentiel » et « Point examen » → quiz → relire seulement ce qui est raté.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
