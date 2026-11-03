# WolverBark 🐕‍🦺

App de adestramento pet por assinatura, com experiência gamificada estilo Duolingo e o mascote **Logan** (Akita Inu herói).

## Rodando

```bash
npm install
npm start          # Expo Go / dev client
npm run web        # preview no navegador
npm run typecheck
```

## Stack

Expo SDK 58 · Expo Router · TypeScript estrito · NativeWind v4 · Zustand (persistido em AsyncStorage) · Lucide · react-native-svg

## Estrutura

| Pasta | Conteúdo |
| --- | --- |
| `app/` | Rotas: onboarding, mapa de missões `(tabs)/index`, perfil `(tabs)/profile`, missão `lesson/[id]`, edição `pet-edit` |
| `components/` | Logan (SVG), LoganSays, MissionRow, ModuleBanner, StatsHeader, HeroButton, form, icons, ProgressBar, PaywallModal, `lesson/*` |
| `store/` | `useAppStore` — pet, progresso, XP, streak, escudos, `isPro`, paywall |
| `services/` | Regras puras de gamificação e progressão, mock RevenueCat, repositório Supabase-ready, diálogos |
| `data/` | `mockData.ts` — 4 fases, 14 lições, planos e benefícios Pro |
| `types/` | Schema do domínio |
| `supabase/` | `schema.sql` com RLS |

## Identidade e vocabulário

Paleta do uniforme do Wolverine (amarelo `#FFC72C`, azul `#1E3A8A`, preto e branco) + pelagem do Logan. Títulos em Oswald; botões em estilo "quadrinho" (contorno preto + sombra sólida). Termos centralizados em `constants/brand.ts`:

| Conceito | Nome no app |
| --- | --- |
| Lição | Missão |
| XP | Garras |
| Streak | Sequência |
| Streak freeze | Osso Reserva |
| Nível | Patente |

## Regras de gamificação

- **Garras** = recompensa da missão + bônus de dificuldade (0/3/5). Refazer/reforçar rende 50%.
- **Sequência semanal:** o tutor escolhe a meta (3x, 4x, 5x por semana ou todo dia). A sequência conta semanas (seg–dom) com a meta batida. Bater a meta rende +30 garras.
- **Osso Reserva:** salva uma semana abaixo da meta. Ganha-se 1 a cada 4 semanas seguidas (Pro: a cada 2), máx. 2.
- **Treino de Reforço (repetição espaçada):** toda missão cumprida volta para revisão — "difícil" no dia seguinte, "médio" em 3 dias, "fácil" em 7, com intervalos crescentes. Até 3 reforços por dia no Mapa de Missões; o reforço abre direto no treino prático.
- **Clicker digital** na etapa de treino: som + vibração no exato momento do acerto; cada clique conta uma repetição.
- **Diário de comportamento:** check-in semanal (1 = fora de controle, 5 = sob controle) para cada desafio do cão, com gráfico das últimas 8 semanas (`app/diary.tsx`).
- **Código de parceiro:** creches/hotéis indicam com um código (ex.: `GARRIDOSP`, em `constants/partners.ts`); fica salvo no perfil (`profiles.partner_code`) para medir aquisição e conversão do piloto.
- Fase 1 é gratuita; demais fases exigem Pro e a conclusão da fase anterior.
- Primeiro acesso passa pelo onboarding (`app/onboarding.tsx`): tutor, cão, raça, peso/porte, idade, foco, meta semanal e lembrete.

## Conta e nuvem (Supabase)

Sem `.env` o app roda 100% local (sem login). Para ativar:

1. Crie um projeto em [supabase.com](https://supabase.com) (plano grátis).
2. **SQL Editor →** cole e rode `supabase/schema.sql` (projetos que já rodaram uma versão anterior: rode também os arquivos de `supabase/migrations/`).
3. **Authentication → Sign In / Providers → Email:** desligue "Confirm email" e confirme que **Email OTP Length = 6**.
4. **Authentication → Emails → Magic Link** (e **Confirm signup**): cole o conteúdo de `supabase/email-codigo.html` (assunto: `Seu código WolverBark: {{ .Token }}`). Sem isso o e-mail chega com um link em vez do código.
5. **Project Settings → API:** copie a *Project URL* e a *anon public key* para um arquivo `.env` (veja `.env.example`).
6. Reinicie o Expo com `--clear`.

Login **sem senha**: o tutor informa o e-mail e digita o código de 6 dígitos recebido (o mesmo fluxo cria a conta). O código só é pedido em aparelho novo ou após sair da conta. ⚠️ O e-mail padrão do Supabase tem limite baixo de envios por hora — para produção, configure um SMTP próprio (ex.: Resend) em Authentication → Emails → SMTP.

Fluxo: o onboarding acontece primeiro; depois o tutor cria conta (ou continua sem conta). Login em conta existente restaura a jornada da nuvem; conta nova envia o que já foi feito no aparelho. Alterações são sincronizadas em segundo plano (`services/sync.ts`).

## Lembretes diários

Notificações locais (`services/notifications.ts`) agendadas para os próximos 7 dias no horário escolhido; o lembrete do dia é pulado se o tutor já treinou. Reagendadas ao abrir o app e ao cumprir missões. Não funcionam no navegador.

## Build (APK / lojas)

Projeto EAS: `@maarcosramalhos-team/wolverbark`. Perfis em `eas.json`:

- `eas build -p android --profile preview` → APK para instalar e testar
- `eas build --profile production` → builds das lojas

## Próximos passos de integração

- **RevenueCat:** `npx expo install react-native-purchases` e implementar `services/purchases.ts` (interface já pronta). `is_pro` no banco só deve ser alterado pelo webhook do RevenueCat.
- **Fotos do pet:** enviar para o Supabase Storage (hoje ficam só no aparelho).
- **Login com Google/Apple:** exige development build (não funciona no Expo Go).
