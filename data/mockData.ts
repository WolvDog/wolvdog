import type { Lesson, Module, Pet, SubscriptionPlan, User } from '@/types';

import { lesson, sequence } from './lessonBuilder';
import {
  areaSeguraLesson,
  caminhaLesson,
  EXISTING_QUIZZES,
  focoLesson,
  interfoneLesson,
  module5Lessons,
  nomeLesson,
  passeioCalorLesson,
  socializacaoLesson,
  soltaLesson,
} from './missionsExtra';
import { SPECIAL_LESSONS, SPECIAL_MODULE, SPECIAL_MODULE_ID } from './specials';

// ---------------------------------------------------------------------------
// Missões-base 1 (a ordem nas fases é definida em MODULES, no fim do arquivo)
// ---------------------------------------------------------------------------

const MODULE_1 = 'm1-boas-maneiras';

const module1Lessons: Lesson[] = [
  lesson({
    id: 'm1-l1',
    moduleId: MODULE_1,
    order: 1,
    title: 'O marcador mágico: "Isso!"',
    summary: 'Ensine seu cão que "Isso!" significa "acertou, vem prêmio".',
    durationMinutes: 4,
    xpReward: 10,
    icon: '✨',
    concept: {
      title: 'Uma palavra que vale ouro',
      loganSpeech: 'Au! Eu sou o Logan, e hoje vou te contar meu superpoder secreto: uma palavrinha que faz qualquer cão prestar atenção!',
      body:
        'O marcador é uma palavra curta ("Isso!") dita no EXATO segundo em que o cão faz algo certo. Logo depois vem o petisco. ' +
        'Com repetição, o cão entende que "Isso!" = "o que eu acabei de fazer dá prêmio". É a base de TODO o treino do WolvDog.',
      whyItWorks:
        'É condicionamento clássico: o som vira uma ponte entre o comportamento e a recompensa, permitindo marcar ações rápidas com precisão.',
    },
    practice: {
      title: 'Carregando o marcador',
      loganSpeech: 'Pega 15 petiscos bem pequenininhos (do tamanho de uma ervilha). Bora carregar esse marcador!',
      instructions: [
        'Cômodo calmo, 15 petiscos pequenos na mão.',
        'Diga "Isso!" e dê o petisco em até 1 segundo.',
        'Espere 3 segundos em silêncio. Repita.',
        '{O_pet} não precisa fazer nada ainda.',
        'Teste: "Isso!" quando {o_pet} olhar para outro lado. Virou? Sucesso!',
      ],
      targetReps: 15,
      timerSeconds: 180,
      avoid: ['Usar o marcador sem dar o petisco depois', 'Repetir "Isso, isso, isso!" várias vezes seguidas'],
    },
    validation: {
      question: 'Quando você disse "Isso!", seu cão virou para você?',
      feedback: {
        easy: 'Uau, que cão atento! Ele já entendeu o jogo. Amanhã vamos usar esse marcador de verdade.',
        medium: 'Ótimo começo! Faça mais uma rodada de 10 repetições antes de dormir e ele vai pegar.',
        hard: 'Normal no 1º dia! Use um petisco mais cheiroso e um lugar mais quieto.',
      },
    },
    victory: {
      loganSpeech: 'Marcador carregado! Agora você fala a língua dos cães. Tô orgulhoso!',
      nextTip: 'Use "Isso!" durante o dia sempre que ele fizer algo legal espontaneamente, como deitar calmo.',
    },
  }),
  lesson({
    id: 'm1-l2',
    moduleId: MODULE_1,
    order: 2,
    title: 'Os 5 momentos do xixi',
    summary: 'Descubra os horários em que o xixi é quase garantido.',
    durationMinutes: 5,
    xpReward: 10,
    icon: '🚽',
    concept: {
      title: 'Antecipar é o segredo',
      loganSpeech: 'Sabia que a gente quase sempre faz xixi nos mesmos momentos? Se você antecipar, o acerto é garantido!',
      body:
        'Existem 5 momentos-chave: (1) ao acordar, (2) após comer ou beber, (3) depois de brincar, (4) após uma soneca e (5) antes de dormir. ' +
        'Leve o cão ao local certo NESSES momentos e recompense quando ele acertar. Menos acidentes = menos chance de criar hábito errado.',
      whyItWorks:
        'Cães criam preferência de substrato: o lugar onde eliminam com frequência vira "o banheiro". Cada acerto reforça o local certo.',
    },
    practice: {
      title: 'Primeira ida guiada ao banheiro',
      loganSpeech: 'Vamos treinar agora mesmo! Se ele acabou de comer, brincar ou acordar, é a hora perfeita.',
      instructions: [
        'Leve {o_pet} na guia até o tapete higiênico.',
        'Fique parado e sem graça por até 3 min.',
        'Começou a fazer? Silêncio total.',
        'Terminou? "Isso!" + petisco ali mesmo.',
        'Não fez? Tente de novo em 10 a 15 min.',
      ],
      timerSeconds: 180,
      avoid: ['Dar o petisco só quando voltar para dentro de casa', 'Brincar antes de ele fazer'],
    },
    validation: {
      question: 'Seu cão fez xixi no lugar certo durante o treino?',
      feedback: {
        easy: 'Acertou na mosca! Repita nos 5 momentos e em uma semana vira rotina.',
        medium: 'Fez, mas demorou? Tudo bem! Com a rotina ele vai ficando mais rápido.',
        hard: 'Tudo bem! Anote o horário e tente no próximo momento.',
      },
    },
    victory: {
      loganSpeech: 'Banheiro no lugar certo é coisa de herói! Missão cumprida!',
      nextTip: 'Cole um lembrete na geladeira com os 5 momentos. Consistência vence!',
    },
  }),
  lesson({
    id: 'm1-l3',
    moduleId: MODULE_1,
    order: 3,
    title: 'Acidente? Sem bronca!',
    summary: 'Como limpar e reagir para o erro não se repetir.',
    durationMinutes: 3,
    xpReward: 10,
    icon: '🧽',
    concept: {
      title: 'Bronca ensina a esconder, não a acertar',
      loganSpeech: 'Psiu... vou te contar uma coisa: quando brigam comigo por um xixi, eu só aprendo a fazer escondido.',
      body:
        'Punir depois do acidente não funciona: o cão não liga a bronca ao xixi feito minutos antes. Ele aprende que fazer xixi PERTO de você é perigoso. ' +
        'O certo é interromper com calma (se pegar no ato), levar ao lugar certo e limpar com produto enzimático para remover o cheiro.',
      whyItWorks:
        'O olfato canino detecta resíduos que nós não sentimos. Sem cheiro, o lugar deixa de "chamar" o próximo xixi.',
    },
    practice: {
      title: 'Kit anti-acidente',
      kind: 'checklist',
      loganSpeech: 'Vamos montar seu kit de herói da limpeza e ensaiar a reação perfeita!',
      instructions: [
        'Separe papel toalha, limpador enzimático e saquinho.',
        'Ensaie um "Opa!" calmo, sem gritar.',
        'Xixi antigo? Só limpe em silêncio. Pegou no flagra agachando? Leve direto para o tapete higiênico!',
        'Limpe longe {do_pet}, sem drama.',
        'Nada de amônia: o cheiro chama para o mesmo lugar.',
      ],
      avoid: ['Esfregar o focinho no xixi', 'Gritar ou bater jornal', 'Usar água sanitária pura'],
    },
    validation: {
      question: 'Você já sabe como reagir a um acidente?',
      loganSpeech: 'Essa é mais sobre você do que sobre o cão. Como foi?',
      feedback: {
        easy: 'Tutor nível herói! Calma e consistência são seus superpoderes.',
        medium: 'Bom! Releia a lista "Evite" mais uma vez e o plano fica na ponta da língua.',
        hard: 'Respira! Acidente é informação, não desobediência.',
      },
    },
    victory: {
      loganSpeech: 'FASE 3 CONCLUÍDA! Você aprendeu a lição mais difícil para humanos: paciência! Au au!',
      nextTip: 'Se os acidentes acontecem sempre no mesmo lugar, coloque o pote de comida ali: cães evitam sujar onde comem. Na Fase 4: passeio sem puxar.',
    },
  }),
  lesson({
    id: 'm1-l4',
    moduleId: MODULE_1,
    order: 4,
    title: 'Quatro patas no chão',
    summary: 'Pare os pulos em visitas e na hora de chegar em casa.',
    durationMinutes: 6,
    xpReward: 15,
    icon: '🐕',
    concept: {
      title: 'Atenção é o prêmio que ele quer',
      loganSpeech: 'Quando eu pulo em você, eu quero sua atenção. Se você me empurra e fala "desce!", adivinha? Eu ganhei atenção!',
      body:
        'O cão pula para cumprimentar e ganhar atenção. A estratégia é: pulou, você vira de costas e fica em silêncio. ' +
        'Quatro patas no chão? "Isso!" + carinho calmo ou petisco. Ele aprende que ficar no chão é o que faz você interagir.',
      whyItWorks:
        'Extinção + reforço diferencial: o comportamento indesejado deixa de funcionar e um comportamento alternativo passa a ser recompensado.',
    },
    practice: {
      title: 'Treino da chegada',
      loganSpeech: 'Saia de casa por 1 minutinho e volte. Vamos simular a chegada 5 vezes!',
      instructions: [
        'Petiscos no bolso antes de entrar.',
        'Entre calmo, sem "oi" animado.',
        'Pulou? Vire de costas e cruze os braços.',
        '4 patas no chão? "Isso!" + petisco no chão.',
        'Repita a entrada 5 vezes.',
      ],
      targetReps: 5,
      avoid: ['Empurrar o cão com o joelho', 'Fazer festa assim que entra', 'Recompensar só às vezes o pulo (visitas devem seguir a regra também!)'],
    },
    validation: {
      feedback: {
        easy: 'Que educado! Agora peça para alguém da família repetir o treino — todo mundo precisa jogar o mesmo jogo.',
        medium: 'Ele já está entendendo! Os pulos costumam até aumentar antes de diminuir. Persistência!',
        hard: 'Muita energia? Passeie ou brinque antes e tente de novo.',
      },
    },
    victory: {
      loganSpeech: 'Quatro patas no chão, cumprimento de herói! As chegadas em casa nunca mais vão ser um caos.',
      nextTip: 'Combine com a família: ninguém dá atenção para pulos, nem as visitas. A seguir: a Caminha, o cantinho de calma {do_pet}.',
    },
  }),
];

