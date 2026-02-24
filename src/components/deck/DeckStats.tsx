import type { Card } from '../../lib/gameTypes';

export function DeckStats({ deck, validation }: { deck: Card[]; validation: { valid: boolean; creatures: number; highCost: boolean; legends: number; factions: number; maxCopies: boolean } }) {
  const curve = Array.from({length: 12},(_,i)=>deck.filter((c)=>c.cost===i+1).length);
  return <div className="panel"><h3>Validação</h3>
    <p>{deck.length}/40</p>
    <p>{validation.creatures >= 15 ? '✅':'❌'} mín 15 criaturas ({validation.creatures})</p>
    <p>{validation.highCost ? '✅':'❌'} 1 criatura custo 11+</p>
    <p>{validation.legends <= 10 ? '✅':'❌'} máx 10 lendárias ({validation.legends})</p>
    <p>{validation.factions <= 2 ? '✅':'❌'} máx 2 facções ({validation.factions})</p>
    <p>{validation.maxCopies ? '✅':'❌'} máx 3 cópias</p>
    <h4>Curva de mana</h4>
    <div className="curve">{curve.map((v,i)=><div key={i} style={{height: `${v*8}px`}} title={`custo ${i+1}: ${v}`} />)}</div>
  </div>;
}
