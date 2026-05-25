import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMarkdownContent } from "@/lib/markdown";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = await prisma.module.findUnique({ where: { slug } });
  if (!mod) notFound();

  const { content } = getMarkdownContent(mod.category, slug);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mb-6 inline-block">
          ← Retour
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">{mod.category}</span>
        </div>
        <h1 className="text-3xl font-bold mb-8">{mod.title}</h1>

        <div className="prose prose-invert prose-blue max-w-none">
          <MarkdownRenderer content={content} />
        </div>

        <div className="flex gap-3 mt-12 pt-8 border-t border-gray-800">
          <Link href={`/quiz/${slug}`} className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg transition-colors font-medium">
            Faire le quiz
          </Link>
          <Link href={`/flashcards/${slug}`} className="bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-lg transition-colors font-medium">
            Flashcards
          </Link>
        </div>
      </div>
    </main>
  );
}
