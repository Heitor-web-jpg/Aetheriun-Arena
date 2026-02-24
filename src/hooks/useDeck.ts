import { useMemo, useState } from 'react';
import type { Card } from '../lib/gameTypes';

export function useDeck() {
  const [deck, setDeck] = useState<Card[]>([]);

  const validation = useMemo(() => {
    const creatures = deck.filter((c) => c.type === 'Criatura').length;
    const highCost = deck.some((c) => c.type === 'Criatura' && c.cost >= 11);
    const legends = deck.filter((c) => c.rarity === 'Lendária').length;
    const factions = new Set(deck.map((c) => c.faction)).size;
    const byCard = new Map<string, number>();
    deck.forEach((c) => byCard.set(c.id, (byCard.get(c.id) ?? 0) + 1));
    const maxCopies = [...byCard.values()].every((v) => v <= 3);
    const valid = deck.length === 40 && creatures >= 15 && highCost && legends <= 10 && factions <= 2 && maxCopies;
    return { valid, creatures, highCost, legends, factions, maxCopies };
  }, [deck]);

  function addCard(card: Card) {
    if (deck.length >= 40) return;
    const copies = deck.filter((c) => c.id === card.id).length;
    if (copies >= 3) return;
    setDeck((prev) => [...prev, card]);
  }

  return { deck, setDeck, addCard, validation };
}
