import { useEffect, useRef, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/** true quando o sistema pede menos movimento; acompanha a mudança ao vivo */
export function useReducedMotion(): boolean {
  const [reduzido, setReduzido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduzido(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduzido
}

/**
 * Marca o elemento com data-visivel quando ele entra na tela, uma vez só.
 * O CSS de .reveal faz o resto — e com movimento reduzido ele já nasce visível.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.visivel = ''
        io.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/** true enquanto o elemento está (pelo menos em parte) na tela */
export function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [visivel, setVisivel] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visivel
}
