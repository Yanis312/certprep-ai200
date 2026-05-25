import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FlashcardsClient from "@/components/FlashcardsClient";

export default async function FlashcardsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await prisma.module.findUnique({ where: { slug }, include: { questions: true } });
  if (!mod) notFound();

  const cards = mod.questions.map((q) => ({
    front: q.question,
    back: q.explanation,
  }));

  if (cards.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-xl mx-auto text-center mt-20">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mb-8 inline-block">← Retour</Link>
          <p className="text-gray-400">Aucune flashcard disponible pour ce module.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">← Retour</Link>
        <h1 className="text-2xl font-bold mb-1">{mod.title}</h1>
        <p className="text-orange-400 text-sm mb-8">{cards.length} flashcards</p>
        <FlashcardsClient cards={cards} moduleSlug={slug} />
      </div>
    </main>
  );
}
