import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const { roomId, action, payload } = await req.json();
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: room, error } = await supabase.from('match_rooms').select('*').eq('id', roomId).single();
  if (error || !room) return new Response(JSON.stringify({ error: 'room_not_found' }), { status: 404 });

  const state = room.game_state;
  const player = state.players[payload.playerId];
  const opponentId = Object.keys(state.players).find((id) => id !== payload.playerId)!;
  const opponent = state.players[opponentId];

  if (action === 'playCard') {
    const card = player.hand.find((c: any) => c.id === payload.cardId);
    if (!card || card.cost > player.energy) return Response.json({ error: 'invalid_play' }, { status: 400 });
    const slot = player.field.findIndex((c: any) => c === null);
    if (slot < 0) return Response.json({ error: 'field_full' }, { status: 400 });
    player.field[slot] = card;
    player.hand = player.hand.filter((c: any) => c.id !== payload.cardId);
    player.energy -= card.cost;
  }

  if (action === 'attack') {
    const attacker = player.field[payload.attackerSlot];
    if (!attacker) return Response.json({ error: 'invalid_attacker' }, { status: 400 });
    const defender = opponent.field[payload.targetSlot];
    if (defender) {
      defender.health -= attacker.attack;
      attacker.health -= defender.attack;
      if (defender.health <= 0) opponent.field[payload.targetSlot] = null;
      if (attacker.health <= 0) player.field[payload.attackerSlot] = null;
    } else {
      opponent.health -= attacker.attack;
    }
  }

  if (action === 'endTurn') {
    state.currentTurn = opponentId;
    state.turnNumber += 1;
    opponent.energy = Math.min(12, opponent.energy + 1);
    if (opponent.deck.length) opponent.hand.push(opponent.deck.shift());
  }

  if (action === 'surrender') {
    state.status = 'finished';
    state.winner = opponentId;
  }

  await supabase.from('match_rooms').update({ game_state: state, current_turn: state.currentTurn, status: state.status }).eq('id', roomId);
  return Response.json({ ok: true, gameState: state });
});
