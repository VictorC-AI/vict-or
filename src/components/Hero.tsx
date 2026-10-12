import { useEffect, useRef, useState } from 'react'
import { hero } from '../data/site'
import { useInView, useReducedMotion } from '../lib/motion'
import {
  criarInteracao,
  desenharSimbolo,
  useCanvasAnimado,
  VIDA_DA_ONDA,
  type Interacao,
} from '../lib/simbolo'

const REPOUSO = { rx: 0.25, ry: -0.4 }
/** quanto o clique duplo deixa os pixels espalhados antes de remontar, em ms */
const ESPALHA = 1300
/** quanto o ponteiro pode andar entre apertar e soltar e ainda contar como toque, em px */
const TOQUE = 6

const limita = (v: number) => Math.max(0, Math.min(1, v))
const sai = (t: number) => 1 - Math.pow(1 - t, 3)
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/**
 * Topo: o título entra linha por linha quando a abertura sai (`pronto`), e o
 * símbolo fica vivo ao lado pra brincar. Ele inclina na direção do ponteiro,
 * os pixels fogem do cursor, arrastar gira (e ele segue no embalo), um toque
 * solta uma onda a partir do ponto tocado e o clique duplo espalha os pixels.
 */
export default function Hero({ pronto }: { pronto: boolean }) {
  const reduzido = useReducedMotion()
  const secao = useRef<HTMLElement | null>(null)
  const visivel = useInView(secao)
  const prontoEm = useRef<number | null>(null)
  const [dica, setDica] = useState(true)
  // tudo que muda a cada quadro fica fora do estado do React
  const mov = useRef({
    rx: REPOUSO.rx,
    ry: REPOUSO.ry,
    alvoRx: REPOUSO.rx,
    alvoRy: REPOUSO.ry,
    onda: 0,
    // giro somado pelo arrasto e o embalo dele
    girX: 0,
    girY: 0,
    vX: 0,
    vY: 0,
  })
  const brinca = useRef<Interacao | null>(null)
  const arrasto = useRef<{ x: number; y: number; andou: number } | null>(null)
  const espalharEm = useRef<number | null>(null)
  // onde o símbolo foi desenhado no último quadro, pra saber onde o toque caiu
  const ultimo = useRef({ cx: 0, cy: 0, tam: 1 })

  useEffect(() => {
    if (pronto && prontoEm.current === null) prontoEm.current = performance.now()
  }, [pronto])

  const canvas = useCanvasAnimado(({ ctx, largura, altura }, cores, agora) => {
    const m = mov.current
    m.rx += (m.alvoRx - m.rx) * 0.06
    m.ry += (m.alvoRy - m.ry) * 0.06
    m.onda *= 0.97
    if (!arrasto.current) {
      // solto: segue no embalo e volta devagar pro repouso
      m.girX += m.vX
      m.girY += m.vY
      m.vX *= 0.95
      m.vY *= 0.95
      m.girX *= 0.96
      m.girY *= 0.96
    }

    const t = agora / 1000
    brinca.current ??= criarInteracao()
    const b = brinca.current
    b.ondas = b.ondas.filter((o) => t - o.t < VIDA_DA_ONDA)

    let espalhar = 0
    if (espalharEm.current !== null) {
      const e = (agora - espalharEm.current) / ESPALHA
      espalhar = e < 0.3 ? sai(e / 0.3) : 1 - suave(limita((e - 0.3) / 0.7))
      if (e >= 1) espalharEm.current = null
    }

    const montagem = reduzido
      ? 1
      : prontoEm.current === null
        ? 0
        : limita((agora - prontoEm.current - 300) / 1200)
    const quadro = {
      cx: largura / 2,
      cy: altura / 2,
      tam: Math.min(largura, altura) * 0.66,
    }
    ultimo.current = quadro
    desenharSimbolo(
      ctx,
      {
        ...quadro,
        t,
        rx: reduzido ? REPOUSO.rx : m.rx + m.girX,
        ry: reduzido ? REPOUSO.ry : m.ry + m.girY,
        onda: reduzido ? 0 : 0.035 + m.onda * 0.09,
        montagem,
        explosao: 0,
        espalhar: reduzido ? 0 : espalhar,
        cores,
      },
      reduzido ? undefined : b,
    )
  }, visivel)

  // inclinação pelo ponteiro em qualquer ponto do topo (menos enquanto arrasta)
  const segue = (e: React.PointerEvent) => {
    if (arrasto.current) return
    const r = e.currentTarget.getBoundingClientRect()
    mov.current.alvoRy = ((e.clientX - r.left) / r.width - 0.5) * 1.1
    mov.current.alvoRx = -((e.clientY - r.top) / r.height - 0.5) * 0.8
  }
  const solta = () => {
    mov.current.alvoRx = REPOUSO.rx
    mov.current.alvoRy = REPOUSO.ry
  }

  const noCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const aoApertar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (reduzido) return
    e.currentTarget.setPointerCapture(e.pointerId)
    arrasto.current = { x: e.clientX, y: e.clientY, andou: 0 }
    mov.current.vX = 0
    mov.current.vY = 0
    setDica(false)
  }

  const aoMover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (reduzido) return
    const p = noCanvas(e)
    if (brinca.current) {
      // no toque não existe "passar por cima": só o mouse empurra os pixels
      brinca.current.px = e.pointerType === 'mouse' ? p.x : -1e4
      brinca.current.py = e.pointerType === 'mouse' ? p.y : -1e4
    }
    const a = arrasto.current
    if (!a) return
    const dx = e.clientX - a.x
    // no toque, arrastar pra cima e pra baixo é rolar a página: gira só de lado
    const dy = e.pointerType === 'mouse' ? e.clientY - a.y : 0
    a.andou += Math.abs(dx) + Math.abs(dy)
    a.x = e.clientX
    a.y = e.clientY
    const m = mov.current
    m.girY += dx * 0.008
    m.girX -= dy * 0.008
    m.vY = dx * 0.008
    m.vX = -dy * 0.008
  }

  const aoSoltar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const a = arrasto.current
    arrasto.current = null
    if (!a) return
    const m = mov.current
    // volta pro repouso pelo caminho mais curto, sem desenrolar as voltas dadas
    m.girX = Math.atan2(Math.sin(m.girX), Math.cos(m.girX))
    m.girY = Math.atan2(Math.sin(m.girY), Math.cos(m.girY))
    if (a.andou > TOQUE || !brinca.current) return
    // foi um toque: solta uma onda a partir do ponto, no plano do símbolo
    const p = noCanvas(e)
    const { cx, cy, tam } = ultimo.current
    brinca.current.ondas.push({ x: (p.x - cx) / tam, y: (p.y - cy) / tam, t: performance.now() / 1000 })
    m.onda = Math.max(m.onda, 0.4)
  }

  const aoSair = () => {
    if (brinca.current) brinca.current.px = brinca.current.py = -1e4
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

      <div className="relative">
        <canvas
          ref={canvas}
          aria-hidden="true"
          onPointerDown={aoApertar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={() => {
            arrasto.current = null
          }}
          onPointerLeave={aoSair}
          onDoubleClick={() => {
            if (!reduzido) espalharEm.current = performance.now()
          }}
          className="aspect-square max-h-[56vh] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing lg:max-h-[78vh]"
        />
        {!reduzido && (
          <p
            aria-hidden="true"
            className={`entra pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-xs text-ink/55 transition-opacity duration-500 ${
              dica ? '' : '!opacity-0'
            }`}
            style={{ transitionDelay: dica ? '1200ms' : '0ms' }}
          >
            Arraste, toque ou clique duas vezes
          </p>
        )}
      </div>
    </section>
  )
}
