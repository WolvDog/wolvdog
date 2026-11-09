-- WolvDog — migração 011: lista de espera da landing page (wolvdog.com)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).
-- O site só consegue INSERIR. Ninguém lê a lista pelo site: consulte pelo painel do Supabase.

create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique check (email = lower(email) and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' and length(email) <= 254),
  dog_name text check (dog_name is null or length(dog_name) <= 40),
  source text not null default 'landing' check (length(source) <= 40),
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

drop policy if exists "anyone can join waitlist" on public.waitlist;
create policy "anyone can join waitlist" on public.waitlist for insert to anon, authenticated with check (true);

-- Só inserir: sem leitura, edição ou exclusão pelo site.
revoke all on public.waitlist from anon, authenticated;
grant insert (email, dog_name, source) on public.waitlist to anon, authenticated;

-- Ver a lista (no SQL Editor):
-- select email, dog_name, created_at from public.waitlist order by created_at desc;
