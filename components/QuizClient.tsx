"use client";

import { useState } from "react";
import Link from "next/link";

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export default function QuizClient({ questions, moduleSlug, moduleTitle }: { questions: Question[]; moduleSlug: string; moduleTitle: string }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const score = answers.filter(Boolean).length;

  function handleSelect(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    setAnswers([...answers, idx === q.correctAnswer]);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(current + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-16">
        <div className={`text-6xl font-bold mb-4 ${pct >= 70 ? "text-green-400" : "text-red-400"}`}>{pct}%</div>
        <p className="text-xl text-gray-300 mb-2">{score} / {questions.length} bonnes réponses</p>
        <p className="text-gray-500 mb-10">{pct >= 70 ? "Bien joué !" : "Continue de réviser !"}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setShowExplanation(false); setFinished(false); }} className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-lg transition-colors">
            Recommencer
          </button>
          <Link href={`/module/${moduleSlug}`} className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors">
            Revoir le cours
          </Link>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors">
            Accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400 mb-6">
        <span>Question {current + 1} / {questions.length}</span>
        <span>{score} correctes</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
        <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${((current) / questions.length) * 100}%` }} />
      </div>

      <h2 className="text-xl font-semibold text-white mb-6">{q.question}</h2>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          let cls = "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ";
          if (selected === null) {
            cls += "border-gray-700 bg-gray-800 hover:border-purple-500 hover:bg-gray-700 text-gray-200";
          } else if (idx === q.correctAnswer) {
            cls += "border-green-500 bg-green-900/30 text-green-300";
          } else if (idx === selected && idx !== q.correctAnswer) {
            cls += "border-red-500 bg-red-900/30 text-red-300";
          } else {
            cls += "border-gray-700 bg-gray-800 text-gray-500";
          }
          return (
            <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
              <span className="font-mono text-xs mr-3 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-xs text-gray-400 mb-1 font-semibold uppercase tracking-wide">Explication</p>
          <p className="text-gray-300 text-sm">{q.explanation}</p>
        </div>
      )}

      {selected !== null && (
        <button onClick={handleNext} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg transition-colors font-medium">
          {current + 1 >= questions.length ? "Voir les résultats" : "Question suivante →"}
        </button>
      )}
    </div>
  );
}
