import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllUnitSlugs, getUnit } from "@/lib/course";
import { getMarkdownContent } from "@/lib/markdown";
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/module/${unit.module.slug}`} className="hover:text-indigo-600 transition-colors">{unit.module.title}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{unit.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main content */}
        <article className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <span className="text-xs text-indigo-200 font-medium uppercase tracking-widest">{unit.module.category} · Unité {unit.order}</span>
              <h1 className="text-2xl font-bold text-white mt-1">{unit.title}</h1>
            </div>
            <div className="px-5 sm:px-8 py-8">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-20 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Continuer avec</p>

            {qCount > 0 && (
              <>
              <Link href={`/quiz/${slug}`} className="flex items-center gap-3 w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-3.5 rounded-xl transition-colors shadow-sm shadow-violet-100">
                <span className="text-xl">🧠</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Quiz</p>
                  <p className="text-xs text-violet-200">{qCount} question{qCount > 1 ? "s" : ""}</p>
                </div>
              </Link>

              <Link href={`/flashcards/${slug}`} className="flex items-center gap-3 w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-3.5 rounded-xl transition-colors shadow-sm shadow-amber-100">
                <span className="text-xl">🃏</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">Flashcards</p>
                  <p className="text-xs text-amber-100">{qCount} cartes</p>
                </div>
              </Link>
              </>
            )}

            <Link href={`/module/${unit.module.slug}`} className="flex items-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-3.5 rounded-xl transition-colors">
              <span className="text-xl">📋</span>
              <p className="font-medium text-sm">Toutes les unités</p>
            </Link>

            <Link href="/" className="flex items-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-3.5 rounded-xl transition-colors">
              <span className="text-xl">🏠</span>
              <p className="font-medium text-sm">Accueil</p>
            </Link>

            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-semibold text-indigo-700 mb-1">Méthode recommandée</p>
              <p className="text-xs text-indigo-500 leading-relaxed">Cours → Quiz → Flashcards pour ancrer les concepts.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
