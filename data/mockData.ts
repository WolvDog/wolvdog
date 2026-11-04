import type { Lesson, Module, Pet, SubscriptionPlan, User } from '@/types';

import { lesson, sequence } from './lessonBuilder';
import {
  areaSeguraLesson,
  caminhaLesson,
  EXISTING_QUIZZES,
  module5Lessons,
  passeioCalorLesson,
  socializacaoLesson,
} from './missionsExtra';

// ---------------------------------------------------------------------------
// FASE 1 — Boas Maneiras & Xixi no Lugar Certo (gratuita)
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
        'Com repetição, o cão entende que "Isso!" = "o que eu acabei de fazer dá prêmio". É a base de TODO o treino do WolverBark.',
      whyItWorks:
        'É condicionamento clássico: o som vira uma ponte entre o comportamento e a recompensa, permitindo marcar ações rápidas com precisão.',
    },
    practice: {
      title: 'Carregando o marcador',
      loganSpeech: 'Pega 15 petiscos bem pequenininhos (do tamanho de uma ervilha). Bora carregar esse marcador!',
      instructions: [
        'Fique em um cômodo calmo, sem outras pessoas ou brinquedos.',
        'Diga "Isso!" com voz alegre e, em até 1 segundo, entregue um petisco.',
        'Espere 3–5 segundos sem falar nada. Repita.',
        'O cão não precisa fazer nada ainda — só estamos criando a associação.',
        'Teste final: diga "Isso!" quando ele estiver olhando para outro lado. Ele virou na hora? Sucesso!',
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
        hard: 'Normal no primeiro dia! Tente um petisco mais cheiroso (frango cozido) e um lugar mais silencioso.',
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
        'Leve o cão até o tapete higiênico (ou local no quintal) com calma, de preferência na guia.',
        'Fique parado e entediante. Espere até 3 minutos sem brincar.',
        'Quando ele começar a fazer, fique em silêncio para não interromper.',
        'Assim que TERMINAR: "Isso!" + petisco especial ali mesmo, no local.',
        'Se não fizer em 3 minutos, volte e tente de novo em 10–15 minutos.',
      ],
      timerSeconds: 180,
      avoid: ['Dar o petisco só quando voltar para dentro de casa', 'Brincar antes de ele fazer'],
    },
    validation: {
      question: 'Seu cão fez xixi no lugar certo durante o treino?',
      feedback: {
        easy: 'Acertou na mosca! Repita nos 5 momentos e em uma semana vira rotina.',
        medium: 'Fez, mas demorou? Tudo bem! Com a rotina ele vai ficando mais rápido.',
        hard: 'Não rolou dessa vez — e está tudo certo. Anote o horário e tente de novo no próximo "momento".',
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
      loganSpeech: 'Vamos montar seu kit de herói da limpeza e ensaiar a reação perfeita!',
      instructions: [
        'Separe: papel toalha, limpador enzimático (ou água + vinagre branco) e um saquinho.',
        'Ensaie a frase de interrupção: um "Opa!" neutro, sem gritar.',
        'Pratique a rota: do local do acidente até o tapete higiênico, com o cão na guia.',
        'Limpe longe do cão, sem drama — ele não deve achar que é uma brincadeira.',
        'Evite produtos com amônia: o cheiro lembra urina e atrai o cão de volta.',
      ],
      timerSeconds: 120,
      avoid: ['Esfregar o focinho no xixi', 'Gritar ou bater jornal', 'Usar água sanitária pura'],
    },
    validation: {
      question: 'Você se sente preparado para reagir a um acidente?',
      loganSpeech: 'Essa é mais sobre você do que sobre o cão. Como foi?',
      feedback: {
        easy: 'Tutor nível herói! Calma e consistência são seus superpoderes.',
        medium: 'Bom! Releia a lista "Evite" mais uma vez e você estará pronto.',
        hard: 'É difícil não se frustrar, eu sei. Lembre: acidente é informação, não desobediência.',
      },
    },
    victory: {
      loganSpeech: 'Você aprendeu a lição mais difícil para humanos: paciência! Au au!',
      nextTip: 'Se os acidentes acontecem sempre no mesmo lugar, coloque o pote de comida ali — cães evitam sujar onde comem.',
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
        'Tenha petiscos no bolso antes de entrar.',
        'Entre em casa calmamente, sem falar "oi" animado.',
        'Se ele pular: vire de costas, braços cruzados, olhe para o teto.',
        'No segundo em que as 4 patas tocarem o chão: "Isso!" + petisco jogado NO CHÃO.',
        'Repita a entrada 5 vezes seguidas. As chegadas vão ficando mais calmas.',
      ],
      targetReps: 5,
      avoid: ['Empurrar o cão com o joelho', 'Fazer festa assim que entra', 'Recompensar só às vezes o pulo (visitas devem seguir a regra também!)'],
    },
    validation: {
      feedback: {
        easy: 'Que educado! Agora peça para alguém da família repetir o treino — todo mundo precisa jogar o mesmo jogo.',
        medium: 'Ele já está entendendo! Os pulos costumam até aumentar antes de diminuir. Persistência!',
        hard: 'Muita energia? Faça um passeio ou brincadeira ANTES do treino e tente de novo.',
      },
    },
    victory: {
      loganSpeech: 'Quatro patas no chão, cumprimento de herói! As chegadas em casa nunca mais vão ser um caos.',
      nextTip: 'Combine com a família: ninguém dá atenção para pulos, nem as visitas. A seguir vem o comando mais útil de todos: o Senta.',
    },
  }),
];

