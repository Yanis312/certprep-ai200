"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Toute la progression du site vit dans le navigateur, sous des clés « certprep-… ».
// Cette page permet de la sauvegarder dans un fichier ou un code, et de la restaurer ailleurs.
const PREFIX = "certprep-";
const LAST_BACKUP_KEY = "certprep-last-backup";

type Snapshot = { app: "certprep"; version: 1; savedAt: number; data: Record<string, unknown> };
type Attempt = { score: number; totalQ: number; at: number };

function readAll(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX) || k === LAST_BACKUP_KEY) continue;
      const raw = window.localStorage.getItem(k);
      if (raw === null) continue;
      try {
        data[k] = JSON.parse(raw);
      } catch {
        data[k] = raw;
      }
    }
  } catch {
    // stockage indisponible
  }
  return data;
}

function snapshot(): Snapshot {
  return { app: "certprep", version: 1, savedAt: Date.now(), data: readAll() };
}

// Fusion : on ne perd jamais de progression, ni d'un côté ni de l'autre
function merge(key: string, local: unknown, incoming: unknown): unknown {
  if (local === undefined || local === null) return incoming;
  if (key === "certprep-progress-v1") {
    const out = { ...(local as Record<string, Attempt>) };
    for (const [unit, a] of Object.entries(incoming as Record<string, Attempt>)) {
      if (!out[unit] || a.at > out[unit].at) out[unit] = a;
    }
    return out;
  }
  if (key === "certprep-tasks-v1") return [...new Set([...(local as string[]), ...(incoming as string[])])];
  if (key === "certprep-exam-history-v1") {
    const out = { ...(local as Record<string, { at: number; score: number }[]>) };
    for (const [code, list] of Object.entries(incoming as Record<string, { at: number; score: number }[]>)) {
      const seen = new Set((out[code] ?? []).map((h) => h.at));
      out[code] = [...(out[code] ?? []), ...list.filter((h) => !seen.has(h.at))].sort((x, y) => x.at - y.at).slice(-10);
    }
    return out;
  }
  return local; // examen en cours, certification affichée : on garde ce qui est sur cet appareil
}

function restore(s: Snapshot): number {
  if (s?.app !== "certprep" || typeof s.data !== "object") throw new Error("format");
  const current = readAll();
  let n = 0;
  for (const [k, v] of Object.entries(s.data)) {
    if (!k.startsWith(PREFIX)) continue;
    window.localStorage.setItem(k, JSON.stringify(merge(k, current[k], v)));
    n++;
  }
  return n;
}

const toCode = (s: Snapshot) => btoa(unescape(encodeURIComponent(JSON.stringify(s))));
const fromCode = (c: string) => JSON.parse(decodeURIComponent(escape(atob(c.trim())))) as Snapshot;

function countProgress(data: Record<string, unknown>) {
  const progress = (data["certprep-progress-v1"] ?? {}) as Record<string, Attempt>;
  const tasks = (data["certprep-tasks-v1"] ?? []) as string[];
  const exams = Object.values((data["certprep-exam-history-v1"] ?? {}) as Record<string, unknown[]>).reduce((a, l) => a + l.length, 0);
  return { units: Object.keys(progress).length, tasks: tasks.length, exams };
}

