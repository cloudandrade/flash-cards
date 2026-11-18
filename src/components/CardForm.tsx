"use client";

import { useState } from "react";
import { FlashCard } from "@/types/flashcard";

interface CardFormProps {
  card?: FlashCard | null;
  onSave: (question: string, answer: string, category?: string) => void;
  onCancel: () => void;
}

export default function CardForm({ card, onSave, onCancel }: CardFormProps) {
  const [question, setQuestion] = useState(card?.question ?? "");
  const [answer, setAnswer] = useState(card?.answer ?? "");
  const [category, setCategory] = useState(card?.category ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    onSave(question.trim(), answer.trim(), category.trim() || undefined);
  }

  return (
    <div className="bg-white border border-indigo-200 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">
          {card ? "Editar card" : "Novo flash card"}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-white/70 hover:text-white transition-colors text-lg leading-none"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Pergunta / Título
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ex: O que é React?"
            rows={2}
            required
            autoFocus
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Resposta
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Ex: Biblioteca JavaScript para construir interfaces..."
            rows={3}
            required
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-slate-700 placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Categoria <span className="text-slate-300 font-normal normal-case">(opcional)</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex: React, CSS..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!question.trim() || !answer.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {card ? "Salvar" : "Criar card"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