// ---------------------------------------------------------------------------
// FASE 2 — Comandos Básicos (Senta, Fica, Junto)
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
        'Segure o petisco no focinho do cão, deixando ele cheirar.',
        'Suba a mão devagar, passando por cima da cabeça em direção às orelhas.',
        'Quando o bumbum tocar o chão: "Isso!" + petisco.',
        'Após 5 acertos seguidos, diga "Senta" UMA vez antes de mover a mão.',
        'Nas últimas repetições, faça o gesto com a mão vazia e entregue o petisco do bolso.',
      ],
      targetReps: 10,
      timerSeconds: 240,
      avoid: ['Empurrar o bumbum para baixo', 'Repetir "senta, senta, SENTA"', 'Mão alta demais (ele vai pular)'],
    },
    validation: {
      feedback: {
        easy: 'Senta dominado! Agora peça antes de colocar a comida no pote.',
        medium: 'Está quase! Mantenha a isca mais perto do focinho.',
        hard: 'Se ele dá ré em vez de sentar, treine com as costas dele perto de uma parede.',
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
        'Peça "Senta". Mostre a palma da mão e diga "Fica".',
        'Conte 2 segundos, "Isso!" e entregue o petisco NA POSIÇÃO (ele não deve levantar).',
        'Libere com uma palavra: "Livre!" e deixe ele se mexer.',
        'Aumente: 3s, 5s, 8s, 10s. Se ele levantar, volte ao último tempo que deu certo.',
        'Use o timer abaixo para a série final de 15 segundos.',
      ],
      timerSeconds: 15,
      targetReps: 8,
      avoid: ['Chamar o cão para você no fim do "Fica"', 'Aumentar duração e distância ao mesmo tempo'],
    },
    validation: {
      feedback: {
        easy: 'Paciência de monge! Na próxima, dê 1 passo para trás (e volte para 3 segundos).',
        medium: 'Ótimo. Se ele levanta às vezes, entregue petiscos mais frequentes durante o fica.',
        hard: 'Fica é difícil mesmo! Volte para 1 segundo e suba de 1 em 1.',
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
        'Fique parado com o cão do seu lado esquerdo. Petiscos na mão esquerda, na altura da sua costura da calça.',
        'Toda vez que ele estiver alinhado à sua perna: "Isso!" + petisco ali mesmo.',
        'Dê 1 passo. Se ele acompanhar: "Isso!" + petisco.',
        'Aumente para 2, depois 3 passos. Dica: fale "Junto" ao começar a andar.',
        'Faça 10 repetições curtas dentro de casa.',
      ],
      targetReps: 10,
      avoid: ['Entregar o petisco na frente do corpo (puxa ele para frente)', 'Treinar na rua antes de dominar em casa'],
    },
    validation: {
      feedback: {
        easy: 'Dupla dinâmica! Tente fazer uma curva para a direita mantendo a posição.',
        medium: 'Ele vai aprendendo. Mais petiscos, mais frequentes, passos mais curtos.',
        hard: 'Muito agitado? Faça o treino depois de um passeio e em um corredor estreito.',
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
        'Duas pessoas, uma em cada lado do cômodo, com petiscos especiais.',
        'Pessoa A diz "Logan, vem!" (use o nome do SEU cão) com voz feliz e se agacha.',
        'Quando ele chegar: "Isso!" + petisco + segurar a coleira por 1 segundo (para ele se acostumar).',
        'Pessoa B chama em seguida. Alterne 10 vezes.',
        'Sozinho? Jogue um petisco longe e chame quando ele terminar de comer.',
      ],
      targetReps: 10,
      timerSeconds: 180,
      avoid: ['Repetir o comando várias vezes', 'Correr atrás do cão (vira brincadeira de pega-pega)'],
    },
    validation: {
      feedback: {
        easy: 'Chamado de foguete! Pratique no quintal ou em um lugar cercado.',
        medium: 'Bom! Use um petisco ainda mais gostoso só para esse comando.',
        hard: 'Comece com 1 metro de distância e se afaste aos poucos.',
      },
    },
    victory: {
      loganSpeech: 'FASE 2 CONCLUÍDA! Senta, Fica, Junto e Vem: seu cão tem um arsenal de herói!',
      nextTip: 'Próxima fase: passeios sem puxar e socialização. Vai ser leve como uma pena!',
    },
  }),
];

