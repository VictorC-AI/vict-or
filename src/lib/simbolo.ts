import { useEffect, useRef } from 'react'

/*
 * O símbolo da marca desenhado em pixels 3D, num canvas 2D, sem biblioteca.
 * Usado pela abertura e pelo topo. A forma vem do próprio logo (public/brand/icon.svg):
 * bloco atrás, deslocado pra baixo e pra esquerda; peça azul na frente; V por cima.
 */

// caminho do V do icon.svg, já na origem da peça azul
const V =
  'M 247.17 0.62 C 225.68 0.62 207.45 -5.16 192.48 -16.75 C 177.52 -28.34 164.88 -43.94 154.56 -63.53 C 144.24 -83.12 135.28 -105.46 127.69 -130.53 C 120.1 -155.61 112.94 -181.64 106.2 -208.61 C 102.41 -223.79 98.09 -240.85 93.23 -259.81 C 88.39 -278.78 82.7 -296.8 76.17 -313.86 C 69.64 -330.93 62.27 -345.05 54.05 -356.22 C 45.83 -367.38 36.24 -372.97 25.28 -372.97 L 25.28 -442.52 C 47.63 -442.52 66.59 -436.72 82.17 -425.12 C 97.77 -413.53 111.04 -397.72 122 -377.7 C 132.96 -357.69 142.55 -334.62 150.77 -308.48 C 158.98 -282.36 166.68 -254.55 173.84 -225.05 C 177.22 -211.98 181.22 -196.39 185.86 -178.27 C 190.49 -160.14 195.76 -142.65 201.66 -125.8 C 207.56 -108.94 214.3 -94.82 221.89 -83.44 C 229.47 -72.06 237.9 -66.38 247.17 -66.38 C 256.44 -66.38 264.87 -72.16 272.45 -83.75 C 280.05 -95.34 286.89 -109.88 293 -127.38 C 299.11 -144.86 304.38 -162.46 308.81 -180.16 C 313.24 -197.86 316.93 -212.83 319.88 -225.05 C 327.04 -253.7 334.63 -280.99 342.63 -306.91 C 350.63 -332.83 360.01 -356.02 370.75 -376.45 C 381.5 -396.89 394.77 -413.01 410.58 -424.81 C 426.39 -436.61 445.67 -442.52 468.42 -442.52 L 468.42 -372.97 C 457.46 -372.97 447.77 -367.27 439.34 -355.89 C 430.91 -344.52 423.44 -330.08 416.91 -312.59 C 410.38 -295.1 404.79 -276.98 400.16 -258.23 C 395.52 -239.48 391.3 -222.73 387.52 -207.98 C 380.35 -179.74 372.86 -152.98 365.06 -127.69 C 357.27 -102.41 348.32 -80.18 338.2 -61 C 328.09 -41.82 315.66 -26.75 300.91 -15.8 C 286.16 -4.85 268.24 0.62 247.17 0.62 Z'

const CELULAS = 38
const UNIDADE = 704 / CELULAS

/** 0 = bloco, 1 = peça azul, 2 = V */
type Tipo = 0 | 1 | 2

interface Pixels {
  n: number
  tipo: Tipo[]
  x: Float32Array
  y: Float32Array
  z: Float32Array
  atraso: Float32Array
  /** de onde cada pixel vem na montagem */
  ox: Float32Array
  oy: Float32Array
}

let cache: Pixels | null = null

/** Amostra o logo numa grade: cada célula coberta vira um pixel. Calculado uma vez. */
function pixels(): Pixels {
  if (cache) return cache
  const off = document.createElement('canvas')
  off.width = 704
  off.height = 710
  const o = off.getContext('2d', { willReadFrequently: true })!
  const camada = (desenha: () => void) => {
    o.clearRect(0, 0, 704, 710)
    desenha()
    return o.getImageData(0, 0, 704, 710).data
  }
  const bloco = camada(() => {
    o.beginPath()
    o.roundRect(0, 47.6, 662, 662, 96)
    o.fill()
  })
  const peca = camada(() => {
    o.beginPath()
    o.roundRect(42, 0.6, 662, 662, 96)
    o.fill()
  })
  const v = camada(() => {
    o.translate(126.39, 584.9)
    o.fill(new Path2D(V))
    o.setTransform(1, 0, 0, 1, 0, 0)
  })
  const dentro = (d: Uint8ClampedArray, x: number, y: number) =>
    d[(Math.floor(y) * 704 + Math.floor(x)) * 4 + 3] > 128

  const tipo: Tipo[] = []
  const xs: number[] = []
  const ys: number[] = []
  const zs: number[] = []
  const add = (t: Tipo, cx: number, cy: number, cz: number) => {
    tipo.push(t)
    xs.push((cx - 352) / 704)
    ys.push((cy - 355) / 704)
    zs.push(cz)
  }
  // o bloco inteiro entra primeiro (é desenhado atrás); z maior = mais longe
  for (const etapa of [0, 1] as const) {
    for (let r = 0; r < CELULAS; r++) {
      for (let c = 0; c < CELULAS; c++) {
        const cx = (c + 0.5) * UNIDADE
        const cy = (r + 0.5) * UNIDADE
        if (cy >= 710) continue
        if (etapa === 0 && dentro(bloco, cx, cy)) add(0, cx, cy, 0.09)
        if (etapa === 1 && dentro(peca, cx, cy)) {
          const noV = dentro(v, cx, cy)
          add(noV ? 2 : 1, cx, cy, noV ? -0.02 : 0)
        }
      }
    }
  }

  const n = tipo.length
  const aleatorio = (escala: number) =>
    Float32Array.from({ length: n }, () => (Math.random() - 0.5) * escala)
  cache = {
    n,
    tipo,
    x: Float32Array.from(xs),
    y: Float32Array.from(ys),
    z: Float32Array.from(zs),
    atraso: Float32Array.from({ length: n }, () => Math.random()),
    ox: aleatorio(3),
    oy: aleatorio(3),
  }
  if (import.meta.env.DEV) {
    console.assert(
      [0, 1, 2].every((t) => tipo.includes(t as Tipo)),
      'simbolo: a amostragem perdeu o bloco, a peça ou o V',
    )
  }
  return cache
}

