/**
 * Schema de domínio do WolvDog.
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
  /** Código do parceiro que indicou o app (ex.: creche), se houver. Sincronizado com a nuvem. */
  partnerCode: string | null;
  /** Nome e benefício do parceiro (cache local da tabela `partners`). */
  partnerInfo: PartnerInfo | null;
  /** Dados de perfil para segmentação de campanhas. */
  tutorGender: TutorGender | null;
  /** Data de nascimento do tutor (YYYY-MM-DD). */
  tutorBirthDate: string | null;
}

export interface PartnerInfo {
  code: string;
  name: string;
  /** Benefício exibido no app. */
  perk: string;
}

export type TutorGender = 'male' | 'female' | 'undisclosed';
export type PetSex = 'male' | 'female';

/** Nível de energia do cão no dia a dia (onboarding). */
export type PetEnergy = 'high' | 'balanced' | 'calm';

/** O quanto o cão já sabe de comandos antes do app. */
export type PetExperience = 'none' | 'basic' | 'advanced';

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
  sex?: PetSex;
  energyLevel?: PetEnergy;
  commandExperience?: PetExperience;
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
/**
 * Tipo da etapa "Hora do treino":
 * - practice: treino com o cão (clicker, repetições e cronômetro);
 * - knowledge: leitura/orientação (sem clicker nem cronômetro);
 * - checklist: preparar o ambiente ou o material (sem clicker nem cronômetro).
 */
export type PracticeKind = 'practice' | 'knowledge' | 'checklist';

/** Sons de treino de dessensibilização (assets/sounds). */
export type TrainingSound = 'fogos' | 'rojao' | 'trovao';

export interface PracticeStep extends BaseStep {
  type: 'practice';
  title: string;
  /** Padrão: 'practice'. */
  kind?: PracticeKind;
  /** Sons para tocar durante o treino (ex.: fogos), com controle de volume. */
  sounds?: TrainingSound[];
  instructions: string[];
  timerSeconds?: number;
  targetReps?: number;
  /** Erros comuns a evitar. */
  avoid?: string[];
  /** Demonstração do movimento (animação Lottie ou vídeo curto em loop). */
  media?: DemoMedia;
}

/**
 * Mídia de demonstração da etapa "Hora do treino".
 * `source`: `require('@/assets/demos/senta.json')` (Lottie) / `require('@/assets/demos/senta.mp4')` (vídeo) ou uma URL.
 */
export interface DemoMedia {
  type: 'lottie' | 'video';
  source: number | string;
  caption?: string;
  /** Proporção largura/altura (padrão 16:9 para vídeo, 1:1 para Lottie). */
  aspectRatio?: number;
}

/** Pergunta de múltipla escolha dos quizzes das missões teóricas. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Explicação curta mostrada depois da resposta. */
  explanation: string;
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
  /** Quiz opcional (3 a 5 perguntas) entre a Dica do Logan e a Hora do treino. */
  quiz?: QuizQuestion[];
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
  source: 'lesson' | 'streak_bonus' | 'perfect_week' | 'guide';
}

// ---------------------------------------------------------------------------
// Guia do Tutor: consultas rápidas fora da trilha de treino
// ---------------------------------------------------------------------------

export type GuideCategory = 'socializacao' | 'comportamento' | 'saude' | 'clima' | 'emergencia';

export interface TutorGuide {
  slug: string;
  category: GuideCategory;
  icon: string;
  title: string;
  /** Uma linha: a dor que o guia resolve. */
  summary: string;
  readMinutes: number;
  /** Visão da veterinária: exatamente 2 frases curtas sobre a causa. */
  doctorAdvice: string;
  /** Missão do Logan: 3 passos práticos, sem nada punitivo. Aceita {pet}. */
  loganSteps: [string, string, string];
  /** Quando procurar o veterinário (destaque em vermelho). Aceita {pet}. */
  warning?: string;
}

/** Especialista parceira que assina o Guia (tabela `experts` do Supabase). */
export interface Expert {
  id: string;
  displayName: string;
  title: string;
  registry: string | null;
  avatarUrl: string | null;
  validatedGuides: string[];
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

/** Nota de 1 (fora de controle) a 5 (sob controle) para cada desafio do cão. */
export type BehaviorRating = 1 | 2 | 3 | 4 | 5;

/** Diário de comportamento: semana (segunda-feira YYYY-MM-DD) → nota por desafio. */
export type BehaviorLog = Record<string, Partial<Record<BehaviorChallenge, BehaviorRating>>>;

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

export type PlanPeriod = 'monthly' | 'semiannual' | 'annual';

export interface SubscriptionPlan {
  id: string;
  /** Identificador do package no RevenueCat ($rc_monthly, $rc_six_month, $rc_annual). */
  revenueCatPackageId: string;
  /** Produto de assinatura adicional cobrado por cão extra (RevenueCat / lojas). */
  extraPetProductId: string;
  period: PlanPeriod;
  title: string;
  priceCents: number;
  currency: 'BRL';
  priceLabel: string;
  pricePerMonthLabel: string;
  trialDays: number;
  /** Valor por cão adicional no mesmo período (50% do plano base). */
  extraPetPriceCents: number;
  badge?: string;
  /** Economia em relação a pagar o plano mensal pelo mesmo tempo. */
  savingsPercent?: number;
}
