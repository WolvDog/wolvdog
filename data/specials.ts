import type { Lesson, Module } from '@/types';

import { lesson } from './lessonBuilder';

/**
 * Missões especiais: ficam fora da trilha linear e aparecem como card de destaque na Home
 * em épocas específicas (ex.: fogos de fim de ano). São do Pro e podem ser repetidas.
 */
export const SPECIAL_MODULE_ID = 'especiais';

export const SPECIAL_MODULE: Module = {
  id: SPECIAL_MODULE_ID,
  phase: 0,
  title: 'Missões especiais',
  subtitle: 'Especial',
  description: 'Treinos de época, fora da trilha.',
  color: '#1850BE',
  colorDark: '#1E3A8A',
  isFree: true,
  lessons: [],
};

export const fogosLesson: Lesson = {
  ...lesson({
    id: 'esp-fogos',
    title: 'Réveillon sem medo',
    summary: 'Fogos, rojões e trovões: treino com sons baixinhos para chegar ao fim de ano tranquilo.',
    durationMinutes: 6,
    xpReward: 25,
    icon: '🎆',
    concept: {
      title: 'Som baixinho + petisco = fogos sem pânico',
      loganSpeech: 'Meu ouvido é umas 4 vezes mais sensível que o seu. Fogos, pra mim, são um terremoto! Mas dá pra treinar.',
      body:
        'A técnica é a dessensibilização: o cão ouve o som tão baixinho que nem se assusta, e ao mesmo tempo ganha petisco ou brincadeira. ' +
        'Dia após dia, o volume sobe um pouquinho, sempre abaixo do medo. Comece semanas antes do Réveillon. ' +
        'Monte também um esconderijo seguro: um canto fechado, com a caminha, uma coberta por cima e um brinquedo recheado.',
      whyItWorks:
        'Contracondicionamento: o som passa a prever algo bom. Subir o volume aos poucos mantém o cão abaixo do limiar de medo, então ele aprende em vez de entrar em pânico.',
    },
    practice: {
      title: 'Fogos no volume 1',
      loganSpeech: 'Petiscos bem gostosos na mão e o celular longe {do_pet}. Começa no volume mais baixo!',
      instructions: [
        'Celular a uns 3 metros, no volume 1.',
        'Toque o som e dê petiscos enquanto ele toca.',
        'Parou o som? Parou o petisco.',
        '{O_pet} comeu tranquil{o/a} 3 vezes? Suba 1 nível amanhã.',
        'Orelha para trás, tremor ou fuga? Volte 1 nível.',
      ],
      sounds: ['fogos', 'rojao', 'trovao'],
      targetReps: 10,
      avoid: ['Subir o volume no mesmo dia em que ele se assustou', 'Segurar o cão para ele "se acostumar"', 'Treinar com o cão já agitado'],
    },
    validation: {
      question: '{O_pet} continuou comendo tranquil{o/a} durante os sons?',
      feedback: {
        easy: 'Show! Amanhã, suba só um nível de volume.',
        medium: 'Bom! Repita no mesmo volume até ficar fácil.',
        hard: 'Tudo bem! Volte para o nível 1 e afaste mais o celular.',
      },
    },
    victory: {
      loganSpeech: 'Bum, petisco! Mais um passo para um Réveillon em paz.',
      nextTip: 'Treine 1 vez por dia até o fim de ano. No dia, deixe o esconderijo pronto e a TV ou um ruído branco ligado.',
    },
  }),
  moduleId: SPECIAL_MODULE_ID,
  order: 1,
};

