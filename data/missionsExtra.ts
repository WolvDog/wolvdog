import type { Lesson, QuizQuestion } from '@/types';

import { lesson } from './lessonBuilder';

/**
 * Missões e quizzes adicionados a partir do feedback do primeiro teste do APK:
 * prevenção de acidentes, comando "Caminha" (Place), passeio no calor, socialização
 * e a fase de Alimentação & Enriquecimento.
 * ⚠️ Conteúdo técnico: revisar com um adestrador antes do lançamento.
 */

// ---------------------------------------------------------------------------
// Quizzes das missões teóricas já existentes
// ---------------------------------------------------------------------------

export const EXISTING_QUIZZES: Record<string, QuizQuestion[]> = {
  'm1-l2': [
    {
      id: 'm1-l2-q1',
      question: 'Qual destes NÃO é um dos 5 momentos-chave para levar o cão ao banheiro?',
      options: ['Logo ao acordar', 'Depois de comer ou beber', 'Depois de brincar', 'Durante o banho'],
      correctIndex: 3,
      explanation: 'Os 5 momentos são: ao acordar, depois de comer/beber, depois de brincar, depois de cochilar e antes de dormir.',
    },
    {
      id: 'm1-l2-q2',
      question: 'Quando o petisco deve ser entregue?',
      options: ['Quando ele voltar para dentro de casa', 'Assim que ele terminar, no próprio local', 'Antes de ele começar', 'No fim do dia'],
      correctIndex: 1,
      explanation: 'O prêmio precisa acontecer no lugar certo e no momento certo, senão ele não liga a recompensa ao xixi.',
    },
    {
      id: 'm1-l2-q3',
      question: 'Ele não fez nada em 3 minutos. O que fazer?',
      options: ['Brigar para ele entender', 'Soltar pela casa sem supervisão', 'Voltar e tentar de novo em 10–15 minutos', 'Desistir até amanhã'],
      correctIndex: 2,
      explanation: 'Sem pressão: volte depois de um tempo, mantendo-o por perto para não acontecer um acidente.',
    },
  ],
  'm1-l3': [
    {
      id: 'm1-l3-q1',
      question: 'Você achou um xixi no tapete minutos depois. O que fazer?',
      options: ['Esfregar o focinho dele no xixi', 'Limpar sem drama, longe dele', 'Dar uma bronca', 'Deixá-lo de castigo'],
      correctIndex: 1,
      explanation: 'O cão não liga a bronca a algo que aconteceu minutos atrás. Limpar com calma evita criar medo.',
    },
    {
      id: 'm1-l3-q2',
      question: 'Qual tipo de produto evitar na limpeza?',
      options: ['Limpador enzimático', 'Água com vinagre branco', 'Produtos com amônia', 'Papel toalha'],
      correctIndex: 2,
      explanation: 'O cheiro de amônia lembra urina e pode atrair o cão de volta para o mesmo lugar.',
    },
    {
      id: 'm1-l3-q3',
      question: 'Por que a bronca atrapalha o aprendizado?',
      options: ['Ele aprende a esconder o xixi de você', 'Ele aprende mais rápido', 'Não atrapalha', 'Ele entende que errou'],
      correctIndex: 0,
      explanation: 'Com medo, ele passa a fazer escondido — e fica mais difícil levá-lo ao lugar certo.',
    },
  ],
};

// ---------------------------------------------------------------------------
// FASE 1 — novas missões
// ---------------------------------------------------------------------------

