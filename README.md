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
| `app/` | Rotas: trilha `(tabs)/index`, perfil `(tabs)/profile`, lição `lesson/[id]`, cadastro `pet-edit` |
| `components/` | Logan (SVG), LoganSays, PathNode, ModuleBanner, StatsHeader, ChunkyButton, ProgressBar, PaywallModal, `lesson/*` |
| `store/` | `useAppStore` — pet, progresso, XP, streak, escudos, `isPro`, paywall |
| `services/` | Regras puras de gamificação e progressão, mock RevenueCat, repositório Supabase-ready, diálogos |
| `data/` | `mockData.ts` — 4 fases, 14 lições, planos e benefícios Pro |
| `types/` | Schema do domínio |
| `supabase/` | `schema.sql` com RLS |

## Regras de gamificação

- XP = recompensa da lição + bônus de dificuldade (0/3/5). Refazer lição rende 50%.
- Ofensiva sobe 1x por dia. A cada 7 dias: +50 XP e Escudo(s) de Ofensiva (1 grátis / 2 Pro, máx. 2).
- Ao abrir o app, dias perdidos consomem escudos; sem escudos suficientes a ofensiva zera.
- Fase 1 é gratuita; demais fases exigem Pro e a conclusão da fase anterior.

## Próximos passos de integração

- **RevenueCat:** `npx expo install react-native-purchases` e implementar `services/purchases.ts` (interface já pronta).
- **Supabase:** preencher `.env` (ver `.env.example`), aplicar `supabase/schema.sql` e implementar `WolverBarkRepository` em `services/api.ts`.
