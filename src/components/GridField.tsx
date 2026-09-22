import { useEffect, useRef } from 'react'

const CELL = 26
const GAP = 4
const RADIUS = 130
const DECAY = 0.935

/**
 * Malha de blocos que acende onde o cursor passa e apaga sozinha.
 * Toda a animação responde a um gesto — nada se mexe sozinho.
 * Com prefers-reduced-motion a malha vira estática.
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
    let dirty = true
    const pointer = { x: -9999, y: -9999, active: false }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(width / (CELL + GAP)) + 1
      rows = Math.ceil(height / (CELL + GAP)) + 1
      heat = new Float32Array(cols * rows)
      dirty = true
    }

    const draw = () => {
      const w = canvas.width / (Math.min(window.devicePixelRatio || 1, 2) || 1)
      const h = canvas.height / (Math.min(window.devicePixelRatio || 1, 2) || 1)
      ctx.clearRect(0, 0, w, h)

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x
          const v = heat[i]
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
      if (pointer.active) {
        const cx = pointer.x
        const cy = pointer.y
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const px = x * (CELL + GAP) + CELL / 2
            const py = y * (CELL + GAP) + CELL / 2
            const d = Math.hypot(px - cx, py - cy)
            if (d < RADIUS) {
              const add = (1 - d / RADIUS) ** 2
              const i = y * cols + x
              if (add > heat[i]) heat[i] = add
            }
          }
        }
      }
      for (let i = 0; i < heat.length; i++) {
        if (heat[i] > 0.001) {
          heat[i] *= DECAY
          alive = true
        } else heat[i] = 0
      }
      if (alive || dirty) {
        draw()
        dirty = false
      }
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      pointer.active =
        pointer.x > -RADIUS &&
        pointer.y > -RADIUS &&
        pointer.x < r.width + RADIUS &&
        pointer.y < r.height + RADIUS
    }
    const onLeave = () => {
      pointer.active = false
    }

    resize()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
      raf = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
