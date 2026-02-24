import { useMemo, useState } from 'react';
import { CardFilters } from '../components/deck/CardFilters';
import { CardGrid } from '../components/deck/CardGrid';
import { DeckList } from '../components/deck/DeckList';
import { DeckStats } from '../components/deck/DeckStats';
import { useCards } from '../hooks/useCards';
import { useDeck } from '../hooks/useDeck';

export function DeckBuilder() {
  const { cards } = useCards();
  const { deck, addCard, validation } = useDeck();
  const [filters, setFilters] = useState({ search: '', faction: '' as '' | 'Eternia' | 'Snake Mountain' | 'Neutral', rarity: '' as '' | 'Comum' | 'Rara' | 'Épica' | 'Lendária', type: '' as '' | 'Criatura' | 'Poção' | 'Resposta', maxCost: 12 });

  const filtered = useMemo(() => cards.filter((c) =>
    c.name.toLowerCase().includes(filters.search.toLowerCase())
    && (!filters.faction || c.faction === filters.faction)
    && (!filters.rarity || c.rarity === filters.rarity)
    && (!filters.type || c.type === filters.type)
    && c.cost <= filters.maxCost,
  ), [cards, filters]);

  return <main className="page grid-2"><section><CardFilters filters={filters} setFilters={setFilters} /><CardGrid cards={filtered} onAdd={addCard} /></section><section><DeckStats deck={deck} validation={validation} /><DeckList deck={deck} /><button disabled={!validation.valid}>Salvar deck</button></section></main>;
}
