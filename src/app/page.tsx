"use client";

import { useState, useMemo } from "react";
import { FlashCard as FlashCardType } from "@/types/flashcard";
import { useFlashCards } from "@/hooks/useFlashCards";
import FlashCard from "@/components/FlashCard";
import CardForm from "@/components/CardForm";
import Alert from "@/components/Alert";
import DeckView from "@/components/DeckView";

type ViewMode = "grid" | "deck";

export default function Home() {
  const { cards, isLoaded, addCard, updateCard, deleteCard, deleteAll } = useFlashCards();
  const [viewMode, setViewMode]         = useState<ViewMode>("grid");
  const [formOpen, setFormOpen]         = useState(false);
  const [editingCard, setEditingCard]   = useState<FlashCardType | null>(null);
  const [search, setSearch]             = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const categories = useMemo(() => {
    const cats = cards.map((c) => c.category).filter((c): c is string => Boolean(c));
    return [...new Set(cats)].sort();
  }, [cards]);

  const filtered = useMemo(() => {
    return cards.filter((c) => {
      const matchSearch =
        !search ||
        c.question.toLowerCase().includes(search.toLowerCase()) ||
        c.answer.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !filterCategory || c.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [cards, search, filterCategory]);

  function handleEdit(card: FlashCardType) {
    setEditingCard(card);
    setFormOpen(true);
    setViewMode("grid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSave(question: string, answer: string, category?: string) {
    if (editingCard) {
      updateCard(editingCard.id, question, answer, category);
    } else {
      addCard(question, answer, category);
    }
    setFormOpen(false);
    setEditingCard(null);
  }

  function handleCancel() {
    setFormOpen(false);
    setEditingCard(null);
  }

  function handleNewCard() {
    setEditingCard(null);
    setFormOpen(true);
    setViewMode("grid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30">

      {/* ── Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow shadow-indigo-200">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-base font-bold text-slate-800 tracking-tight hidden sm:block">Flash Cards</h1>
          </div>

          {/* Search — só no modo grade */}
          {viewMode === "grid" && (
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Toggle de modo */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode("grid")}
                title="Modo grade"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {/* Grid icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                onClick={() => { setViewMode("deck"); setFormOpen(false); }}
                title="Modo baralho"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "deck"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {/* Deck/cards icon */}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                </svg>
              </button>
            </div>

            {/* Filtro por categoria — só no modo grade */}
            {viewMode === "grid" && categories.length > 0 && (
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="hidden md:block text-sm py-1.5 pl-2 pr-6 bg-slate-100 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-600 cursor-pointer appearance-none"
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            )}

            {cards.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 text-sm font-medium rounded-lg transition-colors border border-red-200"
                title="Apagar todos os cards"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Apagar todos</span>
              </button>
            )}

            {/* Novo card — só no modo grade */}
            {viewMode === "grid" && (
              <button
                onClick={handleNewCard}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow shadow-indigo-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Novo card</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────── */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5">

        {/* ── Modo Baralho ── */}
        {viewMode === "deck" && (
          <DeckView cards={filtered} onEdit={handleEdit} />
        )}

        {/* ── Modo Grade ── */}
        {viewMode === "grid" && (
          <>
            {/* Formulário inline */}
            {formOpen && (
              <div className="mb-5">
                <CardForm card={editingCard} onSave={handleSave} onCancel={handleCancel} />
              </div>
            )}

            {/* Stats / filtros */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "card" : "cards"}
                {filtered.length !== cards.length && (
                  <span className="text-slate-400"> de {cards.length}</span>
                )}
              </span>
              {(search || filterCategory) && (
                <button
                  onClick={() => { setSearch(""); setFilterCategory(""); }}
                  className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline underline-offset-2"
                >
                  limpar filtros
                </button>
              )}
              <div className="ml-auto text-xs text-slate-400 hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] border border-slate-200">1×</kbd>
                <span>revela</span>
              </div>
            </div>

            {/* Grid */}
            {!isLoaded ? (
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-slate-100 animate-pulse" style={{ height: "250px" }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-slate-600 font-medium text-sm">Nenhum card encontrado</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {search || filterCategory ? "Tente outros termos" : "Crie seu primeiro flash card!"}
                  </p>
                </div>
                {!search && !filterCategory && !formOpen && (
                  <button
                    onClick={handleNewCard}
                    className="mt-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Criar primeiro card
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
                {filtered.map((card) => (
                  <FlashCard
                    key={card.id}
                    card={card}
                    onEdit={handleEdit}
                    onDelete={deleteCard}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Alert de confirmação */}
      {confirmDeleteAll && (
        <Alert
          variant="danger"
          title="Apagar todos os cards?"
          message={`Você está prestes a apagar ${cards.length} ${cards.length === 1 ? "card" : "cards"}. Esta ação não pode ser desfeita.`}
          confirmLabel="Apagar todos"
          cancelLabel="Cancelar"
          onConfirm={() => {
            deleteAll();
            setFormOpen(false);
            setEditingCard(null);
            setConfirmDeleteAll(false);
          }}
          onCancel={() => setConfirmDeleteAll(false)}
        />
      )}
    </div>
  );
}
