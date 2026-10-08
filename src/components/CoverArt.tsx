import type { Cover, Project } from '../data/site'
import DeviceFrame from './DeviceFrame'
import { asset } from '../lib/asset'

/** ✦ de quatro pontas, centrado em 0,0 com raio 1 */
const ESTRELA =
  'M0 -1 C0.12 -0.12 0.12 -0.12 1 0 C0.12 0.12 0.12 0.12 0 1 C-0.12 0.12 -0.12 0.12 -1 0 C-0.12 -0.12 -0.12 -0.12 0 -1Z'

/**
 * Desenhos de fundo num viewBox 160 × h (100 no card). O banner é mais baixo:
 * passa h menor e os ✦ descem/sobem junto, em vez de serem cortados.
 */
function Padrao({ cover, id, h = 100 }: { cover: Cover; id: string; h?: number }) {
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

/**
 * Capa desenhada do card de projeto: paleta, padrão, logo num canto e os
 * aparelhos com telas reais. O hover vem do `group` do card (Work.tsx).
 */
/**
 * Nome + classe de View Transition. O nome liga a mesma camada nos dois estados
 * (card e banner); a classe deixa o CSS animar todas as capas com uma regra só.
 */
export function camada(nome: string, classe: string, ativo = true): React.CSSProperties {
  return ativo
    ? ({ viewTransitionName: nome, viewTransitionClass: classe } as React.CSSProperties)
    : { viewTransitionName: 'none' }
}

/**
 * O card inteiro e o painel inteiro do detalhe dividem este nome: a caixa
 * cresce de um pro outro (container transform) e a capa se dissolve no banner,
 * que tem a mesma cor e o mesmo padrão.
 */
export const nomeDaCapa = (slug: string) => `capa-${slug}`

export default function CoverArt({
  project,
  className = '',
  transicao = true,
}: {
  project: Project & { cover: Cover }
  className?: string
  /** desligar enquanto o detalhe deste projeto está aberto (o nome passa pro painel) */
  transicao?: boolean
}) {
  const { cover } = project
  const soCelular = !cover.laptop

  return (
    <div
      className={`@container relative isolate overflow-hidden ${className}`}
      style={camada(nomeDaCapa(project.slug), 'capa', transicao)}
    >
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: cover.palette.bg }}>
        <svg
          viewBox="0 0 160 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          <Padrao cover={cover} id={`padrao-card-${project.slug}`} />
        </svg>
      </div>

      <div className="absolute inset-0">
        {cover.laptop && (
          <DeviceFrame
            screen={{ device: 'laptop', src: cover.laptop, alt: '' }}
            className="absolute top-1/2 left-[7cqw] w-[60cqw] -translate-y-[44%] transition-transform duration-500 ease-snap motion-safe:group-hover:-translate-y-[47%]"
          />
        )}

        <div
          className={`absolute top-1/2 -translate-y-1/2 transition-transform duration-500 ease-snap motion-safe:group-hover:-translate-y-[54%] motion-safe:group-hover:-rotate-2 ${
            soCelular
              ? 'left-1/2 w-[24cqw] -translate-x-1/2'
              : 'right-[8cqw] w-[19cqw]'
          }`}
        >
          <DeviceFrame
            screen={{
              device: 'phone',
              src: cover.phone,
              widths: cover.phoneWidths,
              alt: '',
            }}
            className="shadow-hard-sm"
          />
          {cover.badge && (
            <span
              className="absolute bottom-full left-1/2 mb-[2cqw] -translate-x-1/2 rounded-full border-2 border-ink px-[1.8cqw] py-[0.6cqw] text-[max(0.7rem,2.1cqw)] font-bold whitespace-nowrap shadow-hard-sm"
              style={{ backgroundColor: cover.palette.accent, color: cover.palette.bg }}
            >
              {cover.badge}
            </span>
          )}
        </div>

        {project.logo && (
          <span className="absolute top-[3.5cqw] left-[3.5cqw] border-2 border-ink bg-paper px-[1.6cqw] py-[1.1cqw]">
            <img
              src={asset(project.logo)}
              alt={project.title}
              className="block h-[max(1.1rem,4.2cqw)] w-auto max-w-[24cqw] object-contain"
            />
          </span>
        )}

        <span
          aria-hidden="true"
          className="absolute bottom-[3.5cqw] left-[3.5cqw] translate-y-2 border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          Ver projeto →
        </span>
      </div>
    </div>
  )
}

/** 160 de largura em 21:9 */
const ALTURA_BANNER = (160 * 9) / 21

/**
 * Banner do topo do detalhe: a mesma paleta e o mesmo padrão da capa do card,
 * sem telas, com a logo grande no centro. Faz parte do painel que cresce a partir
 * do card (ver nomeDaCapa e as regras de ::view-transition em index.css).
 */
export function CoverBanner({ project }: { project: Project & { cover: Cover } }) {
  const { cover } = project
  const logo = cover.bannerLogo ?? project.logo
  return (
    <div className="relative isolate flex aspect-[21/9] min-h-36 items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ backgroundColor: cover.palette.bg }}>
        <svg
          viewBox={`0 0 160 ${ALTURA_BANNER}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 size-full"
        >
          <Padrao cover={cover} id={`padrao-banner-${project.slug}`} h={ALTURA_BANNER} />
        </svg>
      </div>
      {logo ? (
        // o título vem logo abaixo em texto: aqui a logo é só imagem
        <img
          src={asset(logo)}
          alt=""
          className="h-[36%] w-auto max-w-[64%] object-contain"
        />
      ) : (
        <span
          className="type-display text-4xl sm:text-6xl"
          style={{ color: cover.palette.ink }}
          aria-hidden="true"
        >
          {project.title}
        </span>
      )}
    </div>
  )
}
