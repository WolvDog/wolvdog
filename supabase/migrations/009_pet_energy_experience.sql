-- WolverBark — migração 009: perfil do cão no onboarding (energia e experiência com comandos)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).
-- O sexo do cão já existe (coluna `sex`, migração 004) e é usado na gramática dos textos (o/a, do/da…).

alter table public.pets add column if not exists energy_level text
  check (energy_level in ('high', 'balanced', 'calm'));

alter table public.pets add column if not exists command_experience text
  check (command_experience in ('none', 'basic', 'advanced'));
