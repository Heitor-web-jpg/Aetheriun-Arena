import type { Card } from '../../lib/gameTypes';
export function CardSlot({ card }: { card: Card | null }) { return <div className="slot">{card ? `${card.name} (${card.attack}/${card.health})` : 'Slot vazio'}</div>; }
