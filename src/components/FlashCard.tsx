"use client";

import { useState } from "react";
import { FlashCard as FlashCardType } from "@/types/flashcard";

interface FlashCardProps {
  card: FlashCardType;
  onEdit: (card: FlashCardType) => void;
  onDelete: (id: string) => void;
}

function CardModal({ card, onClose, onEdit }: { card: FlashCardType; onClose: () => void; onEdit: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ animation: "alertIn 0.2s ease-out both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {card.category && (
              <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-widest block mb-1">
                {card.category}
              </span>
            )}
            <p className="text-white font-semibold text-xl leading-snug whitespace-pre-wrap">
              {card.question}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors text-2xl leading-none mt-0.5"
          >
            ✕
          </button>
        </div>

        {/* Resposta */}
        <div className="px-6 py-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Resposta</p>
          <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap">{card.answer}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-medium border border-indigo-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
            </svg>
            Editar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FlashCard({ card, onEdit, onDelete }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  function handleCardClick(e: React.MouseEvent) {
    e.stopPropagation();
    setFlipped((prev) => !prev);
  }

  function handleExpandClick(e: React.MouseEvent) {
    e.stopPropagation();
    setModalOpen(true);
  }

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(card);
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(card.id);
  }

  return (
    <>
      <div
        className="group relative cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((prev) => !prev);
          }
        }}
        aria-label={flipped ? "Ocultar resposta" : "Revelar resposta"}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "250px",
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 rounded-xl p-4 flex flex-col justify-between shadow-sm border border-slate-200 bg-white"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <p className="text-base font-semibold text-slate-700 text-center leading-snug line-clamp-4 whitespace-pre-wrap">
                {card.question}
              </p>
            </div>
            {card.category && (
              <span className="mt-2 self-end text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 uppercase tracking-wide">
                {card.category}
              </span>
            )}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              clique para revelar
            </span>
          </div>

          {/* Verso */}
          <div
            className="absolute inset-0 rounded-xl p-4 flex flex-col justify-between shadow-sm border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex-1 flex items-center justify-center overflow-hidden">
              <p className="text-base text-slate-600 text-center leading-snug line-clamp-4 whitespace-pre-wrap">
                {card.answer}
              </p>
            </div>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              clique para ocultar
            </span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleExpandClick}
            className="p-1 rounded bg-white/90 hover:bg-violet-50 border border-slate-200 text-slate-400 hover:text-violet-500 transition-colors shadow-sm"
            title="Ampliar"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
          <button
            onClick={handleEditClick}
            className="p-1 rounded bg-white/90 hover:bg-indigo-50 border border-slate-200 text-slate-400 hover:text-indigo-500 transition-colors shadow-sm"
            title="Editar"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 rounded bg-white/90 hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-500 transition-colors shadow-sm"
            title="Excluir"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {modalOpen && (
        <CardModal
          card={card}
          onClose={() => setModalOpen(false)}
          onEdit={() => { setModalOpen(false); onEdit(card); }}
        />
      )}
    </>
  );
}
