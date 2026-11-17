-- Assinatura Pro pelo RevenueCat: o webhook (supabase/functions/revenuecat-webhook) é o único que muda estes campos.
-- O app só lê (nenhum grant de insert/update para authenticated nestas colunas).
alter table public.profiles add column if not exists pro_expires_at timestamptz;
-- Momento do último evento aplicado: eventos que chegam fora de ordem não desfazem um mais novo.
alter table public.profiles add column if not exists pro_event_at timestamptz;
