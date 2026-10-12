import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../lib/motion'

/**
 * Entra na tela subindo de leve quando o bloco aparece, uma vez só.
 * É o mesmo .reveal do index.css (IntersectionObserver + transição em CSS,
 * sem biblioteca de animação); com movimento reduzido já nasce no lugar.
 * `ordem` escalona itens irmãos: cada um espera um pouco mais que o anterior.
 */
export default function Reveal({
  as: Tag = 'div',
  ordem = 0,
  className = '',
  children,
}: {
  as?: ElementType
  ordem?: number
  className?: string
  children: ReactNode
}) {
  const ref = useReveal<HTMLElement>()
  const style = ordem ? ({ transitionDelay: `${Math.min(ordem, 6) * 90}ms` } as CSSProperties) : undefined
  return (
    <Tag ref={ref} style={style} className={`reveal ${className}`}>
      {children}
    </Tag>
  )
}
