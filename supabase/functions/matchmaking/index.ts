import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { userId, deckId } = await req.json();
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  await supabase.from('matchmaking_queue').upsert({ user_id: userId, deck_id: deckId });
  const { data: queue } = await supabase.from('matchmaking_queue').select('*').order('created_at', { ascending: true }).limit(2);

  if (!queue || queue.length < 2) return Response.json({ status: 'waiting' });
  const [p1, p2] = queue;

  const initialState = {
    players: {
      [p1.user_id]: { health: 30, energy: 1, hand: [], field: [null, null, null, null], deck: [], canAttack: true },
      [p2.user_id]: { health: 30, energy: 1, hand: [], field: [null, null, null, null], deck: [], canAttack: true },
    },
    currentTurn: p1.user_id,
    turnNumber: 1,
    status: 'playing',
    winner: null,
  };

  const { data: room } = await supabase.from('match_rooms').insert({ player1_id: p1.user_id, player2_id: p2.user_id, game_state: initialState, current_turn: p1.user_id, status: 'playing' }).select('*').single();
  await supabase.from('matchmaking_queue').delete().in('user_id', [p1.user_id, p2.user_id]);

  return Response.json({ status: 'matched', room });
});