export const areaSeguraLesson: Lesson = lesson({
  id: 'm1-l5',
  title: 'Área segura (sem acidentes)',
  summary: 'Restrição de espaço temporária para acertar o banheiro mais rápido.',
  durationMinutes: 5,
  xpReward: 15,
  icon: '🏠',
  concept: {
    title: 'Menos espaço agora, mais liberdade depois',
    loganSpeech: 'Casa grande demais confunde a gente! Com uma área menor, eu entendo rapidinho onde é o banheiro.',
    body:
      'Enquanto o cão aprende, deixe-o numa área segura quando você não puder supervisionar: um cômodo pequeno ou um cercadinho com caminha, água e o tapete higiênico. ' +
      'Cães evitam sujar perto de onde dormem, então o tapete fica longe da cama. A cada semana sem acidentes, libere mais um pedaço da casa.',
    whyItWorks:
      'Controlar o ambiente evita que o erro vire hábito e aumenta as chances de acerto — e cada acerto reforçado fortalece o lugar certo.',
  },
  practice: {
    title: 'Montando a área segura',
    loganSpeech: 'Bora montar meu QG! Escolha um cantinho tranquilo da casa.',
    instructions: [
      'Escolha um cômodo pequeno ou um cercadinho.',
      'Caminha num canto, tapete higiênico no outro.',
      'Água e um brinquedo de mastigar.',
      'Jogue 3 petiscos lá dentro e deixe explorar.',
      'Use quando não puder vigiar. Nunca como castigo.',
    ],
    timerSeconds: 180,
    avoid: ['Usar a área como castigo', 'Tapete colado na caminha ou no pote de comida', 'Liberar a casa toda logo no primeiro dia'],
  },
  validation: {
    question: 'Seu cão ficou tranquilo na área segura?',
    feedback: {
      easy: 'Perfeito! Mantenha por uma semana e, sem acidentes, libere mais um cômodo.',
      medium: 'Ele ainda está se acostumando. Dê refeições e petiscos lá dentro para criar boas associações.',
      hard: 'Chorou? Comece com tempos curtos, com você por perto.',
    },
  },
  victory: {
    loganSpeech: 'QG montado! Com a área segura, os acidentes vão diminuir rapidinho.',
    nextTip: 'Anote os dias sem acidente. Com 7 dias seguidos, é hora de liberar um novo espaço.',
  },
  quiz: [
    {
      id: 'm1-l5-q1',
      question: 'Por que limitar o espaço do cão no começo?',
      options: ['Como castigo', 'Cães evitam sujar perto de onde dormem, então fica mais fácil acertar', 'Para ele ficar sozinho o dia todo', 'Não faz diferença'],
      correctIndex: 1,
      explanation: 'Uma área menor deixa claro onde é o banheiro e evita que acidentes virem hábito.',
    },
    {
      id: 'm1-l5-q2',
      question: 'Onde colocar o tapete higiênico na área segura?',
      options: ['Colado na caminha', 'No lado oposto à caminha e à água', 'Embaixo do pote de comida', 'Fora da área'],
      correctIndex: 1,
      explanation: 'Longe de onde ele dorme e come — é assim que ele entende que aquele é o banheiro.',
    },
    {
      id: 'm1-l5-q3',
      question: 'Quando liberar mais um cômodo da casa?',
      options: ['No primeiro dia', 'Depois de cerca de 1 semana sem acidentes', 'Só depois de 1 ano', 'Sempre que ele chorar'],
      correctIndex: 1,
      explanation: 'Liberdade vem com acertos: cerca de uma semana limpa é um bom sinal para expandir.',
    },
    {
      id: 'm1-l5-q4',
      question: 'Pode usar a área segura como castigo depois de um acidente?',
      options: ['Sim, assim ele aprende', 'Não — a área precisa ser um lugar bom', 'Só em dias difíceis', 'Só se ele latir'],
      correctIndex: 1,
      explanation: 'Se a área virar castigo, ele vai odiar ficar lá. Ela deve ser um refúgio tranquilo.',
    },
  ],
});

