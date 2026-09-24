/**
 * Versão dos arquivos de /public.
 *
 * O navegador guarda imagem pelo endereço. Se você trocar o conteúdo de
 * um arquivo mantendo o mesmo nome — um print atualizado, por exemplo —
 * quem já visitou o site continua vendo o antigo, às vezes por dias.
 *
 * SEMPRE QUE TROCAR UMA IMAGEM SEM MUDAR O NOME, SOME 1 AQUI.
 * O endereço vira .../foto.jpg?v=4, o navegador entende como arquivo
 * diferente e baixa de novo.
 *
 * (Isso não vale pro JavaScript e pro CSS: o Vite já põe um código no
 * nome deles a cada build, e por isso eles nunca dão esse problema.)
 */
const VERSAO_DOS_ARQUIVOS = '3'

/**
 * Resolve um caminho da pasta /public respeitando a base do build.
 *
 * Em desenvolvimento e em domínio próprio a base é '/', mas no GitHub Pages
 * o site vive em /nome-do-repo/. O Vite reescreve caminhos no index.html e
 * nos imports, mas NÃO dentro de strings do código — então toda imagem
 * referenciada em src/data/site.ts precisa passar por aqui.
 *
 *   asset('/shots/foto.jpg') → '/vict-or/shots/foto.jpg?v=3'
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  const limpo = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${limpo}?v=${VERSAO_DOS_ARQUIVOS}`
}
