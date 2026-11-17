-- Cupom de parceiro com desconto na assinatura.
-- O desconto de verdade é uma oferta criada na loja; aqui fica só qual oferta cada código usa.
--   discount_percent: % exibido no app (ex.: 15), para riscar o preço cheio
--   google_offer_tag: tag da oferta "determinada pelo desenvolvedor" nos planos base do Google Play (ex.: parceiro-15).
--     A mesma oferta também precisa da tag rc-ignore-offer, para o RevenueCat não oferecê-la a quem não tem cupom.
-- Código sem desconto (só atribuição/benefício) deixa as duas colunas vazias.
alter table public.partners add column if not exists discount_percent smallint
  check (discount_percent is null or discount_percent between 1 and 90);
alter table public.partners add column if not exists google_offer_tag text
  check (google_offer_tag is null or google_offer_tag ~ '^[a-z0-9-]{1,63}$');

-- Exemplo (descomente e ajuste quando a oferta existir na Play Console):
-- insert into public.partners (code, name, perk, discount_percent, google_offer_tag)
-- values ('GARRIDO', 'Garrido', '15% off no primeiro período da assinatura', 15, 'parceiro-15')
-- on conflict (code) do update set name = excluded.name, perk = excluded.perk,
--   discount_percent = excluded.discount_percent, google_offer_tag = excluded.google_offer_tag, active = true;
