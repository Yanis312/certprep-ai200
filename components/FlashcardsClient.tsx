"use client";

import { useState } from "react";
import Link from "next/link";

type Card = { front: string; back: string };

export default function FlashcardsClient({ cards, moduleSlug }: { cards: Card[]; moduleSlug: string }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [toReview, setToReview] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  function handleKnown(isKnown: boolean) {
    const nextKnown = new Set(known);
    const nextReview = new Set(toReview);
    if (isKnown) nextKnown.add(current);
    else nextReview.add(current);
    setKnown(nextKnown);
    setToReview(nextReview);
    setFlipped(false);
    if (current + 1 >= cards.length) setFinished(true);
    else setCurrent(current + 1);
  }

  if (finished) {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-4">🎯</div>
        <p className="text-2xl font-bold text-slate-800 mb-1">{known.size} / {cards.length}</p>
        <p className="text-sm text-slate-500 mb-2">cartes maîtrisées</p>
        {toReview.size > 0 && (
          <p className="text-xs text-amber-500 font-medium mb-8">{toReview.size} carte{toReview.size > 1 ? "s" : ""} à revoir</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setCurrent(0); setFlipped(false); setKnown(new Set()); setToReview(new Set()); setFinished(false); }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            🔄 Recommencer
          </button>
          <Link href={`/quiz/${moduleSlug}`} className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            🧠 Faire le quiz
          </Link>
          <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            🏠 Accueil
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[current];
  const pct = Math.round((current / cards.length) * 100);

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
        <span>Carte {current + 1} sur {cards.length}</span>
        <span className="text-emerald-500 font-medium">{known.size} maîtrisée{known.size > 1 ? "s" : ""}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-7">
        <div className="bg-linear-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className={`cursor-pointer min-h-44 rounded-2xl border-2 p-6 flex flex-col items-center justify-center text-center transition-all duration-300 mb-6 select-none ${
          flipped
            ? "bg-indigo-50 border-indigo-200 shadow-inner"
            : "bg-white border-slate-200 hover:border-amber-300 hover:shadow-md shadow-sm"
        }`}
      >
        {!flipped ? (
          <>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">❓ Question</span>
            <p className="text-base font-semibold text-slate-800 leading-relaxed">{card.front}</p>
            <p className="text-xs text-slate-300 mt-4">Clique pour voir la réponse</p>
          </>
        ) : (
          <>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4">💡 Réponse</span>
            <p className="text-sm text-slate-700 leading-relaxed">{card.back}</p>
          </>
        )}
      </div>

      {/* Actions */}
      {flipped ? (
        <div className="flex gap-3">
          <button onClick={() => handleKnown(false)}
            className="flex-1 bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600 py-3 rounded-xl transition-colors font-semibold text-sm">
            😕 À revoir
          </button>
          <button onClick={() => handleKnown(true)}
            className="flex-1 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-700 py-3 rounded-xl transition-colors font-semibold text-sm">
            ✅ Je sais !
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs text-slate-300">Clique sur la carte pour voir la réponse, puis évalue-toi</p>
        </div>
      )}
    </div>
  );
}
