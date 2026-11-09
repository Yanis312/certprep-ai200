"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/lib/types";
import { isDone, pctOf, resetAll, useProgress, useTasksDone } from "@/lib/progress";
import CertTabs, { useCert } from "@/components/CertTabs";
import type { Task } from "@/data/certs/types";

export default function PlanClient({ modules }: { modules: ModuleSummary[] }) {
  const progress = useProgress();
  const [tasksDone, toggleTask] = useTasksDone();
  const [cert, setCert] = useCert();
  const { exam, domains, learningPaths, method, weeks } = cert;

  const taskId = (weekId: string, i: number) => `${cert.code}:${weekId}-${i}`;

  // Une tâche reliée à des modules ou des unités est faite toute seule quand leurs quiz sont validés
  const allUnits = modules.flatMap((m) => m.units);
  const unitsOf = (t: Task) => {
    if (typeof t === "string") return [];
    const fromModules = (t.modules ?? []).flatMap((sl) => modules.find((m) => m.slug === sl)?.units ?? []);
    const fromUnits = (t.units ?? []).flatMap((sl) => allUnits.filter((u) => u.slug === sl));
    return [...fromModules, ...fromUnits];
  };
  const autoDone = (t: Task) => {
    const us = unitsOf(t);
    return us.length > 0 && us.every((u) => isDone(progress[u.slug]));
  };
  const isTaskDone = (weekId: string, i: number, t: Task) => tasksDone.includes(taskId(weekId, i)) || autoDone(t);
  const weekChecked = (w: (typeof weeks)[number]) => w.tasks.filter((t, i) => isTaskDone(w.id, i, t)).length;
  // La première tâche pas encore faite : c'est là que tu en es
  const here = (() => {
    for (const w of weeks) {
      const i = w.tasks.findIndex((t, k) => !isTaskDone(w.id, k, t));
      if (i >= 0) return taskId(w.id, i);
    }
    return null;
  })();
  const totalTasks = weeks.reduce((a, w) => a + w.tasks.length, 0);
  const checkedTasks = weeks.reduce((a, w) => a + weekChecked(w), 0);
  const weeksDone = weeks.filter((w) => weekChecked(w) === w.tasks.length).length;
  const globalPct = Math.round((checkedTasks / totalTasks) * 100);

  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const lpById = new Map(learningPaths.map((lp) => [lp.id, lp]));
  const moduleDone = (slug: string | undefined) => {
    const m = slug ? bySlug.get(slug) : undefined;
    return !!m && m.units.length > 0 && m.units.every((u) => isDone(progress[u.slug]));
  };

  function handleReset() {
    if (window.confirm("Effacer toute ta progression (quiz et tâches cochées) ?")) resetAll();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Plan de révision</span>
      </div>

      <CertTabs current={cert} onChange={setCert} />

      {/* En-tête */}
      <div className="rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white p-6 sm:p-8 mb-8 shadow-lg shadow-indigo-100">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">Plan de révision · {weeks.length} semaines</p>
        <h1 className="text-2xl font-bold mt-1">{cert.code} — {cert.title}</h1>
        <p className="text-indigo-100 text-sm mt-2">{cert.planSubtitle}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 pt-6 border-t border-white/20 text-sm">
          <div><p className="font-bold">{exam.duration}</p><p className="text-indigo-200 text-xs">Durée</p></div>
          <div><p className="font-bold">{exam.passScore}</p><p className="text-indigo-200 text-xs">Score requis</p></div>
          <div><p className="font-bold">{exam.price}</p><p className="text-indigo-200 text-xs">Prix</p></div>
          <div><p className="font-bold">{weeksDone}/{weeks.length}</p><p className="text-indigo-200 text-xs">Semaines faites</p></div>
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-indigo-100 mb-1.5">
            <span>{checkedTasks}/{totalTasks} tâches cochées</span>
            <span className="font-bold">{globalPct}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${globalPct}%` }} />
          </div>
        </div>
      </div>

      {/* Poids des domaines */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Ce que pèse chaque domaine à l&apos;examen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(domains).map(Number).map((id) => {
            const d = domains[id];
            const lps = learningPaths.filter((lp) => lp.domains.includes(id)).map((lp) => lp.id).join(", ");
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

      {here && (
        <a href="#ici" className="flex items-center justify-between gap-3 mb-6 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 rounded-2xl font-semibold text-sm transition-colors">
          <span>📍 Aller à l&apos;étape où tu en es</span><span>↓</span>
        </a>
      )}

      {/* Semaines */}
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Semaine par semaine</h2>
      <div className="space-y-4">
        {weeks.map((w) => {
          const checked = weekChecked(w);
          const done = checked === w.tasks.length;
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
                <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold shrink-0 ${done ? "bg-emerald-100 text-emerald-700" : "bg-white border border-slate-200 text-slate-500"}`}>
                  {done ? "✓ Semaine faite" : `${checked}/${w.tasks.length}`}
                </span>
              </div>
              <div className="px-5 py-4">
                <ul className="space-y-1">
                  {w.tasks.map((t, i) => {
                    const id = taskId(w.id, i);
                    const auto = autoDone(t);
                    const isChecked = tasksDone.includes(id) || auto;
                    const isHere = id === here;
                    const text = typeof t === "string" ? t : t.text;
                    const obj = typeof t === "string" ? null : t;
                    return (
                      <li key={id} id={isHere ? "ici" : undefined} className={`scroll-mt-24 rounded-xl ${isHere ? "bg-indigo-50 border border-indigo-200 px-2 -mx-2" : ""}`}>
                        <div className="flex items-start gap-3 text-sm px-2 py-2 -mx-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={auto}
                            onChange={() => toggleTask(id)}
                            className="mt-0.5 w-4 h-4 shrink-0 accent-emerald-500 cursor-pointer disabled:cursor-default"
                            aria-label={text}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={isChecked ? "text-slate-400 line-through" : "text-slate-700"}>{text}</span>
                              {isHere && <span className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">📍 Tu es ici</span>}
                              {auto && <span className="text-xs text-emerald-600 font-medium">quiz validés</span>}
                            </div>
                            {obj && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {(obj.modules ?? []).map((sl) => {
                                  const m = modules.find((mm) => mm.slug === sl);
                                  if (!m) return null;
                                  const done = m.units.filter((u) => isDone(progress[u.slug])).length;
                                  const full = done === m.units.length;
                                  return (
                                    <Link key={sl} href={`/module/${sl}`} className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${full ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-indigo-700 hover:border-indigo-300"}`}>
                                      {full ? "✓ " : ""}{m.title} · {done}/{m.units.length}
                                    </Link>
                                  );
                                })}
                                {(obj.units ?? []).map((sl) => {
                                  const pct = pctOf(progress[sl]);
                                  const ok = isDone(progress[sl]);
                                  const tone = ok ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 hover:border-indigo-300";
                                  return (
                                    <span key={sl} className="flex gap-1.5">
                                      <Link href={`/unit/${sl}`} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${tone} ${ok ? "" : "text-indigo-700"}`}>📖 Fiche</Link>
                                      <Link href={`/quiz/${sl}`} className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${tone} ${ok ? "" : "text-violet-700"}`}>
                                        🧠 Quiz{pct !== null ? ` · ${pct} %` : ""}
                                      </Link>
                                    </span>
                                  );
                                })}
                                {obj.href && (obj.href.startsWith("/")
                                  ? <Link href={obj.href} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">{obj.hrefLabel ?? "Ouvrir →"}</Link>
                                  : <a href={obj.href} target="_blank" rel="noreferrer" className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-indigo-700 font-medium hover:border-indigo-300">{obj.hrefLabel ?? "Ouvrir ↗"}</a>)}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
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
