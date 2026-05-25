import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuizClient from "@/components/QuizClient";

export default async function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await prisma.module.findUnique({ where: { slug }, include: { questions: true } });
  if (!mod) notFound();

  const questions = mod.questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options) as string[],
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-2xl mx-auto text-center mt-20">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">← Retour</Link>
          <p className="text-gray-400 text-lg">Aucune question disponible pour ce module.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Retour</Link>
        <h1 className="text-2xl font-bold mb-1">{mod.title}</h1>
        <p className="text-purple-400 text-sm mb-8">{questions.length} questions</p>
        <QuizClient questions={questions} moduleSlug={slug} moduleTitle={mod.title} />
      </div>
    </main>
  );
}
