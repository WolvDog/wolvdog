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

- Garras = recompensa da missão + bônus de dificuldade (0/3/5). Refazer missão rende 50%.
- Sequência sobe 1x por dia. A cada 7 dias: +50 garras e Osso(s) Reserva (1 grátis / 2 Pro, máx. 2).
- Ao abrir o app, dias perdidos consomem Ossos Reserva; sem ossos suficientes a sequência zera.
- Fase 1 é gratuita; demais fases exigem Pro e a conclusão da fase anterior.
- Primeiro acesso passa pelo onboarding (`app/onboarding.tsx`): tutor, cão, raça, peso/porte, idade, foco e meta diária.

## Conta e nuvem (Supabase)

Sem `.env` o app roda 100% local (sem login). Para ativar:

1. Crie um projeto em [supabase.com](https://supabase.com) (plano grátis).
2. **SQL Editor →** cole e rode `supabase/schema.sql`.
3. **Authentication → Providers → Email:** para testes, desligue "Confirm email".
4. **Project Settings → API:** copie a *Project URL* e a *anon public key* para um arquivo `.env` (veja `.env.example`).
5. Reinicie o Expo com `--clear`.

Fluxo: o onboarding acontece primeiro; depois o tutor cria conta (ou continua sem conta). Login em conta existente restaura a jornada da nuvem; conta nova envia o que já foi feito no aparelho. Alterações são sincronizadas em segundo plano (`services/sync.ts`).

## Lembretes diários

Notificações locais (`services/notifications.ts`) agendadas para os próximos 7 dias no horário escolhido; o lembrete do dia é pulado se o tutor já treinou. Reagendadas ao abrir o app e ao cumprir missões. Não funcionam no navegador.

## Próximos passos de integração

- **RevenueCat:** `npx expo install react-native-purchases` e implementar `services/purchases.ts` (interface já pronta). `is_pro` no banco só deve ser alterado pelo webhook do RevenueCat.
- **Fotos do pet:** enviar para o Supabase Storage (hoje ficam só no aparelho).
- **Login com Google/Apple:** exige development build (não funciona no Expo Go).
