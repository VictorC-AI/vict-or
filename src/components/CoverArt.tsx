import type { Cover } from '../data/site'

/** ✦ de quatro pontas, centrado em 0,0 com raio 1 */
const ESTRELA =
  'M0 -1 C0.12 -0.12 0.12 -0.12 1 0 C0.12 0.12 0.12 0.12 0 1 C-0.12 0.12 -0.12 0.12 -1 0 C-0.12 -0.12 -0.12 -0.12 0 -1Z'

/**
 * Desenhos de fundo num viewBox 160 × h (100 no card). O banner é mais baixo:
 * passa h menor e os ✦ descem/sobem junto, em vez de serem cortados.
 */
export function Padrao({ cover, id, h = 100 }: { cover: Cover; id: string; h?: number }) {
  const { ink, accent } = cover.palette
  const y = (v: number) => (v * h) / 100
  // no banner o botão de fechar ocupa o canto: o ✦ grande sai de baixo dele
  const xEstrela = h < 100 ? 128 : 146

  if (cover.pattern === 'sparkle') {
    const estrelas: [number, number, number, string][] = [
      [xEstrela, 16, 9, accent],
      [128, 34, 3.2, ink],
      [18, 82, 5, ink],
      [34, 14, 2.4, ink],
      [8, 40, 2, accent],
      [152, 86, 3, ink],
    ]
    return (
      <g>
        {estrelas.map(([x, py, r, cor], i) => (
          <path
            key={i}
            d={ESTRELA}
            fill={cor}
            opacity={cor === accent ? 0.9 : 0.22}
            transform={`translate(${x} ${y(py)}) scale(${r})`}
          />
        ))}
      </g>
    )
  }

  if (cover.pattern === 'neubauer') {
    // câmara de Neubauer: quadrados pequenos, e a cada 4 uma linha tripla
    return (
      <g>
        <defs>
          <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M2.5 0V10M5 0V10M7.5 0V10M0 2.5H10M0 5H10M0 7.5H10" stroke={ink} strokeWidth="0.08" opacity="0.22" />
            <path d="M0 0V10M0.35 0V10M0.7 0V10M0 0H10M0 0.35H10M0 0.7H10" stroke={ink} strokeWidth="0.1" opacity="0.32" />
          </pattern>
        </defs>
        <rect width="160" height={h} fill={`url(#${id})`} />
      </g>
    )
  }

  return (
    <g>
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.55" fill={ink} opacity="0.35" />
        </pattern>
      </defs>
      <rect width="160" height={h} fill={`url(#${id})`} />
      <path d={ESTRELA} fill={accent} transform={`translate(${xEstrela} ${y(16)}) scale(8)`} />
    </g>
  )
}
