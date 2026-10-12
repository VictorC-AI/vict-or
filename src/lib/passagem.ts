/*
 * A onda de pixels azuis: cobre a tela da esquerda pra direita e descobre de
 * novo. Usada entre um projeto e outro no palco (Work) e pra abrir e fechar o
 * detalhe. A mesma linguagem de pixels do símbolo da abertura.
 */

/** duração da onda inteira (cobrir + descobrir), em ms */
export const PASSAGEM = 1400

const AZUL = '#233dff' // azul da marca, igual nos dois temas

const limita = (v: number) => Math.max(0, Math.min(1, v))
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const sorteio = (c: number, r: number) => {
  const s = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453
  return s - Math.floor(s)
}

/**
 * desenha a onda no ponto tt (0 a 1); em 0.5 a tela está toda coberta.
 * sentido 1 varre da esquerda pra direita, -1 da direita pra esquerda.
 */
export function desenharOnda(
  ctx: CanvasRenderingContext2D,
  largura: number,
  altura: number,
  tt: number,
  sentido: 1 | -1 = 1,
) {
  if (tt <= 0 || tt >= 1) return
  const lado = largura < 700 ? 34 : 56
  const cols = Math.ceil(largura / lado)
  const linhas = Math.ceil(altura / lado)
  const k = tt * 2
  ctx.fillStyle = AZUL
  for (let c = 0; c < cols; c++) {
    for (let l = 0; l < linhas; l++) {
      // da esquerda pra direita, com um pouco de acaso pra não virar uma régua
      const coluna = sentido === 1 ? c : cols - 1 - c
      const d = (coluna / cols) * 0.62 + (l / linhas) * 0.14 + sorteio(c, l) * 0.24
      const cobre = k <= 1 ? limita((k * 1.7 - d) / 0.5) : 1 - limita(((k - 1) * 1.7 - d) / 0.5)
      if (cobre <= 0) continue
      const q = lado * suave(cobre) + 0.6
      ctx.fillRect(c * lado + (lado - q) / 2, l * lado + (lado - q) / 2, q, q)
    }
  }
}

let camada: HTMLDivElement | null = null
let rodando = false

/**
 * Camada da onda: um popover manual, porque precisa ficar por cima do
 * <dialog> do detalhe (os dois moram na top layer; a última aberta fica em cima).
 */
function criarCamada() {
  if (camada) return camada
  camada = document.createElement('div')
  camada.setAttribute('popover', 'manual')
  camada.setAttribute('aria-hidden', 'true')
  Object.assign(camada.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100dvh',
    margin: '0',
    padding: '0',
    border: '0',
    background: 'transparent',
    overflow: 'hidden',
  })
  camada.appendChild(document.createElement('canvas'))
  document.body.appendChild(camada)
  return camada
}

/**
 * Roda a onda e chama `meio` no meio dela, com a tela coberta (abrir ou fechar
 * o detalhe). Sem a API de popover, com movimento reduzido ou com outra onda
 * já rodando, `meio` roda na hora, sem animação.
 */
export function passar(meio: () => void) {
  const semAnimacao =
    rodando ||
    !('showPopover' in HTMLElement.prototype) ||
    document.visibilityState !== 'visible' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (semAnimacao) {
    meio()
    return
  }

  const el = criarCamada()
  const canvas = el.firstElementChild as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    meio()
    return
  }
  rodando = true
  el.showPopover()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const largura = window.innerWidth
  const altura = window.innerHeight
  canvas.width = Math.round(largura * dpr)
  canvas.height = Math.round(altura * dpr)
  canvas.style.width = `${largura}px`
  canvas.style.height = `${altura}px`

  const inicio = performance.now()
  let trocou = false
  const quadro = (agora: number) => {
    const tt = (agora - inicio) / PASSAGEM
    if (tt >= 0.5 && !trocou) {
      trocou = true
      try {
        meio()
      } finally {
        // o detalhe acabou de abrir por cima: a onda volta pra frente dele
        el.hidePopover()
        el.showPopover()
      }
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, largura, altura)
    if (tt >= 1) {
      el.hidePopover()
      rodando = false
      return
    }
    desenharOnda(ctx, largura, altura, Math.max(tt, 0.001))
    requestAnimationFrame(quadro)
  }
  requestAnimationFrame(quadro)
}
