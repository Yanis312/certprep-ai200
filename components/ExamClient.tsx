"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exam, ExamQuestion } from "@/lib/exam";
import CertTabs, { useCert } from "@/components/CertTabs";

// Réponse de l'utilisateur, selon le type de question :
// single → index ; multi → index[] ; yesno → (boolean | null)[] ; order → ordre des étapes (index dans items)
type Answer = number | number[] | (boolean | null)[];
type Saved = { phase: "exam" | "results"; current: number; answers: Record<number, Answer>; flags: number[] };
type HistoryEntry = { at: number; score: number };

const stateKey = (code: string) => `certprep-exam-${code}-v1`;
const HISTORY_KEY = "certprep-exam-history-v1";
const PASS = 700;

function load<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible : l'examen fonctionne quand même, sans sauvegarde
  }
}

// Mélange stable : la même question affiche toujours ses étapes dans le même désordre
function shuffledOrder(n: number, seed: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  let s = seed * 9301 + 49297;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (idx.every((v, i) => v === i) && n > 1) [idx[0], idx[1]] = [idx[1], idx[0]];
  return idx;
}

/** Points obtenus pour une question, entre 0 et 1 */
function grade(q: ExamQuestion, a: Answer | undefined): number {
  if (a === undefined) return 0;
  if (q.type === "single") return a === q.answer ? 1 : 0;
  if (q.type === "multi") {
    const want = [...(q.answer as number[])].sort().join(",");
    return [...(a as number[])].sort().join(",") === want ? 1 : 0;
  }
  if (q.type === "yesno") {
    const st = q.statements ?? [];
    return st.filter((s, i) => (a as (boolean | null)[])[i] === s.answer).length / st.length;
  }
  return (a as number[]).every((v, i) => v === i) ? 1 : 0;
}

function isAnswered(q: ExamQuestion, a: Answer | undefined): boolean {
  if (a === undefined) return false;
  if (q.type === "multi") return (a as number[]).length === (q.answer as number[]).length;
  if (q.type === "yesno") return (a as (boolean | null)[]).every((v) => v !== null);
  return true;
}

export default function ExamClient({ exams }: { exams: Exam[] }) {
  const [cert, setCert] = useCert();
  const exam = exams.find((e) => e.code === cert.code);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-slate-600 font-medium">Examen blanc</span>
      </div>
      <CertTabs current={cert} onChange={setCert} />
      {exam ? <ExamRunner key={exam.code} exam={exam} /> : (
        <p className="text-slate-500 bg-white border border-slate-100 rounded-2xl p-6">Pas encore d&apos;examen blanc pour {cert.code}.</p>
      )}
    </div>
  );
}

