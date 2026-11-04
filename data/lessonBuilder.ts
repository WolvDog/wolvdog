import type {
  ConceptStep,
  Difficulty,
  Lesson,
  PracticeStep,
  QuizQuestion,
  ValidationStep,
  VictoryStep,
} from '@/types';

// ---------------------------------------------------------------------------
// Helpers de autoria — mantêm o conteúdo legível e os IDs consistentes.
// ---------------------------------------------------------------------------

type ConceptInput = Omit<ConceptStep, 'id' | 'type'>;
type PracticeInput = Omit<PracticeStep, 'id' | 'type'>;
type VictoryInput = Omit<VictoryStep, 'id' | 'type'>;

interface ValidationInput {
  question?: string;
  loganSpeech?: string;
  feedback: Record<Difficulty, string>;
}

function validation(lessonId: string, input: ValidationInput): ValidationStep {
  return {
    id: `${lessonId}-validation`,
    type: 'validation',
    loganMood: 'thinking',
    question: input.question ?? 'Como seu cão reagiu ao exercício?',
    loganSpeech: input.loganSpeech ?? 'Responda com sinceridade, tá? Não existe resposta errada — eu uso isso pra ajustar seu próximo treino!',
    options: [
      { id: 'easy', emoji: '🌟', label: 'Mandou bem! Pegou rápido', difficulty: 'easy', loganFeedback: input.feedback.easy },
      { id: 'medium', emoji: '🐾', label: 'Foi indo, com algumas pausas', difficulty: 'medium', loganFeedback: input.feedback.medium },
      { id: 'hard', emoji: '🌀', label: 'Não focou / foi difícil', difficulty: 'hard', loganFeedback: input.feedback.hard },
    ],
  };
}

export interface LessonInput {
  id: string;
  /** Definidos ao montar a fase (ver `sequence`); opcionais na autoria. */
  moduleId?: string;
  order?: number;
  title: string;
  summary: string;
  durationMinutes: number;
  xpReward: number;
  icon: string;
  concept: ConceptInput;
  practice: PracticeInput;
  validation: ValidationInput;
  victory: VictoryInput;
  quiz?: QuizQuestion[];
}

export function lesson(input: LessonInput): Lesson {
  const { concept, practice, validation: validationInput, victory, moduleId, order, ...meta } = input;
  return {
    ...meta,
    moduleId: moduleId ?? '',
    order: order ?? 0,
    steps: [
      { id: `${input.id}-concept`, type: 'concept', loganMood: 'happy', ...concept },
      { id: `${input.id}-practice`, type: 'practice', loganMood: 'hero', ...practice },
      validation(input.id, validationInput),
      { id: `${input.id}-victory`, type: 'victory', loganMood: 'excited', ...victory },
    ],
  };
}

/** Monta uma fase: define a ordem das missões e o módulo a que pertencem (e anexa quizzes). */
export function sequence(moduleId: string, lessons: Lesson[], quizzes: Record<string, QuizQuestion[]> = {}): Lesson[] {
  return lessons.map((l, i) => ({ ...l, moduleId, order: i + 1, quiz: l.quiz ?? quizzes[l.id] }));
}
