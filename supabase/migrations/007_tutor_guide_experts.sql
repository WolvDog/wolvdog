-- WolvDog — migração 007: Guia do Tutor (especialista parceira + leitura dos guias)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).
--
-- Os textos dos guias ficam dentro do app (funcionam sem internet).
-- Quem assina o guia (veterinária parceira) é cadastrada aqui — nenhum nome fica fixo no app.
-- Sem especialista ativa, o app mostra o Guia como conteúdo WolvDog genérico.

create table if not exists public.experts (
  id text primary key,                                  -- ex.: 'vet-parceira'
  display_name text not null,                           -- como aparece no app (ex.: 'Dra. Fulana')
  title text not null default 'Médica veterinária',
  registry text,                                        -- ex.: 'CRMV-SP 00000'
  avatar_url text,                                      -- URL pública da foto ou avatar ilustrado (opcional)
  -- Guias que ela JÁ revisou e aprovou (slugs de data/guides.ts). Só esses ganham o selo "Validado".
  validated_guides text[] not null default '{}',
  sort int not null default 0,                          -- se houver mais de uma ativa, vale a de menor sort
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.experts enable row level security;

drop policy if exists "read active experts" on public.experts;
create policy "read active experts" on public.experts for select to anon, authenticated using (active);

-- Guias lidos pelo tutor: { "slug": "AAAA-MM-DD" }. A leitura vale +5 garras uma única vez.
alter table public.profiles add column if not exists guide_reads jsonb not null default '{}'::jsonb;

-- Para cadastrar a especialista (troque pelos dados reais):
-- insert into public.experts (id, display_name, registry, avatar_url)
-- values ('vet-parceira', 'Dra. Nome', 'CRMV-SP 00000', null)
-- on conflict (id) do update set display_name = excluded.display_name, registry = excluded.registry, avatar_url = excluded.avatar_url;
--
-- Quando ela aprovar um guia, marque como validado:
-- update public.experts set validated_guides = array_append(validated_guides, 'calor') where id = 'vet-parceira';
-- Slugs: parque, monta, calor, primeiros-socorros, creche
--
-- Para encerrar a parceria (o app volta ao modo genérico):
-- update public.experts set active = false where id = 'vet-parceira';
--
-- Cupom da clínica: use a tabela partners (migração 005), ex.:
-- insert into public.partners (code, name, perk) values ('CODIGO', 'Nome da clínica', '30% off no 1º mês');
