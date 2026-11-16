/**
 * Textos legais do WolvDog (política de privacidade, termos de uso e exclusão de conta).
 * Publicados no app e na web (wolvdog.expo.app/privacidade, /termos-de-uso, /excluir-conta): as lojas exigem links públicos.
 * RASCUNHO: revisar com advogado(a) ou contador(a) antes do lançamento nas lojas.
 */
export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDoc {
  title: string;
  updatedAt: string; // AAAA-MM-DD
  intro: string;
  sections: LegalSection[];
}

export const COMPANY = {
  brand: 'WolvDog',
  name: 'Wolv Serviços e Tecnologia',
  cnpj: '46.042.371/0001-37',
  email: 'contato@wolvdog.com',
  city: 'Uberaba/MG',
};

const CONTACT = `Fale com a gente pelo e-mail ${COMPANY.email}.`;

export const PRIVACY_POLICY: LegalDoc = {
  title: 'Política de Privacidade',
  updatedAt: '2026-11-16',
  intro:
    `O ${COMPANY.brand} é um app de treino para cães, oferecido pela ${COMPANY.name} (CNPJ ${COMPANY.cnpj}). ` +
    'Esta política explica quais dados coletamos, para que usamos e como você controla seus dados, conforme a Lei Geral de Proteção de Dados (LGPD).',
  sections: [
    {
      title: 'Dados que coletamos',
      bullets: [
        'Conta: seu e-mail, usado para entrar com um código.',
        'Tutor: nome, gênero e data de nascimento informados no cadastro.',
        'Cão: nome, sexo, raça, idade, porte, peso, nível de energia, comandos que já sabe e desafios de comportamento.',
        'Uso do app: missões cumpridas, garras, sequência semanal, diário de comportamento, guias lidos, meta semanal e horário do lembrete.',
        'Código de parceiro, se você usar um (por exemplo, de uma creche).',
        'Aparelho: um identificador para enviar notificações, se você permitir.',
        'Assinatura: se você é assinante do plano Pro. O pagamento é feito pela App Store ou pelo Google Play; não recebemos dados do seu cartão.',
      ],
      paragraphs: ['A foto do cão fica apenas no seu aparelho e não é enviada para nossos servidores.'],
    },
    {
      title: 'Para que usamos',
      bullets: [
        'Fazer o app funcionar: salvar seu progresso e sincronizar entre aparelhos.',
        'Personalizar o treino e os textos, como o nome do seu cão nas missões.',
        'Enviar lembretes e avisos sobre o treino, se você permitir notificações.',
        'Entender, de forma agregada, como o app é usado, para melhorar o conteúdo e planejar campanhas.',
        'Liberar benefícios de parceiros quando você informa um código.',
        'Responder suas mensagens de suporte.',
      ],
      paragraphs: [
        'As bases legais são a execução do serviço que você contratou, o nosso legítimo interesse em melhorar o app e, para notificações, o seu consentimento, que pode ser retirado a qualquer momento nos ajustes do celular.',
      ],
    },
    {
      title: 'Com quem compartilhamos',
      paragraphs: ['Não vendemos seus dados. Usamos empresas que processam dados em nosso nome, apenas para o app funcionar:'],
      bullets: [
        'Supabase: banco de dados e login (servidores em São Paulo).',
        'Expo: hospedagem da versão web e envio de notificações.',
        'Google Firebase: entrega de notificações no Android.',
        'Apple e Google: lojas de aplicativos e pagamentos da assinatura.',
      ],
    },
    {
      title: 'Transferência internacional',
      paragraphs: [
        'Alguns desses serviços podem processar dados fora do Brasil, com as garantias exigidas pela LGPD.',
      ],
    },
    {
      title: 'Por quanto tempo guardamos',
      paragraphs: [
        'Guardamos seus dados enquanto sua conta existir. Quando você exclui a conta, apagamos os dados na hora; cópias de segurança são descartadas em até 30 dias.',
      ],
    },
    {
      title: 'Seus direitos',
      paragraphs: [
        'Você pode pedir acesso, correção, portabilidade ou exclusão dos seus dados, e saber com quem eles são compartilhados. ' +
          'A exclusão pode ser feita direto no app, em Meu Pet → Conta → Excluir conta e dados. ' +
          CONTACT,
      ],
    },
    {
      title: 'Público do app',
      paragraphs: ['O WolvDog é destinado a maiores de 18 anos. Não coletamos de propósito dados de crianças.'],
    },
    {
      title: 'Segurança',
      paragraphs: [
        'Os dados trafegam com criptografia, e cada pessoa só tem acesso aos próprios dados no banco. Nenhum sistema é infalível; se houver um incidente relevante, avisaremos você e a autoridade de proteção de dados.',
      ],
    },
    {
      title: 'Encarregado e contato',
      paragraphs: [`Encarregado pelo tratamento de dados: ${COMPANY.name}, pelo e-mail ${COMPANY.email}.`],
    },
    {
      title: 'Mudanças nesta política',
      paragraphs: ['Se esta política mudar, atualizamos a data abaixo e avisamos no app quando a mudança for importante.'],
    },
  ],
};

