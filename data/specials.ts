import type { Lesson, Module } from '@/types';

import { lesson } from './lessonBuilder';

/**
 * Missões especiais: ficam fora da trilha linear e aparecem como card de destaque na Home
 * em épocas específicas (ex.: fogos de fim de ano). São gratuitas e podem ser repetidas.
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

export const SPECIAL_LESSONS: Lesson[] = [fogosLesson];

/** Fim de ano (novembro a janeiro): o card dos fogos aparece no topo da Home. */
export function isFireworksSeason(date: Date = new Date()): boolean {
  const month = date.getMonth(); // 0 = janeiro
  return month === 10 || month === 11 || month === 0;
}
