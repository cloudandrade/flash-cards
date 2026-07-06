"use client";

import { useState, useEffect, useCallback } from "react";
import { FlashCard } from "@/types/flashcard";
import { loadCards, saveCards, generateId } from "@/lib/storage";

export function useFlashCards() {
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCards(loadCards());
    setIsLoaded(true);
  }, []);

  const addCard = useCallback(
    (question: string, answer: string, category?: string) => {
      const newCard: FlashCard = {
        id: generateId(),
        question,
        answer,
        category,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setCards((prev) => {
        const updated = [...prev, newCard];
        saveCards(updated);
        return updated;
      });
    },
    []
  );

  const updateCard = useCallback(
    (id: string, question: string, answer: string, category?: string) => {
      setCards((prev) => {
        const updated = prev.map((c) =>
          c.id === id
            ? { ...c, question, answer, category, updatedAt: Date.now() }
            : c
        );
        saveCards(updated);
        return updated;
      });
    },
    []
  );

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveCards(updated);
      return updated;
    });
  }, []);

  const deleteAll = useCallback(() => {
    setCards([]);
    saveCards([]);
  }, []);

  return { cards, isLoaded, addCard, updateCard, deleteCard, deleteAll };
}
