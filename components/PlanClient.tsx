"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/lib/types";
import { isDone, resetAll, useProgress, useWeeksDone } from "@/lib/progress";
import { domains, exam, learningPaths, method, weeks, type DomainId } from "@/data/plan";

export default function PlanClient({ modules }: { modules: ModuleSummary[] }) {
  const progress = useProgress();
  const [weeksDone, toggleWeek] = useWeeksDone();

  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const lpById = new Map(learningPaths.map((lp) => [lp.id, lp]));
  const moduleDone = (slug: string | undefined) => {
    const m = slug ? bySlug.get(slug) : undefined;
    return !!m && m.units.length > 0 && m.units.every((u) => isDone(progress[u.slug]));
  };

  function handleReset() {
    if (window.confirm("Effacer toute ta progression (quiz et semaines cochées) ?")) resetAll();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Plan de révision</span>
      </div>

      {/* En-tête */}
      <div className="rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white p-6 sm:p-8 mb-8 shadow-lg shadow-indigo-100">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">Plan de révision · 10 semaines</p>
        <h1 className="text-2xl font-bold mt-1">{exam.code} — {exam.title}</h1>
        <p className="text-indigo-100 text-sm mt-2">Du 5 octobre au 13 décembre 2026 · environ 7 à 8 h par semaine</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 pt-6 border-t border-white/20 text-sm">
          <div><p className="font-bold">{exam.duration}</p><p className="text-indigo-200 text-xs">Durée</p></div>
          <div><p className="font-bold">{exam.passScore}</p><p className="text-indigo-200 text-xs">Score requis</p></div>
          <div><p className="font-bold">{exam.price}</p><p className="text-indigo-200 text-xs">Prix</p></div>
          <div><p className="font-bold">{weeksDone.length}/{weeks.length}</p><p className="text-indigo-200 text-xs">Semaines faites</p></div>
        </div>
      </div>

      {/* Poids des domaines */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Ce que pèse chaque domaine à l&apos;examen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(domains) as unknown as DomainId[]).map((id) => {
            const d = domains[id];
            const lps = learningPaths.filter((lp) => lp.domain === Number(id)).map((lp) => lp.id).join(", ");
            return (
              <div key={id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${d.color}`}>{d.weight}</span>
                <p className="font-semibold text-slate-800 text-sm mt-2">{d.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{lps}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Méthode */}
      <section className="mb-8 bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <h2 className="text-xs font-semibold text-indigo-700 uppercase tracking-widest mb-3">La méthode, à chaque unité</h2>
        <ol className="space-y-1.5">
          {method.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-indigo-900">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Semaines */}
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Semaine par semaine</h2>
      <div className="space-y-4">
        {weeks.map((w) => {
          const done = weeksDone.includes(w.id);
          const planModules = w.lps.flatMap((id) => lpById.get(id)?.modules ?? []).filter((m) => !m.bonus);
          const validated = planModules.filter((m) => moduleDone(m.site)).length;
          return (
            <div key={w.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${done ? "border-emerald-200" : "border-slate-100"}`}>
              <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4 ${done ? "bg-emerald-50" : "bg-slate-50"}`}>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${done ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white"}`}>{w.id}</span>
                <div className="flex-1 min-w-48">
                  <p className="font-bold text-slate-800 text-sm">{w.title}</p>
                  <p className="text-xs text-slate-400">
                    {w.dates}
                    {w.lps.length > 0 && ` · ${w.lps.join(" + ")}`}
                    {planModules.length > 0 && ` · ${validated}/${planModules.length} modules validés par quiz`}
                  </p>
                </div>
                <button
                  onClick={() => toggleWeek(w.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${done ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"}`}
                >
                  {done ? "✓ Semaine faite" : "Marquer comme faite"}
                </button>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-1.5">
                  {w.tasks.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-700">
                      <span className="text-slate-300 shrink-0">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mt-3">
                  <span className="font-semibold">À retenir : </span>{w.focus}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 text-xs">
        <a href={exam.studyGuide} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">Guide d&apos;étude officiel ↗</a>
        <button onClick={handleReset} className="text-slate-400 hover:text-red-500 transition-colors">Réinitialiser ma progression</button>
      </div>
      <p className="text-xs text-slate-300 mt-3">Ta progression est enregistrée dans ce navigateur uniquement.</p>
    </div>
  );
}