export const caminhaLesson: Lesson = lesson({
  id: 'm1-l6',
  title: 'Caminha! (Place)',
  summary: 'Ensine o cão a ir para a caminha e relaxar lá quando você pedir.',
  durationMinutes: 6,
  xpReward: 15,
  icon: '🛏️',
  concept: {
    title: 'Um lugar só dele',
    loganSpeech: 'Campainha tocou? Visita chegando? Eu vou pra minha caminha e espero de boa. É meu superpoder favorito!',
    body:
      'O "Caminha" (ou "Place") ensina o cão a ir para um lugar definido — caminha, tapete ou almofada — e ficar lá deitado até ser liberado. ' +
      'É perfeito para visitas, hora das refeições da família e campainha. Primeiro ensinamos a subir no tapete, depois a deitar, e só então a ficar mais tempo.',
    whyItWorks: 'Dá ao cão uma tarefa clara em situações de agitação: em vez de pular, ele tem algo certo (e recompensado) para fazer.',
  },
  practice: {
    title: 'Subiu, ganhou!',
    loganSpeech: 'Escolha um tapete ou a caminha e separe 10 petiscos. Vamos lá!',
    instructions: [
      'Tapete no chão. Atraia {pet} com um petisco até subir.',
      'Patas no tapete? "Isso!" + petisco em cima dele.',
      'Jogue um petisco fora para {pet} sair. Repita.',
      'Subiu no tapete com as 4 patas? Peça "Senta" ou espere ele relaxar e entregue o petisco!',
      'Após 5 acertos, diga "Caminha!" antes. Libere com "Livre!".',
    ],
    targetReps: 10,
    timerSeconds: 240,
    avoid: ['Empurrar o cão para a caminha', 'Usar a caminha para castigo', 'Esquecer de liberar com "Livre!"'],
  },
  validation: {
    feedback: {
      easy: 'Ele já entendeu! Comece a pedir "Caminha" quando a campainha tocar (sem visita ainda).',
      medium: 'Bom progresso. Recompense várias vezes enquanto ele fica deitado no tapete.',
      hard: 'Use petiscos melhores e um tapete que se destaque do chão.',
    },
  },
  victory: {
    loganSpeech: 'FASE 1 COMPLETA! Caminha dominada e boas maneiras de super-herói. Tô orgulhoso!',
    nextTip: 'Treine 3x ao dia, aumentando aos poucos o tempo deitado antes do "Livre!". Na Fase 2: Fica, Junto e Vem.',
  },
});

// ---------------------------------------------------------------------------
// FASE 3 — Passeio & Socialização (novas missões)
// ---------------------------------------------------------------------------

export const passeioCalorLesson: Lesson = lesson({
  id: 'm3-l4',
  title: 'Passeio no calor',
  summary: 'Horários seguros, asfalto quente e sinais de superaquecimento.',
  durationMinutes: 4,
  xpReward: 15,
  icon: '☀️',
  concept: {
    title: 'Pata no asfalto quente queima',
    loganSpeech: 'No verão brasileiro, o asfalto vira chapa! Antes de sair, faça o teste da mão — eu agradeço.',
    body:
      'Em dias quentes, o asfalto pode queimar as almofadas das patas. Faça o teste dos 7 segundos: encoste o dorso da mão no chão; se não aguentar, está quente demais para o cão. ' +
      'Prefira passear antes das 9h ou depois das 17h, leve água e procure sombra e grama. Raças de focinho curto (Pug, Bulldog, Shih Tzu) sofrem mais com o calor.',
    whyItWorks: 'Cães regulam a temperatura principalmente ofegando, o que é bem menos eficiente que o nosso suor.',
  },
  practice: {
    title: 'Checklist do passeio seguro',
    loganSpeech: 'Antes do próximo passeio, faça este checklist comigo.',
    instructions: [
      'No verão: antes das 9h ou depois das 17h.',
      'Dorso da mão no asfalto por 7 s. Aguentou?',
      'Leve água e um potinho.',
      'Rota com sombra, grama ou terra.',
      'Língua muito pra fora ou babando? Pare na sombra.',
    ],
    timerSeconds: 60,
    avoid: ['Passear ao meio-dia no verão', 'Deixar o cão no carro, mesmo por pouco tempo', 'Correr com o cão em dias quentes'],
  },
  validation: {
    question: 'Você conseguiu planejar um passeio seguro?',
    loganSpeech: 'Essa missão é mais sobre você. Como foi?',
    feedback: {
      easy: 'Tutor prevenido vale por dois! Deixe a garrafinha sempre na mochila do passeio.',
      medium: 'Ótimo começo. Teste rotas diferentes até achar a mais fresquinha.',
      hard: 'Muito calor? Troque parte do passeio por faro em casa.',
    },
  },
  victory: {
    loganSpeech: 'Patas protegidas, cão feliz! Obrigado por cuidar de mim no calor.',
    nextTip: 'Em dias muito quentes, um passeio curto + 10 minutos de faro em casa cansam tanto quanto um passeio longo.',
  },
  quiz: [
    {
      id: 'm3-l4-q1',
      question: 'Como saber se o asfalto está quente demais?',
      options: ['Olhar se tem sol', 'Encostar o dorso da mão por 7 segundos', 'Perguntar ao cão', 'Não dá para saber'],
      correctIndex: 1,
      explanation: 'Se a sua mão não aguenta 7 segundos, as patas dele também não aguentam.',
    },
    {
      id: 'm3-l4-q2',
      question: 'Quais horários são melhores para passear no verão?',
      options: ['Entre 11h e 15h', 'Antes das 9h ou depois das 17h', 'Qualquer horário', 'Só à meia-noite'],
      correctIndex: 1,
      explanation: 'Fora do pico de calor, o chão e o ar estão mais frescos.',
    },
    {
      id: 'm3-l4-q3',
      question: 'Qual destes é um sinal de superaquecimento?',
      options: ['Abanar o rabo', 'Ofegar muito, babar e ficar muito cansado', 'Cheirar a grama', 'Querer brincar'],
      correctIndex: 1,
      explanation: 'Pare na sombra, ofereça água e, se não melhorar, procure um veterinário.',
    },
  ],
});

