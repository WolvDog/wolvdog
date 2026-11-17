// Webhook do RevenueCat → marca quem é Pro em public.profiles (is_pro, pro_expires_at).
// É o único caminho que muda o Pro no servidor: o app não tem permissão de escrever nessas colunas.
//
// Publicação (Supabase → Edge Functions):
//   - nome: revenuecat-webhook, com "Verify JWT" DESLIGADO (o RevenueCat não manda token do Supabase)
//   - segredo REVENUECAT_WEBHOOK_AUTH (Edge Functions → Secrets), igual ao "Authorization header" do webhook no RevenueCat
//   - URL para o RevenueCat: https://<projeto>.supabase.co/functions/v1/revenuecat-webhook
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já existem no ambiente das Edge Functions.
import { createClient } from 'jsr:@supabase/supabase-js@2';

const PRO_ENTITLEMENT_ID = 'pro';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Eventos que não mudam o acesso. */
const IGNORED = new Set(['TEST', 'SUBSCRIBER_ALIAS', 'SUBSCRIPTION_PAUSED', 'INVOICE_ISSUANCE', 'VIRTUAL_CURRENCY_TRANSACTION']);

interface RevenueCatEvent {
  type: string;
  app_user_id?: string;
  original_app_user_id?: string;
  aliases?: string[];
  entitlement_ids?: string[] | null;
  expiration_at_ms?: number | null;
  event_timestamp_ms?: number;
  transferred_from?: string[];
  transferred_to?: string[];
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

/** Só ids do Supabase (uuid): ids anônimos do RevenueCat ($RCAnonymousID…) não têm perfil. */
const supabaseIds = (ids: (string | undefined)[]) => [...new Set(ids.filter((id): id is string => !!id && UUID.test(id)))];

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' });

  const secret = Deno.env.get('REVENUECAT_WEBHOOK_AUTH');
  if (!secret || req.headers.get('Authorization') !== secret) return json(401, { error: 'unauthorized' });

  const body = await req.json().catch(() => null);
  const event: RevenueCatEvent | undefined = body?.event;
  if (!event?.type) return json(400, { error: 'missing event' });
  if (IGNORED.has(event.type)) return json(200, { ignored: event.type });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });
  const eventAt = new Date(event.event_timestamp_ms ?? Date.now()).toISOString();
  // Eventos fora de ordem: só aplica se for mais novo que o último aplicado.
  const newerOnly = `pro_event_at.is.null,pro_event_at.lte."${eventAt}"`;

  async function setPro(ids: string[], isPro: boolean, expiresAtMs: number | null) {
    if (ids.length === 0) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        is_pro: isPro,
        pro_expires_at: expiresAtMs ? new Date(expiresAtMs).toISOString() : null,
        pro_event_at: eventAt,
      })
      .in('id', ids)
      .or(newerOnly);
    if (error) throw error;
  }

  try {
    // Assinatura passou de uma conta para outra (restaurar compras em outra conta).
    if (event.type === 'TRANSFER') {
      await setPro(supabaseIds(event.transferred_from ?? []), false, null);
      await setPro(supabaseIds(event.transferred_to ?? []), true, null);
      return json(200, { ok: true });
    }

    if (!event.entitlement_ids?.includes(PRO_ENTITLEMENT_ID)) return json(200, { ignored: 'not pro' });

    const ids = supabaseIds([event.app_user_id, event.original_app_user_id, ...(event.aliases ?? [])]);
    const expiresAtMs = event.expiration_at_ms ?? null;
    // Cancelar não tira o acesso: o Pro vale até a expiração (o evento EXPIRATION chega depois).
    const isPro = event.type !== 'EXPIRATION' && (expiresAtMs === null || expiresAtMs > Date.now());
    await setPro(ids, isPro, expiresAtMs);
    return json(200, { ok: true, users: ids.length, isPro });
  } catch (e) {
    console.error('[revenuecat-webhook]', e);
    // 500: o RevenueCat tenta de novo mais tarde.
    return json(500, { error: 'db error' });
  }
});