/** 9 tons por camada (bloco, peça, V): mais claro quando o pixel vem pra frente */
export type Cores = string[][]

/** lê as cores do tema atual; chame de novo quando o tema mudar */
export function coresDoTema(): Cores {
  const css = getComputedStyle(document.documentElement)
  const hex = (nome: string) => {
    const h = css.getPropertyValue(nome).trim().replace('#', '')
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  const tons = ([r, g, b]: number[]) =>
    Array.from({ length: 9 }, (_, j) => {
      const k = 1 + (j - 4) * 0.045
      const c = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)))
      return `rgb(${c(r)},${c(g)},${c(b)})`
    })
  // bloco na cor do texto, peça azul, V na cor do fundo (como no logo, nos dois temas)
  return [tons(hex('--color-ink')), tons(hex('--color-blue')), tons(hex('--color-cream'))]
}

export interface Quadro {
  /** centro e tamanho do símbolo em px do canvas */
  cx: number
  cy: number
  tam: number
  /** segundos, move a onda */
  t: number
  /** inclinação em radianos */
  rx: number
  ry: number
  /** altura da onda (0 = parado) */
  onda: number
  /** 0 = pixels espalhados e longe, 1 = montado */
  montagem: number
  /** 0 = inteiro, 1 = pixels voaram contra a tela e sumiram */
  explosao: number
  cores: Cores
}

const limita = (v: number) => Math.max(0, Math.min(1, v))
const sai = (t: number) => 1 - Math.pow(1 - t, 3)

/** desenha um quadro: onda em diagonal, giro em Y e X, perspectiva e luz pela profundidade */
export function desenharSimbolo(ctx: CanvasRenderingContext2D, q: Quadro) {
  const p = pixels()
  const D = 2.6
  const cY = Math.cos(q.ry)
  const sY = Math.sin(q.ry)
  const cX = Math.cos(q.rx)
  const sX = Math.sin(q.rx)
  const lado0 = (q.tam / CELULAS) * 0.84

  for (let i = 0; i < p.n; i++) {
    let x = p.x[i]
    let y = p.y[i]
    let z = p.z[i] + q.onda * Math.sin((x * 1.1 + y * 0.8) * 7.5 - q.t * 2.6)
    let alfa = 1

    if (q.montagem < 1) {
      // cada pixel parte num momento diferente: a forma escorre em vez de pular
      const m = sai(limita(q.montagem * 1.7 - p.atraso[i] * 0.7))
      x = p.ox[i] + (x - p.ox[i]) * m
      y = p.oy[i] + (y - p.oy[i]) * m
      z = 3 + (z - 3) * m
      alfa = m
    }
    if (q.explosao > 0) {
      const e = q.explosao * q.explosao
      z -= e * (1.2 + p.atraso[i] * 2.6)
      x *= 1 + e * 0.8
      y *= 1 + e * 0.8
      alfa *= 1 - q.explosao
    }

    const x1 = x * cY + z * sY
    const z1 = -x * sY + z * cY
    const y1 = y * cX - z1 * sX
    const z2 = y * sX + z1 * cX
    const prof = D + z2
    if (prof < 0.2 || alfa <= 0.01) continue

    const s = D / prof
    const lado = lado0 * s
    ctx.globalAlpha = alfa
    ctx.fillStyle = q.cores[p.tipo[i]][Math.round(Math.max(-4, Math.min(4, -z2 * 30))) + 4]
    ctx.fillRect(q.cx + x1 * q.tam * s - lado / 2, q.cy + y1 * q.tam * s - lado / 2, lado, lado)
  }
  ctx.globalAlpha = 1
}

export interface Tela {
  ctx: CanvasRenderingContext2D
  largura: number
  altura: number
}

/**
 * Roda `desenha` a cada quadro enquanto `ativo` for true, com o canvas no
 * tamanho certo pra tela (até 2x de densidade) e as cores do tema em dia.
 */
export function useCanvasAnimado(
  desenha: (tela: Tela, cores: Cores, agora: number) => void,
  ativo: boolean,
) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const desenhaRef = useRef(desenha)
  desenhaRef.current = desenha

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !ativo) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const tela: Tela = { ctx, largura: 0, altura: 0 }
    let dpr = 1
    const medir = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      tela.largura = r.width
      tela.altura = r.height
      canvas.width = Math.round(r.width * dpr)
      canvas.height = Math.round(r.height * dpr)
    }
    const ro = new ResizeObserver(medir)
    ro.observe(canvas)
    medir()

    let cores = coresDoTema()
    const escuro = window.matchMedia('(prefers-color-scheme: dark)')
    const trocaTema = () => {
      cores = coresDoTema()
    }
    escuro.addEventListener('change', trocaTema)
    // data-tema="claro" desliga o escuro (index.css): as cores seguem também
    const tema = new MutationObserver(trocaTema)
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })

    let raf = 0
    const quadro = (agora: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, tela.largura, tela.altura)
      desenhaRef.current(tela, cores, agora)
      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      escuro.removeEventListener('change', trocaTema)
      tema.disconnect()
    }
  }, [ativo])

  return ref
}
