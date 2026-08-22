-- ============================================================================
-- WHYNOTUPSC CHILL ZONE DATABASE SCHEMA & RLS POLICIES
-- ============================================================================

-- 1. Games Catalog
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  scoring_direction text default 'DESCENDING', -- 'ASCENDING' (e.g. react time) or 'DESCENDING' (points)
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Game Sessions
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  game_slug text not null,
  status text default 'completed',
  started_at timestamptz default now(),
  ended_at timestamptz default now(),
  duration_ms integer default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 3. Game Scores (Leaderboards)
create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  game_slug text not null,
  session_id uuid references public.game_sessions(id) on delete set null,
  score numeric not null,
  score_display text,
  duration_ms integer default 0,
  accuracy numeric,
  moves integer,
  streak integer,
  difficulty text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 4. Game Achievements
create table if not exists public.game_achievements (
  id text primary key,
  game_slug text,
  name text not null,
  description text not null,
  criteria jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 5. User Game Achievements
create table if not exists public.user_game_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  achievement_id text references public.game_achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- 6. Multiplayer Rooms
create table if not exists public.multiplayer_rooms (
  id uuid primary key default gen_random_uuid(),
  game_slug text not null default 'quick-duel',
  room_code text not null,
  status text default 'waiting', -- 'waiting', 'matched', 'active', 'finished'
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 minutes')
);

-- 7. Multiplayer Room Players
create table if not exists public.multiplayer_room_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references public.multiplayer_rooms(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  status text default 'joined', -- 'joined', 'ready', 'active', 'finished'
  score numeric,
  joined_at timestamptz default now()
);

-- ============================================================================
-- INDEXES FOR FAST QUERYING
-- ============================================================================
create index if not exists idx_game_scores_slug_score on public.game_scores(game_slug, score desc);
create index if not exists idx_game_scores_user on public.game_scores(user_id, game_slug);
create index if not exists idx_multiplayer_rooms_code on public.multiplayer_rooms(room_code);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table public.games enable row level security;
alter table public.game_sessions enable row level security;
alter table public.game_scores enable row level security;
alter table public.game_achievements enable row level security;
alter table public.user_game_achievements enable row level security;
alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_room_players enable row level security;

-- Public can read games and achievements
create policy "Allow public read on games" on public.games for select using (true);
create policy "Allow public read on achievements" on public.game_achievements for select using (true);

-- Public can read leaderboard scores
create policy "Allow public read on scores" on public.game_scores for select using (true);

-- Authenticated users can insert their own scores & sessions
create policy "Users can insert own scores" on public.game_scores
  for insert with check (auth.uid() = user_id or auth.uid() is null);

create policy "Users can insert own sessions" on public.game_sessions
  for insert with check (auth.uid() = user_id or auth.uid() is null);

create policy "Users can read own sessions" on public.game_sessions
  for select using (auth.uid() = user_id);

-- Multiplayer room policies
create policy "Public can read and join rooms" on public.multiplayer_rooms for select using (true);
create policy "Users can create rooms" on public.multiplayer_rooms for insert with check (true);
create policy "Users can update rooms" on public.multiplayer_rooms for update using (true);
create policy "Public can read room players" on public.multiplayer_room_players for select using (true);
create policy "Users can insert room players" on public.multiplayer_room_players for insert with check (true);
