"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/lib/types";
import { isDone, useProgress } from "@/lib/progress";
import { domains, exam, learningPaths, learnModuleUrl } from "@/data/plan";
import ModuleCard from "@/components/ModuleCard";
import Lexique from "@/components/Lexique";
import Roadmap from "@/components/Roadmap";

const categoryMeta: Record<string, { color: string; bg: string; border: string; icon: string; desc: string }> = {
  "React": { color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-100", icon: "⚛️", desc: "Hooks, patterns et bonnes pratiques" },
  "Interview": { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", icon: "💼", desc: "Révision entretien C# — Fondamentaux, Avancé, Cheat Sheet" },
};

export default function HomeClient({ modules }: { modules: ModuleSummary[] }) {
  const progress = useProgress();

  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const moduleDone = (m: ModuleSummary | undefined) =>
    !!m && m.units.length > 0 && m.units.every((u) => isDone(progress[u.slug]));

  const totalUnits = modules.reduce((a, m) => a + m.units.length, 0);
  const completedUnits = modules.reduce((a, m) => a + m.units.filter((u) => isDone(progress[u.slug])).length, 0);
  const totalQ = modules.reduce((a, m) => a + m.units.reduce((b, u) => b + u.qCount, 0), 0);

  const planModules = learningPaths.flatMap((lp) => lp.modules);
  const planDone = planModules.filter((pm) => pm.site && moduleDone(bySlug.get(pm.site))).length;

  const otherCategories = [...new Set(modules.filter((m) => m.category !== "AI-200").map((m) => m.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white p-6 sm:p-8 mb-10 shadow-lg shadow-indigo-100">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-widest">Espace de révision</p>
          <h1 className="text-3xl font-bold mb-2">CertPrep — {exam.code}</h1>
          <p className="text-indigo-100 text-sm max-w-md">{exam.title} · {exam.duration} · {exam.passScore} pour réussir</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href="/plan" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              📅 Mon plan de révision →
            </Link>
            <Link href="/vue-globale" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors border border-white/20">
              🗺️ Comprendre pourquoi tout est lié →
            </Link>
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{planDone}/{planModules.length}</p>
            <p className="text-indigo-200 text-xs">Modules AI-200</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{completedUnits}/{totalUnits}</p>
            <p className="text-indigo-200 text-xs">Unités validées</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalQ}</p>
            <p className="text-indigo-200 text-xs">Questions</p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-white/5 rounded-full" />
      </div>

      {/* Main layout: modules + lexique */}
      <div className="flex flex-col lg:flex-row gap-8">

      <div className="flex-1 min-w-0">

        {/* Parcours AI-200 : les 9 learning paths officiels */}
        {learningPaths.map((lp) => {
          const d = domains[lp.domain];
          const lpDone = lp.modules.filter((pm) => pm.site && moduleDone(bySlug.get(pm.site))).length;
          return (
            <section key={lp.id} className="mb-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 rounded-xl border mb-4 bg-indigo-50 border-indigo-100">
                <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded-lg shrink-0">{lp.id}</span>
                <div className="flex-1 min-w-48">
                  <h2 className="font-bold text-sm text-indigo-700 leading-snug">{lp.title}</h2>
                  <p className="text-xs text-slate-400">{lp.duration} · {lpDone}/{lp.modules.length} modules validés</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${d.color}`}>{d.label} · {d.weight}</span>
              </div>

              <div className="space-y-4">
                {lp.modules.map((pm) => {
                  const mod = pm.site ? bySlug.get(pm.site) : undefined;
                  if (mod) return <ModuleCard key={pm.learn} mod={mod} progress={progress} />;
                  return (
                    <div key={pm.learn} className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-white rounded-2xl border border-dashed border-slate-200 px-5 py-4">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center text-xs shrink-0">○</span>
                      <span className="text-sm text-slate-500 flex-1 min-w-48 leading-tight">{pm.title}</span>
                      {pm.bonus && <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">Bonus</span>}
                      <span className="text-xs text-slate-400 shrink-0">Fiche à venir</span>
                      <a href={learnModuleUrl(pm.learn)} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium shrink-0">Microsoft Learn ↗</a>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Autres révisions */}
        {otherCategories.map((cat) => {
          const meta = categoryMeta[cat] ?? { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", icon: "📚", desc: "" };
          return (
            <section key={cat} className="mb-10">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 ${meta.bg} ${meta.border}`}>
                <span className="text-xl">{meta.icon}</span>
                <div>
                  <h2 className={`font-bold text-sm ${meta.color}`}>{cat}</h2>
                  <p className="text-xs text-slate-400">{meta.desc}</p>
                </div>
              </div>
              <div className="space-y-4">
                {modules.filter((m) => m.category === cat).map((mod) => (
                  <ModuleCard key={mod.slug} mod={mod} progress={progress} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="lg:sticky lg:top-20">
          <Lexique />
          <Roadmap />
        </div>
      </aside>

      </div>
    </div>
  );
}
