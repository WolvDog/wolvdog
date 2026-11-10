# WolvDog — briefing do produto (para discussão de retenção)

> Documento para compartilhar com outras IAs/consultores. Descreve o que já existe no app e abre a discussão sobre retenção de longo prazo.

## 1. O que é

App mobile (React Native/Expo) de **adestramento de cães por assinatura**, gamificado e em pequenas etapas diárias (5–10 min). Público: tutores brasileiros sem experiência em adestramento. Mascote/mentor: **Logan**, um Akita Inu com uniforme inspirado no Wolverine (paleta amarelo, azul, preto e branco). Método: reforço positivo (marcador "Isso!" + petisco).

## 2. Jornada atual do usuário

1. **Onboarding (~1 min):** nome do tutor → nome e foto do cão → raça → peso/porte → idade → foco do treinamento (8 desafios: xixi fora do lugar, puxa a guia, late demais, pula nas pessoas, ansiedade de separação, destrói objetos, não atende ao chamado, reatividade) → meta diária (5/10/15 min) → horário do lembrete → plano personalizado mostrando as fases prioritárias.
2. **Conta (opcional):** e-mail e senha (Supabase) para salvar na nuvem, ou "continuar sem conta".
3. **Mapa de Missões:** linha do tempo vertical, com medalhas hexagonais, dividida em fases.
4. **Missão (3–7 min), em 4 etapas:**
   - **Dica do Logan:** o conceito e o "por que funciona".
   - **Hora do treino:** passo a passo com checklist, cronômetro e contador de repetições.
   - **Relatório do treino:** "como seu cão reagiu?" (fácil / médio / difícil).
   - **Missão cumprida:** recompensas e dica para o próximo treino.
5. **Perfil do pet:** patente (nível), estatísticas, gráfico dos últimos 7 dias, evolução por fase, histórico, lembretes e conta.

## 3. Conteúdo atual (14 missões em 4 fases)

| Fase | Missões | Acesso |
| --- | --- | --- |
| 1. Boas Maneiras & Xixi no Lugar Certo | O marcador mágico "Isso!" · Os 5 momentos do xixi · Acidente? Sem bronca! · Quatro patas no chão | Grátis |
| 2. Comandos Básicos | Senta! · Fica: os 3 Ds · Junto: a posição de ouro · Vem! O chamado infalível | Pro |
| 3. Passeio sem Puxar a Guia | Equipamento de herói · Virar árvore · Meia-volta surpresa | Pro |
| 4. Ansiedade & Autocontrole | O tapete do relaxamento · "Deixa": o poder do não · Saídas que não assustam | Pro |

As missões são liberadas em sequência: a próxima só abre quando a anterior é cumprida, e cada fase exige a anterior concluída.

## 4. Gamificação atual (vocabulário próprio)

| Conceito | Nome no app | Regra atual |
| --- | --- | --- |
| XP | **Garras** | 10 a 30 por missão, + bônus de dificuldade (0/3/5); refazer uma missão rende 50% |
| Nível | **Patente** | 6 patentes (Filhote Curioso → Lenda WolvDog), de 0 a 400 garras |
| Streak | **Sequência** | +1 por dia com pelo menos 1 missão; a cada 7 dias, +50 garras |
| Streak freeze | **Osso Reserva** | Cobre dias perdidos automaticamente; ganha-se 1 (grátis) ou 2 (Pro) a cada 7 dias, máximo de 2 |
| Lembrete | Notificação do Logan | Diária, no horário escolhido; pulada se o tutor já treinou no dia |

## 5. Monetização

**WolvDog Pro:** teste grátis de 7 dias, depois R$ 29,90/mês ou R$ 199,90/ano (−44%). Benefícios:
- todas as fases liberadas;
- comportamentos complexos;
- vários perfis de pets;
- Ossos Reserva extras.

O paywall aparece ao tocar numa fase Pro, no perfil ou ao tentar adicionar outro pet. O RevenueCat ainda está simulado.

## 6. Problema que queremos resolver: retenção de longo prazo

