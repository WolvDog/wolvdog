-- WolvDog — migração 006: corrige a sincronização do perfil
-- O app salva o perfil com "upsert" (INSERT ... ON CONFLICT (id) DO UPDATE), que também regrava a coluna id.
-- Sem UPDATE em id, o Postgres recusava a operação inteira e nada subia para a nuvem.
-- Seguro: a política RLS "own profile" só permite que o usuário altere a própria linha (auth.uid() = id).

grant update (id) on public.profiles to authenticated;
