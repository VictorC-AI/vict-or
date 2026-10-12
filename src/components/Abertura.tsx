import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/motion'
import { desenharSimbolo, useCanvasAnimado } from '../lib/simbolo'

/** tempo mínimo da abertura, mesmo com tudo já carregado */
const MINIMO = 2800
const MINIMO_REDUZIDO = 300
/** quanto dura o símbolo voando contra a tela antes da página aparecer */
const EXPLOSAO = 700
const FADE = 500

const limita = (v: number) => Math.max(0, Math.min(1, v))

/**
 * Tela de carregamento: o símbolo se monta em pixels, ondula girando devagar e,
 * quando o site termina de carregar, voa contra a tela e revela a página.
 * O número conta o carregamento real (fontes e arquivos da página), nunca
 * passa de 90% antes disso. Pular ou Esc encerra na hora.
 */
export default function Abertura({ onPronto }: { onPronto: () => void }) {
  const reduzido = useReducedMotion()
  const [fase, setFase] = useState<'carregando' | 'saindo' | 'fim'>('carregando')
  const inicio = useRef(performance.now())
  const fimEm = useRef<number | null>(null)
  const carregado = useRef(false)
  const numero = useRef<HTMLSpanElement | null>(null)
  const onProntoRef = useRef(onPronto)
  onProntoRef.current = onPronto

  useEffect(() => {
    let vivo = true
    const pagina =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((ok) => window.addEventListener('load', () => ok(), { once: true }))
    Promise.all([pagina, document.fonts.ready]).then(() => {
      if (vivo) carregado.current = true
    })
    return () => {
      vivo = false
    }
  }, [])

  const encerrar = (agora = performance.now()) => {
    if (fimEm.current !== null) return
    fimEm.current = agora
    window.setTimeout(
      () => {
        setFase('saindo')
        onProntoRef.current()
      },
      reduzido ? 0 : EXPLOSAO - 300,
    )
  }

  useEffect(() => {
    if (fase !== 'saindo') return
    const t = window.setTimeout(() => setFase('fim'), FADE)
    return () => window.clearTimeout(t)
  }, [fase])

  // a página não rola por baixo enquanto a abertura cobre a tela
  useEffect(() => {
    if (fase !== 'carregando') return
    const raiz = document.documentElement
    const antes = raiz.style.overflow
    raiz.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && encerrar()
    window.addEventListener('keydown', onKey)
    return () => {
      raiz.style.overflow = antes
      window.removeEventListener('keydown', onKey)
    }
  })

  const canvas = useCanvasAnimado(({ ctx, largura, altura }, cores, agora) => {
    const decorrido = agora - inicio.current
    const t = decorrido / 1000
    const mostrado = Math.min(
      carregado.current ? 1 : 0.9,
      decorrido / (reduzido ? MINIMO_REDUZIDO : MINIMO),
    )
    if (numero.current) numero.current.textContent = String(Math.round(mostrado * 100))
    if (mostrado >= 1) encerrar(agora)

    desenharSimbolo(ctx, {
      cx: largura / 2,
      cy: altura / 2,
      tam: Math.min(largura, altura) * 0.42,
      t,
      rx: reduzido ? 0.25 : 0.3 + Math.sin(t * 0.7) * 0.12,
      ry: reduzido ? -0.35 : -0.5 + Math.sin(t * 0.5) * 0.35,
      onda: reduzido ? 0 : limita((t - 1) / 1.2) * 0.07,
      montagem: reduzido ? 1 : limita(t / 1.3),
      explosao: reduzido || fimEm.current === null ? 0 : limita((agora - fimEm.current) / EXPLOSAO),
      cores,
    })
  }, fase !== 'fim')

  if (fase === 'fim') return null

  return (
    <div
      className={`fixed inset-0 z-[70] bg-cream transition-opacity duration-500 ${
        fase === 'saindo' ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      <canvas ref={canvas} aria-hidden="true" className="block size-full" />
      <p
        aria-hidden="true"
        className="absolute bottom-[max(1.75rem,env(safe-area-inset-bottom))] left-5 flex items-baseline gap-1.5 font-mono text-sm md:left-10"
      >
        <span ref={numero} className="text-3xl font-bold tabular-nums">
          0
        </span>
        %
      </p>
      <button
        type="button"
        onClick={() => encerrar()}
        className="absolute right-5 bottom-[max(1.75rem,env(safe-area-inset-bottom))] rounded-lg border border-ink/20 px-4 py-2.5 text-sm font-semibold md:right-10"
      >
        Pular abertura
      </button>
    </div>
  )
}
