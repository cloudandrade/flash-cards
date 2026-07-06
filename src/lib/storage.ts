import { FlashCard } from "@/types/flashcard";

const STORAGE_KEY = "flashcards_data";

const DEFAULT_CARDS: FlashCard[] = [
  {
    id: "1",
    question: "O que é React?",
    answer: "Uma biblioteca JavaScript para construir interfaces de usuário, mantida pelo Meta.",
    category: "Frontend",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    question: "O que é um Hook em React?",
    answer: "Funções especiais que permitem usar estado e outros recursos do React em componentes funcionais.",
    category: "React",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "3",
    question: "O que é Next.js?",
    answer: "Um framework React com renderização no servidor (SSR), geração de sites estáticos (SSG) e roteamento automático.",
    category: "Framework",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "4",
    question: "O que é TypeScript?",
    answer: "Um superset do JavaScript que adiciona tipagem estática opcional, melhorando a manutenibilidade do código.",
    category: "Linguagem",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "5",
    question: "O que é Tailwind CSS?",
    answer: "Um framework CSS utility-first que permite estilizar diretamente no HTML com classes predefinidas.",
    category: "CSS",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "6",
    question: "O que é useState?",
    answer: "Hook do React que permite adicionar e gerenciar estado local em componentes funcionais.",
    category: "React",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "7",
    question: "O que é useEffect?",
    answer: "Hook do React para executar efeitos colaterais em componentes funcionais, como chamadas de API ou subscriptions.",
    category: "React",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "8",
    question: "O que é localStorage?",
    answer: "API do navegador que permite armazenar dados de forma persistente no cliente, sem expiração automática.",
    category: "Web API",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function loadCards(): FlashCard[] {
  if (typeof window === "undefined") return DEFAULT_CARDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCards(DEFAULT_CARDS);
      return DEFAULT_CARDS;
    }
    return JSON.parse(raw) as FlashCard[];
  } catch {
    return DEFAULT_CARDS;
  }
}

export function saveCards(cards: FlashCard[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
