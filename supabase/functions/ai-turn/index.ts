Deno.serve(async (req) => {
  const { state, aiPlayerId } = await req.json();
  const ai = state.players[aiPlayerId];
  const oppId = Object.keys(state.players).find((id) => id !== aiPlayerId)!;
  const opp = state.players[oppId];

  ai.hand.sort((a: any, b: any) => (b.attack + b.health) / Math.max(1, b.cost) - (a.attack + a.health) / Math.max(1, a.cost));

  for (const card of ai.hand) {
    const slot = ai.field.findIndex((f: any) => f === null);
    if (slot >= 0 && card.cost <= ai.energy && card.type === 'Criatura') {
      ai.field[slot] = card;
      ai.energy -= card.cost;
    }
  }

  for (const attacker of ai.field.filter(Boolean)) {
    const targets = opp.field.map((c: any, idx: number) => ({ c, idx })).filter((t: any) => t.c).sort((x: any, y: any) => x.c.health - y.c.health);
    if (targets.length) {
      targets[0].c.health -= attacker.attack;
      if (targets[0].c.health <= 0) opp.field[targets[0].idx] = null;
    } else {
      opp.health -= attacker.attack;
    }
  }

  state.currentTurn = oppId;
  state.turnNumber += 1;
  return Response.json({ state });
});
