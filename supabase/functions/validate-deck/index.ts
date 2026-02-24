Deno.serve(async (req) => {
  const { cards } = await req.json();
  const creatures = cards.filter((c: any) => c.type === 'Criatura').length;
  const highCost = cards.some((c: any) => c.type === 'Criatura' && c.cost >= 11);
  const legends = cards.filter((c: any) => c.rarity === 'Lendária').length;
  const factions = new Set(cards.map((c: any) => c.faction)).size;
  const counts = new Map<string, number>();
  cards.forEach((c: any) => counts.set(c.id, (counts.get(c.id) ?? 0) + 1));
  const maxCopies = [...counts.values()].every((v) => v <= 3);
  const valid = cards.length === 40 && creatures >= 15 && highCost && legends <= 10 && factions <= 2 && maxCopies;
  return Response.json({ valid, checks: { creatures, highCost, legends, factions, maxCopies } });
});
