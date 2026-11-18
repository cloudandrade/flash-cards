"use client";

import { useMemo, useState } from "react";
import { FlashCard } from "@/types/flashcard";
import { arrangeByIds, DeckOrder, shuffleIds } from "@/lib/deckOrder";

interface DeckViewProps {
  cards: FlashCard[];
  deckOrder: DeckOrder;
  onDeckOrderChange: (order: DeckOrder) => void;
  onEdit: (card: FlashCard) => void;
}

const PEEK_OFFSETS = [
  { y: 10, rot: 2.5, bg: "bg-indigo-100 border-indigo-200" },
  { y: 20, rot: -2,  bg: "bg-violet-100 border-violet-200" },
  { y: 30, rot: 1.5, bg: "bg-slate-100  border-slate-200"  },
];

const DECK_ORDER_OPTIONS: { order: DeckOrder; label: string; iconPath: string }[] = [
  {
    order: "sequential",
    label: "Em ordem",
    iconPath: "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25",
  },
  {
    order: "shuffled",
    label: "Aleatório",
    iconPath: "M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
  },
];

export default function DeckView({ cards, deckOrder, onDeckOrderChange, onEdit }: DeckViewProps) {
  const [index, setIndex]     = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [shuffledIds, setShuffledIds] = useState(() => shuffleIds(cards.map((card) => card.id)));

  const deck = useMemo(
    () => (deckOrder === "shuffled" ? arrangeByIds(cards, shuffledIds) : cards),
    [cards, deckOrder, shuffledIds]
  );

  const total   = deck.length;
  const isDone  = index >= total;
  const current = deck[index];
  const peek    = deck.slice(index + 1, index + 4);
  const progress = total ? Math.round((index / total) * 100) : 0;

  function handleFlip() {
    if (leaving || flipped) return;
    setFlipped(true);
  }

  function handleNext() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setFlipped(false);
      setLeaving(false);
    }, 380);
  }

  function restartWith(order: DeckOrder) {
    if (order === "shuffled") setShuffledIds(shuffleIds(cards.map((card) => card.id)));
    onDeckOrderChange(order);
    setIndex(0);
    setFlipped(false);
    setLeaving(false);
  }

  function handleRestart() {
    restartWith(deckOrder);
  }

  /* ── Empty state ─────────────────────────────────── */
  if (!total) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <p className="text-slate-500 font-medium">Nenhum card para exibir.</p>
        <p className="text-slate-400 text-sm">Crie cards no modo grade primeiro.</p>
      </div>
    );
  }

  /* ── Completion screen ───────────────────────────── */
  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
          <svg className="w-9 h-9 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Deck completo!</h2>
          <p className="text-slate-500 text-sm mt-1">
            Você revisou todos os <span className="font-semibold">{total}</span> cards.
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow shadow-indigo-200"
        >
          Recomeçar
        </button>
      </div>
    );
  }

  /* ── Main deck ───────────────────────────────────── */
  return (
    <div className="flex flex-col items-center gap-8 py-8 select-none">

      <div role="radiogroup" aria-label="Ordem dos cards" className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
        {DECK_ORDER_OPTIONS.map((option) => {
          const isSelected = deckOrder === option.order;
          return (
            <button
              key={option.order}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={option.label}
              disabled={leaving || isSelected}
              onClick={() => restartWith(option.order)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                isSelected ? "bg-white shadow-sm text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={option.iconPath} />
              </svg>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div className="w-full max-w-sm px-1">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-slate-600">{index + 1} <span className="text-slate-400">de</span> {total}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Deck area */}
      <div className="relative" style={{ width: 320, height: 420 }}>

        {/* Peeking cards */}
        {peek.map((_, i) => (
          <div
            key={`peek-${index + i + 1}`}
            className={`absolute inset-0 rounded-2xl border shadow-sm ${PEEK_OFFSETS[i].bg}`}
            style={{
              transform: `translateY(${PEEK_OFFSETS[i].y}px) rotate(${PEEK_OFFSETS[i].rot}deg)`,
              zIndex: 10 - i,
            }}
          />
        ))}

        {/* Current card */}
        <div
          className="absolute inset-0"
          style={{ perspective: "1200px", zIndex: 20 }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500 cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              animation: leaving ? "deckCardExit 0.38s cubic-bezier(0.4,0,0.6,1) forwards" : undefined,
            }}
            onClick={handleFlip}
          >
            {/* ── Frente (pergunta) ── */}
            <div
              className="absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-xl flex flex-col p-7"
              style={{ backfaceVisibility: "hidden" }}
            >
              {current.category && (
                <span className="text-[11px] font-semibold text-indigo-500 uppercase tracking-widest mb-4">
                  {current.category}
                </span>
              )}
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <p className="text-xl font-semibold text-slate-800 text-center leading-snug whitespace-pre-wrap">
                  {current.question}
                </p>
              </div>
              <p className="text-center text-[11px] text-slate-300 mt-4">
                clique para revelar a resposta
              </p>
            </div>

            {/* ── Verso (resposta) ── */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-200 shadow-xl flex flex-col p-7"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              {current.category && (
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                  {current.category}
                </span>
              )}
              <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest mb-3">
                Resposta
              </p>
              <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 py-1">
                <p className="text-lg text-slate-700 text-center leading-relaxed whitespace-pre-wrap">
                  {current.answer}
                </p>
              </div>
              <button
                className="mt-4 text-xs text-indigo-400 hover:text-indigo-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(current);
                }}
              >
                editar este card
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!flipped ? (
          <button
            onClick={handleFlip}
            className="px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow shadow-indigo-200"
          >
            Revelar resposta
          </button>
        ) : (
          <>
            <button
              onClick={() => setFlipped(false)}
              className="px-5 py-2.5 text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 font-medium rounded-xl transition-colors"
            >
              ← Pergunta
            </button>
            <button
              onClick={handleNext}
              className="px-7 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow shadow-indigo-200 flex items-center gap-2"
            >
              {index + 1 < total ? (
                <>Próximo <span className="text-indigo-200">→</span></>
              ) : (
                <>Concluir <span>✓</span></>
              )}
            </button>
          </>
        )}
      </div>

      {/* Restart link */}
      {index > 0 && (
        <button
          onClick={handleRestart}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
        >
          Recomeçar do início
        </button>
      )}
    </div>
  );
}
