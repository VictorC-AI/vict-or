import type { Project } from '../data/site'

/**
 * Cores do projeto no palco e no detalhe: as da capa (são a marca do cliente,
 * valem nos dois temas). Os componentes da casa (Curtir, botões, formulário)
 * leem --color-ink, --color-paper etc., então passam a usar as cores do
 * projeto sem saber disso. Projeto sem capa fica com as cores do site.
 */
export function coresDoProjeto(p: Project): React.CSSProperties {
  if (!p.cover) return {}
  const { bg, ink } = p.cover.palette
  return {
    background: bg,
    color: ink,
    '--color-ink': ink,
    '--color-paper': bg,
    '--color-cream': bg,
    '--color-muted': `color-mix(in oklab, ${ink} 72%, ${bg})`,
    '--color-blue-soft': `color-mix(in oklab, ${ink} 18%, ${bg})`,
  } as React.CSSProperties
}
