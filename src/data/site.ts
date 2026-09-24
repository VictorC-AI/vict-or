/* =====================================================================
   TODO O CONTEÚDO DO SITE MORA AQUI.
   Pra trocar texto, projeto, link ou tecnologia, edite só este arquivo —
   nenhum componente precisa ser mexido.

   Procure por CONFERIR: são os pontos que ainda dependem de você.
   ===================================================================== */

/**
 * 'jogo' continua aqui de propósito, mesmo sem projeto de jogo publicado.
 * No dia em que você entregar o primeiro, é só adicionar o projeto abaixo
 * com category: 'jogo' — o filtro "Jogos" aparece sozinho na seção
 * Trabalhos, porque ele é montado a partir das categorias que têm projeto.
 */
export type Category = 'site' | 'sistema' | 'jogo' | 'ecommerce'

export interface Project {
  /** usado como key e na ordem da grade; o primeiro vira destaque */
  slug: string
  title: string
  /** uma linha, aparece no card */
  summary: string
  year: string
  category: Category
  /** estado real do projeto — some do card se ficar vazio */
  status?: string
  stack: string[]
  /** blocos do detalhe */
  problem: string
  solution: string
  /** o "como ficou" — opcional, mas é o bloco que mais convence */
  result?: string
  /** o que o sistema faz, item a item */
  features?: { title: string; body: string }[]
  /** fecha a lista acima com o que não virou item */
  featuresNote?: string
  /** onde roda e como se mantém no ar */
  infra?: string
  /** por que foi construído assim — o que separa dev de executor */
  decisions?: { title: string; body: string }[]
  /** uma linha sob a lista de tecnologias, pra detalhe que chip não cabe */
  stackNote?: string
  /** o que foi seu neste projeto */
  role?: string
  links?: { label: string; href: string }[]
  /** caminho em /public, ex: '/shots/beacreative.jpg'. Vazio = capa gerada. */
  image?: string
  /**
   * Logo do cliente — SVG (ideal) ou PNG com fundo transparente, em cor
   * que leia sobre o creme. Some do card se ficar vazio.
   */
  logo?: string
  /**
   * Outras telas, mostradas dentro do detalhe. A legenda é obrigatória:
   * print sem legenda o visitante não sabe o que está olhando.
   */
  gallery?: { src: string; caption: string }[]
}

export const profile = {
  name: 'Victor Carvalho',
  wordmark: 'vict.<OR>',
  role: 'Desenvolvedor full stack',
  email: 'victordevv.ui@gmail.com',
  /** deixe '' pra esconder o link no rodapé */
  github: 'https://github.com/VictorC-AI',
  linkedin:
    'https://www.linkedin.com/in/victor-iago-barros-carvalho-b109873b3',
  instagram: '',
  /** WhatsApp em formato internacional, só números. '' esconde o botão. */
  whatsapp: '',
}

export const hero = {
  /** cada string é uma linha do título */
  headline: ['Eu construo', 'a coisa', 'inteira.'],
  lead:
    'Sites e sistemas escritos do zero — do primeiro wireframe ao deploy. Sem tema comprado, sem página que demora seis segundos pra abrir.',
  primaryCta: { label: 'Ver o que eu fiz', href: '#trabalhos' },
  secondaryCta: { label: 'Começar um projeto', href: '#contato' },
  facts: [
    { value: 'Unicamp FT', label: 'Sistemas de Informação' },
    { value: 'LAEG-BIO', label: 'bolsista no laboratório' },
    { value: 'Dois', label: 'projetos no ar hoje' },
  ],
}

export const services = [
  {
    id: 'site' as Category,
    name: 'Sites',
    pitch:
      'Institucional, portfólio ou landing page que carrega rápido, aparece no Google e você mesmo consegue atualizar.',
    includes: [
      'Design sob medida, nada de template',
      'Feito em cima da sua identidade visual',
      'Abre rápido no celular, não só no seu notebook',
      'Formulário e agendamento que realmente chegam',
    ],
    deliverable: 'De 2 a 4 semanas',
  },
  {
    id: 'sistema' as Category,
    name: 'Sistemas',
    pitch:
      'A planilha que já não dá conta virando sistema: cadastro, login por pessoa, histórico de quem mexeu no quê.',
    includes: [
      'Login com níveis de acesso por função',
      'Histórico de movimentação que não se apaga',
      'Funciona no celular, no balcão e no laboratório',
      'Relatório e etiqueta QR quando o processo pede',
    ],
    deliverable: 'De 4 a 10 semanas',
  },
  {
    id: 'ecommerce' as Category,
    name: 'E-commerce',
    pitch:
      'Loja com checkout, Pix e controle de estoque, montada na sua marca. Área que estou abrindo — o preço acompanha.',
    includes: [
      'Checkout com Pix, cartão e boleto',
      'Controle de estoque e pedidos',
      'Frete calculado pelos Correios',
      'Montada na sua identidade, não num tema pronto',
    ],
    deliverable: 'De 4 a 10 semanas',
  },
]

