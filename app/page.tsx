import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Lexique from "@/components/Lexique";
import Roadmap from "@/components/Roadmap";

const categoryMeta: Record<string, { color: string; bg: string; border: string; icon: string; desc: string }> = {
  "AI-200": { color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100", icon: "☁️", desc: "Azure AI Cloud Developer Associate" },
  "React": { color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-100", icon: "⚛️", desc: "Hooks, patterns et bonnes pratiques" },
  "Interview": { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100", icon: "💼", desc: "Révision entretien C# — Fondamentaux, Avancé, Cheat Sheet" },
};

export default async function Home() {
  const modules = await prisma.module.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          progress: true,
          _count: { select: { questions: true } },
        },
      },
    },
  });

  const categories = [...new Set(modules.map((m) => m.category))];
  const totalUnits = modules.reduce((a, m) => a + m.units.length, 0);
  const completedUnits = modules.reduce(
    (a, m) => a + m.units.filter((u) => u.progress.some((p) => p.completed)).length,
    0
  );
  const totalQ = modules.reduce((a, m) => a + m.units.reduce((b, u) => b + u._count.questions, 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white p-8 mb-10 shadow-lg shadow-indigo-100">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-widest">Espace de révision</p>
          <h1 className="text-3xl font-bold mb-2">CertPrep</h1>
          <p className="text-indigo-100 text-sm max-w-md">Cours condensés · Quiz par unité · Flashcards · Exercices pratiques</p>
          <Link href="/vue-globale" className="inline-flex items-center gap-2 mt-4 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors border border-white/20">
            🗺️ Comprendre pourquoi tout est lié →
          </Link>
        </div>
        <div className="relative z-10 flex gap-6 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{totalUnits}</p>
            <p className="text-indigo-200 text-xs">Unités</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalQ}</p>
            <p className="text-indigo-200 text-xs">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{completedUnits}/{totalUnits}</p>
            <p className="text-indigo-200 text-xs">Complétées</p>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-white/5 rounded-full" />
      </div>

      {/* Main layout: modules + lexique */}
      <div className="flex flex-col lg:flex-row gap-8">

      {/* Modules par catégorie */}
      <div className="flex-1 min-w-0">
      {categories.map((cat) => {
        const meta = categoryMeta[cat] ?? { color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-100", icon: "📚", desc: "" };
        const catModules = modules.filter((m) => m.category === cat);
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
              {catModules.map((mod) => {
                const doneCount = mod.units.filter((u) => u.progress.some((p) => p.completed)).length;
                const pct = mod.units.length > 0 ? Math.round((doneCount / mod.units.length) * 100) : 0;

                return (
                  <div key={mod.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden">
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
                          const done = unit.progress.some((p) => p.completed);
                          const lastP = unit.progress[unit.progress.length - 1];
                          const unitPct = lastP?.totalQ ? Math.round((lastP.score / lastP.totalQ) * 100) : null;
                          return (
                            <div key={unit.id} className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors group ${unit.isLab ? "bg-emerald-50 hover:bg-emerald-100" : "bg-slate-50 hover:bg-indigo-50"}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? "bg-emerald-100 text-emerald-600" : unit.isLab ? "bg-emerald-200 text-emerald-700" : "bg-slate-200 text-slate-400"}`}>
                                {done ? "✓" : unit.isLab ? "🔬" : unit.order}
                              </div>
                              <span className={`text-sm flex-1 leading-tight ${unit.isLab ? "text-emerald-800 font-medium" : "text-slate-700"}`}>{unit.title}</span>
                              {unit.isLab && <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-medium shrink-0">Lab</span>}
                              {unitPct !== null && (
                                <span className={`text-xs font-semibold ${unitPct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{unitPct}%</span>
                              )}
                              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/unit/${unit.slug}`} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-colors">Cours</Link>
                                <Link href={`/quiz/${unit.slug}`} className="text-xs bg-violet-600 text-white px-2 py-1 rounded-lg hover:bg-violet-700 transition-colors">Quiz</Link>
                                <Link href={`/flashcards/${unit.slug}`} className="text-xs bg-amber-500 text-white px-2 py-1 rounded-lg hover:bg-amber-600 transition-colors">Cartes</Link>
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
              })}
            </div>
          </section>
        );
      })}

      {modules.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-4">📭</p>
          <p className="font-medium text-slate-500">Aucun module disponible</p>
          <code className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg mt-4 inline-block">npx tsx prisma/seed.ts</code>
        </div>
      )}
      </div>{/* end modules */}

      {/* Sidebar */}
      <aside className="lg:w-72 shrink-0">
        <div className="sticky top-20">
          <Lexique />
          <Roadmap />
        </div>
      </aside>

      </div>{/* end main layout */}
    </div>
  );
}
