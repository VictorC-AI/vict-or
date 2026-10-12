import { useEffect, useRef, useState } from 'react'
import { contactCta, nav } from '../data/site'
import { Wordmark } from './Logo'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // marcador invisível nos primeiros 24px da página: quando ele sai da tela,
  // o menu ganha fundo. Sem ouvir o scroll a cada quadro.
  const marcador = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = marcador.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div
        ref={marcador}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-6 w-px"
      />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? 'border-b border-ink/15 bg-cream/85 backdrop-blur-md'
            : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-16 items-center justify-between gap-4 sm:h-20">
          <a href="#topo" aria-label="Início" className="shrink-0">
            <Wordmark />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="type-narrow text-[0.95rem] font-medium text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
            <a
              href={contactCta.href}
              className="rounded-lg bg-blue px-4 py-2.5 text-[0.95rem] font-bold text-bone transition-transform duration-150 active:scale-[0.98]"
            >
              {contactCta.label}
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center rounded-lg border border-ink/25 bg-cream md:hidden"
          >
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 13h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div
            id="menu-mobile"
            className="border-t border-ink/15 bg-cream md:hidden"
          >
            <nav aria-label="Principal (celular)" className="shell flex flex-col py-3">
              {[...nav, contactCta].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink/10 py-3.5 text-lg font-semibold last:border-0"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
