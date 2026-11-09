"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Rappelle de sauvegarder quand il y a de la progression et aucune sauvegarde depuis 7 jours
export default function BackupReminder() {
  const [show, setShow] = useState(false);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    try {
      const progress = JSON.parse(window.localStorage.getItem("certprep-progress-v1") ?? "{}") as object;
      if (Object.keys(progress).length === 0) return;
      const raw = window.localStorage.getItem("certprep-last-backup");
      const d = raw ? Math.floor((Date.now() - Number(raw)) / 86400000) : null;
      setDays(d);
      setShow(d === null || d >= 7);
    } catch {
      setShow(false);
    }
  }, []);

  if (!show) return null;
  return (
    <Link href="/sauvegarde" className="flex flex-wrap items-center justify-between gap-2 mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-5 py-3 text-sm hover:bg-amber-100 transition-colors">
      <span>💾 {days === null ? "Tu n'as jamais sauvegardé ta progression." : `Dernière sauvegarde il y a ${days} jours.`} Garde une copie en un clic.</span>
      <span className="font-semibold">Sauvegarder →</span>
    </Link>
  );
}