export const projects: Project[] = [
  {
    slug: 'beacreative',
    title: 'BeaCreative',
    summary:
      'Site institucional com portfólio, planos e agendamento integrado — do design ao deploy.',
    year: '2026',
    category: 'site',
    status: 'No ar',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'Cloudflare Pages',
      'Calendly',
      'ffmpeg',
    ],
    stackNote:
      'Tipografia em Adobe Fonts e Google Fonts. Indexação verificada no Google Search Console.',
    problem:
      'A beacreative.co existia só dentro do Instagram. Todo cliente novo chegava pelo link na bio, e a partir dali tudo acontecia no direct: mandar exemplos de trabalho, explicar o que estava incluso em cada plano, combinar um horário pra conversar.\n\nIsso custa três coisas ao mesmo tempo. Tempo, porque a mesma explicação é repetida em toda conversa. Credibilidade, porque um perfil não passa a mesma segurança que um site próprio na hora de fechar contrato. E oportunidade, porque quem chega fora do horário comercial, ou quem só queria dar uma olhada antes de puxar assunto, não tinha pra onde ir.',
    solution:
      'Ele transforma o que era conversa manual em três coisas que funcionam sozinhas:',
    features: [
      {
        title: 'Mostra o trabalho',
        body: 'Oito cases com capa e vídeo, organizados em duas camadas — uma barra de stories no topo, pra quem quer passar o olho rápido, e cards grandes embaixo, pra quem quer se aprofundar. Clicou, abre o vídeo.',
      },
      {
        title: 'Explica os planos sem conversa',
        body: 'Quatro planos com frequência e entregáveis lado a lado, mais o que está incluso em todos. A pessoa se posiciona sozinha antes do primeiro contato.',
      },
      {
        title: 'Agenda sem intermediário',
        body: 'Calendly embutido, mostrando os horários reais do Google Calendar dela. O cliente escolhe, preenche e recebe o link do Meet por e-mail. Nenhuma mensagem trocada até a reunião existir.',
      },
    ],
    featuresNote:
      'Um FAQ com 11 perguntas fecha as dúvidas que sobravam, e a política de privacidade e os termos de uso deixam a operação em ordem com a LGPD.',
    decisions: [
      {
        title: 'Sem framework, de propósito',
        body: 'É um site de uma página, sem estado, sem login, sem dados dinâmicos. React ou Next resolveriam problemas que este projeto não tem, e em troca cobrariam um passo de build e uma pasta de dependências pra manter. São três arquivos: index.html, style.css, script.js.',
      },
      {
        title: 'Conteúdo separado do código',
        body: 'Os cases e as perguntas do FAQ vivem em dois arrays no topo do JavaScript, e o HTML é gerado a partir deles. Adicionar um trabalho novo é acrescentar uma linha, não mexer na estrutura da página.',
      },
      {
        title: 'Design tokens em CSS puro',
        body: 'Paleta, tipografia, escala de espaçamento e curva de animação ficam em variáveis no :root. A identidade da marca muda em um lugar só.',
      },
      {
        title: 'Vídeos comprimidos na mão',
        body: 'Os arquivos originais do portfólio eram grandes demais pra web. Passei todos por ffmpeg com -crf 32 e escala para 480p, e extraí as capas dos próprios vídeos — o peso caiu sem que a qualidade percebida mudasse no tamanho em que eles aparecem.',
      },
      {
        title: 'Degradação prevista',
        body: 'Se o Calendly não carregar em seis segundos, um temporizador substitui o embed por um botão que abre a agenda em aba nova. A pessoa nunca fica olhando pra um espaço vazio.',
      },
      {
        title: 'Acessibilidade e movimento',
        body: 'O carrossel de logos do topo respeita prefers-reduced-motion e pausa quando a aba sai de foco ou o bloco sai da tela — animação rodando fora da vista é bateria gasta à toa.',
      },
    ],
    infra:
      'Deploy automático no Cloudflare Pages, disparado por push no GitHub. Domínio .com.br registrado no Registro.br com o DNS delegado pra Cloudflare. SSL em Full (strict), HTTPS forçado.\n\nCabeçalhos de segurança via arquivo _headers — HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy e X-Frame-Options — com uma Content-Security-Policy desenhada em cima do que o site realmente carrega, testada em preview antes de ir pra produção.',
    role: 'Tudo. Design, código, compressão de mídia, configuração de domínio e DNS, deploy, cabeçalhos de segurança, documentos de LGPD.',
    links: [{ label: 'Abrir o site', href: 'https://beacreativeco.com.br' }],
    image: '/shots/beacreative.jpg',
    logo: '/logos/beacreative.svg',
    gallery: [
      {
        src: '/shots/bea-planos.jpg',
        caption: 'Os quatro planos, com o que cada um entrega',
      },
      {
        src: '/shots/bea-devweb.jpg',
        caption: 'A seção de desenvolvimento web, onde assino o trabalho',
      },
      {
        src: '/shots/bea-agenda.jpg',
        caption: 'Agendamento pelo Calendly, dentro da própria página',
      },
    ],
  },
  {
    slug: 'laeg-estoque',
    title: 'LAEG Estoque',
    summary:
      'Controle de estoque do LAEG-BIO, laboratório de ecotoxicologia da Unicamp.',
    year: '2026',
    category: 'sistema',
    status: 'No ar',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'Vite',
      'Supabase',
      'PostgreSQL',
      'Cloudflare Workers',
      'PWA',
    ],
    stackNote:
      'JavaScript sem framework. No Supabase: autenticação, Row Level Security, Realtime e migrations versionadas. Deploy contínuo em Cloudflare Workers via GitHub. Geração e leitura de QR code acontecem no próprio navegador.',
    problem:
      'Num laboratório de pesquisa, o estoque é compartilhado por técnicos e por alunos que se revezam a cada semestre. O controle dependia de memória e de anotações soltas. Ninguém sabia com certeza o que tinha, onde estava ou quando ia acabar. Reagentes venciam sem ninguém perceber, itens eram comprados em duplicidade, e a informação ia embora junto com cada aluno que saía.',
    solution:
      'Um sistema sob medida para a rotina do laboratório — construído em cima de como as coisas são contadas na bancada, não de como um banco de dados prefere guardá-las.',
    features: [
      {
        title: 'Cadastro pensado pra bancada',
        body: 'Cada item é registrado do jeito que é contado na prateleira: caixa › pacote › unidade, ou frasco com conteúdo (três frascos de 500 g). Reagentes têm marca, pureza e marcação de controlado.',
      },
      {
        title: 'Localização física',
        body: 'Os itens ficam agrupados por estante e prateleira, com filtros independentes. O sistema entende as várias formas de escrever o mesmo lugar — "Estante 2, prat. B" e "Estante 02 / Prateleira B" são o mesmo ponto.',
      },
      {
        title: 'Alertas que fazem sentido',
        body: 'O estoque baixo considera a grandeza de cada item: 1 L não é pouco, 1 g pode ser. O mínimo é configurável por item, e o painel Panorama reúne o que precisa de atenção — estoque baixo, validade próxima e itens sem local.',
      },
      {
        title: 'Busca tolerante',
        body: 'Nome, marca, pureza ou local, em qualquer ordem, sem se preocupar com acento.',
      },
      {
        title: 'QR code por item',
        body: 'Etiquetas imprimíveis com a identidade do laboratório. Escaneando pelo celular, a pessoa abre o item e registra a retirada ali mesmo, de pé na frente da prateleira.',
      },
      {
        title: 'Rastreabilidade',
        body: 'Toda retirada e ajuste fica registrado com operador, data e hora. Cadastros de usuário passam por aprovação, e itens podem ser arquivados sem perder o histórico.',
      },
      {
        title: 'Tempo real',
        body: 'Quando alguém dá baixa no celular, a tela de todo mundo atualiza sozinha.',
      },
    ],
    decisions: [
      {
        title: 'Continuidade institucional como requisito',
        body: 'As contas técnicas pertencem ao laboratório, não a um aluno. O projeto tem manual de manutenção, plano de sucessão e documentação técnica para o próximo responsável.',
      },
      {
        title: 'Mudanças seguras',
        body: 'O desenvolvimento acontece numa branch separada, com link de pré-visualização, e só vai para produção depois de conferido. Alterações no banco são versionadas em migrations e revisadas antes de aplicar.',
      },
      {
        title: 'Identidade visual com o repertório do laboratório',
        body: 'A malha de fundo reproduz a câmara de Neubauer, usada em contagem no microscópio. O Panorama segue a metáfora da lâmina, a ficha do item é o rótulo do frasco, e o indicador de nível lembra uma proveta graduada. A Daphnia, organismo-modelo em ecotoxicologia, é o símbolo do app.',
      },
    ],
    role: 'Levantei os requisitos com a equipe técnica do laboratório, defini a arquitetura e as regras de negócio, conduzi o design de interface e cuidei do deploy, da documentação e do plano de manutenção. O código foi desenvolvido com apoio de IA (Claude Code), sob minha direção e revisão.',
    links: [
      {
        label: 'Abrir o sistema',
        href: 'https://estoque-de-produtos.laegestoque.workers.dev/',
      },
    ],
    image: '/shots/laeg-estoque.jpg',
    logo: '/logos/laeg-bio.png',
    gallery: [
      {
        src: '/shots/laeg-panorama.jpg',
        caption:
          'Painel de abertura: estoque baixo, validade e composição do acervo',
      },
      {
        src: '/shots/laeg-qr.jpg',
        caption: 'Etiquetas QR geradas em lote, prontas pra impressão',
      },
      {
        src: '/shots/laeg-login.jpg',
        caption: 'Entrada com e-mail do laboratório e dois níveis de acesso',
      },
    ],
  },
]

