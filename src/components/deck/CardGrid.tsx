import type { Card } from '../../lib/gameTypes';

export function CardGrid({ cards, onAdd }: { cards: Card[]; onAdd: (card: Card) => void }) {
  return <div className="card-grid">{cards.map((c)=><button key={c.id} className={`card ${c.rarity}`} onClick={()=>onAdd(c)}><strong>{c.name}</strong><span>⚔ {c.attack} / ❤ {c.health}</span><span>💀 {c.cost}</span></button>)}</div>;
}
