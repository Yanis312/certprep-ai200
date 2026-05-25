import Link from "next/link";
import { prisma } from "@/lib/prisma";

const categoryMeta: Record<string, { color: string; bg: string; icon: string; desc: string }> = {
  "AI-200": { color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100", icon: "☁️", desc: "Azure AI Cloud Developer Associate" },
  "React / TypeScript": { color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-100", icon: "⚛️", desc: "Hooks, patterns et bonnes pratiques" },
};

const modeMeta = [
  { key: "module", label: "Cours", icon: "📖", color: "bg-indigo-600 hover:bg-indigo-700", hint: "Lire" },
  { key: "quiz", label: "Quiz", icon: "🧠", color: "bg-violet-600 hover:bg-violet-700", hint: "S'évaluer" },
  { key: "flashcards", label: "Flashcards", icon: "🃏", color: "bg-amber-500 hover:bg-amber-600", hint: "Mémoriser" },
];

export default async function Home() {
  const modules = await prisma.module.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { progress: true, questions: { select: { id: true } } },
  });

  const categories = [...new Set(modules.map((m) => m.category))];
  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.progress.some((p) => p.completed)).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white p-8 mb-10 shadow-lg shadow-indigo-100">
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1 uppercase tracking-widest">Bienvenue</p>
          <h1 className="text-3xl font-bold mb-2">Espace de révision</h1>
          <p className="text-indigo-100 text-sm max-w-md">Cours condensés · Quiz interactifs · Flashcards · Exercices pratiques</p>
        </div>
        {/* Stats */}
        <div className="relative z-10 flex gap-6 mt-6 pt-6 border-t border-white/20">
          <div>
            <p className="text-2xl font-bold">{totalModules}</p>
            <p className="text-indigo-200 text-xs">Modules</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{modules.reduce((a, m) => a + m.questions.length, 0)}</p>
            <p className="text-indigo-200 text-xs">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{completedModules}/{totalModules}</p>
            <p className="text-indigo-200 text-xs">Complétés</p>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
        <div className="absolute -bottom-6 -right-4 w-28 h-28 bg-white/5 rounded-full" />
      </div>

      {/* Modules par catégorie */}
      {categories.map((cat) => {
        const meta = categoryMeta[cat] ?? { color: "text-slate-600", bg: "bg-slate-50 border-slate-100", icon: "📚", desc: "" };
        const catModules = modules.filter((m) => m.category === cat);
        return (
          <section key={cat} className="mb-10">
            {/* Category header */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 ${meta.bg}`}>
              <span className="text-xl">{meta.icon}</span>
              <div>
                <h2 className={`font-bold text-sm ${meta.color}`}>{cat}</h2>
                <p className="text-xs text-slate-400">{meta.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catModules.map((mod) => {
                const lastP = mod.progress[mod.progress.length - 1];
                const pct = lastP?.totalQ ? Math.round((lastP.score / lastP.totalQ) * 100) : 0;
                const qCount = mod.questions.length;

                return (
                  <div key={mod.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden">
                    {/* Top bar */}
                    <div className={`h-1 w-full ${lastP?.completed ? "bg-linear-to-r from-emerald-400 to-green-500" : pct > 0 ? "bg-linear-to-r from-indigo-400 to-purple-500" : "bg-slate-100"}`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm leading-snug">{mod.title}</h3>
                        {lastP?.completed && (
                          <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full font-medium shrink-0 ml-2">✓ Complété</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{mod.description}</p>

                      {/* Progress */}
                      {lastP?.totalQ ? (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                            <span>Dernier score</span>
                            <span className={`font-semibold ${pct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full transition-all ${pct >= 70 ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 text-xs text-slate-300 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-200 inline-block" />
                          Pas encore commencé · {qCount} question{qCount > 1 ? "s" : ""}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2">
                        {modeMeta.map(({ key, label, icon, color }) => (
                          <Link key={key} href={`/${key}/${mod.slug}`} className={`flex-1 text-center text-xs text-white ${color} px-2 py-2 rounded-lg transition-colors font-medium`}>
                            {icon} {label}
                          </Link>
                        ))}
                      </div>
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
          <p className="text-sm mt-1">Lance le seed pour ajouter les modules.</p>
          <code className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg mt-4 inline-block">npx tsx prisma/seed.ts</code>
        </div>
      )}
    </div>
  );
}