export const socializacaoLesson: Lesson = lesson({
  id: 'm3-l5',
  title: 'Socialização segura',
  summary: 'Apresente o mundo ao seu cão sem sustos: pessoas, cães e barulhos.',
  durationMinutes: 6,
  xpReward: 20,
  icon: '🤝',
  concept: {
    title: 'Observar de longe também é treino',
    loganSpeech: 'Socializar não é me jogar no meio de dez cachorros! É conhecer o mundo no meu ritmo.',
    body:
      'Socialização é criar boas experiências com pessoas, cães, sons e lugares. O segredo é a distância: começar longe o bastante para o cão ficar calmo e recompensar quando ele olha para a novidade e volta a atenção para você. ' +
      'Cumprimentos entre cães devem ser curtos (cerca de 3 segundos) e com guia frouxa. Filhotes: confirme com o veterinário quando liberar o chão público.',
    whyItWorks: 'Experiências positivas e graduais ensinam que o mundo é seguro — prevenindo medo e reatividade no futuro.',
  },
  practice: {
    title: 'Jogo do "Olha isso"',
    loganSpeech: 'Sente num banco de praça comigo e vamos observar o movimento!',
    instructions: [
      'Fique longe o bastante para {pet} ficar calmo.',
      'Olhou para pessoa, cão ou barulho? "Isso!" + petisco.',
      'Ficou tenso? Aumente a distância.',
      '8 repetições e vá embora ainda tranquilo.',
      'Cumprimento? Só com os dois relaxados, 3 s, e chame de volta.',
    ],
    targetReps: 8,
    timerSeconds: 300,
    avoid: ['Forçar contato com pessoas ou cães', 'Parques de cães lotados logo de início', 'Puxar a guia quando ele estiver com medo'],
  },
  validation: {
    feedback: {
      easy: 'Que cão confiante! Na próxima, diminua um pouco a distância.',
      medium: 'Ele está aprendendo. Mantenha a distância até ficar fácil.',
      hard: 'Tudo bem! Aumente a distância e faça sessões curtinhas.',
    },
  },
  victory: {
    loganSpeech: 'FASE 3 CONCLUÍDA! Passeios leves e um mundo cheio de boas experiências. Cada uma vira coragem!',
    nextTip: 'Varie os lugares: praça, porta de padaria, estacionamento — sempre de longe no começo. Na Fase 4: alimentação e enriquecimento.',
  },
});

// ---------------------------------------------------------------------------
// FASE 4 (nova) — Alimentação & Enriquecimento Ambiental
// ---------------------------------------------------------------------------

