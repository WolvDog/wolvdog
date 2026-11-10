/**
 * Vocabulário da marca WolvDog. Centralizado aqui para manter a identidade própria
 * (e facilitar ajustes futuros de nomenclatura).
 */
export const TERMS = {
  lesson: 'Missão',
  lessons: 'Missões',
  /** Moeda de progresso (XP). */
  points: 'Garras',
  /** Dias seguidos de treino (streak). */
  streak: 'Sequência',
  /** Protege a sequência em um dia perdido (streak freeze). */
  freeze: 'Osso Reserva',
  freezes: 'Ossos Reserva',
  level: 'Patente',
} as const;

export const days = (n: number) => `${n} ${n === 1 ? 'dia' : 'dias'}`;
export const weeks = (n: number) => `${n} ${n === 1 ? 'semana' : 'semanas'}`;
export const points = (n: number) => `${n} ${n === 1 ? 'garra' : 'garras'}`;
