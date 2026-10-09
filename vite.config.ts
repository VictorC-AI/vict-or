import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects, SITE_URL, urlDoProjeto } from './src/data/site'

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface Previa {
  titulo: string
  descricao: string
  descricaoCurta: string
  imagem: string
  alt: string
  url: string
  tipo: 'website' | 'article'
}

/** bloco de prévia de link (Open Graph) — o mesmo formato em todas as páginas */
function tagsDePrevia(p: Previa) {
  return `
    <title>${escapar(p.titulo)}</title>
    <meta name="description" content="${escapar(p.descricaoCurta)}" />
    <link rel="canonical" href="${p.url}" />
    <meta property="og:type" content="${p.tipo}" />
    <meta property="og:site_name" content="vict.&lt;OR&gt;" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:url" content="${p.url}" />
    <meta property="og:title" content="${escapar(p.titulo)}" />
    <meta property="og:description" content="${escapar(p.descricao)}" />
    <meta property="og:image" content="${p.imagem}" />
    <meta property="og:image:secure_url" content="${p.imagem}" />
    <meta property="og:image:type" content="${p.imagem.endsWith('.png') ? 'image/png' : 'image/jpeg'}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapar(p.alt)}" />
    <meta name="twitter:card" content="summary_large_image" />`
}

const lerAtributo = (html: string, re: RegExp) => {
  const m = re.exec(html)?.[1]
  return m ? m.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : ''
}

/**
 * Prévias de link e uma página estática por projeto (dist/projetos/<slug>/).
 *
 * As páginas são o mesmo index.html do site (o app abre o detalhe lendo o
 * endereço), só com título, descrição e imagem do projeto — WhatsApp, Instagram
 * e cia. não rodam JavaScript, leem só essas tags.
 *
 * As tags vão logo depois do charset/viewport, antes de script e CSS: o leitor
 * do WhatsApp só olha o começo da página e ignora prévia declarada tarde.
 */
function paginasDosProjetos(): Plugin {
  let saida = 'dist'
  return {
    name: 'paginas-dos-projetos',
    apply: 'build',
    configResolved(config) {
      saida = config.build.outDir
    },
    // depois de tudo escrito: o index.html final (com os nomes dos arquivos
    // do build) só existe aqui
    closeBundle() {
      const html = readFileSync(join(saida, 'index.html'), 'utf8')

      // a prévia da página principal continua sendo a do index.html
      const inicio: Previa = {
        titulo: lerAtributo(html, /<title>([\s\S]*?)<\/title>/),
        descricaoCurta: lerAtributo(html, /<meta\s+name="description"\s+content="([^"]*)"/),
        descricao: lerAtributo(html, /property="og:description"\s+content="([^"]*)"/),
        imagem: lerAtributo(html, /property="og:image"\s+content="([^"]*)"/),
        alt: 'vict.<OR> — Victor Carvalho, desenvolvedor full stack',
        url: SITE_URL,
        tipo: 'website',
      }

      // tira as tags de prévia onde quer que estejam e com quantas linhas tiverem
      const limpo = html
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace(/<meta\s[^>]*?(?:name|property)="(?:description|og:[\w:]+|twitter:[\w:]+)"[^>]*>\s*/g, '')
        .replace(/<link\s[^>]*?rel="canonical"[^>]*>\s*/g, '')
        .replace(/<!--\s*Troque[\s\S]*?-->\s*/, '')
      const comPrevia = (p: Previa) =>
        limpo.replace(/(<meta\s+name="viewport"[^>]*>)/, `$1${tagsDePrevia(p)}`)

      writeFileSync(join(saida, 'index.html'), comPrevia(inicio))
      // endereço que não existe (projeto renomeado, link errado): o GitHub
      // Pages serve o 404.html — sendo o próprio site, a pessoa cai no portfólio
      writeFileSync(join(saida, '404.html'), comPrevia(inicio))

      for (const p of projects) {
        const pasta = join(saida, 'projetos', p.slug)
        mkdirSync(pasta, { recursive: true })
        writeFileSync(
          join(pasta, 'index.html'),
          comPrevia({
            titulo: `${p.title} — vict.<OR>`,
            descricaoCurta: p.summary,
            descricao: p.cover?.frase ? `${p.cover.frase} ${p.summary}` : p.summary,
            imagem: p.cover ? `${SITE_URL}share/og-${p.slug}.jpg` : `${SITE_URL}brand/og.png`,
            alt: `${p.title}: ${p.summary}`,
            url: urlDoProjeto(p.slug),
            tipo: 'article',
          }),
        )
      }
    },
  }
}

export default defineConfig({
  // Vercel, Netlify e domínio próprio usam '/'.
  // O workflow do GitHub Pages passa VITE_BASE='/nome-do-repo/' sozinho.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), paginasDosProjetos()],
})
