-- Extensions
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  wins int not null default 0,
  losses int not null default 0,
  games_played int not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(split_part(new.email, '@', 1), 'hero_' || substr(new.id::text, 1, 6)))
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cost int not null,
  faction text not null,
  rarity text not null,
  type text not null,
  attack int not null default 0,
  health int not null default 0,
  description text not null,
  image_url text,
  effect_type text,
  effect_value int,
  duration int,
  trigger_type text,
  reactive_slot int,
  created_at timestamptz default now()
);

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.deck_cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete cascade,
  quantity int not null check (quantity > 0 and quantity <= 3)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  player1_id uuid references auth.users(id),
  player2_id uuid references auth.users(id),
  winner_id uuid references auth.users(id),
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.match_rooms (
  id uuid primary key default gen_random_uuid(),
  player1_id uuid references auth.users(id),
  player2_id uuid references auth.users(id),
  game_state jsonb not null,
  current_turn uuid,
  status text not null default 'waiting',
  created_at timestamptz default now()
);

create table if not exists public.matchmaking_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  deck_id uuid not null references public.decks(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.decks enable row level security;
alter table public.deck_cards enable row level security;
alter table public.matches enable row level security;
alter table public.match_rooms enable row level security;
alter table public.matchmaking_queue enable row level security;

create policy "profiles self select" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "cards read all" on public.cards for select using (true);
create policy "decks owner all" on public.decks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "deck cards by deck owner" on public.deck_cards for all using (
  exists (select 1 from public.decks d where d.id = deck_id and d.user_id = auth.uid())
) with check (
  exists (select 1 from public.decks d where d.id = deck_id and d.user_id = auth.uid())
);
create policy "matches participant read" on public.matches for select using (auth.uid() in (player1_id, player2_id));
create policy "rooms participant all" on public.match_rooms for all using (auth.uid() in (player1_id, player2_id)) with check (auth.uid() in (player1_id, player2_id));
create policy "queue self all" on public.matchmaking_queue for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed ~50 cards
insert into public.cards (name,cost,faction,rarity,type,attack,health,description,effect_type,effect_value,duration,trigger_type,reactive_slot,image_url)
values
('He-Man',12,'Eternia','Lendária','Criatura',8,8,'Campeão de Grayskull','buff_team',2,2,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Teela',6,'Eternia','Épica','Criatura',4,5,'Guardiã tática',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Man-At-Arms',5,'Eternia','Rara','Criatura',3,5,'Defensor de Eternia','shield',2,2,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Sorceress',10,'Eternia','Lendária','Criatura',2,6,'Compra duas cartas','draw',2,null,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Battle Cat',7,'Eternia','Épica','Criatura',5,4,'Fera leal',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Orko',4,'Eternia','Rara','Criatura',2,3,'Compra uma carta','draw',1,null,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Ram Man',3,'Eternia','Comum','Criatura',4,2,'Impacto máximo',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Stratos',2,'Eternia','Comum','Criatura',2,2,'Ataque aéreo',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Man-E-Faces',5,'Eternia','Rara','Criatura',3,4,'Versatilidade tática','adapt',1,1,'on_turn_start',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Buzz-Off',3,'Eternia','Comum','Criatura',2,3,'Escaramuça',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Espada do Poder',2,'Eternia','Rara','Poção',0,0,'+3 de ataque','buff_attack',3,2,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Escudo de Grayskull',2,'Eternia','Rara','Resposta',0,0,'Bloqueia dano','prevent_damage',4,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Benção da Sorceress',3,'Eternia','Épica','Poção',0,0,'+2/+2 aliado','buff_stats',2,2,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Skeletor',11,'Snake Mountain','Lendária','Criatura',7,7,'Lorde maligno','drain',3,null,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Evil-Lyn',7,'Snake Mountain','Épica','Criatura',4,5,'Controle arcano','stun',1,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Beast Man',4,'Snake Mountain','Rara','Criatura',4,3,'Fúria bestial',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Trap Jaw',6,'Snake Mountain','Épica','Criatura',5,4,'Braço mecânico',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Mer-Man',5,'Snake Mountain','Rara','Criatura',3,5,'Maré sombria',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Tri-Klops',3,'Snake Mountain','Comum','Criatura',3,2,'Visão tripla',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Clawful',2,'Snake Mountain','Comum','Criatura',2,2,'Pinça mortal',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Webstor',4,'Snake Mountain','Rara','Criatura',3,3,'Teia pegajosa','root',1,1,'on_attack',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Whiplash',3,'Snake Mountain','Comum','Criatura',2,4,'Cauda devastadora',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Stinkor',2,'Snake Mountain','Comum','Criatura',1,3,'Fedor tóxico','debuff_attack',1,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Cajado de Havoc',2,'Snake Mountain','Rara','Poção',0,0,'Dano mágico','direct_damage',3,null,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Veneno de Snake Mountain',3,'Snake Mountain','Épica','Poção',0,0,'Veneno por turno','poison',2,2,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Armadilha Sombria',2,'Snake Mountain','Rara','Resposta',0,0,'Anula ataque','counter_attack',1,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Mercenário da Areia',2,'Neutral','Comum','Criatura',2,2,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Bárbaro Cibernético',4,'Neutral','Rara','Criatura',4,4,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Arqueira Nômade',3,'Neutral','Comum','Criatura',3,2,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Guardião de Pedra',5,'Neutral','Rara','Criatura',2,6,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Fera do Pântano',4,'Neutral','Comum','Criatura',4,3,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Hiena de Guerra',2,'Neutral','Comum','Criatura',2,1,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Titã de Bronze',8,'Neutral','Épica','Criatura',7,7,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Atirador de Ether',3,'Neutral','Comum','Criatura',3,3,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Lobo Relampejante',5,'Neutral','Rara','Criatura',5,4,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Besta de Cristal',6,'Neutral','Épica','Criatura',4,7,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal I',1,'Neutral','Comum','Poção',0,0,'Suporte','utility',1,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal II',2,'Neutral','Comum','Poção',0,0,'Suporte','utility',1,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal III',3,'Neutral','Comum','Poção',0,0,'Suporte','utility',1,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal IV',4,'Neutral','Rara','Poção',0,0,'Suporte','utility',2,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal V',5,'Neutral','Rara','Poção',0,0,'Suporte','utility',2,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Poção Universal VI',6,'Neutral','Épica','Poção',0,0,'Suporte','utility',3,1,'on_play',null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Resposta Universal I',1,'Neutral','Comum','Resposta',0,0,'Resposta rápida','counter',1,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Resposta Universal II',2,'Neutral','Comum','Resposta',0,0,'Resposta rápida','counter',1,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Resposta Universal III',3,'Neutral','Rara','Resposta',0,0,'Resposta rápida','counter',2,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Resposta Universal IV',4,'Neutral','Rara','Resposta',0,0,'Resposta rápida','counter',2,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Resposta Universal V',5,'Neutral','Épica','Resposta',0,0,'Resposta rápida','counter',3,1,'on_react',0,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Mercenário de Ferro',6,'Neutral','Rara','Criatura',6,5,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Draconato de Elite',7,'Neutral','Épica','Criatura',6,6,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Sentinela Arcana',5,'Neutral','Rara','Criatura',3,6,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512'),
('Berserker do Norte',4,'Neutral','Comum','Criatura',5,3,'Neutro',null,null,null,null,null,'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=512')
on conflict do nothing;