export const module5Lessons: Lesson[] = [
  lesson({
    id: 'm5-l1',
    title: 'Comida com calma',
    summary: 'Nada de pular no pote: senta, espera e só come quando liberado.',
    durationMinutes: 5,
    xpReward: 20,
    icon: '🥣',
    concept: {
      title: 'A refeição também é treino',
      loganSpeech: 'Duas vezes por dia eu fico doido com o pote. Mas aprendi que esperar faz a comida chegar mais rápido!',
      body:
        'Cada refeição é uma chance de treinar autocontrole. Peça "Senta", desça o pote devagar e, se ele levantar, suba o pote de novo. ' +
        'Quando o pote chegar ao chão com ele sentado, libere com "Pode!". Também vale dividir a ração diária em 2 ou 3 refeições em horários fixos.',
      whyItWorks: 'O cão aprende que a calma (e não a agitação) é o que faz a comida chegar — autocontrole aplicado ao dia a dia.',
    },
    practice: {
      title: 'Pote descendo, cão sentado',
      loganSpeech: 'Use a próxima refeição para este treino. Paciência de herói!',
      instructions: [
        'Pote na mão, peça "Senta".',
        'Desça o pote. Levantou? Suba de novo, em silêncio.',
        'Pote no chão e {pet} ainda no "Senta"? Conte 1 s.',
        'Libere: "Pode!".',
        'Próximas refeições: 3 s, depois 5 s.',
      ],
      targetReps: 3,
      avoid: ['Mexer no pote enquanto ele come', 'Deixar ração à vontade o dia todo', 'Esperas longas demais no começo'],
    },
    validation: {
      feedback: {
        easy: 'Educação à mesa nota 10! Aumente aos poucos o tempo de espera.',
        medium: 'Ele está pegando o jeito. Desça o pote mais devagar.',
        hard: 'Desça só até a metade e libere. Vá descendo aos poucos.',
      },
    },
    victory: {
      loganSpeech: 'Refeição com classe! Seu cão aprendeu que calma é o caminho.',
    },
  }),
  lesson({
    id: 'm5-l2',
    title: 'Farejar é trabalhar',
    summary: 'Use o faro para cansar a mente: espalhe a ração e transforme a refeição em caça.',
    durationMinutes: 5,
    xpReward: 20,
    icon: '👃',
    concept: {
      title: '10 minutos de faro cansam muito',
      loganSpeech: 'Meu nariz é meu superpoder! Me deixa usar e eu fico calminho o resto do dia.',
      body:
        'Farejar libera energia mental e acalma. Em vez de dar toda a ração no pote, espalhe parte dela pela grama, num tapete de farejo ou numa toalha enrolada. ' +
        'É ótimo para dias de chuva, calor forte ou para cães agitados e ansiosos.',
      whyItWorks: 'Farejar é um comportamento natural e prazeroso; usar o faro diminui o estresse e a frequência cardíaca.',
    },
    practice: {
      title: 'Caça ao tesouro',
      loganSpeech: 'Separe um punhado da ração de hoje. Bora caçar!',
      instructions: [
        'Separe um punhado da ração do dia.',
        'Espalhe num tapete ou na grama.',
        '"Procura!" e deixe {pet} achar tudo.',
        'Fácil? Enrole a ração numa toalha.',
        'Pare antes de perder a graça.',
      ],
      timerSeconds: 300,
      avoid: ['Ajudar demais', 'Usar petiscos extras demais (conte nas calorias do dia)'],
    },
    validation: {
      feedback: {
        easy: 'Detetive nato! Esconda em lugares mais difíceis na próxima.',
        medium: 'Bom! Deixe os pedaços mais visíveis no começo.',
        hard: 'Deixe a ração bem à vista no começo.',
      },
    },
    victory: {
      loganSpeech: 'Faro ativado, mente cansada, cão feliz. Missão cumprida!',
    },
  }),
  lesson({
    id: 'm5-l3',
    title: 'Enriquecimento sem gastar muito',
    summary: 'Brinquedos caseiros e o que NUNCA dar para o seu cão.',
    durationMinutes: 6,
    xpReward: 20,
    icon: '🧩',
    concept: {
      title: 'Cão entediado inventa moda',
      loganSpeech: 'Quando ninguém brinca comigo, o sofá vira brinquedo... Me dá desafios e eu deixo o sofá em paz!',
      body:
        'Enriquecimento ambiental são atividades que desafiam corpo e mente: brinquedos recheáveis, quebra-cabeças e objetos novos para explorar. ' +
        'Dá para fazer em casa com rolo de papelão, caixas e toalhas — sempre com supervisão. Atenção aos alimentos proibidos: chocolate, uva e uva-passa, cebola, alho, abacate e o adoçante xilitol.',
      whyItWorks: 'Necessidades mentais atendidas reduzem comportamentos destrutivos e a ansiedade.',
    },
    practice: {
      title: 'Brinquedo caseiro',
      loganSpeech: 'Vamos montar um desafio com coisas que você tem em casa!',
      instructions: [
        'Rolo de papel vazio: dobre uma ponta.',
        'Ponha uns grãos de ração e dobre a outra.',
        'Entregue e acompanhe {pet} abrir.',
        'Recolha o papelão no final.',
        'Faça rodízio de brinquedos na semana.',
      ],
      timerSeconds: 300,
      avoid: ['Deixar o cão sozinho com papelão ou garrafas', 'Ossos cozidos (lascam)', 'Alimentos proibidos para cães'],
    },
    validation: {
      feedback: {
        easy: 'Gênio! Teste caixas de ovo ou uma toalha enrolada na próxima.',
        medium: 'Bom! Deixe o rolo mais fácil de abrir no começo.',
        hard: 'Não ligou? Use um petisco mais cheiroso e anime com a voz.',
      },
    },
    victory: {
      loganSpeech: 'Diversão garantida e sofá salvo! Seu cão agradece o desafio.',
      nextTip: 'Um brinquedo recheável congelado (patê + ração) ajuda muito quando você precisa sair de casa.',
    },
    quiz: [
      {
        id: 'm5-l3-q1',
        question: 'Qual destes alimentos é perigoso para cães?',
        options: ['Cenoura', 'Uva e uva-passa', 'Arroz cozido', 'Maçã sem sementes'],
        correctIndex: 1,
        explanation: 'Uvas e uvas-passas podem causar problemas graves nos rins dos cães, mesmo em pouca quantidade.',
      },
      {
        id: 'm5-l3-q2',
        question: 'O adoçante xilitol (presente em chicletes e alguns doces) é…',
        options: ['Seguro', 'Muito perigoso para cães', 'Bom para os dentes dele', 'Indiferente'],
        correctIndex: 1,
        explanation: 'O xilitol pode causar queda brusca de glicose e lesões no fígado. Procure o veterinário se ele ingerir.',
      },
      {
        id: 'm5-l3-q3',
        question: 'Brinquedos de papelão caseiros devem ser usados…',
        options: ['Com supervisão', 'Quando o cão fica sozinho', 'Sem nenhum cuidado', 'Só para filhotes'],
        correctIndex: 0,
        explanation: 'Ele pode engolir pedaços. Supervisione e recolha tudo no final.',
      },
      {
        id: 'm5-l3-q4',
        question: 'Qual destes também é proibido?',
        options: ['Chocolate', 'Ração', 'Água', 'Abobrinha cozida'],
        correctIndex: 0,
        explanation: 'O chocolate tem teobromina, que é tóxica para cães — quanto mais amargo, mais perigoso.',
      },
    ],
  }),
];

