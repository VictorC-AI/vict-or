import type { Category } from '../data/site'

type Tone = 'blue' | 'ink' | 'paper'

const TONES: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: 'var(--color-blue)', fg: 'var(--color-cream)' },
  ink: { bg: 'var(--color-ink)', fg: 'var(--color-cream)' },
  paper: { bg: 'var(--color-paper)', fg: 'var(--color-ink)' },
}

/**
 * Capa geométrica gerada por projeto — placeholder enquanto não há screenshot.
 * Assim que você tiver a imagem real, preencha `image` em src/data/site.ts
 * que o componente Work usa a foto no lugar disto.
 */
export default function ProjectCover({
  category,
  index,
  className = '',
}: {
  category: Category
  index: number
  className?: string
}) {
  const tone: Tone = (['blue', 'paper', 'ink'] as Tone[])[index % 3]
  const { bg, fg } = TONES[tone]

  return (
    <svg
      viewBox="0 0 160 112"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="160" height="112" fill={bg} />
      {category === 'site' && <SiteMark fg={fg} shift={index} />}
      {category === 'jogo' && <GameMark fg={fg} shift={index} />}
      {category === 'ecommerce' && <ShopMark fg={fg} shift={index} />}
    </svg>
  )
}

function SiteMark({ fg, shift }: { fg: string; shift: number }) {
  const rows = [46, 22, 34, 14]
  return (
    <g fill={fg}>
      <rect x="24" y="22" width="112" height="9" />
      <rect x="24" y="37" width="52" height="53" opacity="0.28" />
      {rows.map((w, i) => (
        <rect
          key={i}
          x="84"
          y={37 + i * 14}
          width={w + ((shift * 7 + i * 5) % 18)}
          height="7"
        />
      ))}
    </g>
  )
}

function GameMark({ fg, shift }: { fg: string; shift: number }) {
  // arco de pixels: uma trajetória sob gravidade
  const cells = []
  for (let i = 0; i < 13; i++) {
    const x = 18 + i * 10
    const t = (i - 6 + (shift % 3) - 1) / 6
    const y = 30 + t * t * 44
    cells.push(<rect key={i} x={x} y={Math.round(y)} width="8" height="8" fill={fg} />)
  }
  return (
    <g>
      {cells}
      <rect x="18" y="96" width="124" height="3" fill={fg} opacity="0.35" />
    </g>
  )
}

function ShopMark({ fg, shift }: { fg: string; shift: number }) {
  const o = shift % 2 === 0 ? 0 : 10
  return (
    <g fill={fg}>
      <rect x={24 + o} y="54" width="44" height="40" />
      <rect x={74 + o} y="34" width="44" height="60" opacity="0.32" />
      <rect x={52 + o} y="18" width="26" height="26" />
      <rect x="0" y="100" width="160" height="12" opacity="0.18" />
    </g>
  )
}
