export type DeckOrder = "sequential" | "shuffled";

export function shuffleIds(ids: string[], random: () => number = Math.random): string[] {
  const shuffled = [...ids];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

export function arrangeByIds<T extends { id: string }>(items: T[], orderedIds: string[]): T[] {
  const itemsById = new Map(items.map((item) => [item.id, item]));
  const arranged = orderedIds.flatMap((id) => {
    const item = itemsById.get(id);
    return item ? [item] : [];
  });
  const arrangedIds = new Set(orderedIds);
  const missing = items.filter((item) => !arrangedIds.has(item.id));
  return [...arranged, ...missing];
}