// ---------------------------------------------------------------------------
// Dores do dia a dia (revisão de UX): foco, "Solta!" e interfone
// ---------------------------------------------------------------------------

export const focoLesson: Lesson = lesson({
  id: 'm2-foco',
  title: 'Olha pra mim!',
  summary: 'Um estalo e o olhar volta para você, mesmo com distração.',
  durationMinutes: 4,
  xpReward: 20,
  icon: '👀',
  concept: {
    title: 'O olhar que liga vocês',
    loganSpeech: 'Quando passa outro cachorro, meu mundo some... menos se meu tutor souber me chamar com um estalo!',
    body:
      'Foco é a base de todo comando: se ele olha para você, ele escuta você. Faça um som curto com a boca (um estalo ou "psiu"), ' +
      'espere o olhar e marque com "Isso!". Comece em casa, sem distrações, e depois leve para o corredor e a rua.',
    whyItWorks: 'Reforçar o contato visual vira hábito, e você usa esse olhar para tirar o cão de situações tensas.',
  },
  practice: {
    title: 'Psiu, olha aqui!',
    loganSpeech: 'Petisco na mão e {pet} na sua frente. Bora treinar o olhar!',
    instructions: [
      'Petisco na mão, {pet} na sua frente.',
      'Faça um estalo com a boca ou diga "{pet}!".',
      'Olhou no seu olho? Clique + petisco!',
      'Acertou 5? Leve o treino para o corredor.',
      'Passou outro cão? Estalo, olhou, petisco.',
    ],
    targetReps: 10,
    avoid: ['Chamar várias vezes seguidas', 'Segurar o focinho para ele olhar'],
  },
  validation: {
    question: 'Ele olhou para você quando ouviu o som?',
    feedback: {
      easy: 'Foco de herói! Agora tente com a TV ligada ou no corredor.',
      medium: 'Está pegando! Faça o som uma vez e espere, sem repetir.',
      hard: 'Tudo bem! Treine num cômodo sem nenhuma distração.',
    },
  },
  victory: {
    loganSpeech: 'Olho no olho! Agora {pet} sabe onde está a diversão: em você.',
    nextTip: 'No passeio, use o estalo antes que ele trave em algo.',
  },
});