export const chuvaLesson: Lesson = {
  ...lesson({
    id: 'esp-chuva',
    title: 'Dia de chuva',
    summary: 'Passeio curto e brincadeiras de faro: dia de chuva não precisa ser dia perdido.',
    durationMinutes: 5,
    xpReward: 15,
    icon: '🌧️',
    concept: {
      title: 'A energia não tira folga',
      loganSpeech: 'Choveu? Passeio curtinho e a festa continua dentro de casa!',
      body:
        'Em dia de chuva o passeio encolhe, mas a energia continua lá. Um passeio curto, brincadeiras de faro ' +
        'e alguns minutos de treino de um comando que ele já sabe gastam a energia que sobraria para a bagunça.',
      whyItWorks: 'Faro e treino cansam a cabeça, e cabeça cansada é cão calmo, mesmo sem um passeio longo.',
    },
    practice: {
      title: 'Plano de dia chuvoso',
      loganSpeech: 'Toalha separada, ração na mão e bora!',
      instructions: [
        'Passeio curto: 10 minutos bastam.',
        'Em casa, "Procura!" com ração enrolada numa toalha.',
        'Brinquedo recheado com parte da ração.',
        '3 minutos de um comando que {ele} já sabe.',
        'Seque bem as patas, inclusive entre os dedos.',
      ],
      timerSeconds: 300,
      avoid: ['Passeio longo debaixo de temporal ou com raios', 'Deixar o pelo molhado'],
    },
    validation: {
      question: '{O_pet} gastou a energia mesmo com chuva?',
      feedback: {
        easy: 'Dia de chuva vencido! Guarde esse plano para os próximos.',
        medium: 'Bom! Se sobrar energia, faça mais uma rodada de faro.',
        hard: 'Tudo bem! Comece pelo faro, que é a parte mais fácil, e depois o comando.',
      },
    },
    victory: {
      loganSpeech: 'Lá fora chuva, aqui dentro missão cumprida!',
      nextTip: 'Deixe uma toalha e um brinquedo recheado sempre à mão para os dias de chuva.',
    },
  }),
  moduleId: SPECIAL_MODULE_ID,
  order: 2,
};

export const SPECIAL_LESSONS: Lesson[] = [fogosLesson, chuvaLesson];

/** Destaque da estação no topo da Home: sempre leva a uma missão que existe (da trilha ou especial). */
export interface SeasonalHighlight {
  lessonId: string;
  /** Início e fim, inclusive, como [mês 1-12, dia]. Pode virar o ano (ex.: nov a jan). */
  from: [number, number];
  to: [number, number];
  kicker: string;
  text: string;
}

/** Calendário do destaque (Brasil). Ajuste as datas a cada ano, se precisar. */
export const SEASONAL_HIGHLIGHTS: SeasonalHighlight[] = [
  {
    lessonId: fogosLesson.id,
    from: [11, 1],
    to: [1, 1],
    kicker: 'Missão especial · fim de ano',
    text: 'Treine com sons baixinhos e chegue ao Réveillon sem pânico.',
  },
  {
    lessonId: 'm3-l4', // Passeio no calor
    from: [1, 2],
    to: [3, 31],
    kicker: 'Missão da estação · verão',
    text: 'Asfalto quente queima as patas: faça o teste da mão antes de sair.',
  },
  {
    lessonId: 'm4-l3', // Saídas que não assustam
    from: [4, 1],
    to: [5, 31],
    kicker: 'Missão da estação · feriados',
    text: 'Feriadão chegando? Saídas e despedidas sem drama.',
  },
  {
    lessonId: 'm5-caca', // Caça ao tesouro pela casa
    from: [6, 1],
    to: [8, 31],
    kicker: 'Missão da estação · inverno',
    text: 'Frio e mais tempo em casa: hora de caçar tesouros.',
  },
  {
    lessonId: chuvaLesson.id,
    from: [9, 1],
    to: [10, 31],
    kicker: 'Missão especial · temporada de chuvas',
    text: 'Choveu? Passeio curtinho e a festa continua dentro de casa.',
  },
];

const dayOfYear = ([month, day]: [number, number]) => month * 100 + day;

/** O destaque de hoje (ou undefined, se nenhum período cobre a data). */
export function getSeasonalHighlight(date: Date = new Date()): SeasonalHighlight | undefined {
  const today = dayOfYear([date.getMonth() + 1, date.getDate()]);
  return SEASONAL_HIGHLIGHTS.find((h) => {
    const from = dayOfYear(h.from);
    const to = dayOfYear(h.to);
    return from <= to ? today >= from && today <= to : today >= from || today <= to;
  });
}
