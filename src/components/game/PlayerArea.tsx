import type { PlayerState } from '../../lib/gameTypes';
import { CardSlot } from './CardSlot';
import { EnergyBar } from './EnergyBar';
import { HealthBar } from './HealthBar';

export function PlayerArea({ player, title }: { player: PlayerState; title: string }) {
  return <div className="panel"><h3>{title}</h3><HealthBar value={player.health} /><EnergyBar value={player.energy} /><div className="field">{player.field.map((c,i)=><CardSlot key={i} card={c} />)}</div></div>;
}
