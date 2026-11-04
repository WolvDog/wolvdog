-- WolverBark — migração 008: endereços de push dos aparelhos (Expo Push / FCM)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).
--
-- Cada celular com notificações permitidas registra aqui o seu Expo push token.
-- Para enviar um push de teste: copie o token daqui e use https://expo.dev/notifications

create table if not exists public.push_tokens (
  token text primary key,                                            -- ExponentPushToken[...]
  user_id uuid not null references auth.users (id) on delete cascade,
  platform text not null check (platform in ('android', 'ios')),
  updated_at timestamptz not null default now()
);

create index if not exists push_tokens_user_id_idx on public.push_tokens (user_id);

alter table public.push_tokens enable row level security;

-- O tutor só vê e mexe nos tokens dos próprios aparelhos.
drop policy if exists "own push tokens" on public.push_tokens;
create policy "own push tokens" on public.push_tokens for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.push_tokens to authenticated;

-- Ver os tokens de uma conta (pelo e-mail):
-- select t.token, t.platform, t.updated_at from public.push_tokens t
-- join auth.users u on u.id = t.user_id where u.email = 'email@exemplo.com';
