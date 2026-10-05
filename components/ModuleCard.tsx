"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/lib/types";
import { isDone, pctOf, type ProgressMap } from "@/lib/progress";

export default function ModuleCard({ mod, progress }: { mod: ModuleSummary; progress: ProgressMap }) {
  const doneCount = mod.units.filter((u) => isDone(progress[u.slug])).length;
  const pct = mod.units.length > 0 ? Math.round((doneCount / mod.units.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden">
      {/* Progress line */}
      <div className={`h-1 w-full ${pct === 100 ? "bg-linear-to-r from-emerald-400 to-green-500" : pct > 0 ? "bg-linear-to-r from-indigo-400 to-purple-500" : "bg-slate-100"}`} style={pct > 0 && pct < 100 ? { background: `linear-gradient(to right, #818cf8 ${pct}%, #f1f5f9 ${pct}%)` } : {}} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-slate-800 text-base leading-snug">{mod.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
          </div>
          <span className="text-xs text-slate-400 shrink-0 ml-3">{doneCount}/{mod.units.length} unités</span>
        </div>

        {/* Units list */}
        <div className="space-y-2 mb-4">
          {mod.units.map((unit) => {
            const done = isDone(progress[unit.slug]);
            const unitPct = pctOf(progress[unit.slug]);
            return (
              <div key={unit.slug} className={`flex flex-wrap items-center gap-x-3 gap-y-2 py-2 px-3 rounded-xl transition-colors group ${unit.isLab ? "bg-emerald-50 hover:bg-emerald-100" : "bg-slate-50 hover:bg-indigo-50"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-emerald-100 text-emerald-600" : unit.isLab ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-400"}`}>
                  {done ? "✓" : unit.isLab ? "🔬" : unit.order}
                </div>
                <span className={`text-sm flex-1 min-w-40 leading-tight ${unit.isLab ? "text-emerald-800 font-medium" : "text-slate-700"}`}>{unit.title}</span>
                {unit.isLab && <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">Lab</span>}
                {unitPct !== null && (
                  <span className={`text-xs font-semibold ${unitPct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{unitPct}%</span>
                )}
                <div className="flex gap-1.5 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <Link href={`/unit/${unit.slug}`} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-colors">Cours</Link>
                  {unit.qCount > 0 && (
                    <>
                      <Link href={`/quiz/${unit.slug}`} className="text-xs bg-violet-600 text-white px-2 py-1 rounded-lg hover:bg-violet-700 transition-colors">Quiz</Link>
                      <Link href={`/flashcards/${unit.slug}`} className="text-xs bg-amber-500 text-white px-2 py-1 rounded-lg hover:bg-amber-600 transition-colors">Cartes</Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Link href={`/module/${mod.slug}`} className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          Voir le module complet →
        </Link>
      </div>
    </div>
  );
}
