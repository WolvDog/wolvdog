import type { Lesson, LessonCompletion, Module, NodeStatus } from '@/types';

export interface ProgressSnapshot {
  completedLessons: Record<string, LessonCompletion>;
  /** Lições iniciadas e abandonadas no meio (lessonId → índice da etapa). */
  lessonDrafts: Record<string, number>;
  isPro: boolean;
}

export interface NodeState {
  status: NodeStatus;
  /** Bloqueado apenas pela assinatura — tocar abre o Paywall. */
  requiresPro: boolean;
}

export function isModuleCompleted(module: Module, snap: ProgressSnapshot): boolean {
  return module.lessons.every((l) => snap.completedLessons[l.id]);
}

function isModuleSequenceUnlocked(module: Module, modules: Module[], snap: ProgressSnapshot): boolean {
  const index = modules.findIndex((m) => m.id === module.id);
  if (index <= 0) return true;
  return isModuleCompleted(modules[index - 1]!, snap);
}

export function getModuleState(module: Module, modules: Module[], snap: ProgressSnapshot): NodeState {
  const requiresPro = !module.isFree && !snap.isPro;

  if (isModuleCompleted(module, snap)) return { status: 'completed', requiresPro: false };
  if (requiresPro || !isModuleSequenceUnlocked(module, modules, snap)) return { status: 'locked', requiresPro };

  const started = module.lessons.some((l) => snap.completedLessons[l.id] || snap.lessonDrafts[l.id] !== undefined);
  return { status: started ? 'in_progress' : 'unlocked', requiresPro: false };
}

export function getLessonState(lesson: Lesson, module: Module, modules: Module[], snap: ProgressSnapshot): NodeState {
  if (snap.completedLessons[lesson.id]) return { status: 'completed', requiresPro: false };

  const moduleState = getModuleState(module, modules, snap);
  if (moduleState.status === 'locked') return { status: 'locked', requiresPro: moduleState.requiresPro };

  const previous = module.lessons.find((l) => l.order === lesson.order - 1);
  if (previous && !snap.completedLessons[previous.id]) return { status: 'locked', requiresPro: false };

  return { status: snap.lessonDrafts[lesson.id] !== undefined ? 'in_progress' : 'unlocked', requiresPro: false };
}

/** Próxima lição a fazer na trilha (onde o Logan fica posicionado). */
export function getCurrentLesson(modules: Module[], snap: ProgressSnapshot): Lesson | undefined {
  for (const module of modules) {
    for (const lesson of module.lessons) {
      const { status } = getLessonState(lesson, module, modules, snap);
      if (status === 'unlocked' || status === 'in_progress') return lesson;
    }
  }
  return undefined;
}
