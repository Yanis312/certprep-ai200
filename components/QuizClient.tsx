"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { saveAttempt } from "@/lib/progress";
import type { Question } from "@/lib/types";

export default function QuizClient({ questions, unitSlug }: { questions: Question[]; unitSlug: string }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const score = answers.filter(Boolean).length;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers([...answers, idx === q.correctAnswer]);
  }

  function handleNext() {
    if (current + 1 >= questions.length) setFinished(true);
    else { setCurrent(current + 1); setSelected(null); }
  }

  useEffect(() => {
    if (finished) {
      saveAttempt(unitSlug, score, questions.length);
    }
  }, [finished]);  // eslint-disable-line react-hooks/exhaustive-deps

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const isGood = pct >= 70;
    return (
      <div className="text-center py-6">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${isGood ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200" : "bg-amber-50 text-amber-600 border-2 border-amber-200"}`}>
          {pct}%
        </div>
        <p className="text-xl font-bold text-slate-800 mb-1">{score} / {questions.length} correctes</p>
        <p className={`text-sm mb-8 font-medium ${isGood ? "text-emerald-500" : "text-amber-500"}`}>
          {pct === 100 ? "🏆 Parfait !" : pct >= 70 ? "✅ Bien joué !" : "📚 Continue de réviser !"}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setFinished(false); }}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            🔄 Recommencer
          </button>
          <Link href={`/unit/${unitSlug}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            📖 Revoir le cours
          </Link>
          <Link href={`/flashcards/${unitSlug}`} className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            🃏 Flashcards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>Question {current + 1} sur {questions.length}</span>
        <span className="text-emerald-500 font-medium">{score} correcte{score > 1 ? "s" : ""}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-7">
        <div className="bg-linear-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <h2 className="text-base font-semibold text-slate-800 mb-5 leading-relaxed">{q.question}</h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          let base = "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all text-sm font-medium flex items-start gap-3 ";
          if (selected === null) {
            base += "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 cursor-pointer";
          } else if (idx === q.correctAnswer) {
            base += "border-emerald-400 bg-emerald-50 text-emerald-800";
          } else if (idx === selected) {
            base += "border-red-300 bg-red-50 text-red-700";
          } else {
            base += "border-slate-100 bg-slate-50 text-slate-400 cursor-default";
          }
          return (
            <button key={idx} className={base} onClick={() => handleSelect(idx)}>
              <span className={`shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold mt-0.5 ${
                selected === null ? "bg-slate-100 text-slate-500"
                : idx === q.correctAnswer ? "bg-emerald-400 text-white"
                : idx === selected ? "bg-red-400 text-white"
                : "bg-slate-100 text-slate-300"
              }`}>{letter}</span>
              <span className="leading-6">{opt}</span>
              {selected !== null && idx === q.correctAnswer && <span className="ml-auto shrink-0 text-emerald-500">✓</span>}
              {selected !== null && idx === selected && idx !== q.correctAnswer && <span className="ml-auto shrink-0 text-red-400">✗</span>}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {selected !== null && (
        <div className={`rounded-xl p-4 mb-6 border text-sm leading-relaxed ${
          selected === q.correctAnswer ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <p className="font-semibold mb-1">{selected === q.correctAnswer ? "✅ Correct !" : "❌ Pas tout à fait."}</p>
          <p>{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext} className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl transition-colors font-semibold text-sm">
          {current + 1 >= questions.length ? "Voir mes résultats →" : "Question suivante →"}
        </button>
      )}
    </div>
  );
}
