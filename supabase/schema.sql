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
  tutor_gender text check (tutor_gender in ('male', 'female', 'undisclosed')),
  tutor_birth_date date,
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
  sex text check (sex in ('male', 'female')),
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
grant insert (id, name, daily_goal_minutes, weekly_goal_days, review_queue, partner_code, behavior_log, tutor_gender, tutor_birth_date, total_xp, has_onboarded, reminder_enabled, reminder_hour, reminder_minute, updated_at)
  on public.profiles to authenticated;
grant update (id, name, daily_goal_minutes, weekly_goal_days, review_queue, partner_code, behavior_log, tutor_gender, tutor_birth_date, total_xp, has_onboarded, reminder_enabled, reminder_hour, reminder_minute, updated_at)
  on public.profiles to authenticated;

-- Parceiros B2B2C (códigos de indicação) — ver também migrations/005_partners_table.sql
create table if not exists public.partners (
  code text primary key check (code = upper(code)),
  name text not null,
  perk text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partners enable row level security;

-- O app (inclusive antes do login) só consegue ler parceiros ativos.
drop policy if exists "read active partners" on public.partners;
create policy "read active partners" on public.partners for select to anon, authenticated using (active);

-- Códigos de teste (desenvolvimento)
insert into public.partners (code, name, perk) values
  ('PARCEIRO30', 'Parceiro de teste', '30% off no 1º mês'),
  ('AUAU', 'Cupom AUAU', '10% off no plano anual')
on conflict (code) do nothing;


-- Guia do Tutor (ver migrations/007_tutor_guide_experts.sql)
create table if not exists public.experts (
  id text primary key,
  display_name text not null,
  title text not null default 'Médica veterinária',
  registry text,
  avatar_url text,
  validated_guides text[] not null default '{}',
  sort int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.experts enable row level security;
drop policy if exists "read active experts" on public.experts;
create policy "read active experts" on public.experts for select to anon, authenticated using (active);
alter table public.profiles add column if not exists guide_reads jsonb not null default '{}'::jsonb;

-- Push do servidor (ver migrations/008_push_tokens.sql)
create table if not exists public.push_tokens (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('android', 'ios')),
  updated_at timestamptz not null default now()
);
create index if not exists push_tokens_user_id_idx on public.push_tokens (user_id);
alter table public.push_tokens enable row level security;
drop policy if exists "own push tokens" on public.push_tokens;
create policy "own push tokens" on public.push_tokens for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.push_tokens to authenticated;