export default function BackupClient() {
  const [stats, setStats] = useState({ units: 0, tasks: 0, exams: 0 });
  const [lastBackup, setLastBackup] = useState<number | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    setStats(countProgress(readAll()));
    try {
      const raw = window.localStorage.getItem(LAST_BACKUP_KEY);
      setLastBackup(raw ? Number(raw) : null);
    } catch {
      setLastBackup(null);
    }
    navigator.storage?.persisted?.().then(setPersisted).catch(() => setPersisted(null));
  }, []);

  function markSaved() {
    const now = Date.now();
    try {
      window.localStorage.setItem(LAST_BACKUP_KEY, String(now));
    } catch {
      // ignoré
    }
    setLastBackup(now);
  }

  function download() {
    const s = snapshot();
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `certprep-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    markSaved();
    setMessage({ ok: true, text: "Sauvegarde téléchargée. Garde ce fichier (par exemple dans ton OneDrive ou ton Google Drive)." });
  }

  async function copyCode() {
    const c = toCode(snapshot());
    try {
      await navigator.clipboard.writeText(c);
      markSaved();
      setMessage({ ok: true, text: "Code copié. Envoie-le-toi (e-mail, WhatsApp…), puis colle-le sur l'autre appareil, dans cette même page." });
    } catch {
      setCode(c);
      setMessage({ ok: true, text: "Copie automatique impossible : sélectionne le code dans le cadre ci-dessous et copie-le." });
    }
  }

  function applySnapshot(s: Snapshot) {
    const n = restore(s);
    setMessage({ ok: true, text: `Restauration réussie (${n} éléments fusionnés). La page va se recharger.` });
    setTimeout(() => window.location.reload(), 1200);
  }

  async function restoreFile(file: File | undefined) {
    if (!file) return;
    try {
      applySnapshot(JSON.parse(await file.text()) as Snapshot);
    } catch {
      setMessage({ ok: false, text: "Ce fichier n'est pas une sauvegarde CertPrep valide." });
    }
  }

  function restoreCode() {
    try {
      applySnapshot(fromCode(code));
    } catch {
      setMessage({ ok: false, text: "Ce code n'est pas valide. Vérifie que tu l'as collé en entier." });
    }
  }

  const days = lastBackup ? Math.floor((Date.now() - lastBackup) / 86400000) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Sauvegarde</span>
      </div>

      <div className="rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-lg shadow-indigo-100">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-widest">Ta progression</p>
        <h1 className="text-2xl font-bold mt-1">Sauvegarde</h1>
        <div className="flex flex-wrap gap-6 mt-5 text-sm">
          <div><p className="text-2xl font-bold">{stats.units}</p><p className="text-indigo-200 text-xs">Unités avec un score</p></div>
          <div><p className="text-2xl font-bold">{stats.tasks}</p><p className="text-indigo-200 text-xs">Tâches cochées</p></div>
          <div><p className="text-2xl font-bold">{stats.exams}</p><p className="text-indigo-200 text-xs">Examens blancs passés</p></div>
        </div>
        <p className="text-indigo-100 text-sm mt-5">
          Dernière sauvegarde : {days === null ? "jamais" : days === 0 ? "aujourd'hui" : `il y a ${days} jour${days > 1 ? "s" : ""}`}
          {persisted === true && " · ce navigateur garde tes données"}
        </p>
      </div>

      {message && (
        <p className={`rounded-xl px-4 py-3 text-sm border ${message.ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>{message.text}</p>
      )}

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <h2 className="font-bold text-slate-800">1. Garder une copie</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">Un petit fichier avec tous tes scores, tes cases cochées et tes examens blancs. Fais-le une fois par semaine.</p>
        <button onClick={download} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl text-sm">⬇️ Télécharger ma sauvegarde</button>
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <h2 className="font-bold text-slate-800">2. Passer sur un autre appareil</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">Copie le code ici, envoie-le-toi, puis colle-le dans cette même page sur ton téléphone ou ton autre ordinateur. Rien n&apos;est perdu : les deux progressions sont fusionnées.</p>
        <button onClick={copyCode} className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl text-sm">📋 Copier mon code de transfert</button>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Colle ici un code de transfert…"
          rows={4}
          className="mt-4 w-full border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-400"
        />
        <button onClick={restoreCode} disabled={!code.trim()} className="mt-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">Restaurer depuis ce code</button>
      </section>

      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <h2 className="font-bold text-slate-800">3. Restaurer un fichier</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">Choisis un fichier « certprep-sauvegarde-….json ». Ta progression actuelle est conservée et complétée.</p>
        <input type="file" accept="application/json,.json" onChange={(e) => restoreFile(e.target.files?.[0])} className="text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:font-semibold file:text-slate-700 hover:file:bg-slate-200" />
      </section>
    </div>
  );
}