// ---------------------------------------------------------------------------
// Missões-base 2: comandos (Senta, Fica, Junto, Vem)
// ---------------------------------------------------------------------------

const MODULE_2 = 'm2-comandos-basicos';

const module2Lessons: Lesson[] = [
  lesson({
    id: 'm2-l1',
    moduleId: MODULE_2,
    order: 1,
    title: 'Senta!',
    summary: 'O comando mais útil do mundo, ensinado com isca.',
    durationMinutes: 5,
    xpReward: 15,
    icon: '🪑',
    concept: {
      title: 'O "por favor" dos cães',
      loganSpeech: 'O "Senta" é o "por favor" dos cães! Eu sento antes de comer, antes de sair e antes de ganhar carinho.',
      body:
        'Usamos a técnica da isca (luring): o petisco guia o focinho para cima e para trás, e o bumbum desce naturalmente. ' +
        'Só depois que o movimento estiver fluido adicionamos a palavra "Senta".',
      whyItWorks: 'Ensinar o movimento antes da palavra evita que o cão associe o comando a tentativas erradas.',
    },
    practice: {
      title: 'Isca do focinho ao céu',
      loganSpeech: 'Petisco entre os dedos, e vamos lá! 10 repetições, bem rapidinho.',
      instructions: [
        'Petisco no focinho.',
        'Suba a mão devagar para trás.',
        'Bumbum no chão? "Isso!" + petisco!',
        'Após 5 acertos, diga "Senta" antes do gesto.',
        'No fim: gesto com a mão vazia, petisco do bolso.',
      ],
      targetReps: 10,
      timerSeconds: 240,
      avoid: ['Empurrar o bumbum para baixo', 'Repetir "senta, senta, SENTA"', 'Mão alta demais (ele vai pular)'],
    },
    validation: {
      feedback: {
        easy: 'Senta dominado! Agora peça antes de colocar a comida no pote.',
        medium: 'Está quase! Mantenha a isca mais perto do focinho.',
        hard: 'Dá ré? Treine com as costas dele perto da parede.',
      },
    },
    victory: {
      loganSpeech: 'Senta: desbloqueado! Esse comando vai ser a base de tudo daqui pra frente!',
      nextTip: 'Peça "Senta" 3x ao dia em situações reais: antes da comida, da guia e de abrir a porta.',
    },
  }),
  lesson({
    id: 'm2-l2',
    moduleId: MODULE_2,
    order: 2,
    title: 'Fica: os 3 Ds',
    summary: 'Duração, Distância e Distração — um de cada vez.',
    durationMinutes: 7,
    xpReward: 20,
    icon: '✋',
    concept: {
      title: 'Um D de cada vez',
      loganSpeech: 'Ficar parado é difícil quando o mundo é tão cheiroso! Por isso a gente vai devagar.',
      body:
        'O "Fica" é construído com 3 Ds: Duração (quanto tempo), Distância (quão longe você vai) e Distração (o que acontece em volta). ' +
        'Regra de ouro: aumente só UM D por vez. Se aumentar a distância, diminua a duração.',
      whyItWorks: 'Aproximações sucessivas mantêm a taxa de acerto alta (acima de 80%), o que acelera o aprendizado.',
    },
    practice: {
      title: 'Escadinha da duração',
      loganSpeech: 'Hoje vamos só no primeiro D: duração. Você fica pertinho, combinado?',
      instructions: [
        '"Senta", palma da mão aberta e "Fica".',
        'Conte 2 s, "Isso!" e petisco sem ele levantar.',
        'Libere com "Livre!".',
        'Suba: 3, 5, 8, 10 s. Levantou? Volte um tempo.',
        'Série final: 15 s no cronômetro.',
      ],
      timerSeconds: 15,
      targetReps: 8,
      avoid: ['Chamar o cão para você no fim do "Fica"', 'Aumentar duração e distância ao mesmo tempo'],
    },
    validation: {
      feedback: {
        easy: 'Paciência de monge! Na próxima, dê 1 passo para trás (e volte para 3 segundos).',
        medium: 'Ótimo. Se ele levanta às vezes, entregue petiscos mais frequentes durante o fica.',
        hard: 'Tudo bem! Volte para 1 segundo e suba de 1 em 1.',
      },
    },
    victory: {
      loganSpeech: 'Você construiu os alicerces do autocontrole! Isso é poder de verdade.',
    },
  }),
  lesson({
    id: 'm2-l3',
    moduleId: MODULE_2,
    order: 3,
    title: 'Junto: a posição de ouro',
    summary: 'Ensine seu cão a amar ficar ao seu lado.',
    durationMinutes: 6,
    xpReward: 20,
    icon: '🦸',
    concept: {
      title: 'O lugar mais legal do mundo',
      loganSpeech: 'Eu e meu tutor somos uma dupla de heróis. E todo herói tem seu parceiro bem ao lado!',
      body:
        'O "Junto" é a posição ao lado da sua perna (geralmente a esquerda), com o ombro do cão alinhado à sua perna. ' +
        'Vamos transformar esse lugar em uma "zona premiada": tudo de bom acontece ali.',
      whyItWorks: 'Reforçar uma posição específica cria valor nela — o cão passa a buscá-la sozinho.',
    },
    practice: {
      title: 'Zona premiada',
      loganSpeech: 'Petiscos na mão esquerda, e vamos dar alguns passinhos juntos!',
      instructions: [
        '{O_pet} do seu lado esquerdo, petisco na mão esquerda.',
        'Colado na perna? "Isso!" + petisco ali.',
        'Dê 1 passo. Acompanhou? "Isso!" + petisco.',
        'Deu 2 passos colado na sua perna? Diga "Isso!" e entregue o petisco na altura da coxa.',
        'Fale "Junto" ao começar. 10 rodadas em casa.',
      ],
      targetReps: 10,
      avoid: ['Entregar o petisco na frente do corpo (puxa ele para frente)', 'Treinar na rua antes de dominar em casa'],
    },
    validation: {
      feedback: {
        easy: 'Dupla dinâmica! Tente fazer uma curva para a direita mantendo a posição.',
        medium: 'Ele vai aprendendo. Mais petiscos, mais frequentes, passos mais curtos.',
        hard: 'Agitação? Treine depois do passeio, num corredor.',
      },
    },
    victory: {
      loganSpeech: 'Junto e misturado! Você acabou de preparar o terreno para passeios incríveis.',
    },
  }),
  lesson({
    id: 'm2-l4',
    moduleId: MODULE_2,
    order: 4,
    title: 'Vem! O chamado infalível',
    summary: 'Faça seu cão correr até você toda vez.',
    durationMinutes: 5,
    xpReward: 20,
    icon: '📣',
    concept: {
      title: 'Nunca chame para algo chato',
      loganSpeech: 'Se toda vez que me chamam é para tomar banho ou ir embora do parque... eu finjo que não ouvi!',
      body:
        'O chamado precisa ser SEMPRE a melhor notícia do dia. Use um petisco de alto valor exclusivo para o "Vem!" ' +
        'e nunca chame o cão para algo que ele não gosta — nesses casos, vá até ele.',
      whyItWorks: 'O valor do comando é a soma das experiências: cada chamado ruim "desconta" vários bons.',
    },
    practice: {
      title: 'Jogo do pingue-pongue',
      loganSpeech: 'Melhor com duas pessoas! Uma em cada ponta do cômodo. Prontos?',
      instructions: [
        'Duas pessoas, uma em cada lado do cômodo.',
        'Pessoa A agacha e chama: "{pet}, vem!"',
        'Chegou? "Isso!" + petisco + segure a coleira 1 s.',
        'Pessoa B chama. Alterne 10 vezes.',
        'Sozinho? Jogue um petisco longe e chame.',
      ],
      targetReps: 10,
      timerSeconds: 180,
      avoid: ['Repetir o comando várias vezes', 'Correr atrás do cão (vira brincadeira de pega-pega)'],
    },
    validation: {
      feedback: {
        easy: 'Chamado de foguete! Pratique no quintal ou em um lugar cercado.',
        medium: 'Bom! Use um petisco ainda mais gostoso só para esse comando.',
        hard: 'Comece a 1 metro e vá se afastando.',
      },
    },
    victory: {
      loganSpeech: 'FASE 2 CONCLUÍDA! Senta, Fica, Junto e Vem: seu cão tem um arsenal de herói!',
      nextTip: 'Próxima fase: banheiro sem acidentes, no tapete ou no quintal.',
    },
  }),
];

