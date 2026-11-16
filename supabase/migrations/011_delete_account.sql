-- WolvDog — migração 011: o tutor pode excluir a própria conta pelo app (exigência da App Store e do Google Play)
-- Rode no SQL Editor do Supabase (pode ser executada de novo sem erro).
--
-- Apaga o usuário de auth.users; o resto vai junto pelas chaves "on delete cascade":
-- profiles → pets, lesson_completions, xp_events, streaks; e push_tokens.
-- Só apaga a conta de quem chamou (auth.uid()); ninguém consegue apagar a conta de outra pessoa.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
