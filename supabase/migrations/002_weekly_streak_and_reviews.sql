-- WolverBark — migração 002: sequência semanal + reforço adaptativo
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).

alter table public.profiles add column if not exists weekly_goal_days smallint not null default 3;
alter table public.profiles add column if not exists review_queue jsonb not null default '{}'::jsonb;
alter table public.streaks add column if not exists last_evaluated_week date;
-- frozen_dates passa a guardar as semanas (segunda-feira) salvas por um Osso Reserva.

grant insert (weekly_goal_days, review_queue) on public.profiles to authenticated;
grant update (weekly_goal_days, review_queue) on public.profiles to authenticated;