// ---------------------------------------------------------------------------
// FASE 3 — Passeio sem Puxar a Guia
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
        'Mostre o peitoral: "Isso!" + petisco. Repita 3x.',
        'Passe o petisco por dentro da abertura da cabeça para ele colocar o focinho sozinho.',
        'Feche o peitoral, dê 3 petiscos seguidos, e retire.',
        'Coloque a guia e caminhe 1 minuto dentro de casa, sem rumo, recompensando quando ele estiver perto.',
      ],
      timerSeconds: 60,
      targetReps: 3,
    },
    validation: {
      feedback: {
        easy: 'Pronto para a rua! Uniforme aprovado.',
        medium: 'Ele aceita, mas com dúvidas? Repita a parte do focinho por mais 2 dias.',
        hard: 'Vá mais devagar: só mostre o peitoral e recompense, por alguns dias, sem colocar.',
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
        'Escolha uma rua tranquila ou o corredor do prédio.',
        'Ande normalmente. Guia esticou? PARE. Fique em silêncio.',
        'Guia ficou em "J"? "Isso!" + petisco ao lado da sua perna + volte a andar.',
        'Se ficar muito tempo parado, dê meia-volta (prévia da próxima missão!).',
        'Encerre com 1 minuto de "passeio livre" para farejar à vontade.',
      ],
      timerSeconds: 300,
      avoid: ['Dar trancos na guia', 'Seguir andando "só desta vez" quando ele puxa'],
    },
    validation: {
      feedback: {
        easy: 'Guia em J o tempo todo? Você é uma lenda!',
        medium: 'Ótimo! As primeiras sessões são lentas mesmo. Persistência vence.',
        hard: 'Muita distração na rua? Treine mais 2 dias no corredor ou quintal.',
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
        'Caminhe em linha reta com guia frouxa.',
        'Diga "Vamos!" com voz animada e vire 180° para o lado oposto ao cão.',
        'Quando ele alcançar sua perna: "Isso!" + petisco.',
        'Faça 8 meias-voltas em 5 minutos, em momentos aleatórios.',
        'Bônus: inclua curvas de 90° quando ele já estiver craque.',
      ],
      targetReps: 8,
      timerSeconds: 300,
    },
    validation: {
      feedback: {
        easy: 'Cão grudado em você! O passeio de vocês já é outro.',
        medium: 'Ele ainda se atrasa? Avise mais cedo e vire mais devagar.',
        hard: 'Use petiscos mais valiosos na rua — lá a concorrência é grande!',
      },
    },
    victory: {
      loganSpeech: 'Meia-volta dominada! Agora é você quem guia o passeio. É disso que eu gosto!',
      nextTip: 'A seguir: como passear com segurança nos dias quentes.',
    },
  }),
];

