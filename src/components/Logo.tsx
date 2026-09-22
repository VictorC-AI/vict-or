interface LogoProps {
  /** cor do 'V' dentro do bloco azul */
  glyph?: 'cream' | 'ink'
  /** cor do bloco deslocado atrás */
  shadow?: 'ink' | 'cream'
  className?: string
  title?: string
}

/**
 * Marca vict.<OR> — bloco azul com o V e um bloco sólido deslocado atrás.
 * Pra usar o SVG original do seu designer, troque o conteúdo desta função.
 */
export default function Logo({
  glyph = 'cream',
  shadow = 'ink',
  className = 'size-9',
  title = 'vict.<OR>',
}: LogoProps) {
  const glyphFill = glyph === 'cream' ? 'var(--color-cream)' : 'var(--color-ink)'
  const shadowFill = shadow === 'ink' ? 'var(--color-ink)' : 'var(--color-cream)'

  return (
    <svg
      viewBox="0 0 112 112"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <rect x="0" y="8" width="104" height="104" rx="30" fill={shadowFill} />
      <rect x="8" y="0" width="104" height="104" rx="30" fill="var(--color-blue)" />
      <path
        transform="translate(8 0)"
        d="M24 22 L38 22 C38 42 42 66 52 66 C62 66 66 42 66 22 L80 22 C80 56 70 84 52 84 C34 84 24 56 24 22 Z"
        fill={glyphFill}
      />
    </svg>
  )
}

/** Wordmark completo: bloco + 'vict.<OR>'. */
export function Wordmark({
  tone = 'ink',
  className = '',
}: {
  tone?: 'ink' | 'cream'
  className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo
        glyph={tone === 'ink' ? 'cream' : 'ink'}
        shadow={tone}
        className="size-7 shrink-0 sm:size-8"
      />
      <span
        className="type-display text-[1.35rem] leading-none sm:text-2xl"
        style={{ color: tone === 'ink' ? 'var(--color-ink)' : 'var(--color-cream)' }}
      >
        vict.<span className="type-wide">&lt;OR&gt;</span>
      </span>
    </span>
  )
}
