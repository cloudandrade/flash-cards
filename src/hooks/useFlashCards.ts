"use client";

import { useCallback, useSyncExternalStore } from "react";
import { FlashCard } from "@/types/flashcard";
import { generateId } from "@/lib/storage";
import { getCardsSnapshot, getServerCardsSnapshot, subscribeToCards, updateCards } from "@/lib/cardStore";

const NO_CARDS: FlashCard[] = [];

export function useFlashCards() {
  const snapshot = useSyncExternalStore(subscribeToCards, getCardsSnapshot, getServerCardsSnapshot);
  const cards = snapshot ?? NO_CARDS;
  const isLoaded = snapshot !== null;

  const addCard = useCallback((question: string, answer: string, category?: string) => {
    const now = Date.now();
    const newCard: FlashCard = { id: generateId(), question, answer, category, createdAt: now, updatedAt: now };
    updateCards((current) => [...current, newCard]);
  }, []);

  const updateCard = useCallback((id: string, question: string, answer: string, category?: string) => {
    updateCards((current) =>
      current.map((card) =>
        card.id === id ? { ...card, question, answer, category, updatedAt: Date.now() } : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    updateCards((current) => current.filter((card) => card.id !== id));
  }, []);

  const deleteAll = useCallback(() => {
    updateCards(() => []);
  }, []);

  return { cards, isLoaded, addCard, updateCard, deleteCard, deleteAll };
}
