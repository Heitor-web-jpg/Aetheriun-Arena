import type { Faction, Rarity, CardType } from '../../lib/gameTypes';

interface Props { filters: { search: string; faction: '' | Faction; rarity: '' | Rarity; type: '' | CardType; maxCost: number }; setFilters: (f: Props['filters']) => void; }

export function CardFilters({ filters, setFilters }: Props) {
  return <div className="panel filters">
    <input placeholder="Buscar" value={filters.search} onChange={(e)=>setFilters({...filters,search:e.target.value})} />
    <select value={filters.faction} onChange={(e)=>setFilters({...filters,faction:e.target.value as Props['filters']['faction']})}><option value="">Facção</option><option>Eternia</option><option>Snake Mountain</option><option>Neutral</option></select>
    <select value={filters.type} onChange={(e)=>setFilters({...filters,type:e.target.value as Props['filters']['type']})}><option value="">Tipo</option><option>Criatura</option><option>Poção</option><option>Resposta</option></select>
    <select value={filters.rarity} onChange={(e)=>setFilters({...filters,rarity:e.target.value as Props['filters']['rarity']})}><option value="">Raridade</option><option>Comum</option><option>Rara</option><option>Épica</option><option>Lendária</option></select>
    <input type="range" min={1} max={12} value={filters.maxCost} onChange={(e)=>setFilters({...filters,maxCost:Number(e.target.value)})} /> Custo ≤ {filters.maxCost}
  </div>;
}
