import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = await prisma.unit.findUnique({
    where: { slug },
    include: { questions: true, module: true },
  });
  if (!unit) notFound();

  const questions = unit.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options) as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  if (questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-slate-500">Aucune question disponible pour cette unité.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">← Retour à l&apos;accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/module/${unit.module.slug}`} className="hover:text-indigo-600 transition-colors">{unit.module.title}</Link>
        <span>/</span>
        <Link href={`/unit/${slug}`} className="hover:text-indigo-600 transition-colors">{unit.title}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Quiz</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-violet-600 to-purple-600 px-8 py-5">
          <p className="text-violet-200 text-xs font-medium uppercase tracking-widest">Quiz</p>
          <h1 className="text-xl font-bold text-white mt-0.5">{unit.title}</h1>
          <p className="text-violet-200 text-xs mt-1">{questions.length} questions · 4 choix par question</p>
        </div>
        <div className="px-8 py-8">
          <QuizClient questions={questions} unitSlug={slug} moduleSlug={unit.module.slug} />
        </div>
      </div>
    </div>
  );
}
