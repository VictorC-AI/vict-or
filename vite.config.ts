import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { projects, SITE_URL, urlDoProjeto } from './src/data/site'

const escapar = (t: string) =>
  t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Uma página estática por projeto: dist/projetos/<slug>/index.html.
 *
 * É o mesmo index.html do site (o app abre o detalhe lendo o endereço), só
 * com título, descrição e imagem de prévia do projeto — WhatsApp, Instagram e
 * cia. não rodam JavaScript, leem só essas tags. O GitHub Pages serve a pasta
 * sem precisar de configuração.
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

      // endereço que não existe (projeto renomeado, link errado): o GitHub
      // Pages serve o 404.html — sendo o próprio site, a pessoa cai no portfólio
      writeFileSync(join(saida, '404.html'), html)

      // tira as tags gerais, onde quer que estejam e com quantas linhas tiverem
      const base = html
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace(/<meta\s[^>]*?(?:name|property)="(?:description|og:[\w:]+|twitter:[\w:]+)"[^>]*>\s*/g, '')
        .replace(/<link\s[^>]*?rel="canonical"[^>]*>\s*/g, '')

      for (const p of projects) {
        const url = urlDoProjeto(p.slug)
        const titulo = `${p.title} — vict.<OR>`
        const descricao = p.cover?.frase ? `${p.cover.frase} ${p.summary}` : p.summary
        const imagem = p.cover ? `${SITE_URL}share/og-${p.slug}.jpg` : `${SITE_URL}brand/og.png`
        const tags = `
    <title>${escapar(titulo)}</title>
    <meta name="description" content="${escapar(p.summary)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="vict.&lt;OR&gt;" />
    <meta property="og:title" content="${escapar(titulo)}" />
    <meta property="og:description" content="${escapar(descricao)}" />
    <meta property="og:image" content="${imagem}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapar(`${p.title}: ${p.summary}`)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="pt_BR" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>`
        const pasta = join(saida, 'projetos', p.slug)
        mkdirSync(pasta, { recursive: true })
        writeFileSync(join(pasta, 'index.html'), base.replace(/\s*<\/head>/, tags))
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
