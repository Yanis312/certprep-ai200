"use client";

import { useState } from "react";
import Link from "next/link";

type Card = { front: string; back: string };

export default function FlashcardsClient({ cards, moduleSlug }: { cards: Card[]; moduleSlug: string }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl font-bold text-green-400 mb-4">{known.size}/{cards.length}</div>
        <p className="text-gray-400 mb-10">cartes maîtrisées</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setCurrent(0); setFlipped(false); setKnown(new Set()); setFinished(false); }} className="bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-lg transition-colors">
            Recommencer
          </button>
          <Link href="/" className="bg-gray-700 hover:bg-gray-600 px-5 py-2.5 rounded-lg transition-colors">
            Accueil
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[current];

  function handleKnown(isKnown: boolean) {
    const next = new Set(known);
    if (isKnown) next.add(current);
    setKnown(next);
    setFlipped(false);
    if (current + 1 >= cards.length) setFinished(true);
    else setCurrent(current + 1);
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-gray-400 mb-6">
        <span>Carte {current + 1} / {cards.length}</span>
        <span className="text-green-400">{known.size} maîtrisées</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-8">
        <div className="bg-orange-500 h-1.5 rounded-full transition-all" style={{ width: `${(current / cards.length) * 100}%` }} />
      </div>

      <div
        className="cursor-pointer min-h-48 bg-gray-900 border border-gray-700 rounded-xl p-8 flex items-center justify-center text-center hover:border-orange-500 transition-colors mb-6"
        onClick={() => setFlipped(!flipped)}
      >
        {!flipped ? (
          <div>
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">Question — cliquer pour révéler</p>
            <p className="text-xl text-white font-medium">{card.front}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-orange-400 mb-4 uppercase tracking-widest">Réponse</p>
            <p className="text-lg text-gray-200">{card.back}</p>
          </div>
        )}
      </div>

      {flipped && (
        <div className="flex gap-3">
          <button onClick={() => handleKnown(false)} className="flex-1 bg-red-900/50 hover:bg-red-900 border border-red-700 py-3 rounded-lg transition-colors text-red-300">
            À revoir
          </button>
          <button onClick={() => handleKnown(true)} className="flex-1 bg-green-900/50 hover:bg-green-900 border border-green-700 py-3 rounded-lg transition-colors text-green-300">
            Je sais ✓
          </button>
        </div>
      )}
    </div>
  );
}
