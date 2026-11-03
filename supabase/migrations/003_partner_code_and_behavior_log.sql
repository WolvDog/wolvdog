-- WolverBark — migração 003: código de parceiro (piloto com creches) + diário de comportamento
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).

alter table public.profiles add column if not exists partner_code text;
alter table public.profiles add column if not exists behavior_log jsonb not null default '{}'::jsonb;

grant insert (partner_code, behavior_log) on public.profiles to authenticated;
grant update (partner_code, behavior_log) on public.profiles to authenticated;

-- Relatório do piloto: tutores e assinantes por parceiro
-- select partner_code, count(*) as tutores, count(*) filter (where is_pro) as assinantes
-- from public.profiles where partner_code is not null group by partner_code;
