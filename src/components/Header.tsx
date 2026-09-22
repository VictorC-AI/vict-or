import { useEffect, useState } from 'react'
import { nav } from '../data/site'
import { Wordmark } from './Logo'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
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
              href="#contato"
              className="shadow-hard-sm border-2 border-ink bg-blue px-4 py-2 text-[0.95rem] font-bold text-cream transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Falar comigo
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="shadow-hard-sm flex size-10 items-center justify-center border-2 border-ink bg-paper md:hidden"
          >
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
                />
              ) : (
                <path
                  d="M3 6h14M3 13h14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="square"
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
              {[...nav, { label: 'Falar comigo', href: '#contato' }].map((item) => (
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
