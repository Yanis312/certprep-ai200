import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getModules, summarize } from "@/lib/course";
import ModuleClient from "@/components/ModuleClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return getModules().map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">{mod.title}</span>
      </div>

      <ModuleClient mod={summarize(mod)} />
    </div>
  );
}
