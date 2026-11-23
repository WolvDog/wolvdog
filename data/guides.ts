import type { GuideCategory, TutorGuide } from '@/types';

/**
 * Guia do Tutor v1.1 (11 guias): dores que acontecem fora da sessão de treino.
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
      'Afaste {o_pet} do perigo e ligue para a clínica avisando que está a caminho.',
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
      'Passeie antes das 9h ou depois das 17h, pela sombra, com água {para_pet}.',
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
      'Corpo duro ou olhar fixo? Chame {o_pet} com voz animada e saia andando.',
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
      'Começou a montar? Interrompa com calma: chame {o_pet} e peça "Senta".',
      'Sentou? "Isso!" + petisco, e ofereça um brinquedo ou faro no lugar.',
      'Montaram {no_pet}? Afaste com calma e dê uma pausa aos dois.',
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
      'Na entrada, despedida curta e animada: entregue {o_pet} e vá embora.',
      'No dia seguinte, rotina calma em casa: descanso, faro e passeio leve.',
    ],
    warning:
      'Vacinas e antipulgas em dia antes do primeiro dia. Se {o_pet} parar de comer, se esconder ou piorar depois de uma semana, ' +
      'converse com a creche e com o veterinário.',
  },
  {
    slug: 'fogos-trovoes',
    category: 'comportamento',
    icon: '🎆',
    title: 'Fogos e trovões: na hora do barulho',
    summary: 'O que fazer quando o céu começa a estourar.',
    readMinutes: 2,
    doctorAdvice:
      'Consolar o cão com calma não reforça o medo: ficar perto e tranquilo ajuda. ' +
      'O que mais protege é ter um lugar seguro já conhecido e diminuir o som que chega até ele.',
    loganSteps: [
      'Feche janelas e cortinas e ligue a TV ou um ruído branco.',
      'Deixe {o_pet} ir para a toca e ofereça um brinquedo recheado lá dentro.',
      'Fique por perto, com voz calma. Nunca prenda {o_pet} nem force a encarar o barulho.',
    ],
    warning:
      'Tremor intenso, fuga, ferimentos tentando escapar ou recusa de comida por mais de um dia: fale com o veterinário, ' +
      'que pode indicar outras formas de ajuda. Nunca dê remédio de gente.',
    missionId: 'm4-toca',
  },
  {
    slug: 'comeu-o-que-nao-devia',
    category: 'emergencia',
    icon: '🍫',
    title: 'Comeu o que não devia',
    summary: 'Alimentos de gente que fazem mal ao cão e o que fazer se ele comer.',
    readMinutes: 2,
    doctorAdvice:
      'Chocolate, uva e uva-passa, cebola, alho, xilitol (adoçante de chicletes e balas), macadâmia, álcool e café podem intoxicar cães, mesmo em pouca quantidade. ' +
      'Ossos cozidos também são perigosos, porque lascam e podem ferir por dentro.',
    loganSteps: [
      'Tire o resto do alcance {do_pet} e veja o que e quanto foi comido.',
      'Ligue para o veterinário na hora, mesmo que {o_pet} pareça bem.',
      'Não force vômito nem dê leite ou óleo: leve a embalagem ao veterinário.',
    ],
    warning:
      'Vômito, tremor, agitação, fraqueza, convulsão ou barriga inchada depois de comer algo diferente: vá direto ao veterinário.',
  },
  {
    slug: 'viagem-hotelzinho',
    category: 'socializacao',
    icon: '🧳',
    title: 'Viagem e hotelzinho',
    summary: 'Feriado chegando: como sair sem drama e deixar ele tranquilo.',
    readMinutes: 2,
    doctorAdvice:
      'O cão não entende a mala, mas percebe a agitação da casa, e uma despedida longa confirma que algo estranho está acontecendo. ' +
      'Visitas curtas ao hotelzinho antes da viagem tornam o lugar conhecido.',
    loganSteps: [
      'Antes da viagem, leve {o_pet} ao hotelzinho para uma visita curta ou meio dia.',
      'Mande a caminha, um brinquedo e uma camiseta com o seu cheiro.',
      'Na hora de deixar: despedida curta e animada, e vá embora.',
    ],
    warning:
      'Vacinas e antipulgas em dia antes da hospedagem. Se {o_pet} parar de comer ou tiver diarreia por mais de um dia, ' +
      'avise o hotelzinho e o veterinário.',
    missionId: 'm4-l3',
  },
  {
    slug: 'filhote-48-horas',
    category: 'comportamento',
    icon: '🐶',
    title: 'Filhote novo: as primeiras 48 horas',
    summary: 'Rotina, cantinho e xixi no lugar certo desde o primeiro dia.',
    readMinutes: 2,
    doctorAdvice:
      'Os primeiros dias são de muita novidade, e uma rotina previsível de comida, xixi e sono ajuda o filhote a se sentir seguro. ' +
      'Antes de completar as vacinas, ele não deve passear no chão da rua nem ter contato com cães desconhecidos.',
    loganSteps: [
      'Monte um cantinho com caminha, água e tapete higiênico longe da comida.',
      'Leve {o_pet} ao tapete ao acordar, depois de comer e depois de brincar.',
      'Acertou? "Isso!" e festa. Errou? Limpe sem bronca.',
    ],
    warning:
      'Filhote apático, sem comer, com vômito ou diarreia: vá ao veterinário no mesmo dia. Em filhotes, a piora pode ser rápida.',
    missionId: 'm1-l2',
  },
  {
    slug: 'mordidinhas-filhote',
    category: 'comportamento',
    icon: '🦷',
    title: 'Mordidinhas de filhote',
    summary: 'Ele morde mãos e pés: por que acontece e como redirecionar.',
    readMinutes: 2,
    doctorAdvice:
      'Morder faz parte do desenvolvimento: o filhote explora o mundo com a boca e alivia o incômodo da troca de dentes, que vai até por volta dos 7 meses. ' +
      'Bronca e mão na boca costumam virar brincadeira e aumentar as mordidas.',
    loganSteps: [
      'Mordeu a mão? Pare a brincadeira na hora e fique paradinho por alguns segundos.',
      'Ofereça um brinquedo de morder e brinque com {o_pet} usando o brinquedo.',
      'Muito agitad{o/a}? Uma pausa calma na caminha, com algo para roer.',
    ],
    warning:
      'Mordidas fortes com rosnado, corpo rígido ou proteção de comida e objetos merecem avaliação de um veterinário ou de um adestrador comportamental.',
    missionId: 'm4-l2',
  },
  {
    slug: 'banho-unhas',
    category: 'saude',
    icon: '🛁',
    title: 'Banho e unhas sem drama',
    summary: 'Escova, toalha e cortador viram rotina tranquila, aos poucos.',
    readMinutes: 2,
    doctorAdvice:
      'Tocar patas, orelhas e boca aos poucos, com petisco, facilita o banho, o corte de unha e as consultas no veterinário. ' +
      'Pressa e contenção à força criam um medo que pode durar anos.',
    loganSteps: [
      'Toque nas patas por 1 segundo e dê petisco. Repita alguns dias antes de mostrar o cortador.',
      'Mostre a escova, a toalha ou o cortador e dê petisco, ainda sem usar.',
      'Corte uma unha por vez e pare enquanto {ele} ainda está tranquil{o/a}.',
    ],
    warning:
      'Cortou e sangrou, ou a unha está encravada? Pressione com gaze limpa e procure o veterinário se não parar. Na dúvida, peça ao veterinário para cortar.',
  },
];

export function getGuideBySlug(slug: string | undefined): TutorGuide | undefined {
  return TUTOR_GUIDES.find((g) => g.slug === slug);
}