// ---------------------------------------------------------------------------
// Missões-base 3: passeio sem puxar a guia
// ---------------------------------------------------------------------------

const MODULE_3 = 'm3-passeio';

const module3Lessons: Lesson[] = [
  lesson({
    id: 'm3-l1',
    moduleId: MODULE_3,
    order: 1,
    title: 'Equipamento de herói',
    summary: 'Peitoral, guia e a pochete de petiscos ideais.',
    durationMinutes: 4,
    xpReward: 15,
    icon: '🦺',
    concept: {
      title: 'Peitoral em Y + guia de 1,8 m',
      loganSpeech: 'Antes de sair pro mundo, todo herói precisa do uniforme certo!',
      body:
        'Prefira peitoral com engate frontal ou em formato Y (não pressiona a traqueia) e uma guia fixa de 1,8 m. ' +
        'Evite guias retráteis no treino: elas ensinam que puxar faz a guia aumentar.',
      whyItWorks: 'Equipamento confortável reduz a reatividade causada por desconforto e dá mais controle sem dor.',
    },
    practice: {
      title: 'Peitoral = coisa boa',
      loganSpeech: 'Vamos fazer o peitoral virar sinônimo de festa!',
      instructions: [
        'Mostre o peitoral: "Isso!" + petisco. 3 vezes.',
        'Petisco na abertura: {o_pet} enfia o focinho sozinh{o/a}.',
        'Feche, dê 3 petiscos e retire.',
        'Guia presa: 1 min andando em casa, premiando de perto.',
      ],
      timerSeconds: 60,
      targetReps: 3,
    },
    validation: {
      feedback: {
        easy: 'Pronto para a rua! Uniforme aprovado.',
        medium: 'Ele aceita, mas com dúvidas? Repita a parte do focinho por mais 2 dias.',
        hard: 'Só mostre o peitoral e premie por alguns dias.',
      },
    },
    victory: {
      loganSpeech: 'Uniforme vestido! Agora sim podemos salvar o mundo... digo, passear!',
    },
  }),
  lesson({
    id: 'm3-l2',
    moduleId: MODULE_3,
    order: 2,
    title: 'Virar árvore',
    summary: 'Guia esticou? Você para. Guia frouxa? Vocês andam.',
    durationMinutes: 6,
    xpReward: 20,
    icon: '🌳',
    concept: {
      title: 'Puxar não leva a lugar nenhum',
      loganSpeech: 'Quando eu puxo e meu tutor vira uma árvore... aff, eu não chego no poste! Então eu afrouxo.',
      body:
        'Sempre que a guia esticar, pare completamente. Espere a guia ficar frouxa (formato de "J"). ' +
        'Quando afrouxar: "Isso!" e volte a andar. Andar É a recompensa.',
      whyItWorks: 'Punição negativa + reforço negativo suaves: puxar remove o avanço; afrouxar devolve o avanço.',
    },
    practice: {
      title: 'Passeio de 5 minutos em modo árvore',
      loganSpeech: 'Hoje o passeio é curto e o objetivo não é chegar longe. É ensinar. Vamos?',
      instructions: [
        'Rua calma ou corredor do prédio.',
        'Guia esticou? PARE, em silêncio.',
        'Guia em "J"? "Isso!" + petisco na perna e ande.',
        'Travou muito? Dê meia-volta.',
        'Final: 1 min livre para farejar.',
      ],
      timerSeconds: 300,
      avoid: ['Dar trancos na guia', 'Seguir andando "só desta vez" quando ele puxa'],
    },
    validation: {
      feedback: {
        easy: 'Guia em J o tempo todo? Você é uma lenda!',
        medium: 'Ótimo! As primeiras sessões são lentas mesmo. Persistência vence.',
        hard: 'Muita distração? Mais 2 dias no corredor ou quintal.',
      },
    },
    victory: {
      loganSpeech: 'Você virou uma árvore poderosa! Seu cão está aprendendo que calma leva longe.',
    },
  }),
  lesson({
    id: 'm3-l3',
    moduleId: MODULE_3,
    order: 3,
    title: 'Meia-volta surpresa',
    summary: 'Mudanças de direção que fazem o cão prestar atenção em você.',
    durationMinutes: 6,
    xpReward: 20,
    icon: '🔄',
    concept: {
      title: 'Seja mais interessante que o poste',
      loganSpeech: 'Se meu tutor muda de direção do nada, eu tenho que ficar ligado nele! Virou jogo!',
      body:
        'Mudanças de direção imprevisíveis ensinam o cão a acompanhar você. Avise com um som ("Vamos!"), vire e recompense quando ele te alcançar do lado certo.',
      whyItWorks: 'Aumenta o engajamento com o tutor e interrompe a fixação em estímulos externos.',
    },
    practice: {
      title: 'Zigue-zague do herói',
      loganSpeech: 'Vamos fazer 8 meias-voltas! Capricha na voz animada.',
      instructions: [
        'Ande em linha reta, guia frouxa.',
        '"Vamos!" animado e vire para o outro lado.',
        'Alcançou sua perna? "Isso!" + petisco.',
        '8 meias-voltas em 5 min, sem aviso.',
        'Craque? Inclua curvas de 90°.',
      ],
      targetReps: 8,
      timerSeconds: 300,
    },
    validation: {
      feedback: {
        easy: 'Cão grudado em você! O passeio de vocês já é outro.',
        medium: 'Ele ainda se atrasa? Avise mais cedo e vire mais devagar.',
        hard: 'Na rua, use petiscos mais valiosos.',
      },
    },
    victory: {
      loganSpeech: 'Meia-volta dominada! Agora é você quem guia o passeio. É disso que eu gosto!',
      nextTip: 'A seguir: como passear com segurança nos dias quentes.',
    },
  }),
];

