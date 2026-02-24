# Aetheriun Arena - He-Man Card Game

Projeto completo com frontend React + Supabase (Auth, DB, RLS, Edge Functions, multiplayer e IA de treino).

## Rodando

```bash
npm install
npm run dev
```

Configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Estrutura

- `src/pages`: telas principais
- `src/components`: game, deck, menu, profile
- `src/hooks`: estado e integrações
- `supabase/migrations`: SQL completo com tabelas, políticas e seed
- `supabase/functions`: game-action, validate-deck, ai-turn, matchmaking
