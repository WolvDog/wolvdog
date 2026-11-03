-- WolverBark — schema inicial (Supabase / Postgres)

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  daily_goal_minutes smallint not null default 10,
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles on delete cascade,
  name text not null,
  breed text not null,
  age_months smallint not null,
  size text not null check (size in ('mini','pequeno','medio','grande','gigante')),
  photo_url text,
  challenges text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.lesson_completions (
  user_id uuid not null references public.profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  xp_earned integer not null,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  times_completed integer not null default 1,
  primary key (user_id, lesson_id)
);

create table public.streaks (
  user_id uuid primary key references public.profiles on delete cascade,
  current integer not null default 0,
  longest integer not null default 0,
  last_active_date date,
  freezes_available smallint not null default 1,
  frozen_dates date[] not null default '{}'
);

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.streaks enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id);
create policy "own pets" on public.pets for all using (auth.uid() = owner_id);
create policy "own completions" on public.lesson_completions for all using (auth.uid() = user_id);
create policy "own streak" on public.streaks for all using (auth.uid() = user_id);