// ---------------------------------------------------------------------------
// Missões-base 4: ansiedade e autocontrole
// ---------------------------------------------------------------------------

const MODULE_4 = 'm4-ansiedade';

const module4Lessons: Lesson[] = [
  lesson({
    id: 'm4-l1',
    moduleId: MODULE_4,
    order: 1,
    title: 'O tapete do relaxamento',
    summary: 'Um lugar seguro que ensina o cão a desligar.',
    durationMinutes: 7,
    xpReward: 25,
    icon: '🧘',
    concept: {
      title: 'Calma também se treina',
      loganSpeech: 'Até super-heróis precisam descansar. Eu tenho meu tapete favorito, e você vai ensinar seu cão a ter o dele!',
      body:
        'O "tapete do relaxamento" é um lugar onde o cão aprende a deitar e relaxar. Recompensamos sinais de calma: deitar de lado, suspirar, apoiar a cabeça. ' +
        'Com o tempo, levar o tapete para qualquer lugar (visitas, viagens, veterinário) traz a calma junto.',
      whyItWorks: 'Condicionamento de relaxamento: o tapete vira um gatilho para um estado emocional tranquilo.',
    },
    practice: {
      title: 'Captura da calma',
      loganSpeech: 'Sem comandos dessa vez. Só observe e recompense a calma. Respira junto comigo!',
      instructions: [
        'Tapete no chão, sente ao lado em silêncio.',
        'Pisou no tapete? Petisco entre as patas.',
        'Deitou ou suspirou? Petisco + "bom" baixinho.',
        'Espace os petiscos aos poucos.',
        'Recolha o tapete enquanto {o_pet} ainda relaxa.',
      ],
      timerSeconds: 300,
      avoid: ['Usar voz animada', 'Fazer sessões longas demais no começo'],
    },
    validation: {
      feedback: {
        easy: 'Zen total! Leve o tapete para outro cômodo amanhã.',
        medium: 'Ele relaxou um pouco? Já é vitória. Faça depois de um passeio.',
        hard: 'Tudo bem! Tente depois de um passeio, com um mordedor.',
      },
    },
    victory: {
      loganSpeech: 'Namastê, humano. Seu cão acabou de ganhar um superpoder: a calma!',
    },
  }),
  lesson({
    id: 'm4-l2',
    moduleId: MODULE_4,
    order: 2,
    title: '"Deixa": o poder do não',
    summary: 'Autocontrole diante de petiscos e objetos no chão.',
    durationMinutes: 6,
    xpReward: 25,
    icon: '🛑',
    concept: {
      title: 'Deixar algo te dá algo melhor',
      loganSpeech: 'Meu maior desafio? Um petisco na sua mão e eu não poder pegar. Mas eu aprendi que esperar vale MAIS!',
      body:
        'No "Deixa", o cão aprende que ignorar algo tentador traz uma recompensa ainda melhor, vinda de você. ' +
        'Isso protege o cão de comer coisas perigosas na rua e treina autocontrole em geral.',
      whyItWorks: 'Ensina o cão a inibir um impulso para obter reforço — a base do controle de impulsos.',
    },
    practice: {
      title: 'Mão fechada',
      loganSpeech: 'Petisco comum na mão fechada, petisco top na outra mão. Começou!',
      instructions: [
        'Petisco comum na mão fechada.',
        'Lambeu, mordiscou? Ignore e espere.',
        'Afastou o focinho? "Isso!" + petisco da OUTRA mão.',
        'Após 5 acertos, diga "Deixa" antes.',
        'Nível 2: mão aberta. Avançou? Feche.',
      ],
      targetReps: 10,
      timerSeconds: 240,
      avoid: ['Entregar o petisco que ele tinha que deixar', 'Dizer "deixa" várias vezes'],
    },
    validation: {
      feedback: {
        easy: 'Autocontrole de mestre! Tente com o petisco no chão, protegido pelo seu pé.',
        medium: 'Ele já entende que afastar funciona. Mais 2 sessões e vira hábito.',
        hard: 'Use um petisco menos gostoso na mão fechada.',
      },
    },
    victory: {
      loganSpeech: 'Uau! Recusar comida é praticamente um superpoder para nós. Respeito!',
    },
  }),
  lesson({
    id: 'm4-l3',
    moduleId: MODULE_4,
    order: 3,
    title: 'Saídas que não assustam',
    summary: 'Primeiros passos contra a ansiedade de separação.',
    durationMinutes: 7,
    xpReward: 30,
    icon: '🚪',
    concept: {
      title: 'Ir e voltar vira rotina sem graça',
      loganSpeech: 'Quando meu tutor sai, eu fico pensando se ele volta... Vamos mostrar pro seu cão que você SEMPRE volta.',
      body:
        'A ansiedade de separação melhora com exposição gradual: saídas muito curtas, que terminam antes do cão ficar ansioso. ' +
        'Chegadas e saídas devem ser "chatas" — sem despedidas dramáticas nem festas na volta.',
      whyItWorks: 'Dessensibilização sistemática: expor ao gatilho em intensidade baixa, sem provocar a reação de medo.',
    },
    practice: {
      title: 'Portas que voltam',
      loganSpeech: 'Vamos fazer saídas relâmpago. Ele nem vai perceber que você foi!',
      instructions: [
        'Dê um brinquedo recheado {para_pet}.',
        'Pegue as chaves, saia e volte em 5 s.',
        'Entre sem falar nada e siga sua vida.',
        'Aumente: 10 s, 20 s, 30 s, 1 min.',
        'Chorou? Volte ao tempo anterior.',
      ],
      timerSeconds: 60,
      targetReps: 5,
      avoid: ['Despedidas longas e emotivas', 'Voltar enquanto ele está chorando (espere 2s de silêncio)'],
    },
    validation: {
      feedback: {
        easy: 'Ele nem ligou? Perfeito! Aumente o tempo aos poucos ao longo da semana.',
        medium: 'Pequenos sinais de ansiedade são normais. Mantenha o tempo até ficar fácil.',
        hard: 'Ansiedade forte? Procure um veterinário comportamentalista.',
      },
    },
    victory: {
      loganSpeech: 'TODAS AS FASES COMPLETAS! Você é oficialmente um Tutor Herói WolvDog! AUUUUU!',
      nextTip: 'Revise as missões favoritas toda semana — treino é como músculo: se não usar, enfraquece.',
    },
  }),
];

