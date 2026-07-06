export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
}

export interface FlashCardDeck {
  id: string;
  name: string;
  cards: FlashCard[];
  createdAt: number;
}
