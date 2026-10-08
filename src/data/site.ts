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
  /**
   * Vitrine com aparelhos e anotações. Quando existe, substitui a gallery
   * no detalhe; quem não tiver showcase continua mostrando a gallery.
   */
  showcase?: ShowcaseBlock[]
  /** capa desenhada do card; sem ela, o card usa `image` como antes */
  cover?: Cover
}

/**
 * Capa do card: um molde só, configurado por projeto.
 * sparkle = ✦ espalhados · neubauer = malha da câmara de contagem · dots = grade de pontos
 */
export interface Cover {
  /** bg = fundo, ink = cor do desenho do padrão, accent = destaque */
  palette: { bg: string; ink: string; accent: string }
  pattern: 'sparkle' | 'neubauer' | 'dots'
  /** tela do notebook (16:9). Sem ela, a capa mostra só o celular. */
  laptop?: string
  /** tela do celular (390×844) */
  phone: string
  phoneWidths?: number[]
  /** selo pequeno junto ao celular, ex: '✦ Aprovado' */
  badge?: string
  /**
   * Logo do banner no topo do detalhe, em versão que contraste com `palette.bg`.
   * Vazio = usa o `logo` do projeto.
   */
  bannerLogo?: string
}

export type Device = 'phone' | 'laptop'

