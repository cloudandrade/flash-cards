import { FlashCard } from "@/types/flashcard";

const STORAGE_KEY = "flashcards_data";

const TUTORIAL_CATEGORY = "Tutorial";

const TUTORIAL_STEPS = [
  {
    question: "Como estudar com um card?",
    answer:
      "Clique no card (ou aperte Enter) para revelar a resposta. Passe o mouse sobre ele para ampliar, editar ou excluir. Estes cards de tutorial também podem ser excluídos.",
  },
  {
    question: "Como criar os meus cards?",
    answer:
      "Clique em “Novo card”, escreva a pergunta e a resposta e, se quiser, uma categoria. Depois é só buscar ou filtrar por ela.",
  },
  {
    question: "Como revisar em sequência?",
    answer:
      "Use o modo baralho, no botão ao lado da grade: os cards aparecem um de cada vez e você avança com “Próximo”.",
  },
];

function createTutorialCards(): FlashCard[] {
  const now = Date.now();
  return TUTORIAL_STEPS.map((step, index) => ({
    id: `tutorial-${index + 1}`,
    ...step,
    category: TUTORIAL_CATEGORY,
    createdAt: now,
    updatedAt: now,
  }));
}

export function loadCards(): FlashCard[] {
  if (typeof window === "undefined") return createTutorialCards();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const tutorialCards = createTutorialCards();
      saveCards(tutorialCards);
      return tutorialCards;
    }
    return JSON.parse(raw) as FlashCard[];
  } catch {
    return createTutorialCards();
  }
}

export function saveCards(cards: FlashCard[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