// ---------------------------------------------------------------------------
// Módulos
// ---------------------------------------------------------------------------

const pick = (list: Lesson[], id: string): Lesson => {
  const found = list.find((l) => l.id === id);
  if (!found) throw new Error(`Missão não encontrada: ${id}`);
  return found;
};

const MODULE_5 = 'm5-alimentacao';

/** Sanitário saiu da fase grátis: comandos dão vitórias rápidas; banheiro depende de semanas de rotina. */
const MODULE_SANITARIO = 'm-sanitario';

export const MODULES: Module[] = [
  {
    id: MODULE_1,
    phase: 1,
    title: 'Boas Maneiras & Conexão',
    subtitle: 'Fase 1 · Grátis',
    description: 'Atenção ao nome, olho no olho, calma na hora da comida e regras da casa.',
    color: '#FFC72C',
    colorDark: '#E5A800',
    isFree: true,
    lessons: sequence(
      MODULE_1,
      [pick(module1Lessons, 'm1-l1'), nomeLesson, focoLesson, pick(module5Lessons, 'm5-l1'), pick(module1Lessons, 'm1-l4'), caminhaLesson],
      EXISTING_QUIZZES,
    ),
  },
  {
    id: MODULE_2,
    phase: 2,
    title: 'Comandos Essenciais',
    subtitle: 'Fase 2 · Senta, Fica, Junto, Vem',
    description: 'Vitórias rápidas: comandos que funcionam em minutos, com petisco e clicker.',
    color: '#3B5CC4',
    colorDark: '#1E3A8A',
    isFree: false,
    lessons: sequence(MODULE_2, module2Lessons, EXISTING_QUIZZES),
  },
  {
    id: MODULE_SANITARIO,
    phase: 3,
    title: 'Sanitário à Prova de Falhas',
    subtitle: 'Fase 3',
    description: 'Tapete higiênico ou quintal, rotina certa e zero bronca nos acidentes.',
    color: '#34C38F',
    colorDark: '#1E9C6E',
    isFree: false,
    lessons: sequence(
      MODULE_SANITARIO,
      [pick(module1Lessons, 'm1-l2'), areaSeguraLesson, pick(module1Lessons, 'm1-l3')],
      EXISTING_QUIZZES,
    ),
  },
  {
    id: MODULE_3,
    phase: 4,
    title: 'Passeio & Socialização',
    subtitle: 'Fase 4',
    description: 'Passeio sem puxar, rotina no calor e um mundo cheio de boas experiências.',
    color: '#F28C28',
    colorDark: '#D9721A',
    isFree: false,
    lessons: sequence(MODULE_3, [...module3Lessons, passeioCalorLesson, socializacaoLesson], EXISTING_QUIZZES),
  },
  {
    id: MODULE_5,
    phase: 5,
    title: 'Faro & Enriquecimento',
    subtitle: 'Fase 5',
    description: 'Faro e brincadeiras que cansam a mente (e salvam o sofá).',
    color: '#60A5FA',
    colorDark: '#3B82F6',
    isFree: false,
    lessons: sequence(MODULE_5, module5Lessons.filter((l) => l.id !== 'm5-l1'), EXISTING_QUIZZES),
  },
  {
    id: MODULE_4,
    phase: 6,
    title: 'Ansiedade & Autocontrole',
    subtitle: 'Fase 6',
    description: 'Calma, autocontrole e paz na porta de casa e na calçada.',
    // "Adamantium": cinza metálico
    color: '#9AA5B8',
    colorDark: '#6B7689',
    isFree: false,
    lessons: sequence(
      MODULE_4,
      [pick(module4Lessons, 'm4-l1'), pick(module4Lessons, 'm4-l2'), soltaLesson, interfoneLesson, pick(module4Lessons, 'm4-l3')],
      EXISTING_QUIZZES,
    ),
  },
];

