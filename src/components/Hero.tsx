import { useEffect, useRef } from 'react'
import { hero } from '../data/site'
import { useInView, useReducedMotion } from '../lib/motion'
import { desenharSimbolo, useCanvasAnimado } from '../lib/simbolo'

const REPOUSO = { rx: 0.25, ry: -0.4 }
const limita = (v: number) => Math.max(0, Math.min(1, v))

/**
 * Topo: o título entra linha por linha quando a abertura sai (`pronto`), e o
 * símbolo fica vivo ao lado, ondulando, inclinado na direção do ponteiro.
 * Um toque nele solta uma onda mais forte.
 */
export default function Hero({ pronto }: { pronto: boolean }) {
  const reduzido = useReducedMotion()
  const secao = useRef<HTMLElement | null>(null)
  const visivel = useInView(secao)
  const prontoEm = useRef<number | null>(null)
  // inclinação atual e alvo, fora do estado do React: muda a cada quadro
  const mov = useRef({ rx: REPOUSO.rx, ry: REPOUSO.ry, alvoRx: REPOUSO.rx, alvoRy: REPOUSO.ry, onda: 0 })

  useEffect(() => {
    if (pronto && prontoEm.current === null) prontoEm.current = performance.now()
  }, [pronto])

  const canvas = useCanvasAnimado(({ ctx, largura, altura }, cores, agora) => {
    const m = mov.current
    m.rx += (m.alvoRx - m.rx) * 0.06
    m.ry += (m.alvoRy - m.ry) * 0.06
    m.onda *= 0.97
    const montagem = reduzido
      ? 1
      : prontoEm.current === null
        ? 0
        : limita((agora - prontoEm.current - 300) / 1200)
    desenharSimbolo(ctx, {
      cx: largura / 2,
      cy: altura / 2,
      tam: Math.min(largura, altura) * 0.66,
      t: agora / 1000,
      rx: reduzido ? REPOUSO.rx : m.rx,
      ry: reduzido ? REPOUSO.ry : m.ry,
      onda: reduzido ? 0 : 0.035 + m.onda * 0.09,
      montagem,
      explosao: 0,
      cores,
    })
  }, visivel)

  const segue = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    mov.current.alvoRy = ((e.clientX - r.left) / r.width - 0.5) * 1.1
    mov.current.alvoRx = -((e.clientY - r.top) / r.height - 0.5) * 0.8
  }
  const solta = () => {
    mov.current.alvoRx = REPOUSO.rx
    mov.current.alvoRy = REPOUSO.ry
  }

  return (
    <section
      ref={secao}
      id="topo"
      data-pronto={pronto ? '' : undefined}
      onPointerMove={segue}
      onPointerLeave={solta}
      className="shell grid min-h-[100svh] items-center gap-6 pt-24 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10"
    >
      <div className="min-w-0">
        <h1 className="type-display text-[clamp(2.75rem,5.6vw,6rem)] leading-[0.92]">
          {hero.headline.map((linha, i) => (
            <span key={linha} className="linha block overflow-hidden pb-[0.06em] whitespace-nowrap">
              <span style={{ transitionDelay: `${i * 80}ms` }}>{linha}</span>
            </span>
          ))}
        </h1>

        <p
          className="entra text-lead mt-7 max-w-[40ch] text-ink/75"
          style={{ transitionDelay: '250ms' }}
        >
          {hero.lead}
        </p>

        <div
          className="entra mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
          style={{ transitionDelay: '350ms' }}
        >
          <a
            href={hero.primaryCta.href}
            className="rounded-[9px] bg-blue px-6 py-4 text-lg font-bold text-bone transition-transform duration-150 active:scale-[0.98]"
          >
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            className="text-lg font-bold underline decoration-2 underline-offset-[6px] hover:text-blue"
          >
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <canvas
        ref={canvas}
        aria-hidden="true"
        onPointerDown={() => {
          mov.current.onda = 1
        }}
        className="aspect-square max-h-[56vh] w-full touch-pan-y lg:max-h-[78vh]"
      />
    </section>
  )
}
