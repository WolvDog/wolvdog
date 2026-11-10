-- WolvDog — migração 004: dados de segmentação (gênero e nascimento do tutor, sexo do cão)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).

alter table public.profiles add column if not exists tutor_gender text
  check (tutor_gender in ('male', 'female', 'undisclosed'));
alter table public.profiles add column if not exists tutor_birth_date date;
alter table public.pets add column if not exists sex text check (sex in ('male', 'female'));

grant insert (tutor_gender, tutor_birth_date) on public.profiles to authenticated;
grant update (tutor_gender, tutor_birth_date) on public.profiles to authenticated;

-- Exemplo de segmentação para campanhas:
-- select p.tutor_gender, date_part('year', age(p.tutor_birth_date)) as idade, pt.sex as sexo_cao, pt.breed, p.partner_code
-- from public.profiles p left join public.pets pt on pt.owner_id = p.id;
