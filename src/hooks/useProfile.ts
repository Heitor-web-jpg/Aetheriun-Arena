import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export interface Profile { username: string; wins: number; losses: number; games_played: number; avatar_url?: string; }

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const id = data.user?.id;
      if (!id) return;
      const { data: p } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (p) setProfile(p as Profile);
    });
  }, []);
  return { profile };
}
