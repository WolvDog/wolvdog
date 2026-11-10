-- WolvDog — migração 010: corrige a sincronização depois da migração 007
-- A tabela profiles libera gravação coluna por coluna para o app (ver schema.sql).
-- A 007 criou a coluna guide_reads sem liberar a gravação, e o envio do perfil passou a ser recusado
-- ("permission denied"). Como o perfil é enviado primeiro, o pet e o progresso também não subiam.
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).

grant insert (guide_reads) on public.profiles to authenticated;
grant update (guide_reads) on public.profiles to authenticated;