/** Retângulo em % da tela do aparelho (0 a 100), a partir do canto superior esquerdo. */
export interface Area {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Com `area`, o marcador vai sozinho pro canto de fora do destaque
 * (x/y continuam valendo pra forçar outra posição). Sem `area`, x/y
 * são obrigatórios. Valores fora de 0–100 põem o marcador na moldura.
 */
export type Annotation = {
  title: string
  body: string
} & (
  | {
      /** posição do marcador em % da tela */
      x: number
      y: number
      area?: undefined
      padding?: undefined
    }
  | {
      x?: number
      y?: number
      /** o conteúdo destacado, medido justo em % da tela */
      area: Area
      /** folga em px entre o conteúdo e o contorno (padrão 7) */
      padding?: number
    }
)

export interface Screen {
  device: Device
  /** .jpg, .png, .webp, .svg ou .mp4 — vídeo é detectado pela extensão */
  src: string
  /** obrigatório em vídeo: aparece antes de tocar e no lugar dele com movimento reduzido */
  poster?: string
  /** texto alternativo: o que a tela mostra, não o que ela é */
  alt: string
  /**
   * Larguras disponíveis, pra o navegador escolher a menor que serve.
   * A maior é o próprio src; as outras levam o sufixo. Com src '/shots/x.jpg'
   * (780px) e widths [390, 780], precisa existir também '/shots/x-390.jpg'.
   */
  widths?: number[]
  annotations?: Annotation[]
}

/**
 * duo: notebook + celular, a mesma tela nos dois tamanhos (screens = [notebook, celular])
 * flow: 2 a 4 celulares em sequência, com setas entre eles
 * single: um aparelho, com as anotações ao lado
 */
export interface ShowcaseBlock {
  layout: 'duo' | 'flow' | 'single'
  screens: Screen[]
  caption: string
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
    { value: 'Três', label: 'projetos no ar hoje' },
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
    cover: {
      palette: { bg: '#FFF5E9', ink: '#4D3B31', accent: '#7B85CE' },
      pattern: 'sparkle',
      laptop: '/shots/beacreative.jpg',
      phone: '/shots/bea-m-portfolio.jpg',
      phoneWidths: [390, 780],
    },
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
    showcase: [
      {
        layout: 'duo',
        caption: 'A página inicial no notebook e no celular',
        screens: [
          {
            device: 'laptop',
            src: '/shots/beacreative.jpg',
            alt: 'Página inicial da BeaCreative no notebook',
          },
          {
            device: 'phone',
            src: '/shots/bea-m-inicio.jpg',
            widths: [390, 780],
            alt: 'Página inicial da BeaCreative no celular',
          },
        ],
      },
      {
        layout: 'flow',
        caption:
          'O caminho de quem chega pelo Instagram: vê o trabalho, entende o plano, marca a conversa',
        screens: [
          {
            device: 'phone',
            src: '/shots/bea-m-portfolio.jpg',
            widths: [390, 780],
            alt: 'Portfólio em formato de stories, com cards de case embaixo',
            annotations: [
              {
                area: { x: 7, y: 45.2, w: 82, h: 13.6 },
                title: 'Stories no topo',
                body: 'Quem só quer passar o olho toca num círculo e vê o case em vídeo, do jeito que já faz no Instagram.',
              },
            ],
          },
          {
            device: 'phone',
            src: '/shots/bea-m-planos.jpg',
            widths: [390, 780],
            alt: 'Seção de planos, com o que está incluso em todos',
          },
          {
            device: 'phone',
            src: '/shots/bea-m-agenda.jpg',
            widths: [390, 780],
            alt: 'Seção de agendamento, com os três passos até a reunião',
          },
        ],
      },
      {
        layout: 'duo',
        caption: 'Os quatro planos, com o que cada um entrega',
        screens: [
          {
            device: 'laptop',
            src: '/shots/bea-planos.jpg',
            alt: 'Os quatro planos lado a lado no notebook',
          },
          {
            device: 'phone',
            src: '/shots/bea-m-planos.jpg',
            widths: [390, 780],
            alt: 'A seção de planos no celular',
          },
        ],
      },
      {
        layout: 'duo',
        caption: 'A seção de desenvolvimento web, onde assino o trabalho',
        screens: [
          {
            device: 'laptop',
            src: '/shots/bea-devweb.jpg',
            alt: 'Seção de desenvolvimento web no notebook',
          },
          {
            device: 'phone',
            src: '/shots/bea-m-sites.jpg',
            widths: [390, 780],
            alt: 'Seção de desenvolvimento web no celular',
          },
        ],
      },
      {
        layout: 'single',
        caption: 'Agendamento pelo Calendly, dentro da própria página',
        screens: [
          {
            device: 'phone',
            src: '/shots/bea-m-agenda.jpg',
            widths: [390, 780],
            alt: 'Seção de agendamento no celular',
            annotations: [
              {
                area: { x: 6, y: 23.5, w: 82.3, h: 25.5 },
                // o canto cairia no fim do título: o número vai pra moldura,
                x: 99,
                y: 21,
                title: 'Sem compromisso, dito logo de cara',
                body: 'O título e a linha de apoio tiram o peso do primeiro contato antes de qualquer formulário.',
              },
              {
                area: { x: 6, y: 53.6, w: 86, h: 21 },
                title: 'Três passos antes da agenda',
                body: 'A pessoa sabe o que acontece depois: escolhe o horário, preenche e recebe o link do Meet por e-mail.',
              },
              {
                area: { x: 6, y: 82.2, w: 50.2, h: 5.4 },
                title: 'Saída pra quem prefere conversar',
                body: 'Um atalho pro WhatsApp, pra quem ainda não quer marcar horário.',
              },
            ],
          },
        ],
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
    cover: {
      palette: { bg: '#1f4d40', ink: '#d8e7d4', accent: '#30705f' },
      pattern: 'neubauer',
      bannerLogo: '/logos/laeg-bio-claro.png',
      laptop: '/shots/laeg-panorama.jpg',
      phone: '/shots/laeg-m-lista.jpg',
      phoneWidths: [390, 718],
    },
    gallery: [
      {
        src: '/shots/laeg-panorama.jpg',
        caption:
          'Panorama: estoque baixo, validade próxima e itens sem local, antes de qualquer busca',
      },
      {
        src: '/shots/laeg-ficha.jpg',
        caption:
          'A ficha do item, no formato de rótulo de frasco — nível em proveta, mínimo configurável e baixa registrada ali mesmo',
      },
      {
        src: '/shots/laeg-qr.jpg',
        caption: 'Etiqueta QR do item, pronta pra colar na prateleira',
      },
      {
        src: '/shots/laeg-admin.jpg',
        caption:
          'Administração: usuários, operadores, arquivados e impressão de etiquetas em lote',
      },
    ],
    showcase: [
      {
        layout: 'duo',
        caption: 'Entrada com e-mail do laboratório ou conta Google',
        screens: [
          {
            device: 'laptop',
            src: '/shots/laeg-login.jpg',
            alt: 'Tela de login do LAEG Estoque no notebook',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-login.jpg',
            widths: [390, 780],
            alt: 'Tela de login do LAEG Estoque no celular',
          },
        ],
      },
      {
        layout: 'duo',
        caption:
          'Panorama: estoque baixo, validade próxima e itens sem local, antes de qualquer busca',
        screens: [
          {
            device: 'laptop',
            src: '/shots/laeg-panorama.jpg',
            alt: 'Painel Panorama do LAEG Estoque no notebook',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-panorama.jpg',
            widths: [390, 718],
            alt: 'Panorama no celular, com o gráfico de estoque por status',
          },
        ],
      },
      {
        layout: 'single',
        caption: 'A lista no celular, agrupada do jeito que o laboratório guarda',
        screens: [
          {
            device: 'phone',
            src: '/shots/laeg-m-lista.jpg',
            widths: [390, 718],
            alt: 'Lista de itens da Estante 1, Prateleira A',
            annotations: [
              {
                // faixa escura do cabeçalho, sem texto no meio,
                x: 50,
                y: 30,
                title: 'Agrupado por estante e prateleira',
                body: 'A lista segue a ordem física do laboratório, com filtros independentes por local e categoria.',
              },
              {
                area: { x: 7.5, y: 37.6, w: 88.4, h: 12.4 },
                padding: 3,
                title: 'Estoque baixo à vista',
                body: 'Borda e etiqueta laranja antes mesmo de abrir o item. O mínimo é configurável item a item.',
              },
              {
                // à direita do nome, antes da coluna de quantidade,
                x: 64,
                y: 72,
                title: 'Quem cadastrou',
                body: 'Todo item e toda movimentação ficam registrados com o nome de quem fez.',
              },
              {
                area: { x: 80.2, y: 88.7, w: 14.5, h: 6.7 },
                padding: 5,
                title: 'Cadastro a um toque',
                body: 'O botão fica onde o polegar alcança, pra registrar um item novo de pé na frente da prateleira.',
              },
            ],
          },
        ],
      },
      {
        layout: 'flow',
        caption:
          'Do cadastro à retirada: o item entra no sistema, ganha etiqueta e sai da prateleira pelo celular',
        screens: [
          {
            device: 'phone',
            src: '/shots/laeg-m-novo.jpg',
            widths: [390, 718],
            alt: 'Formulário de novo item',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-qr.jpg',
            widths: [390, 718],
            alt: 'QR code do item, pronto pra imprimir',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-retirada.jpg',
            widths: [390, 718],
            alt: 'Ficha do item com o registro de retirada',
          },
        ],
      },
      {
        layout: 'duo',
        caption:
          'A ficha do item, no formato de rótulo de frasco — nível em proveta, mínimo configurável e baixa registrada ali mesmo',
        screens: [
          {
            device: 'laptop',
            src: '/shots/laeg-ficha.jpg',
            alt: 'Ficha de um item do estoque no notebook',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-retirada.jpg',
            widths: [390, 718],
            alt: 'Ficha do item no celular',
          },
        ],
      },
      {
        layout: 'duo',
        caption: 'Etiqueta QR do item, pronta pra colar na prateleira',
        screens: [
          {
            device: 'laptop',
            src: '/shots/laeg-qr.jpg',
            alt: 'Etiqueta QR de um item no notebook',
          },
          {
            device: 'phone',
            src: '/shots/laeg-m-qr.jpg',
            widths: [390, 718],
            alt: 'QR code do item no celular',
          },
        ],
      },
      {
        layout: 'single',
        caption:
          'Administração: usuários, operadores, arquivados e impressão de etiquetas em lote',
        screens: [
          {
            device: 'laptop',
            src: '/shots/laeg-admin.jpg',
            alt: 'Tela de administração do LAEG Estoque',
          },
        ],
      },
    ],
  },
  {
    slug: 'beacreative-aprovacao',
    title: 'BeaCreative Aprovação',
    summary:
      'Portal onde os clientes da agência veem cada post como vai ficar no Instagram e aprovam ou pedem ajuste, com conversa, áudio e notificações.',
    year: '2026',
    category: 'sistema',
    status: 'No ar',
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'Supabase',
      'PostgreSQL',
      'Cloudflare Pages',
      'Cloudflare R2',
      'PWA',
      'Web Push',
      'Trello API',
      'Google Drive API',
    ],
    stackNote:
      'JavaScript sem framework. No Supabase: autenticação, Row Level Security, funções no banco e Realtime. Imagens e vídeos comprimidos no próprio navegador antes do envio (WebCodecs), guardados no R2 com exclusão automática.',
    problem:
      'A aprovação de conteúdo acontecia espalhada entre WhatsApp, Drive e e-mail. O cliente recebia o post como arquivo solto, sem ver como ia ficar no feed, e os pedidos de ajuste se perdiam no meio das conversas. A agência gastava tempo cobrando resposta, conferindo qual era a última versão e lembrando quem já tinha aprovado o quê.',
    solution:
      'Um portal com a marca da agência, onde cada conteúdo tem um lugar só para ser visto, discutido e aprovado.',
    features: [
      {
        title: 'Prévia fiel ao Instagram',
        body: 'Post, carrossel navegável, story e reels, com legenda ao vivo e as áreas que a interface do app cobre. A prévia é opcional, e o arquivo também pode ser visto cru.',
      },
      {
        title: 'Aprovar ou pedir ajuste',
        body: 'Um toque em ✦ Aprovado, ou um pedido de ajuste com texto, áudio e referências. Prazo de resposta definido pela agência, com aprovação automática quando vence.',
      },
      {
        title: 'Conversa com áudio',
        body: 'Chat estilo WhatsApp entre agência e cliente, com gravação de áudio no navegador, ondas sonoras e mensagens ligadas a cada conteúdo.',
      },
      {
        title: 'Notificações com o app fechado',
        body: 'O sistema se instala na tela inicial e avisa sobre conteúdo novo, mensagens e aprovações direto na barra do celular.',
      },
      {
        title: 'Calendário de publicações',
        body: 'Entregas e prazos de todos os clientes num calendário, sincronizado com os quadros do Trello da agência.',
      },
      {
        title: 'Mídia pesada sem pesar',
        body: 'Vídeos e imagens comprimidos antes de subir, com envio do original direto para o Drive do cliente.',
      },
    ],
    featuresNote:
      'Login com convite, suspensão de acesso no fim do contrato, perfis da agência e do cliente, e versionamento com histórico de novidades completam o sistema.',
    decisions: [
      {
        title: 'Segurança no banco, não na tela',
        body: 'Cada cliente só enxerga os próprios conteúdos por regras de Row Level Security. Ações sensíveis, como aprovar, passam por funções no banco que conferem dono e situação antes de gravar.',
      },
      {
        title: 'Compressão no navegador',
        body: 'Em vez de pagar um serviço de vídeo, a compressão usa o chip de vídeo do próprio computador (WebCodecs). Um vídeo de 40 MB vira menos de 3 MB em segundos.',
      },
      {
        title: 'Armazenamento que não cresce sozinho',
        body: 'Mídias aprovadas são apagadas automaticamente depois de 30 dias, porque o original fica no Drive. Os conteúdos da vitrine ficam numa pasta protegida dessa regra.',
      },
      {
        title: 'Produção protegida',
        body: 'Todo trabalho novo vai para uma branch de desenvolvimento com endereço de teste próprio, e só chega aos clientes depois de conferido, com número de versão e histórico de mudanças.',
      },
    ],
    role: 'Levantei os requisitos com a agência, defini a arquitetura, as regras de negócio e a segurança, conduzi o design de interface e cuidei do deploy, das integrações e do versionamento. O código foi desenvolvido com apoio de IA (Claude Code), sob minha direção e revisão.',
    // sistema com login: o link só aparece quando o href for preenchido
    links: [{ label: 'Ver demonstração', href: '' }],
    logo: '/logos/beacreative.svg',
    // telas reais do sistema rodando com dados de demonstração (cliente fictício "Café Aurora")
    cover: {
      palette: { bg: '#4D3B31', ink: '#FFF5E9', accent: '#7B85CE' },
      pattern: 'dots',
      bannerLogo: '/logos/beacreative-claro.svg',
      laptop: '/shots/aprov-calendario.jpg',
      phone: '/shots/aprov-m-previa.jpg',
      phoneWidths: [390, 780],
      badge: '✦ Aprovado',
    },
    showcase: [
      {
        layout: 'duo',
        caption:
          'O calendário da agência no notebook e a lista do cliente no celular',
        screens: [
          {
            device: 'laptop',
            src: '/shots/aprov-calendario.jpg',
            alt: 'Calendário de outubro com as entregas de todos os clientes, sincronizado com o Trello',
          },
          {
            device: 'phone',
            src: '/shots/aprov-m-lista.jpg',
            widths: [390, 780],
            alt: 'Lista do cliente com os conteúdos esperando aprovação e os prazos',
          },
        ],
      },
      {
        layout: 'single',
        caption: 'A prévia do post, do jeito que vai ao ar',
        screens: [
          {
            device: 'phone',
            src: '/shots/aprov-m-previa.jpg',
            widths: [390, 780],
            alt: 'Prévia de um carrossel como no Instagram, com os botões de aprovar e pedir ajuste',
            annotations: [
              {
                area: { x: 6.4, y: 8.1, w: 87.2, h: 70.6 },
                padding: 4,
                // o cartão vai quase de ponta a ponta: o número fica na moldura
                x: 101,
                y: 10,
                title: 'Prévia fiel ao Instagram',
                body: 'Perfil, carrossel, curtidas e legenda montados como no app, pra aprovar o que vai ao ar e não um arquivo solto.',
              },
              {
                area: { x: 82.6, y: 14.9, w: 8.6, h: 2.4 },
                padding: 4,
                x: 101,
                y: 16.5,
                title: 'Carrossel navegável',
                body: 'O cliente passa as imagens como passaria no feed.',
              },
              {
                area: { x: 4.1, y: 85, w: 91.8, h: 6 },
                title: 'Aprovar ou pedir ajuste',
                body: 'Um toque em ✦ Aprovado, com confirmação, ou um pedido de ajuste que abre a conversa já ligada a este conteúdo.',
              },
            ],
          },
        ],
      },
      {
        layout: 'flow',
        caption: 'Do aviso à aprovação: a lista, a prévia, a conversa e o registro',
        screens: [
          {
            device: 'phone',
            src: '/shots/aprov-m-lista.jpg',
            widths: [390, 780],
            alt: 'Conteúdos esperando aprovação',
          },
          {
            device: 'phone',
            src: '/shots/aprov-m-previa.jpg',
            widths: [390, 780],
            alt: 'Prévia do carrossel',
          },
          {
            device: 'phone',
            src: '/shots/aprov-m-conversa.jpg',
            widths: [390, 780],
            alt: 'Conversa sobre o conteúdo, com mensagem de áudio',
            annotations: [
              {
                area: { x: 23, y: 38.2, w: 73.4, h: 6.8 },
                title: 'Áudio no navegador',
                body: 'Gravado ali mesmo, com a onda sonora, e ligado à versão do conteúdo.',
              },
            ],
          },
          {
            device: 'phone',
            src: '/shots/aprov-m-aprovado.jpg',
            widths: [390, 780],
            alt: 'Conteúdo aprovado, com a data da aprovação',
          },
        ],
      },
      {
        layout: 'duo',
        caption: 'A mesma conversa dos dois lados: a caixa de mensagens da agência e o chat do cliente',
        screens: [
          {
            device: 'laptop',
            src: '/shots/aprov-mensagens.jpg',
            alt: 'Caixa de mensagens da agência, com a conversa do cliente aberta',
          },
          {
            device: 'phone',
            src: '/shots/aprov-m-conversa.jpg',
            widths: [390, 780],
            alt: 'A mesma conversa no celular do cliente',
          },
        ],
      },
      {
        layout: 'single',
        caption:
          'Clientes com acesso ativo, suspensão a um clique e o espaço usado no armazenamento',
        screens: [
          {
            device: 'laptop',
            src: '/shots/aprov-clientes.jpg',
            alt: 'Lista de clientes da agência com o uso do armazenamento',
          },
        ],
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