export const stack = [
  {
    group: 'Uso hoje',
    items: [
      'HTML',
      'CSS',
      'JavaScript',
      'Python',
      'Supabase',
      'Cloudflare Workers',
      'Git',
    ],
  },
  {
    group: 'Aprendendo agora',
    items: ['React', 'TypeScript', 'Tailwind', 'Vite'],
  },
]

export const about = {
  title: 'Sobre',
  paragraphs: [
    'Sou Victor. Curso Sistemas de Informação na Unicamp FT e sou bolsista no LAEG-BIO, laboratório de ecotoxicologia — foi lá dentro que nasceu o sistema de estoque que está aqui em cima, sem ninguém ter pedido.',
    'Aprendo linguagem nova pelo gosto de aprender, e o assunto que mais me puxa é cibersegurança. Mas o motivo de eu escrever código é mais simples que isso: gosto de olhar uma dor de quem está perto e devolver alguma coisa que tire aquele peso. Foi assim no laboratório, foi assim no site da agência da Beatriz.',
    'Trabalho do início ao fim: converso com você pra entender o problema, desenho, escrevo, publico e fico por perto depois que sobe.',
    'O próximo terreno que eu quero pisar é jogo de navegador. Ainda não entreguei nenhum — no dia em que entregar, ele aparece aqui em cima.',
  ],
  principles: [
    'Começo pela dor, não pela tecnologia',
    'Nada vai pro ar sem passar no celular',
    'Você recebe o código, não só o site',
    'Explico decisão técnica em português',
  ],
}

