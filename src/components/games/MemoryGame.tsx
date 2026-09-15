import React, { useState, useEffect } from 'react';

const ICONS = ['\u{1F47E}', '\u{1F3AE}', '\u{1F4BE}', '\u{1F6F0}', '\u{1F512}', '\u{1F41B}', '\u26A1', '\u{1F9E9}'];

interface Card {
  id: number;
  icon: string;
  matched: boolean;
}

function shuffledDeck(): Card[] {
  const deck = [...ICONS, ...ICONS].map((icon, i) => ({ id: i, icon, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(shuffledDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (selected.length === 2) {
      const [a, b] = selected;
      setMoves((m) => m + 1);
      if (deck[a].icon === deck[b].icon) {
        setDeck((d) => d.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setSelected([]);
      } else {
        const t = setTimeout(() => setSelected([]), 700);
        return () => clearTimeout(t);
      }
    }
  }, [selected, deck]);

  useEffect(() => {
    if (deck.every((c) => c.matched)) setWon(true);
  }, [deck]);

  const flip = (i: number) => {
    if (selected.length === 2 || deck[i].matched || selected.includes(i)) return;
    setSelected((s) => [...s, i]);
  };

  const restart = () => {
    setDeck(shuffledDeck());
    setSelected([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-primary text-white h-full min-h-[300px]">
      <div className="flex justify-between w-full max-w-[240px] mb-2 font-pixel text-[10px]">
        <span>MOVES:{moves}</span>
        {won && <span className="text-green-400 animate-pulse">SOLVED!</span>}
      </div>
      <div className="grid grid-cols-4 gap-1">
        {deck.map((c, i) => {
          const isOpen = c.matched || selected.includes(i);
          return (
            <button
              key={c.id}
              onClick={() => flip(i)}
              className={`w-10 h-10 md:w-12 md:h-12 border-2 border-white flex items-center justify-center text-lg transition-colors ${
                isOpen ? 'bg-white text-primary' : 'bg-black text-black hover:bg-white/10'
              }`}
            >
              {isOpen ? c.icon : ''}
            </button>
          );
        })}
      </div>
      <button onClick={restart} className="mt-4 brutalist-button bg-white text-primary px-4 py-2 font-pixel text-[10px] uppercase">
        {won ? 'PLAY AGAIN' : 'RESTART'}
      </button>
    </div>
  );
}
