-- Cupons: desconto vitalício por oferta do RevenueCat e prazo de validade do código.
--   offering_id: oferta do RevenueCat com os planos de preço menor (ex.: desconto15, desconto30).
--     O tutor paga o preço com desconto enquanto continuar assinando (vitalício).
--   google_offer_tag (migração 014): oferta de desconto só na primeira cobrança (ex.: promo-20).
--   valid_from / valid_until: período em que o código pode ser usado (datas do Brasil, inclusive).
alter table public.partners add column if not exists offering_id text
  check (offering_id is null or offering_id ~ '^[a-z0-9_-]{1,63}$');
alter table public.partners add column if not exists valid_from date;
alter table public.partners add column if not exists valid_until date;

-- O app só enxerga códigos ativos e dentro do prazo (horário de Brasília).
drop policy if exists "read active partners" on public.partners;
create policy "read active partners" on public.partners for select to anon, authenticated using (
  active
  and (valid_from is null or (now() at time zone 'America/Sao_Paulo')::date >= valid_from)
  and (valid_until is null or (now() at time zone 'America/Sao_Paulo')::date <= valid_until)
);
