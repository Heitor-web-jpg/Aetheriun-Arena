import type { Card } from '../../lib/gameTypes';
export function CardView({ card }: { card: Card | null }) { return <div className="panel">{card ? <><h4>{card.name}</h4><p>{card.description}</p></> : 'Passe o mouse numa carta'}</div>; }
