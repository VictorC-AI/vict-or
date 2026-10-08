import { useEffect, useRef, type ReactNode } from 'react'
import type { Screen } from '../data/site'
import { asset } from '../lib/asset'
import { useInView, useReducedMotion } from '../lib/motion'

/** proporção da área de tela de cada aparelho */
export const SCREEN_RATIO = { phone: 390 / 844, laptop: 16 / 9 }

/** o quanto cada aparelho ocupa da largura, pra o navegador escolher a imagem */
const SIZES = {
  phone: '(min-width: 640px) 260px, 62vw',
  laptop: '(min-width: 768px) 640px, 92vw',
}

const ehVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src)

function srcSet(src: string, widths?: number[]) {
  if (!widths?.length) return undefined
  // a maior largura é o próprio src; as outras têm o sufixo -<largura>
  const maior = Math.max(...widths)
  return widths
    .map((w) =>
      w === maior
        ? `${asset(src)} ${w}w`
        : `${asset(src.replace(/(\.\w+)$/, `-${w}$1`))} ${w}w`,
    )
    .join(', ')
}

function Video({ screen }: { screen: Screen }) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const reduzido = useReducedMotion()
  const naTela = useInView(ref)

  // só toca enquanto aparece: vídeo rodando fora da vista é bateria à toa
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (naTela && !reduzido) v.play().catch(() => {})
    else v.pause()
  }, [naTela, reduzido])

  return (
    <video
      ref={ref}
      src={reduzido ? undefined : asset(screen.src)}
      poster={screen.poster ? asset(screen.poster) : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-label={screen.alt}
      className="block size-full object-cover object-top"
    />
  )
}

/**
 * Moldura de celular ou notebook com a tela dentro.
 * `children` fica por cima da tela, no mesmo sistema de coordenadas —
 * é ali que entram os marcadores das anotações.
 */
export default function DeviceFrame({
  screen,
  onOpen,
  children,
  className = '',
}: {
  screen: Screen
  /** abre a tela ampliada; só vale pra imagem */
  onOpen?: () => void
  children?: ReactNode
  className?: string
}) {
  const { device } = screen
  const video = ehVideo(screen.src)

  const midia = video ? (
    <Video screen={screen} />
  ) : (
    <img
      src={asset(screen.src)}
      srcSet={srcSet(screen.src, screen.widths)}
      sizes={screen.widths ? SIZES[device] : undefined}
      alt={screen.alt}
      loading="lazy"
      decoding="async"
      className="block size-full object-cover object-top"
    />
  )

  // a mídia é recortada nos cantos; os marcadores (children) não —
  // eles podem sair da tela e ficar em cima da moldura
  const tela = (
    <div className="relative" style={{ aspectRatio: SCREEN_RATIO[device] }}>
      <div
        className={`absolute inset-0 overflow-hidden bg-paper ${
          device === 'phone' ? 'rounded-[12%/5.6%]' : ''
        }`}
      >
        {onOpen && !video ? (
          <button
            type="button"
            onClick={onOpen}
            aria-label={`Ampliar: ${screen.alt}`}
            className="block size-full cursor-zoom-in"
          >
            {midia}
          </button>
        ) : (
          midia
        )}
      </div>
      {children}
    </div>
  )

  if (device === 'phone') {
    return (
      <div
        className={`@container shadow-hard rounded-[15%/7%] border-2 border-ink bg-ink ${className}`}
      >
        {/* cqw = % da largura do próprio aparelho; % puro mediria o pai */}
        <div className="p-[3.5cqw]">
          <div className="relative">
            {tela}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[1.6%] left-1/2 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-ink"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`@container ${className}`}>
      <div className="mx-[6cqw] rounded-t-[0.9rem] border-2 border-ink bg-ink p-[2cqw] pb-[2.6cqw]">
        <div className="relative">{tela}</div>
      </div>
      <svg
        viewBox="0 0 100 4"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block h-auto w-full overflow-visible"
      >
        <path
          d="M0.6 0.5 H99.4 L97.5 3.5 H2.5 Z"
          className="fill-sand stroke-ink"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
        <path
          d="M42 0.5 H58 V1.4 H42 Z"
          className="fill-ink/20"
        />
      </svg>
    </div>
  )
}