// ---------------------------------------------------------------------------
// FASE 4 — Controle de Ansiedade & Autocontrole
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
        'Coloque um tapete ou toalha no chão e sente-se ao lado, em silêncio.',
        'Pisou no tapete? Petisco colocado no tapete, entre as patas.',
        'Deitou? Petisco. Deitou de lado ou suspirou? Petisco calmo + "bom" bem baixinho.',
        'Espace cada vez mais os petiscos. A ideia é ele relaxar, não ficar agitado.',
        'Encerre retirando o tapete enquanto ele ainda está calmo.',
      ],
      timerSeconds: 300,
      avoid: ['Usar voz animada', 'Fazer sessões longas demais no começo'],
    },
    validation: {
      feedback: {
        easy: 'Zen total! Leve o tapete para outro cômodo amanhã.',
        medium: 'Ele relaxou um pouco? Já é vitória. Faça depois de um passeio.',
        hard: 'Ansioso demais? Tente após atividade física e com um mordedor de longa duração.',
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
        'Feche um petisco comum na mão e mostre ao cão.',
        'Ele vai lamber, cheirar, mordiscar. Ignore e espere.',
        'No segundo em que ele afastar o focinho: "Isso!" + petisco TOP da OUTRA mão.',
        'Após 5 acertos, diga "Deixa" antes de mostrar a mão.',
        'Nível 2: mão aberta. Se ele avançar, feche a mão.',
      ],
      targetReps: 10,
      timerSeconds: 240,
      avoid: ['Entregar o petisco que ele tinha que deixar', 'Dizer "deixa" várias vezes'],
    },
    validation: {
      feedback: {
        easy: 'Autocontrole de mestre! Tente com o petisco no chão, protegido pelo seu pé.',
        medium: 'Ele já entende que afastar funciona. Mais 2 sessões e vira hábito.',
        hard: 'Use um petisco menos interessante na mão fechada para facilitar.',
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
        'Dê um brinquedo recheável (ex.: Kong com patê) ao cão.',
        'Pegue as chaves, saia pela porta e feche. Conte 5 segundos e volte.',
        'Entre sem falar nada, guarde as chaves, siga sua vida.',
        'Repita aumentando: 10s, 20s, 30s, 1min. Se ele chorar, volte ao tempo anterior.',
        'Anote o maior tempo sem sinais de ansiedade (choro, arranhar, latir).',
      ],
      timerSeconds: 60,
      targetReps: 5,
      avoid: ['Despedidas longas e emotivas', 'Voltar enquanto ele está chorando (espere 2s de silêncio)'],
    },
    validation: {
      feedback: {
        easy: 'Ele nem ligou? Perfeito! Aumente o tempo aos poucos ao longo da semana.',
        medium: 'Pequenos sinais de ansiedade são normais. Mantenha o tempo até ficar fácil.',
        hard: 'Se a ansiedade for intensa, consulte um veterinário comportamentalista. Eu te ajudo enquanto isso!',
      },
    },
    victory: {
      loganSpeech: 'TODAS AS FASES COMPLETAS! Você é oficialmente um Tutor Herói WolverBark! AUUUUU!',
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

export const MODULES: Module[] = [
  {
    id: MODULE_1,
    phase: 1,
    title: 'Boas Maneiras & Xixi no Lugar Certo',
    subtitle: 'Fase 1 · Grátis',
    description: 'A base de tudo: comunicação, banheiro, área segura, Senta e Caminha.',
    color: '#FFC72C',
    colorDark: '#E5A800',
    isFree: true,
    lessons: sequence(
      MODULE_1,
      [
        pick(module1Lessons, 'm1-l1'),
        pick(module1Lessons, 'm1-l2'),
        pick(module1Lessons, 'm1-l3'),
        areaSeguraLesson,
        pick(module1Lessons, 'm1-l4'),
        // "Senta" e "Caminha" são prioritários e ficam na fase gratuita.
        pick(module2Lessons, 'm2-l1'),
        caminhaLesson,
      ],
      EXISTING_QUIZZES,
    ),
  },
  {
    id: MODULE_2,
    phase: 2,
    title: 'Comandos Básicos',
    subtitle: 'Fase 2 · Fica, Junto, Vem',
    description: 'Os comandos clássicos que todo cão educado precisa saber.',
    color: '#3B5CC4',
    colorDark: '#1E3A8A',
    isFree: false,
    lessons: sequence(MODULE_2, module2Lessons.filter((l) => l.id !== 'm2-l1'), EXISTING_QUIZZES),
  },
  {
    id: MODULE_3,
    phase: 3,
    title: 'Passeio & Socialização',
    subtitle: 'Fase 3',
    description: 'Passeio sem puxar, rotina no calor e um mundo cheio de boas experiências.',
    color: '#F28C28',
    colorDark: '#D9721A',
    isFree: false,
    lessons: sequence(MODULE_3, [...module3Lessons, passeioCalorLesson, socializacaoLesson], EXISTING_QUIZZES),
  },
  {
    id: MODULE_5,
    phase: 4,
    title: 'Alimentação & Enriquecimento',
    subtitle: 'Fase 4',
    description: 'Refeições com calma, faro e brincadeiras que cansam a mente.',
    color: '#60A5FA',
    colorDark: '#3B82F6',
    isFree: false,
    lessons: sequence(MODULE_5, module5Lessons, EXISTING_QUIZZES),
  },
  {
    id: MODULE_4,
    phase: 5,
    title: 'Ansiedade & Autocontrole',
    subtitle: 'Fase 5',
    description: 'Calma, paciência e confiança para lidar com o mundo.',
    // "Adamantium": cinza metálico
    color: '#9AA5B8',
    colorDark: '#6B7689',
    isFree: false,
    lessons: sequence(MODULE_4, module4Lessons, EXISTING_QUIZZES),
  },
];

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons);

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getModuleById(id: string): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

// ---------------------------------------------------------------------------
// Usuário, pet e planos de exemplo
// ---------------------------------------------------------------------------

export const MOCK_USER: User = {
  id: 'user-demo',
  name: 'Tutor',
  email: 'tutor@wolverbark.app',
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
 * Planos do WolverBark Pro. O plano cobre 1 cão; cada cão adicional custa 50% do plano base
 * (assinatura adicional `extraPetProductId` nas lojas). Labels em services/pricing.ts.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'wolverbark_pro_annual',
    revenueCatPackageId: '$rc_annual',
    extraPetProductId: 'wolverbark_extra_pet_annual',
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
    id: 'wolverbark_pro_semiannual',
    revenueCatPackageId: '$rc_six_month',
    extraPetProductId: 'wolverbark_extra_pet_semiannual',
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
    id: 'wolverbark_pro_monthly',
    revenueCatPackageId: '$rc_monthly',
    extraPetProductId: 'wolverbark_extra_pet_monthly',
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
