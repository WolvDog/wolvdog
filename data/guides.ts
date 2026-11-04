import type { GuideCategory, TutorGuide } from '@/types';

/**
 * Guia do Tutor v1.0: dores que acontecem fora da sessão de treino.
 * Formato fixo de microlearning: 2 frases da veterinária + 3 passos do Logan + quando procurar o vet.
 * Os textos aguardam revisão da especialista parceira; o selo "Validado" só aparece para os slugs
 * que ela aprovar (coluna experts.validated_guides no Supabase).
 */
export const GUIDE_READ_REWARD = 5;

export const GUIDE_CATEGORY_LABELS: Record<GuideCategory, string> = {
  socializacao: 'Socialização',
  comportamento: 'Comportamento',
  saude: 'Saúde',
  clima: 'Saúde & Clima',
  emergencia: 'Emergência',
};

export const TUTOR_GUIDES: TutorGuide[] = [
  {
    slug: 'primeiros-socorros',
    category: 'emergencia',
    icon: '🚑',
    title: 'Primeiros socorros: antes do vet',
    summary: 'O que fazer nos primeiros minutos de uma emergência.',
    readMinutes: 2,
    doctorAdvice:
      'Em uma emergência, o objetivo é estabilizar e chegar rápido ao veterinário, não tratar em casa. ' +
      'Mesmo um cão dócil pode morder quando sente dor, então proteja-se antes de tocar nele.',
    loganSteps: [
      'Afaste {pet} do perigo e ligue para a clínica avisando que está a caminho.',
      'Sangramento? Pressione firme com um pano limpo e não tire para olhar.',
      'Engoliu algo tóxico? Não force vômito: leve a embalagem ao veterinário.',
    ],
    warning:
      'Vá direto ao veterinário se houver dificuldade para respirar, convulsão, atropelamento, barriga inchada e dura, ' +
      'sangramento que não para ou ingestão de veneno, chocolate, uva ou remédio de gente.',
  },
  {
    slug: 'calor',
    category: 'clima',
    icon: '🌡️',
    title: 'Dias quentes: asfalto e insolação',
    summary: 'Como proteger as patas e reconhecer o superaquecimento.',
    readMinutes: 2,
    doctorAdvice:
      'Cães perdem calor principalmente ofegando, e raças de focinho curto, idosos, obesos e filhotes superaquecem mais rápido. ' +
      'Asfalto ao sol pode passar de 50 °C e queimar as almofadas das patas em poucos minutos.',
    loganSteps: [
      'Dorso da mão no chão por 7 segundos. Não aguentou? Não é hora de passear.',
      'Passeie antes das 9h ou depois das 17h, pela sombra, com água para {pet}.',
      'Ofegando muito ou cambaleando? Sombra, água fresca no corpo e veterinário.',
    ],
    warning:
      'Insolação é emergência: gengiva muito vermelha ou arroxeada, vômito, desmaio ou convulsão. ' +
      'Molhe o corpo com água fresca (não gelada) e vá ao veterinário na hora.',
  },
  {
    slug: 'parque',
    category: 'socializacao',
    icon: '🌳',
    title: 'Confusão no parque',
    summary: 'Clima pesou no cachorródromo? Saia antes da briga.',
    readMinutes: 2,
    doctorAdvice:
      'Brigas em parque quase sempre começam com sinais que passam despercebidos: corpo travado, olhar fixo e pelos eriçados. ' +
      'Cães cansados, com medo ou disputando brinquedo e petisco têm bem menos paciência.',
    loganSteps: [
      'Corpo duro ou olhar fixo? Chame {pet} com voz animada e saia andando.',
      'Começou a briga? Mãos longe das bocas: palmas fortes ou um jato de água.',
      'Depois, examine orelhas, pescoço e patas, e encerre o passeio por hoje.',
    ],
    warning: 'Mordida que furou a pele precisa de veterinário, mesmo pequena: pode infeccionar por dentro.',
  },
  {
    slug: 'monta',
    category: 'comportamento',
    icon: '🐾',
    title: 'Ele monta (ou montam nele)',
    summary: 'Por que acontece e como redirecionar sem bronca.',
    readMinutes: 2,
    doctorAdvice:
      'Montar nem sempre é sexual: cães castrados e fêmeas também montam para aliviar excitação, estresse ou brincadeira intensa. ' +
      'Os hormônios aumentam a frequência em machos não castrados, mas a castração sozinha não desfaz um hábito já formado.',
    loganSteps: [
      'Começou a montar? Interrompa com calma: chame {pet} e peça "Senta".',
      'Sentou? "Isso!" + petisco, e ofereça um brinquedo ou faro no lugar.',
      'Montaram em {pet}? Afaste com calma e dê uma pausa aos dois.',
    ],
    warning: 'Monta frequente com lambedura excessiva ou desconforto para fazer xixi? Procure o veterinário.',
  },
  {
    slug: 'creche',
    category: 'socializacao',
    icon: '🏫',
    title: 'Adaptação na creche',
    summary: 'Uma transição casa-creche tranquila, sem estresse.',
    readMinutes: 2,
    doctorAdvice:
      'Creche é um ambiente intenso, com muitos cães, cheiros e barulhos ao mesmo tempo, e cada cão leva um tempo para se sentir seguro. ' +
      'Cansaço forte, muita sede ou fezes amolecidas nos primeiros dias costumam ser estresse, não doença.',
    loganSteps: [
      'Na 1ª semana, meio período em dias alternados. Aumente aos poucos.',
      'Na entrada, despedida curta e animada: entregue {pet} e vá embora.',
      'No dia seguinte, rotina calma em casa: descanso, faro e passeio leve.',
    ],
    warning:
      'Vacinas e antipulgas em dia antes do primeiro dia. Se {pet} parar de comer, se esconder ou piorar depois de uma semana, ' +
      'converse com a creche e com o veterinário.',
  },
];

export function getGuideBySlug(slug: string | undefined): TutorGuide | undefined {
  return TUTOR_GUIDES.find((g) => g.slug === slug);
}