export const soltaLesson: Lesson = lesson({
  id: 'm4-solta',
  title: '"Solta!": troca sem briga',
  summary: 'Pegou lixo ou osso na calçada? Ele solta em troca de algo melhor.',
  durationMinutes: 5,
  xpReward: 25,
  icon: '🦴',
  concept: {
    title: 'Troca justa, sem cabo de guerra',
    loganSpeech: 'Achei um osso de frango na calçada! É MEU... a não ser que você tenha algo melhor.',
    body:
      'Puxar da boca vira cabo de guerra, e o cão aprende a engolir rápido. No "Solta!", você oferece uma troca: mostra um petisco melhor, ' +
      'ele abre a boca e você recolhe o objeto com calma. Treine em casa com brinquedos antes de precisar na rua. ' +
      'Se ele engolir algo perigoso (osso cozido, remédio), procure o veterinário.',
    whyItWorks: 'Trocar em vez de tomar evita que o cão aprenda a proteger ou engolir objetos, e torna soltar algo vantajoso.',
  },
  practice: {
    title: 'Troca premiada',
    loganSpeech: 'Um brinquedo de que {pet} goste e petiscos bem cheirosos. Começou a troca!',
    instructions: [
      'Dê um brinquedo para {pet} brincar.',
      'Petisco cheiroso bem na frente do focinho.',
      'Abriu a boca? Diga "Solta!" + petisco.',
      'Recolha o brinquedo e devolva. Ele não perde nada!',
      'Na rua: mesma troca e afaste o lixo com o pé.',
    ],
    targetReps: 8,
    avoid: ['Puxar o objeto da boca', 'Correr atrás dele', 'Brigar quando ele soltar'],
  },
  validation: {
    question: 'Ele soltou o brinquedo pelo petisco?',
    feedback: {
      easy: 'Troca perfeita! Agora teste com o brinquedo favorito dele.',
      medium: 'Bom! Use um petisco ainda melhor na troca.',
      hard: 'Tudo bem! Comece com um brinquedo de que ele gosta menos.',
    },
  },
  victory: {
    loganSpeech: 'Solta, pega, ganha! {pet} aprendeu que trocar com você sempre compensa.',
    nextTip: 'Engoliu algo perigoso? Ligue para o veterinário na hora.',
  },
});

export const interfoneLesson: Lesson = lesson({
  id: 'm4-interfone',
  title: 'Tocou o interfone!',
  summary: 'Campainha toca, ele corre para a caminha em vez de latir na porta.',
  durationMinutes: 6,
  xpReward: 25,
  icon: '🔔',
  concept: {
    title: 'Campainha = hora da caminha',
    loganSpeech: 'Tocou o interfone? Eu viro alarme! A não ser que o som signifique petisco na minha caminha...',
    body:
      'Em vez de brigar com o latido, mude o que o som significa. Toda vez que tocar o interfone ou a campainha, jogue 3 petiscos na caminha. ' +
      'Logo ele corre para a caminha em vez de ir latir na porta. A missão Caminha é a base, e vale pedir ajuda a alguém para tocar a campainha nos treinos.',
    whyItWorks: 'Contracondicionamento: o som passa a prever algo bom num lugar certo, e correr para a caminha substitui o latido na porta.',
  },
  practice: {
    title: 'Toca e corre pra caminha',
    loganSpeech: 'Peça para alguém tocar a campainha (ou use um vídeo com o som). Bora!',
    instructions: [
      'Alguém toca a campainha ou o interfone.',
      'Na hora, jogue 3 petiscos na caminha.',
      '{pet} correu pra lá? "Isso!" + mais um petisco.',
      'Só abra a porta com {pet} na caminha.',
      'Repita 5 vezes, com pausas entre os toques.',
    ],
    targetReps: 5,
    avoid: ['Gritar "quieto" por cima do latido', 'Abrir a porta com ele latindo'],
  },
  validation: {
    question: 'Ele foi para a caminha quando o som tocou?',
    feedback: {
      easy: 'Porteiro nota 10! Agora teste com uma visita de verdade.',
      medium: 'Quase lá! Jogue os petiscos ainda mais rápido depois do som.',
      hard: 'Tudo bem! Use o som do celular baixinho e aumente aos poucos.',
    },
  },
  victory: {
    loganSpeech: 'Ding-dong, petisco na caminha! A porta ficou bem mais tranquila.',
    nextTip: 'Deixe um pote de petiscos perto do interfone para não perder a hora.',
  },
});
