/**
 * Resolve um caminho da pasta /public respeitando a base do build.
 *
 * Em desenvolvimento e em domínio próprio a base é '/', mas no GitHub Pages
 * o site vive em /nome-do-repo/. O Vite reescreve caminhos no index.html e
 * nos imports, mas NÃO dentro de strings do código — então toda imagem
 * referenciada em src/data/site.ts precisa passar por aqui.
 *
 *   asset('/shots/foto.jpg') → '/vict-or/shots/foto.jpg'
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