- **O conteúdo acaba rápido.** São 14 missões, e com 1 por dia a trilha termina em cerca de 2 semanas. Depois disso o app não oferece nada novo, então a assinatura perde sentido e o usuário cancela.
- **Adestramento é repetição, não novidade.** O cão precisa praticar a mesma habilidade muitas vezes e em lugares diferentes. Uma "lição nova por dia" contraria a forma como o cão aprende.
- **A sequência diária pune a vida real.** Exigir treino todo dia gera culpa e abandono. Para cães, de 3 a 5 sessões por semana já dão ótimo resultado.
- **A evolução do pet não é medida.** Hoje medimos o que o tutor fez (missões, garras), não o que o cão melhorou (menos acidentes, menos puxões, chamado mais confiável). O valor real do produto é o comportamento do cão.

## 7. Propostas iniciais (para validar e expandir)

1. **Sequência semanal ("Semana de Garra").** O tutor escolhe uma meta de 3, 4, 5 ou 7 treinos por semana, e a sequência conta semanas cumpridas, não dias. O calendário diário continua visível. O Osso Reserva passa a proteger uma semana.
2. **Separar "aprender" de "praticar".** As missões ensinam uma habilidade nova. O **Treino do Dia** é gerado automaticamente com revisões curtas (2–3 min) das habilidades já aprendidas, em repetição espaçada. Isso cria conteúdo infinito a partir de uma base finita.
3. **Maestria por habilidade.** Cada comando avança por quatro estágios:
   1. Aprendendo
   2. Praticando
   3. Dominado
   4. "À prova de distrações", que exige praticar em 3 ambientes: casa, quintal e rua

   Assim o progresso continua mesmo com a trilha completa.
4. **Diário de comportamento.** Um check-in semanal de 30 segundos (por exemplo, "quantos acidentes esta semana?" ou "nota do passeio, de 1 a 5"). Gera gráficos de evolução real, que são o argumento mais forte para renovar a assinatura.
5. **Conteúdo por fase de vida.** Trilhas para filhote, adolescente (6–18 meses), adulto e sênior, ativadas pela idade cadastrada. Inclui eventos de aniversário do cão.
6. **Desafios e eventos sazonais.** Um desafio semanal do Logan e temporadas temáticas ligadas a momentos-chave no Brasil: fogos de Réveillon e de jogos de futebol (ansiedade), Carnaval, viagens de férias, calor e chuva.
7. **Truques como recompensa.** Dá a pata, rola, high five, finge de morto. É conteúdo divertido e muito compartilhável, ótimo para aquisição orgânica.
8. **SOS do Logan.** Uma biblioteca de soluções rápidas para problemas pontuais (latido na campainha, mordidinha de filhote, medo de trovão). Dá utilidade imediata mesmo fora da trilha.
9. **Família no treino.** Convidar outros moradores da casa, porque consistência entre as pessoas é essencial no adestramento. Também é um fator social de retenção.
10. **Cartões de conquista compartilháveis.** Por exemplo, "Caramelo dominou o Senta! 🦴", no formato de story do Instagram.
11. **Futuro Pro+:** o tutor envia um vídeo do cão executando o comando e recebe uma avaliação (por IA ou adestrador), ganhando um "certificado".

## 8. Perguntas para discussão

1. Sequência **semanal** ou **diária flexível** (por exemplo, a meta é X dias por semana, mas a contagem continua diária)? Qual retém melhor nesse contexto?
2. Qual a melhor estrutura de conteúdo para 6–12 meses de assinatura sem a qualidade cair? Quantas missões e treinos por mês?
3. Como medir e mostrar a **evolução do comportamento do cão** de forma simples e confiável?
4. Que mecânicas de retenção de apps como Duolingo, Headspace, Strava e Noom funcionam aqui, e quais devemos evitar?
5. Onde ficam as linhas de corte entre grátis e Pro para maximizar a conversão sem frustrar quem está começando?
6. Que eventos sazonais e culturais brasileiros merecem conteúdo específico?
7. Como tornar o app útil depois que o cão "já está educado"? Manutenção, truques, esportes caninos (agility, faro), enriquecimento ambiental?

## 9. Stack técnica (resumo)

- **App:** Expo SDK 58 · Expo Router · TypeScript · NativeWind · Zustand (offline-first, com persistência local).
- **Nuvem:** Supabase (Auth + Postgres com Row Level Security) para conta e sincronização.
- **Lembretes:** expo-notifications, com notificações locais.
- **Assinatura:** RevenueCat (ainda simulado).
- **Conteúdo:** fica em código (`data/mockData.ts`) e, no futuro, deve migrar para o banco ou um CMS.