function ExamRunner({ exam }: { exam: Exam }) {
  const total = exam.questions.length;
  const [state, setState] = useState<Saved | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [overview, setOverview] = useState(false);
  const [onlyErrors, setOnlyErrors] = useState(false);

  // Reprise d'un examen en cours (sauvegardé dans le navigateur)
  useEffect(() => {
    setState(load<Saved>(stateKey(exam.code)));
    setHistory(load<Record<string, HistoryEntry[]>>(HISTORY_KEY)?.[exam.code] ?? []);
  }, [exam.code]);

  useEffect(() => {
    if (state) save(stateKey(exam.code), state);
  }, [state, exam.code]);

  const points = useMemo(
    () => exam.questions.map((q, i) => grade(q, state?.answers[i])),
    [exam.questions, state?.answers],
  );
  const score = Math.round((points.reduce((a, b) => a + b, 0) / total) * 1000);

  function start() {
    setOverview(false);
    setState({ phase: "exam", current: 0, answers: {}, flags: [] });
    window.scrollTo(0, 0);
  }

  function finish() {
    if (!state) return;
    const unanswered = exam.questions.filter((q, i) => !isAnswered(q, state.answers[i])).length;
    const msg = unanswered > 0
      ? `Il reste ${unanswered} question(s) sans réponse complète. Terminer quand même ?`
      : "Terminer l'examen et voir le résultat ?";
    if (!window.confirm(msg)) return;
    const all = load<Record<string, HistoryEntry[]>>(HISTORY_KEY) ?? {};
    const mine = [...(all[exam.code] ?? []), { at: Date.now(), score }].slice(-10);
    save(HISTORY_KEY, { ...all, [exam.code]: mine });
    setHistory(mine);
    setOverview(false);
    setState({ ...state, phase: "results" });
    window.scrollTo(0, 0);
  }

  function quit() {
    if (!window.confirm("Abandonner cet examen ? Tes réponses seront effacées.")) return;
    save(stateKey(exam.code), null);
    setState(null);
  }

  // ---------- Accueil de l'examen ----------
  if (!state) {
    const nCase = exam.questions.filter((q) => q.case).length;
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-linear-to-r from-slate-800 to-indigo-800 px-6 sm:px-8 py-6 text-white">
          <p className="text-xs uppercase tracking-widest text-indigo-200">Examen blanc</p>
          <h1 className="text-2xl font-bold mt-1">{exam.code} — {exam.title}</h1>
          <p className="text-sm text-indigo-100 mt-2">{total} questions{nCase > 0 ? `, dont une étude de cas de ${nCase} questions à la fin` : ""} · sans chronomètre · {PASS}/1000 pour réussir</p>
        </div>
        <div className="px-6 sm:px-8 py-6 space-y-5 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-800 mb-2">Ce que tu vas trouver</p>
            <ul className="space-y-1.5 list-disc pl-5">
              <li>Des questions à <strong>choix unique</strong> et à <strong>choix multiple</strong> (le nombre de réponses à cocher est indiqué).</li>
              <li>Des séries <strong>Oui / Non</strong> : chaque affirmation compte pour une partie du point.</li>
              <li>Des questions où il faut <strong>remettre les étapes dans l&apos;ordre</strong>.</li>
              <li>Des extraits de <strong>code Python</strong> à lire.</li>
              {nCase > 0 && <li>Une <strong>étude de cas</strong> à la fin : un scénario d&apos;entreprise et plusieurs questions dessus.</li>}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-slate-800 mb-2">Domaines évalués</p>
            <ul className="space-y-1">
              {Object.entries(exam.domains).map(([k, v]) => <li key={k} className="text-slate-600">· {v}</li>)}
            </ul>
          </div>
          <p className="bg-amber-50 border border-amber-100 text-amber-900 rounded-xl px-4 py-3">
            <span className="font-semibold">À l&apos;examen réel : </span>{exam.realExam}
          </p>
          <p className="text-slate-500">Tu peux marquer une question pour la revoir, revenir en arrière et voir la liste de toutes les questions. Ta progression est sauvegardée dans ce navigateur : tu peux fermer la page et reprendre plus tard.</p>
          {history.length > 0 && (
            <div>
              <p className="font-semibold text-slate-800 mb-2">Tes derniers essais</p>
              <div className="flex flex-wrap gap-2">
                {history.slice().reverse().map((h) => (
                  <span key={h.at} className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${h.score >= PASS ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                    {h.score} · {new Date(h.at).toLocaleDateString("fr-CA")}
                  </span>
                ))}
              </div>
            </div>
          )}
          <button onClick={start} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-colors">
            Commencer l&apos;examen →
          </button>
        </div>
      </div>
    );
  }

  // ---------- Résultats ----------
  if (state.phase === "results") {
    const passed = score >= PASS;
    const byDomain = Object.entries(exam.domains).map(([k, label]) => {
      const idx = exam.questions.map((q, i) => (q.domain === k ? i : -1)).filter((i) => i >= 0);
      const got = idx.reduce((a, i) => a + points[i], 0);
      return { k, label, pct: idx.length ? Math.round((got / idx.length) * 100) : 0, n: idx.length };
    });
    return (
      <div className="space-y-6">
        <div className={`rounded-2xl p-6 sm:p-8 text-center border-2 ${passed ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
          <p className="text-xs uppercase tracking-widest text-slate-500">Ton score</p>
          <p className={`text-5xl font-bold mt-2 ${passed ? "text-emerald-600" : "text-red-600"}`}>{score}<span className="text-2xl text-slate-400"> / 1000</span></p>
          <p className={`mt-2 font-semibold ${passed ? "text-emerald-700" : "text-red-700"}`}>{passed ? "✅ Réussi (700 requis)" : "❌ Pas encore : il faut 700"}</p>
          <p className="text-xs text-slate-500 mt-3 max-w-md mx-auto">Microsoft calcule un score pondéré, pas un simple pourcentage. Ici, le score est proportionnel à tes bonnes réponses : vise 800 ou plus pour avoir de la marge.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Par domaine</p>
          <div className="space-y-4">
            {byDomain.map((d) => (
              <div key={d.k}>
                <div className="flex justify-between gap-3 text-sm mb-1">
                  <span className="text-slate-700">{d.label} <span className="text-slate-400">({d.n} questions)</span></span>
                  <span className={`font-bold ${d.pct >= 70 ? "text-emerald-600" : "text-red-600"}`}>{d.pct} %</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${d.pct >= 70 ? "bg-emerald-400" : "bg-red-400"}`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <button onClick={start} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">🔄 Refaire l&apos;examen</button>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={onlyErrors} onChange={(e) => setOnlyErrors(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
            Voir seulement mes erreurs
          </label>
        </div>

        <div className="space-y-4">
          {exam.questions.map((q, i) => {
            if (onlyErrors && points[i] === 1) return null;
            return <Review key={i} n={i + 1} q={q} a={state.answers[i]} pts={points[i]} exam={exam} />;
          })}
        </div>
      </div>
    );
  }

  // ---------- Pendant l'examen ----------
  const i = state.current;
  const q = exam.questions[i];
  const flagged = state.flags.includes(i);
  const setAnswer = (a: Answer) => setState({ ...state, answers: { ...state.answers, [i]: a } });
  const go = (n: number) => { setOverview(false); setState({ ...state, current: n }); window.scrollTo(0, 0); };
  const toggleFlag = () => setState({ ...state, flags: flagged ? state.flags.filter((f) => f !== i) : [...state.flags, i] });
  const answeredCount = exam.questions.filter((qq, k) => isAnswered(qq, state.answers[k])).length;
  const caseInfo = q.case ? exam.cases?.[q.case] : undefined;

  if (overview) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <p className="font-bold text-slate-800">Vue d&apos;ensemble</p>
        <p className="text-xs text-slate-500 mt-1 mb-4">{answeredCount}/{total} répondues · {state.flags.length} marquées · clique sur un numéro pour y aller</p>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {exam.questions.map((qq, k) => {
            const ans = isAnswered(qq, state.answers[k]);
            const fl = state.flags.includes(k);
            return (
              <button key={k} onClick={() => go(k)} className={`relative h-10 rounded-lg text-sm font-semibold border transition-colors ${ans ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-slate-200 text-slate-400"} ${k === i ? "ring-2 ring-indigo-500" : ""}`}>
                {k + 1}
                {fl && <span className="absolute -top-1.5 -right-1.5 text-xs">🚩</span>}
                {qq.case && <span className="absolute bottom-0.5 left-1 text-[9px] text-slate-400">cas</span>}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <button onClick={() => setOverview(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm">← Retour à la question {i + 1}</button>
          <button onClick={finish} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm">Terminer l&apos;examen</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3 bg-slate-800 text-white text-sm">
        <span className="font-semibold">Question {i + 1} sur {total}{q.case ? " · Étude de cas" : ""}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setOverview(true)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold">Vue d&apos;ensemble ({answeredCount}/{total})</button>
          <button onClick={quit} className="text-xs text-slate-300 hover:text-white px-2 py-1.5">Abandonner</button>
        </div>
      </div>
      <div className="w-full bg-slate-100 h-1"><div className="bg-indigo-500 h-1" style={{ width: `${(answeredCount / total) * 100}%` }} /></div>

      <div className="px-5 sm:px-8 py-6">
        {caseInfo && (
          <details open className="mb-6 bg-slate-50 border border-slate-200 rounded-xl">
            <summary className="cursor-pointer px-4 py-3 font-semibold text-slate-700 text-sm">📁 Étude de cas : {caseInfo.title}</summary>
            <div className="px-4 pb-4 text-sm text-slate-700 whitespace-pre-line leading-relaxed">{caseInfo.text}</div>
          </details>
        )}

        <p className="text-base font-semibold text-slate-800 leading-relaxed whitespace-pre-line">{q.q}</p>
        {q.code && <pre className="mt-3 bg-slate-900 text-slate-100 text-xs leading-relaxed rounded-xl p-4 overflow-x-auto"><code>{q.code}</code></pre>}
        <QuestionInput q={q} a={state.answers[i]} onChange={setAnswer} seed={i + 1} />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-5 border-t border-slate-100">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={flagged} onChange={toggleFlag} className="w-4 h-4 accent-amber-500" />
            🚩 Marquer pour révision
          </label>
          <div className="flex gap-2">
            <button disabled={i === 0} onClick={() => go(i - 1)} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40">← Précédente</button>
            {i + 1 < total
              ? <button onClick={() => go(i + 1)} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700">Suivante →</button>
              : <button onClick={() => setOverview(true)} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">Revoir et terminer →</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionInput({ q, a, onChange, seed }: { q: ExamQuestion; a: Answer | undefined; onChange: (a: Answer) => void; seed: number }) {
  if (q.type === "single" || q.type === "multi") {
    const multi = q.type === "multi";
    const need = multi ? (q.answer as number[]).length : 1;
    const chosen: number[] = multi ? ((a as number[] | undefined) ?? []) : a === undefined ? [] : [a as number];
    const pick = (k: number) => {
      if (!multi) return onChange(k);
      if (chosen.includes(k)) return onChange(chosen.filter((c) => c !== k));
      if (chosen.length < need) onChange([...chosen, k]);
    };
    return (
      <div className="mt-5">
        {multi && <p className="text-xs font-semibold text-indigo-600 mb-2">Choisis {need} réponses.</p>}
        <div className="space-y-2.5">
          {q.options!.map((opt, k) => {
            const on = chosen.includes(k);
            return (
              <button key={k} onClick={() => pick(k)} className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border-2 text-sm transition-colors ${on ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 hover:border-indigo-200 text-slate-700"}`}>
                <span className={`shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center border-2 text-[10px] font-bold ${multi ? "rounded-md" : "rounded-full"} ${on ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300"}`}>{on ? "✓" : ""}</span>
                <span className="leading-6 whitespace-pre-line">{opt}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (q.type === "yesno") {
    const st = q.statements!;
    const cur = (a as (boolean | null)[] | undefined) ?? st.map(() => null);
    const set = (k: number, v: boolean) => onChange(cur.map((c, j) => (j === k ? v : c)));
    return (
      <div className="mt-5">
        <p className="text-xs font-semibold text-indigo-600 mb-2">Pour chaque affirmation, choisis Oui ou Non.</p>
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
          {st.map((s, k) => (
            <div key={k} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="flex-1 min-w-56 text-sm text-slate-700 leading-relaxed">{s.text}</span>
              <div className="flex gap-2">
                {[true, false].map((v) => (
                  <button key={String(v)} onClick={() => set(k, v)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold border-2 ${cur[k] === v ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-200 text-slate-600 hover:border-indigo-200"}`}>
                    {v ? "Oui" : "Non"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // order : l'utilisateur déplace les étapes ; la réponse est la liste des index dans l'ordre choisi
  const items = q.items!;
  const cur = (a as number[] | undefined) ?? shuffledOrder(items.length, seed);
  const move = (k: number, d: number) => {
    const nx = [...cur];
    [nx[k], nx[k + d]] = [nx[k + d], nx[k]];
    onChange(nx);
  };
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-indigo-600 mb-2">Remets les étapes dans l&apos;ordre avec les flèches.{a === undefined && " Si l'ordre affiché te convient déjà, clique sur « Valider cet ordre »."}</p>
      <ol className="space-y-2">
        {cur.map((itemIdx, k) => (
          <li key={itemIdx} className="flex items-center gap-3 border-2 border-slate-200 rounded-xl px-3 py-2.5 bg-white">
            <span className="w-6 h-6 shrink-0 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">{k + 1}</span>
            <span className="flex-1 text-sm text-slate-700">{items[itemIdx]}</span>
            <button disabled={k === 0} onClick={() => move(k, -1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600" aria-label="Monter">↑</button>
            <button disabled={k === cur.length - 1} onClick={() => move(k, 1)} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-600" aria-label="Descendre">↓</button>
          </li>
        ))}
      </ol>
      {a === undefined && (
        <button onClick={() => onChange(cur)} className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Valider cet ordre</button>
      )}
    </div>
  );
}

function Review({ n, q, a, pts, exam }: { n: number; q: ExamQuestion; a: Answer | undefined; pts: number; exam: Exam }) {
  const status = pts === 1 ? "ok" : pts > 0 ? "part" : "ko";
  const color = status === "ok" ? "border-emerald-200" : status === "part" ? "border-amber-200" : "border-red-200";
  const badge = status === "ok" ? "✅ Correct" : status === "part" ? `🟡 Partiel (${Math.round(pts * 100)} %)` : a === undefined ? "⚪ Sans réponse" : "❌ Incorrect";

  let body: React.ReactNode = null;
  if (q.type === "single" || q.type === "multi") {
    const right = q.type === "multi" ? (q.answer as number[]) : [q.answer as number];
    const mine = a === undefined ? [] : q.type === "multi" ? (a as number[]) : [a as number];
    body = (
      <ul className="space-y-1.5 mt-3">
        {q.options!.map((o, k) => (
          <li key={k} className={`text-sm px-3 py-2 rounded-lg whitespace-pre-line ${right.includes(k) ? "bg-emerald-50 text-emerald-800 font-medium" : mine.includes(k) ? "bg-red-50 text-red-700 line-through" : "text-slate-500"}`}>
            {right.includes(k) ? "✓ " : mine.includes(k) ? "✗ " : "· "}{o}
          </li>
        ))}
      </ul>
    );
  } else if (q.type === "yesno") {
    const mine = (a as (boolean | null)[] | undefined) ?? [];
    body = (
      <ul className="space-y-1.5 mt-3">
        {q.statements!.map((s, k) => {
          const ok = mine[k] === s.answer;
          return (
            <li key={k} className={`text-sm px-3 py-2 rounded-lg ${ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
              <span className="font-semibold">{s.answer ? "Oui" : "Non"}</span>
              {!ok && <span> (tu as dit {mine[k] === undefined || mine[k] === null ? "rien" : mine[k] ? "Oui" : "Non"})</span>} — {s.text}
            </li>
          );
        })}
      </ul>
    );
  } else {
    body = (
      <div className="grid sm:grid-cols-2 gap-3 mt-3 text-sm">
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-1">Bon ordre</p>
          <ol className="list-decimal pl-5 space-y-0.5 text-slate-700">{q.items!.map((it) => <li key={it}>{it}</li>)}</ol>
        </div>
        {a !== undefined && pts < 1 && (
          <div>
            <p className="text-xs font-semibold text-red-600 mb-1">Ton ordre</p>
            <ol className="list-decimal pl-5 space-y-0.5 text-slate-500">{(a as number[]).map((k) => <li key={k}>{q.items![k]}</li>)}</ol>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border-2 ${color} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-400">Question {n} · {exam.domains[q.domain]}{q.case ? " · Étude de cas" : ""}</span>
        <span className="text-xs font-semibold">{badge}</span>
      </div>
      <p className="text-sm font-semibold text-slate-800 whitespace-pre-line">{q.q}</p>
      {q.code && <pre className="mt-2 bg-slate-900 text-slate-100 text-xs rounded-xl p-3 overflow-x-auto"><code>{q.code}</code></pre>}
      {body}
      <p className="mt-3 text-sm text-slate-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2 leading-relaxed"><span className="font-semibold">Explication : </span>{q.explanation}</p>
    </div>
  );
}
