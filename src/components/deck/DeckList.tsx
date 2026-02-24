import type { Card } from '../../lib/gameTypes';
export function DeckList({ deck }: { deck: Card[] }) {
  return <div className="panel"><h3>Deck atual ({deck.length}/40)</h3>{deck.map((c,i)=><div key={`${c.id}-${i}`}>{c.name}</div>)}</div>;
}
