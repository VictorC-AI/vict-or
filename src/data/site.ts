/* =====================================================================
   TODO O CONTEÚDO DO SITE MORA AQUI.
   Pra trocar texto, projeto, link ou tecnologia, edite só este arquivo —
   nenhum componente precisa ser mexido.
   ===================================================================== */

/**
 * 'jogo' continua aqui de propósito, mesmo sem projeto de jogo publicado.
 * No dia em que você entregar o primeiro, é só:
 *   1. adicionar o projeto abaixo com category: 'jogo'  → o filtro "Jogos"
 *      aparece sozinho na seção Trabalhos;
 *   2. (se quiser vender o serviço) devolver o bloco de Jogos em `services`.
 */
export type Category = 'site' | 'jogo' | 'ecommerce'

export interface Project {
  /** usado na URL do modal e como key */
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
  /** caminho em /public, ex: '/shots/lumen.png'. Vazio = usa o padrão gerado. */
  image?: string
}

export const profile = {
  name: 'Victor Barros',
  wordmark: 'vict.<OR>',
  role: 'Desenvolvedor full stack',
  location: 'Sorocaba, SP',
  email: 'victorbarros.carvalho13@gmail.com',
  /** deixe '' pra esconder o link no rodapé */
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
  instagram: '',
  /** WhatsApp em formato internacional, só números. '' esconde o botão. */
  whatsapp: '',
}

export const hero = {
  /** cada string é uma linha do título */
  headline: ['Eu construo', 'a coisa', 'inteira.'],
  lead:
    'Sites e lojas online escritos do zero — do primeiro wireframe ao deploy. Sem tema comprado, sem página que demora seis segundos pra abrir.',
  primaryCta: { label: 'Ver o que eu fiz', href: '#trabalhos' },
  secondaryCta: { label: 'Começar um projeto', href: '#contato' },
  /** números pequenos ao pé do hero */
  facts: [
    { value: '2022', label: 'escrevendo código desde' },
    { value: 'Unicamp', label: 'Sistemas de Informação' },
    { value: 'PT / EN', label: 'idiomas de trabalho' },
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
      'Painel simples pra editar textos e fotos',
      'Nota verde no Lighthouse',
      'Formulário de contato que realmente chega',
    ],
    deliverable: 'De 2 a 4 semanas',
  },
  {
    id: 'ecommerce' as Category,
    name: 'E-commerce',
    pitch:
      'Loja completa com checkout, Pix, cartão e estoque — montada na sua marca, não na cara do Shopify.',
    includes: [
      'Checkout com Pix, cartão e boleto',
      'Controle de estoque e pedidos',
      'Frete calculado pelos Correios',
      'Relatório de vendas por período',
    ],
    deliverable: 'De 4 a 10 semanas',
  },
]

export const projects: Project[] = [
  {
    slug: 'lumen-studio',
    title: 'Lumen Studio',
    summary: 'Site de um estúdio de fotografia com galeria que carrega em blocos.',
    year: '2026',
    category: 'site',
    status: 'No ar',
    stack: ['React', 'TypeScript', 'Tailwind', 'Sanity CMS'],
    problem:
      'O estúdio publicava trabalhos novos em um Instagram que ninguém encontrava no Google, e o site antigo levava nove segundos pra abrir a galeria.',
    solution:
      'Refiz o site com galeria em blocos que carregam sob demanda, imagens em AVIF com fallback e um CMS onde a equipe publica um ensaio novo em dois minutos.',
    result:
      'Galeria abre em menos de um segundo. O estúdio publica sozinho desde a entrega, sem me chamar.',
    links: [{ label: 'Abrir o site', href: '#' }],
  },
  {
    slug: 'raiz-organicos',
    title: 'Raiz Orgânicos',
    summary: 'Loja de hortifruti com entrega por bairro e assinatura semanal.',
    year: '2025',
    category: 'ecommerce',
    status: 'No ar',
    stack: ['Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
    problem:
      'A venda acontecia por WhatsApp. Pedido errado, estoque no caderno e nenhuma forma de saber o que mais saía.',
    solution:
      'Loja com catálogo por safra, assinatura semanal recorrente, checkout com Pix e cartão, e um painel que mostra o que precisa ser colhido na quinta.',
    result:
      'Pedido entra sozinho no painel. O caderno saiu de circulação no primeiro mês.',
    links: [{ label: 'Ver a loja', href: '#' }],
  },
  {
    slug: 'clave-app',
    title: 'Clave',
    summary: 'App de cifras que transpõe o tom junto com a banda inteira.',
    year: '2025',
    category: 'site',
    status: 'Beta',
    stack: ['React', 'IndexedDB', 'Web Audio API', 'PWA'],
    problem:
      'Toco teclado em igreja. Quando o tom muda no ensaio, cinco pessoas rabiscam a cifra no papel ao mesmo tempo e alguém sempre erra.',
    solution:
      'Cifra compartilhada que transpõe pra todo mundo de uma vez, funciona offline depois da primeira abertura e marca a parte de cada instrumento.',
    result:
      'Usado toda semana pela banda. Zero papel no ensaio desde março.',
    links: [{ label: 'Entrar no beta', href: '#' }],
  },
  {
    slug: 'marco-zero',
    title: 'Marco Zero',
    summary: 'Catálogo de peças de bicicleta com busca por compatibilidade.',
    year: '2024',
    category: 'ecommerce',
    status: 'No ar',
    stack: ['Astro', 'Alpine.js', 'Mercado Pago', 'Supabase'],
    problem:
      'Quem compra peça de bike quer saber uma coisa antes do preço: isso encaixa na minha bicicleta?',
    solution:
      'Busca que filtra por modelo e ano da bike antes de mostrar qualquer produto, com checkout Mercado Pago e retirada na loja.',
    result:
      'A pergunta "serve na minha?" saiu do WhatsApp. Devolução por peça errada caiu.',
    links: [{ label: 'Ver o catálogo', href: '#' }],
  },
]

export const stack = [
  {
    group: 'Interface',
    items: [
      'React',
      'TypeScript',
      'Next.js',
      'Astro',
      'Tailwind',
      'Vite',
      'Canvas API',
    ],
  },
  {
    group: 'Servidor e dados',
    items: ['Node.js', 'PostgreSQL', 'Prisma', 'Supabase', 'Python', 'C'],
  },
  {
    group: 'Operação',
    items: ['Git', 'Vercel', 'Docker', 'Figma', 'Linux'],
  },
]

export const about = {
  title: 'Sobre',
  paragraphs: [
    'Sou Victor. Estudo Sistemas de Informação na Unicamp e escrevo código desde 2022, quando quebrei o primeiro site tentando entender por que ele estava lento.',
    'Antes de programar, eu já tocava teclado — e é de lá que vem a parte do trabalho que ninguém vê no código: arranjo é decidir o que entra, o que sai e em que ordem. Uma tela funciona igual. A maior parte do meu tempo em um projeto é cortando coisa.',
    'Trabalho do início ao fim: converso com você pra entender o problema, desenho, escrevo, publico e fico por perto depois que sobe.',
    'O próximo terreno que eu quero pisar é jogo de navegador. Ainda não entreguei nenhum — no dia em que entregar, ele aparece aqui em cima.',
  ],
  /** aparece como lista curta ao lado do texto */
  principles: [
    'Nada vai pro ar sem passar no teclado',
    'Se demora mais de 2s pra abrir, não terminei',
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
  jogo: 'Jogo',
  ecommerce: 'E-commerce',
}
