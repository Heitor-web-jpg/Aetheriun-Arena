export type Faction = 'Eternia' | 'Snake Mountain' | 'Neutral';
export type Rarity = 'Comum' | 'Rara' | 'Épica' | 'Lendária';
export type CardType = 'Criatura' | 'Poção' | 'Resposta';

export interface Card {
  id: string;
  name: string;
  cost: number;
  faction: Faction;
  rarity: Rarity;
  type: CardType;
  attack: number;
  health: number;
  description: string;
  image_url: string;
  effect_type: string | null;
  effect_value: number | null;
  duration: number | null;
  trigger_type: string | null;
  reactive_slot: number | null;
}

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  name: string;
  user_id: string;
  cards: DeckCard[];
  created_at: string;
  updated_at: string;
}

export interface PlayerState {
  id: string;
  health: number;
  energy: number;
  hand: Card[];
  deck: Card[];
  field: (Card | null)[];
  canAttack: boolean;
}

export interface GameState {
  players: Record<string, PlayerState>;
  currentTurn: string;
  turnNumber: number;
  status: 'playing' | 'finished';
  winner: string | null;
}
