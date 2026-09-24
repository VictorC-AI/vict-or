import { useEffect, useRef } from 'react'

const CELL = 26
const GAP = 4
const RADIUS = 130
const DECAY = 0.935

/**
 * Malha de blocos que acende onde o dedo ou o cursor passa, e apaga sozinha.
 * Toda a animação responde a um gesto — nada se mexe sozinho.
 *
 * No celular o tratamento é separado: `pointermove` é cancelado assim que o
 * navegador assume o gesto como rolagem, então quem responde ali é o
 * `touchmove`, registrado como passivo pra não atrapalhar o scroll. O rastro
 * acende embaixo do dedo enquanto a pessoa rola a página.
 *
 * Com prefers-reduced-motion a malha fica estática.
 */
export default function GridField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cols = 0
    let rows = 0
    let heat = new Float32Array(0)
    let raf = 0
    let dpr = 1


    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / (CELL + GAP)) + 1
      rows = Math.ceil(height / (CELL + GAP)) + 1
      heat = new Float32Array(cols * rows)
    }

    const draw = () => {
      const w = canvas.width / dpr
      const h = canvas.height / dpr
      ctx.clearRect(0, 0, w, h)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = heat[y * cols + x]
          const px = x * (CELL + GAP)
          const py = y * (CELL + GAP)

          if (v > 0.015) {
            ctx.fillStyle = `rgba(35, 61, 255, ${Math.min(v, 1) * 0.92})`
            ctx.fillRect(px, py, CELL, CELL)
          } else {
            // malha de repouso: pontinho quase invisível
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'
            ctx.fillRect(px + CELL / 2 - 1, py + CELL / 2 - 1, 2, 2)
          }
        }
      }
    }

    const tick = () => {
      let alive = false

      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0.001) {
          heat[i] *= DECAY
          alive = true
        } else heat[i] = 0
      }

      draw()

      // nada aceso: para o loop em vez de girar à toa
      if (!alive) {
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!reduced && !raf) raf = requestAnimationFrame(tick)
    }

    /**
     * Acende no próprio evento, não no próximo quadro. Um toque rápido
     * termina antes da primeira animação rodar — se a tinta dependesse do
     * loop, tap nenhum deixaria marca.
     */
    const setFrom = (clientX: number, clientY: number) => {
      const r = canvas.getBoundingClientRect()
      const px0 = clientX - r.left
      const py0 = clientY - r.top
      const dentro =
        px0 > -RADIUS &&
        py0 > -RADIUS &&
        px0 < r.width + RADIUS &&
        py0 < r.height + RADIUS
      if (!dentro) return

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * (CELL + GAP) + CELL / 2
          const py = y * (CELL + GAP) + CELL / 2
          const d = Math.hypot(px - px0, py - py0)
          if (d < RADIUS) {
            const add = (1 - d / RADIUS) ** 2
            const i = y * cols + x
            if (add > heat[i]) heat[i] = add
          }
        }
      }
      wake()
    }

    // mouse e caneta
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setFrom(e.clientX, e.clientY)
    }

    // toque: sobrevive à rolagem, ao contrário do pointermove
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) setFrom(t.clientX, t.clientY)
    }

    resize()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      draw()
      wake()
    })
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    if (!reduced) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('touchstart', onTouch, { passive: true })
      window.addEventListener('touchmove', onTouch, { passive: true })
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
