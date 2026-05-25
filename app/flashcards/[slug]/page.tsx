import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FlashcardsClient from "@/components/FlashcardsClient";

export default async function FlashcardsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = await prisma.unit.findUnique({
    where: { slug },
    include: { questions: true, module: true },
  });
  if (!unit) notFound();

  const cards = unit.questions.map((q) => ({ front: q.question, back: q.explanation }));

  if (cards.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-slate-500">Aucune flashcard disponible.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">← Retour</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link href={`/module/${unit.module.slug}`} className="hover:text-indigo-600 transition-colors">{unit.module.title}</Link>
        <span>/</span>
        <Link href={`/unit/${slug}`} className="hover:text-indigo-600 transition-colors">{unit.title}</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Flashcards</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-amber-500 to-orange-500 px-8 py-5">
          <p className="text-amber-100 text-xs font-medium uppercase tracking-widest">Flashcards</p>
          <h1 className="text-xl font-bold text-white mt-0.5">{unit.title}</h1>
          <p className="text-amber-100 text-xs mt-1">{cards.length} cartes · Clique pour retourner</p>
        </div>
        <div className="px-8 py-8">
          <FlashcardsClient cards={cards} unitSlug={slug} moduleSlug={unit.module.slug} />
        </div>
      </div>
    </div>
  );
}
