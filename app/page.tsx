import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function Home() {
  const modules = await prisma.module.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { progress: true },
  });

  const categories = [...new Set(modules.map((m) => m.category))];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Révision Certifications</h1>
        <p className="text-gray-400 mb-10">Cours · Quiz · Flashcards · Exercices</p>

        {categories.map((cat) => (
          <section key={cat} className="mb-10">
            <h2 className="text-xl font-semibold text-blue-400 mb-4">{cat}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules
                .filter((m) => m.category === cat)
                .map((mod) => {
                  const lastProgress = mod.progress[mod.progress.length - 1];
                  const pct = lastProgress?.totalQ
                    ? Math.round((lastProgress.score / lastProgress.totalQ) * 100)
                    : 0;
                  return (
                    <Card key={mod.id} className="bg-gray-900 border-gray-800 hover:border-blue-500 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-white text-base">{mod.title}</CardTitle>
                          {lastProgress?.completed && (
                            <Badge className="bg-green-600 text-xs">Complété</Badge>
                          )}
                        </div>
                        <CardDescription className="text-gray-400 text-sm">{mod.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {lastProgress?.totalQ ? (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Dernier score</span>
                              <span>{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                        ) : null}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Link
                            href={`/module/${mod.slug}`}
                            className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
                          >
                            Cours
                          </Link>
                          <Link
                            href={`/quiz/${mod.slug}`}
                            className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-md transition-colors"
                          >
                            Quiz
                          </Link>
                          <Link
                            href={`/flashcards/${mod.slug}`}
                            className="text-xs bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded-md transition-colors"
                          >
                            Flashcards
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </section>
        ))}

        {modules.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Aucun module disponible.</p>
            <p className="text-sm mt-2">Lance le seed pour ajouter les modules :</p>
            <code className="text-xs bg-gray-800 px-3 py-1.5 rounded mt-3 inline-block">
              npx tsx prisma/seed.ts
            </code>
          </div>
        )}
      </div>
    </main>
  );
}
