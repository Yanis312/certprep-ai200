import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMarkdownContent } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await prisma.module.findUnique({ where: { slug }, include: { questions: { select: { id: true } } } });
  if (!mod) notFound();

  const { content } = getMarkdownContent(mod.category, slug);
  const qCount = mod.questions.length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{mod.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Main content */}
        <article className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <span className="text-xs text-indigo-200 font-medium uppercase tracking-widest">{mod.category}</span>
              <h1 className="text-2xl font-bold text-white mt-1">{mod.title}</h1>
              <p className="text-indigo-200 text-sm mt-1">{mod.description}</p>
            </div>
            {/* Body */}
            <div className="px-8 py-8">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="sticky top-20 space-y-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Continuer avec</p>

            <Link href={`/quiz/${slug}`} className="flex items-center gap-3 w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-3.5 rounded-xl transition-colors shadow-sm shadow-violet-100 group">
              <span className="text-xl">🧠</span>
              <div className="text-left">
                <p className="font-semibold text-sm">Quiz</p>
                <p className="text-xs text-violet-200">{qCount} questions</p>
              </div>
            </Link>

            <Link href={`/flashcards/${slug}`} className="flex items-center gap-3 w-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-3.5 rounded-xl transition-colors shadow-sm shadow-amber-100">
              <span className="text-xl">🃏</span>
              <div className="text-left">
                <p className="font-semibold text-sm">Flashcards</p>
                <p className="text-xs text-amber-100">{qCount} cartes</p>
              </div>
            </Link>

            <Link href="/" className="flex items-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-4 py-3.5 rounded-xl transition-colors">
              <span className="text-xl">🏠</span>
              <p className="font-medium text-sm">Accueil</p>
            </Link>

            {/* Tip */}
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-semibold text-indigo-700 mb-1">💡 Conseil</p>
              <p className="text-xs text-indigo-500 leading-relaxed">Lis le cours, fais le quiz, puis les flashcards pour bien mémoriser.</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
