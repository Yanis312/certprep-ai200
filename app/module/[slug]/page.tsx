import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await prisma.module.findUnique({
    where: { slug },
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
  if (!mod) notFound();

  const doneCount = mod.units.filter((u) => u.progress.some((p) => p.completed)).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{mod.title}</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">{mod.category}</p>
          <h1 className="text-2xl font-bold text-white mt-1">{mod.title}</h1>
          <p className="text-indigo-200 text-sm mt-1">{mod.description}</p>
          <p className="text-indigo-300 text-xs mt-3">{doneCount}/{mod.units.length} unités complétées</p>
        </div>

        <div className="px-8 py-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Unités du module</p>
          <div className="space-y-3">
            {mod.units.map((unit) => {
              const done = unit.progress.some((p) => p.completed);
              const lastP = unit.progress[unit.progress.length - 1];
              const pct = lastP?.totalQ ? Math.round((lastP.score / lastP.totalQ) * 100) : null;
              const qCount = unit._count.questions;

              return (
                <div key={unit.id} className={`border rounded-2xl p-4 hover:shadow-sm transition-all ${unit.isLab ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300" : "border-slate-100 hover:border-indigo-100"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${done ? "bg-emerald-100 text-emerald-600" : unit.isLab ? "bg-emerald-100 text-emerald-700" : "bg-indigo-50 text-indigo-600"}`}>
                        {done ? "✓" : unit.isLab ? "🔬" : unit.order}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800 text-sm">{unit.title}</p>
                          {unit.isLab && <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-medium">Lab</span>}
                        </div>
                        <p className="text-xs text-slate-400">{qCount} question{qCount > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    {pct !== null && (
                      <span className={`text-sm font-bold ${pct >= 70 ? "text-emerald-500" : "text-amber-500"}`}>{pct}%</span>
                    )}
                  </div>

                  {pct !== null && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
                      <div className={`h-1.5 rounded-full transition-all ${pct >= 70 ? "bg-emerald-400" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/unit/${unit.slug}`} className="flex-1 text-center text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                      📖 Cours
                    </Link>
                    <Link href={`/quiz/${unit.slug}`} className="flex-1 text-center text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                      🧠 Quiz
                    </Link>
                    <Link href={`/flashcards/${unit.slug}`} className="flex-1 text-center text-xs bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-colors font-medium">
                      🃏 Flashcards
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
