import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';
import { fallbackCards } from '../lib/cardData';
import type { Card } from '../lib/gameTypes';

export function useCards() {
  const [cards, setCards] = useState<Card[]>(fallbackCards);
  useEffect(() => {
    supabase.from('cards').select('*').then(({ data }) => {
      if (data?.length) setCards(data as Card[]);
    });
  }, []);
  return { cards };
}
