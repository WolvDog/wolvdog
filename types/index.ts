/**
 * Schema de domínio do WolverBark.
 * Os nomes dos campos espelham as tabelas planejadas no Supabase (snake_case lá, camelCase aqui).
 */

// ---------------------------------------------------------------------------
// Usuário & Pet
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO
  /** Meta diária em minutos escolhida no onboarding (5, 10 ou 15). */
  dailyGoalMinutes: 5 | 10 | 15;
  /** Meta de dias de treino por semana — a sequência conta semanas cumpridas. */
  weeklyGoalDays: WeeklyGoalDays;
  reminder: ReminderSettings;
}

export type WeeklyGoalDays = 3 | 4 | 5 | 7;

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export type PetSize = 'mini' | 'pequeno' | 'medio' | 'grande' | 'gigante';

export type BehaviorChallenge =
  | 'xixi_fora_do_lugar'
  | 'puxa_a_guia'
  | 'late_demais'
  | 'pula_nas_pessoas'
  | 'ansiedade_separacao'
  | 'destroi_objetos'
  | 'nao_atende_chamado'
  | 'reatividade';

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  breed: string;
  /** Idade em meses — facilita a lógica de filhote vs. adulto. */
  ageMonths: number;
  size: PetSize;
  weightKg?: number;
  photoUri?: string;
  challenges: BehaviorChallenge[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Conteúdo: Módulos, Lições e Etapas
// ---------------------------------------------------------------------------

export type LoganMood = 'happy' | 'thinking' | 'excited' | 'proud' | 'sleepy' | 'hero';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface BaseStep {
  id: string;
  /** Fala do Logan exibida no balão desta etapa. */
  loganSpeech: string;
  loganMood?: LoganMood;
}

/** 1. Dica do Logan — explicação do conceito. */
export interface ConceptStep extends BaseStep {
  type: 'concept';
  title: string;
  body: string;
  /** "Por que funciona?" — reforço científico/comportamental curto. */
  whyItWorks?: string;
}

/** 2. Passo a passo prático com timer e/ou contador de repetições. */
export interface PracticeStep extends BaseStep {
  type: 'practice';
  title: string;
  instructions: string[];
  timerSeconds?: number;
  targetReps?: number;
  /** Erros comuns a evitar. */
  avoid?: string[];
}

export interface ValidationOption {
  id: string;
  label: string;
  emoji: string;
  difficulty: Difficulty;
  loganFeedback: string;
}

/** 3. Validação do treino — como o cão reagiu. */
export interface ValidationStep extends BaseStep {
  type: 'validation';
  question: string;
  options: ValidationOption[];
}

/** 4. Tela de vitória. */
export interface VictoryStep extends BaseStep {
  type: 'victory';
  /** Dica para o próximo treino, exibida abaixo das recompensas. */
  nextTip?: string;
}

export type LessonStep = ConceptStep | PracticeStep | ValidationStep | VictoryStep;
export type LessonStepType = LessonStep['type'];

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: string;
  summary: string;
  durationMinutes: number;
  xpReward: number;
  icon: string; // emoji usado no nó da trilha
  steps: [ConceptStep, PracticeStep, ValidationStep, VictoryStep];
}

export interface Module {
  id: string;
  phase: number;
  title: string;
  subtitle: string;
  description: string;
  /** Cor de destaque (hex) do banner da fase. */
  color: string;
  colorDark: string;
  isFree: boolean;
  lessons: Lesson[];
}

/** Status visual de um nó/módulo na trilha. */
export type NodeStatus = 'locked' | 'unlocked' | 'in_progress' | 'completed';

// ---------------------------------------------------------------------------
// Progresso & Gamificação
// ---------------------------------------------------------------------------

export interface LessonCompletion {
  lessonId: string;
  completedAt: string; // ISO
  xpEarned: number;
  difficulty: Difficulty;
  /** Quantas vezes o tutor refez a lição (prática espaçada). */
  timesCompleted: number;
}

export interface XpEvent {
  date: string; // YYYY-MM-DD
  amount: number;
  source: 'lesson' | 'streak_bonus' | 'perfect_week';
}

export interface UserProgress {
  totalXp: number;
  completedLessons: Record<string, LessonCompletion>;
  xpHistory: XpEvent[];
}

/**
 * Sequência semanal: conta semanas seguidas (segunda a domingo) em que o tutor
 * treinou pelo menos a meta de dias escolhida.
 */
export interface Streak {
  /** Semanas seguidas já fechadas com a meta cumprida (a semana atual não entra). */
  current: number;
  longest: number;
  /** Último dia (YYYY-MM-DD, horário local) em que uma missão foi cumprida. */
  lastActiveDate: string | null;
  /** Ossos Reserva disponíveis: cada um salva uma semana abaixo da meta. */
  freezesAvailable: number;
  /** Semanas (segunda-feira YYYY-MM-DD) salvas por um Osso Reserva. */
  frozenWeeks: string[];
  /** Última semana já fechada e avaliada (segunda-feira YYYY-MM-DD). */
  lastEvaluatedWeek: string | null;
}

/** Agenda de reforço (repetição espaçada) de uma missão já cumprida. */
export interface ReviewItem {
  lessonId: string;
  /** Dia em que o reforço fica disponível (YYYY-MM-DD). */
  dueDate: string;
  intervalDays: number;
  lastDifficulty: Difficulty;
}

// ---------------------------------------------------------------------------
// Monetização
// ---------------------------------------------------------------------------

export type PlanPeriod = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: string;
  /** Identificador do package no RevenueCat ($rc_monthly, $rc_annual). */
  revenueCatPackageId: string;
  period: PlanPeriod;
  title: string;
  priceCents: number;
  currency: 'BRL';
  priceLabel: string;
  pricePerMonthLabel: string;
  trialDays: number;
  badge?: string;
  savingsPercent?: number;
}