export const TERMS_OF_USE: LegalDoc = {
  title: 'Termos de Uso',
  updatedAt: '2026-11-16',
  intro: `Estes termos valem para o uso do ${COMPANY.brand}, oferecido pela ${COMPANY.name} (CNPJ ${COMPANY.cnpj}). Ao usar o app, você concorda com eles.`,
  sections: [
    {
      title: 'O que é o WolvDog',
      paragraphs: [
        'Um app de treino com missões curtas de reforço positivo, um guia de dúvidas do dia a dia e acompanhamento do progresso do seu cão.',
      ],
    },
    {
      title: 'Conteúdo educativo, não substitui profissionais',
      paragraphs: [
        'As orientações do app são educativas e não substituem a consulta com veterinário nem o acompanhamento de um adestrador. ' +
          'Em caso de doença, ferimento, agressividade ou emergência, procure um profissional.',
      ],
    },
    {
      title: 'Sua responsabilidade com o cão',
      paragraphs: [
        'Você é responsável pela segurança e pelo bem-estar do seu cão e de outras pessoas durante os treinos. Respeite os limites dele e interrompa o treino se ele mostrar sinais de estresse ou dor.',
      ],
    },
    {
      title: 'Conta',
      paragraphs: [
        'Você entra com seu e-mail e um código enviado a ele. Mantenha seu e-mail seguro. Você pode excluir a conta a qualquer momento pelo app.',
      ],
    },
    {
      title: 'Plano Pro e assinatura',
      bullets: [
        'A primeira fase é gratuita; as demais fazem parte do plano Pro.',
        'O Pro é uma assinatura com renovação automática, cobrada pela App Store ou pelo Google Play na conta da loja.',
        'O teste grátis, quando oferecido, vira assinatura paga ao fim do período, a menos que você cancele antes.',
        'Você cancela quando quiser nas assinaturas da loja do celular; o acesso continua até o fim do período já pago.',
        'Reembolsos seguem as regras da App Store e do Google Play.',
      ],
    },
    {
      title: 'Códigos de parceiros',
      paragraphs: [
        'Benefícios de parceiros (creches, clínicas, adestradores) seguem as condições divulgadas em cada código e podem ser encerrados pelo parceiro.',
      ],
    },
    {
      title: 'Uso permitido',
      paragraphs: [
        'Não é permitido copiar, revender ou distribuir o conteúdo do app, nem tentar acessar dados de outras pessoas ou atrapalhar o funcionamento do serviço.',
      ],
    },
    {
      title: 'Propriedade intelectual',
      paragraphs: [`Marca, mascote, textos, ilustrações e sons do ${COMPANY.brand} pertencem à ${COMPANY.name}.`],
    },
    {
      title: 'Limitação de responsabilidade',
      paragraphs: [
        'Fazemos o possível para o app funcionar bem, mas ele pode ter falhas ou ficar fora do ar. Os resultados do treino dependem de cada cão e da prática do tutor.',
      ],
    },
    {
      title: 'Mudanças e foro',
      paragraphs: [
        `Podemos atualizar estes termos e avisaremos no app quando a mudança for importante. Fica eleito o foro da comarca de ${COMPANY.city}, ressalvados os direitos do consumidor. ${CONTACT}`,
      ],
    },
  ],
};

export const DELETE_ACCOUNT: LegalDoc = {
  title: 'Excluir conta e dados',
  updatedAt: '2026-11-16',
  intro: 'Você pode excluir sua conta do WolvDog e todos os dados dela a qualquer momento.',
  sections: [
    {
      title: 'Pelo app',
      bullets: [
        'Abra o WolvDog e entre na sua conta.',
        'Toque em Meu Pet e role até Conta.',
        'Toque em Excluir conta e dados e confirme.',
      ],
    },
    {
      title: 'Sem o app',
      paragraphs: [
        `Envie um e-mail para ${COMPANY.email}, a partir do e-mail da sua conta, com o assunto "Excluir conta". Concluímos a exclusão em até 7 dias e confirmamos por e-mail.`,
      ],
    },
    {
      title: 'O que é apagado',
      paragraphs: [
        'Sua conta, o perfil do tutor e do cão, missões, garras, sequência, diário de comportamento e o identificador de notificações. Cópias de segurança são descartadas em até 30 dias.',
        'A assinatura do Pro não é cancelada automaticamente: cancele também na App Store ou no Google Play.',
      ],
    },
  ],
};
