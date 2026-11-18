import { FlashCard } from "@/types/flashcard";
import { loadCards, saveCards } from "@/lib/storage";

const listeners = new Set<() => void>();
let cachedCards: FlashCard[] | null = null;

export function subscribeToCards(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCardsSnapshot(): FlashCard[] {
  if (cachedCards === null) cachedCards = loadCards();
  return cachedCards;
}

export function getServerCardsSnapshot(): null {
  return null;
}

export function updateCards(transform: (cards: FlashCard[]) => FlashCard[]): void {
  cachedCards = transform(getCardsSnapshot());
  saveCards(cachedCards);
  listeners.forEach((listener) => listener());
}
