"use client";

import Link from "next/link";
import type { ModuleSummary } from "@/lib/types";
import { isDone, useProgress } from "@/lib/progress";
import { certCodes, moduleLearnUrl } from "@/data/certs";
import CertTabs, { useCert } from "@/components/CertTabs";
import ModuleCard from "@/components/ModuleCard";
import Lexique from "@/components/Lexique";
import Roadmap from "@/components/Roadmap";
import { unitSteps } from "@/lib/path";
import BackupReminder from "@/components/BackupReminder";

const categoryMeta: Record<string, { color: string; bg: string; border: string; icon: string; desc: string }> = {
  "React": { color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-100", icon: "⚛️", desc: "Hooks, patterns et bonnes pratiques" },
  "Interview": { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", icon: "💼", desc: "Révision entretien C# — Fondamentaux, Avancé, Cheat Sheet" },
};

export default function HomeClient({ modules }: { modules: ModuleSummary[] }) {
  const progress = useProgress();
  const [cert, setCert] = useCert();
  const { exam, domains, learningPaths, pairs } = cert;

  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const moduleDone = (m: ModuleSummary | undefined) =>
    !!m && m.units.length > 0 && m.units.every((u) => isDone(progress[u.slug]));

  const certModules = modules.filter((m) => m.category === cert.code);
  const totalUnits = certModules.reduce((a, m) => a + m.units.length, 0);
  const completedUnits = certModules.reduce((a, m) => a + m.units.filter((u) => isDone(progress[u.slug])).length, 0);
  const totalQ = certModules.reduce((a, m) => a + m.units.reduce((b, u) => b + u.qCount, 0), 0);

  const planModules = learningPaths.flatMap((lp) => lp.modules);
  const planDone = planModules.filter((pm) => pm.site && moduleDone(bySlug.get(pm.site))).length;

  // Première unité non validée, dans l'ordre de révision
  const steps = unitSteps(modules, cert);
  const resume = steps.find((st) => !isDone(progress[st.slug]));
  const resumeLabel = (() => {
    if (!resume) return null;
    const i = pairs?.findIndex((p) => p.sites.includes(resume.moduleSlug)) ?? -1;
    return i >= 0 && pairs ? (pairs[i].badge ?? `Paire ${i + 1}`) : null;
  })();

  const lpBySite = new Map(learningPaths.flatMap((lp) => lp.modules.map((pm) => [pm.site, lp] as const)));

  const otherCategories = [...new Set(modules.filter((m) => !certCodes.includes(m.category)).map((m) => m.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      <CertTabs current={cert} onChange={setCert} />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white p-6 sm:p-8 mb-10 shadow-lg shadow-indigo-100">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-widest">Espace de révision</p>
          <h1 className="text-3xl font-bold mb-2">CertPrep — {cert.code}</h1>
          <p className="text-indigo-100 text-sm max-w-md">{cert.title} · {exam.duration} · {exam.passScore} pour réussir</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href="/plan" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              📅 Mon plan de révision →
            </Link>
            <Link href="/examen" className="inline-flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
              📝 Examen blanc {cert.code} →
            </Link>
            {cert.overviewHref && (
              <Link href={cert.overviewHref} className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors border border-white/20">
                🗺️ Comprendre pourquoi tout est lié →
              </Link>
            )}
          </div>
        </div>
        <div className="relative z-10 flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{planDone}/{planModules.length}</p>
            <p className="text-indigo-200 text-xs">Modules {cert.code}</p>
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

      <BackupReminder />

      {/* Reprendre où j'en étais */}
      {steps.length > 0 && (
        <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 mb-6 shadow-sm">
          {resume ? (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-56">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Reprendre où j&apos;en étais</p>
                <p className="font-bold text-slate-800 mt-1 leading-snug">{resume.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{resumeLabel ? `${resumeLabel} · ` : ""}{resume.moduleTitle}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/unit/${resume.slug}`} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">📖 Lire la fiche</Link>
                <Link href={`/quiz/${resume.slug}`} className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">🧠 Quiz</Link>
              </div>
            </div>
          ) : (
            <p className="font-semibold text-emerald-700">🏆 Toutes les unités sont validées. Passe au Practice Assessment officiel !</p>
          )}
          <p className="text-xs text-slate-400 mt-3">Une unité est validée quand tu as au moins 70 % à son quiz.</p>
        </div>
      )}

      {/* Sommaire des paires */}
      {pairs && (
        <nav className="flex flex-wrap gap-2 mb-8">
          {pairs.map((pair, i) => {
            const mods = pair.sites.map((sl) => bySlug.get(sl)).filter((m) => m !== undefined);
            const done = mods.length > 0 && mods.every((m) => moduleDone(m));
            return (
              <a key={pair.title} href={`#paire-${i + 1}`} className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${done ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"}`}>
                {done ? "✓ " : ""}{pair.badge ?? i + 1} · {pair.title}
              </a>
            );
          })}
        </nav>
      )}

      {/* Main layout: modules + lexique */}
      <div className="flex flex-col lg:flex-row gap-8">

      <div className="flex-1 min-w-0">

        {/* Révision en paires : le concept, puis sa mise en pratique */}
        {pairs?.map((pair, i) => {
          const pairModules = pair.sites.map((slug) => bySlug.get(slug)).filter((m) => m !== undefined);
          const pairDone = pairModules.filter((m) => moduleDone(m)).length;
          return (
            <section key={pair.title} id={`paire-${i + 1}`} className="mb-10 scroll-mt-20">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 rounded-xl border mb-4 bg-indigo-50 border-indigo-100">
                <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded-lg shrink-0">{pair.badge ?? `Paire ${i + 1}`}</span>
                <div className="flex-1 min-w-48">
                  <h2 className="font-bold text-sm text-indigo-700 leading-snug">{pair.title}</h2>
                  <p className="text-xs text-slate-400">{pairDone}/{pairModules.length} modules validés</p>
                </div>
              </div>

              <div className="space-y-4">
                {pairModules.map((mod) => {
                  const lp = lpBySite.get(mod.slug);
                  return (
                    <div key={mod.slug}>
                      {lp && (
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          <span className="text-xs font-bold text-indigo-700">{lp.id}</span>
                          {lp.domains.map((id) => (
                            <span key={id} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${domains[id].color}`}>{domains[id].label} · {domains[id].weight}</span>
                          ))}
                        </div>
                      )}
                      <ModuleCard mod={mod} progress={progress} />
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Les learning paths officiels de la certification choisie */}
        {!pairs && learningPaths.map((lp) => {
          const lpDone = lp.modules.filter((pm) => pm.site && moduleDone(bySlug.get(pm.site))).length;
          return (
            <section key={lp.id} className="mb-10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 rounded-xl border mb-4 bg-indigo-50 border-indigo-100">
                <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-1 rounded-lg shrink-0">{lp.id}</span>
                <div className="flex-1 min-w-48">
                  <h2 className="font-bold text-sm text-indigo-700 leading-snug">{lp.title}</h2>
                  <p className="text-xs text-slate-400">{lp.duration} · {lpDone}/{lp.modules.length} modules validés</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lp.domains.map((id) => (
                    <span key={id} className={`text-xs px-2 py-0.5 rounded-full border font-medium ${domains[id].color}`}>{domains[id].label} · {domains[id].weight}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {lp.modules.map((pm) => {
                  const mod = pm.site ? bySlug.get(pm.site) : undefined;
                  if (mod) return <ModuleCard key={pm.title} mod={mod} progress={progress} />;
                  return (
                    <div key={pm.title} className="flex flex-wrap items-center gap-x-3 gap-y-2 bg-white rounded-2xl border border-dashed border-slate-200 px-5 py-4">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-300 flex items-center justify-center text-xs shrink-0">○</span>
                      <span className="text-sm text-slate-500 flex-1 min-w-48 leading-tight">{pm.title}</span>
                      {pm.bonus && <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">Bonus</span>}
                      <span className="text-xs text-slate-400 shrink-0">Fiche à venir</span>
                      <a href={moduleLearnUrl(pm)} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium shrink-0">Microsoft Learn ↗</a>
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