export const contact = {
  title: 'Vamos construir',
  lead:
    'Me conte o que você quer resolver. Respondo em até um dia útil com um caminho, um prazo e um preço — ou com o motivo de eu não ser a pessoa certa pra esse projeto.',
  /**
   * Onde o formulário entrega a mensagem.
   *
   * Vazio: o botão abre o e-mail do visitante já preenchido — e só chega
   * em você se ele clicar em enviar lá também. Serve de emergência, não
   * de solução.
   *
   * Web3Forms (grátis, sem criar conta — a chave chega por e-mail):
   *   formEndpoint: 'https://api.web3forms.com/submit'
   *   formHiddenFields: { access_key: 'sua-chave-aqui' }
   *
   * Formspree (precisa de conta):
   *   formEndpoint: 'https://formspree.io/f/SEU-ID'
   *   formHiddenFields: {}
   */
  formEndpoint: 'https://api.web3forms.com/submit',
  /** campos extras que o serviço exige, enviados junto */
  formHiddenFields: {
    access_key: '3509b54a-6b8c-401e-a4d8-2e211c637f3c',
  } as Record<string, string>,
  budgets: ['Até R$ 3 mil', 'R$ 3 a 8 mil', 'R$ 8 a 20 mil', 'Ainda não sei'],
}

export const nav = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Trabalhos', href: '#trabalhos' },
  { label: 'Stack', href: '#stack' },
  { label: 'Sobre', href: '#sobre' },
]

export const categoryLabel: Record<Category, string> = {
  site: 'Site',
  sistema: 'Sistema',
  jogo: 'Jogo',
  ecommerce: 'E-commerce',
}
