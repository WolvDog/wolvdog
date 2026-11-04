-- WolverBark — migração 005: códigos de parceiro (B2B2C) dinâmicos
-- Os parceiros saem do código do app e passam a ser cadastrados aqui.
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).

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

-- Para cadastrar um parceiro real (ex.: uma creche), rode com os dados dele:
-- insert into public.partners (code, name, perk) values ('CODIGO', 'Nome do parceiro', 'Benefício exibido no app');
-- Para encerrar uma parceria: update public.partners set active = false where code = 'CODIGO';
