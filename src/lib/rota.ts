/**
 * Endereço de cada projeto: <base>projetos/<slug>/ — o mesmo que o build gera
 * como página estática (vite.config.ts), pra prévia no WhatsApp e na DM.
 */
const BASE = import.meta.env.BASE_URL

export const caminhoDoProjeto = (slug: string) => `${BASE}projetos/${slug}/`
export const caminhoDoSite = () => BASE

/** slug do projeto no endereço atual, ou null */
export function projetoNoEndereco(): string | null {
  if (!location.pathname.startsWith(BASE)) return null
  const resto = location.pathname.slice(BASE.length)
  return /^projetos\/([\w-]+)\/?$/.exec(resto)?.[1] ?? null
}