/** Missões da trilha (as especiais ficam de fora da contagem e da ordem). */
export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id) ?? SPECIAL_LESSONS.find((l) => l.id === id);
}

export function getModuleById(id: string): Module | undefined {
  if (id === SPECIAL_MODULE_ID) return SPECIAL_MODULE;
  return MODULES.find((m) => m.id === id);
}

// ---------------------------------------------------------------------------
// Usuário, pet e planos de exemplo
// ---------------------------------------------------------------------------

export const MOCK_USER: User = {
  id: 'user-demo',
  name: 'Tutor',
  email: 'tutor@wolvdog.app',
  createdAt: new Date().toISOString(),
  dailyGoalMinutes: 10,
  weeklyGoalDays: 3,
  reminder: { enabled: false, hour: 19, minute: 0 },
  partnerCode: null,
  partnerInfo: null,
  tutorGender: null,
  tutorBirthDate: null,
};

export const MOCK_PET: Pet = {
  id: 'pet-demo',
  ownerId: MOCK_USER.id,
  name: 'Caramelo',
  breed: 'Vira-lata (SRD)',
  ageMonths: 8,
  size: 'medio',
  challenges: ['puxa_a_guia', 'pula_nas_pessoas'],
  createdAt: new Date().toISOString(),
};

/**
 * Planos do WolvDog Pro. O plano cobre 1 cão; cada cão adicional custa 50% do plano base
 * (assinatura adicional `extraPetProductId` nas lojas). Labels em services/pricing.ts.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'wolvdog_pro_annual',
    revenueCatPackageId: '$rc_annual',
    extraPetProductId: 'wolvdog_extra_pet_annual',
    period: 'annual',
    title: 'Anual',
    priceCents: 25999,
    extraPetPriceCents: 12999,
    currency: 'BRL',
    priceLabel: 'R$ 259,99/ano',
    pricePerMonthLabel: 'R$ 21,67/mês',
    trialDays: 7,
    badge: 'MELHOR VALOR',
    savingsPercent: 38,
  },
  {
    id: 'wolvdog_pro_semiannual',
    revenueCatPackageId: '$rc_six_month',
    extraPetProductId: 'wolvdog_extra_pet_semiannual',
    period: 'semiannual',
    title: 'Semestral',
    priceCents: 17999,
    extraPetPriceCents: 8999,
    currency: 'BRL',
    priceLabel: 'R$ 179,99/semestre',
    pricePerMonthLabel: 'R$ 30,00/mês',
    trialDays: 7,
    savingsPercent: 14,
  },
  {
    id: 'wolvdog_pro_monthly',
    revenueCatPackageId: '$rc_monthly',
    extraPetProductId: 'wolvdog_extra_pet_monthly',
    period: 'monthly',
    title: 'Mensal',
    priceCents: 3499,
    extraPetPriceCents: 1749,
    currency: 'BRL',
    priceLabel: 'R$ 34,99/mês',
    pricePerMonthLabel: 'R$ 34,99/mês',
    trialDays: 7,
  },
];

export const PRO_BENEFITS = [
  { icon: '📚', title: '+50 missões ilimitadas', description: 'Todas as fases desbloqueadas, com conteúdo novo todo mês.' },
  { icon: '🧠', title: 'Comportamentos complexos', description: 'Reatividade, ansiedade, latidos e destruição de objetos.' },
  { icon: '🐾', title: 'Mais de um cão', description: 'Cada cão adicional por apenas 50% do valor do plano.' },
  { icon: '🦴', title: 'Ossos Reserva em dobro', description: 'Ganhe um Osso Reserva a cada 2 semanas de meta batida.' },
] as const;
