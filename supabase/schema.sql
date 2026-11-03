-- WolverBark — schema (Supabase / Postgres)
-- Rode no SQL Editor do projeto Supabase. Pode ser executado de novo sem erro.

-- Perfil do tutor (1:1 com auth.users) ---------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null default '',
  daily_goal_minutes smallint not null default 10,
  weekly_goal_days smallint not null default 3,
  review_queue jsonb not null default '{}'::jsonb,
  partner_code text,
  behavior_log jsonb not null default '{}'::jsonb,
  total_xp integer not null default 0,
  has_onboarded boolean not null default false,
  reminder_enabled boolean not null default false,
  reminder_hour smallint not null default 19,
  reminder_minute smallint not null default 0,
  -- Somente o backend (webhook do RevenueCat) deve alterar is_pro.
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id text primary key,
  owner_id uuid not null references public.profiles on delete cascade,
  name text not null,
  breed text not null,
  age_months smallint not null,
  size text not null check (size in ('mini','pequeno','medio','grande','gigante')),
  weight_kg numeric(5,1),
  photo_url text,
  challenges text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_completions (
  user_id uuid not null references public.profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  xp_earned integer not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  times_completed integer not null default 1,
  primary key (user_id, lesson_id)
);

-- Histórico de garras (append-only; seq = posição no histórico local)
create table if not exists public.xp_events (
  user_id uuid not null references public.profiles on delete cascade,
  seq integer not null,
  date date not null,
  amount integer not null,
  source text not null,
  primary key (user_id, seq)
);

create table if not exists public.streaks (
  user_id uuid primary key references public.profiles on delete cascade,
  current integer not null default 0,
  longest integer not null default 0,
  last_active_date date,
  freezes_available smallint not null default 1,
  frozen_dates date[] not null default '{}',
  last_evaluated_week date
);

-- Row Level Security: cada usuário só enxerga e altera os próprios dados -------
alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.xp_events enable row level security;
alter table public.streaks enable row level security;

drop policy if exists "own profile" on public.profiles;
drop policy if exists "own pets" on public.pets;
drop policy if exists "own completions" on public.lesson_completions;
drop policy if exists "own xp events" on public.xp_events;
drop policy if exists "own streak" on public.streaks;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own pets" on public.pets for all using (auth.uid() = owner_id);
create policy "own completions" on public.lesson_completions for all using (auth.uid() = user_id);
create policy "own xp events" on public.xp_events for all using (auth.uid() = user_id);
create policy "own streak" on public.streaks for all using (auth.uid() = user_id);

-- Impede que o app marque a si mesmo como Pro: o cliente só escreve as colunas abaixo.
revoke insert, update on public.profiles from authenticated;
grant insert (id, name, daily_goal_minutes, weekly_goal_days, review_queue, partner_code, behavior_log, total_xp, has_onboarded, reminder_enabled, reminder_hour, reminder_minute, updated_at)
  on public.profiles to authenticated;
grant update (name, daily_goal_minutes, weekly_goal_days, review_queue, partner_code, behavior_log, total_xp, has_onboarded, reminder_enabled, reminder_hour, reminder_minute, updated_at)
  on public.profiles to authenticated;
