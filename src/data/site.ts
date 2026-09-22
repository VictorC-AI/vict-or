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
  result: string
  links?: { label: string; href: string }[]
  /** caminho em /public, ex: '/shots/beacreative.jpg'. Vazio = capa gerada. */
  image?: string
  /**
   * Logo do cliente — SVG (ideal) ou PNG com fundo transparente, em cor
   * que leia sobre o creme. Some do card se ficar vazio.
   */
  logo?: string
}

export const profile = {
  name: 'Victor Carvalho',
  wordmark: 'vict.<OR>',
  role: 'Desenvolvedor full stack',
  location: 'Sorocaba, SP',
  email: 'victordevv.ui@gmail.com',
  github: 'https://github.com/VictorC-AI',
  /** deixe '' pra esconder o link no rodapé */
  linkedin: '',
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
      'Site da agência de social media e estratégia de conteúdo da Beatriz Silveira.',
    year: '2026',
    category: 'site',
    status: 'No ar',
    stack: ['HTML', 'CSS', 'JavaScript'],
    // CONFERIR: se antes existia outro site, ou se o gargalo era outro
    problem:
      'Os quatro planos da agência, o que cada um entrega e o portfólio de clientes viviam em conversa de Instagram e WhatsApp, repetidos a cada novo interessado.',
    solution:
      'Site estático em HTML, CSS e JavaScript puros — sem CMS, sem build, sem framework pra carregar antes do conteúdo aparecer. Os planos Essência, Presença, Conexão e Memória com o que cada um inclui, portfólio, FAQ e bloco de agendamento. A identidade visual da Bea aplicada do zero.',
    result:
      'Quem chega já sabe o que cada plano entrega antes de mandar a primeira mensagem. Sou o desenvolvedor web da equipe e o site é meu desde a primeira linha.',
    links: [{ label: 'Abrir o site', href: 'https://beacreativeco.com.br' }],
    image: '/shots/beacreative.jpg',
    logo: '/logos/beacreative.svg',
  },
  {
    slug: 'laeg-estoque',
    title: 'LAEG Estoque',
    summary:
      'Controle de estoque do LAEG-BIO, laboratório de ecotoxicologia da Unicamp.',
    year: '2026',
    category: 'sistema',
    status: 'No ar',
    stack: ['JavaScript', 'Supabase', 'Cloudflare Workers'],
    problem:
      'O controle do estoque era um caderno. Sou bolsista no LAEG-BIO e via todo dia a mesma cena: ninguém respondia de cabeça o que havia na prateleira, o que estava perto de vencer ou quem tinha levado o último frasco. Ninguém pediu um sistema — a falta dele custava tempo de todo mundo.',
    solution:
      'Sistema com login e dois níveis de acesso. Cadastro por categoria com unidade, marca, local e validade, marcação de reagente controlado, e registro de qual operador retirou cada item. Um painel abre mostrando o que está em estoque baixo e o que vence primeiro, antes de qualquer busca. Etiqueta QR impressa pra prateleira: aponta a câmera e o item abre. Item apagado vai pro arquivo em vez de sumir, então o histórico de movimentação sobrevive.',
    result:
      'O caderno saiu do circuito. Validade e responsável pela retirada passaram a viver na mesma tela, consultáveis do celular no meio do laboratório, e o histórico sobrevive mesmo quando um item sai do catálogo.',
    links: [
      {
        label: 'Abrir o sistema',
        href: 'https://estoque-de-produtos.laegestoque.workers.dev/',
      },
    ],
    image: '/shots/laeg-estoque.jpg',
    logo: '/logos/laeg-bio.png',
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
   * Formspree, Basin, Web3Forms — qualquer um funciona.
   * Deixe '' e o formulário vira um link de e-mail.
   */
  formEndpoint: '',
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
