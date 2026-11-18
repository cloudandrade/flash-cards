"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FlashCard } from "@/types/flashcard";

interface CardFormModalProps {
  card?: FlashCard | null;
  onSave: (question: string, answer: string, category?: string) => void;
  onClose: () => void;
}

export default function CardFormModal({ card, onSave, onClose }: CardFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isUnmountingRef = useRef(false);
  const [question, setQuestion] = useState(card?.question ?? "");
  const [answer, setAnswer] = useState(card?.answer ?? "");
  const [category, setCategory] = useState(card?.category ?? "");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    isUnmountingRef.current = false;
    dialog.showModal();
    return () => {
      isUnmountingRef.current = true;
      if (dialog.open) dialog.close();
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) onClose();
    },
    [onClose]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!question.trim() || !answer.trim()) return;
      onSave(question.trim(), answer.trim(), category.trim() || undefined);
      onClose();
    },
    [question, answer, category, onSave, onClose]
  );

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={() => { if (!isUnmountingRef.current) onClose(); }}
      className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">
          {card ? "Editar Card" : "Novo Flash Card"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 bg-white">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Pergunta / Título
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: O que é React?"
            rows={2}
            required
            autoFocus
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Resposta
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ex: Uma biblioteca JavaScript para construir interfaces..."
            rows={4}
            required
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none text-slate-700placeholder:text-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Categoria <span className="text-slate-300 font-normal normal-case">(opcional)</span>
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: React, JavaScript, CSS..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!question.trim() || !answer.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {card ? "Salvar alterações" : "Criar card"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
