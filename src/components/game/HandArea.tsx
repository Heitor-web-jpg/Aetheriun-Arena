import type { Card } from '../../lib/gameTypes';
export function HandArea({ cards, onPlay }: { cards: Card[]; onPlay: (card: Card) => void }) { return <div className="hand">{cards.map((c)=><button key={c.id} className="card Comum" onClick={()=>onPlay(c)}>{c.name} ({c.cost})</button>)}</div>; }
