import { useState } from 'react';
import { fallbackCards } from '../lib/cardData';
import type { GameState } from '../lib/gameTypes';

export function useGameState() {
  const starter = fallbackCards.slice(0, 6);
  const [state, setState] = useState<GameState>({
    players: {
      p1: { id: 'p1', health: 30, energy: 1, hand: starter, deck: fallbackCards, field: [null, null, null, null], canAttack: true },
      p2: { id: 'p2', health: 30, energy: 1, hand: starter, deck: fallbackCards, field: [null, null, null, null], canAttack: true },
    },
    currentTurn: 'p1',
    turnNumber: 1,
    status: 'playing',
    winner: null,
  });
  return { state, setState };
}
