import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'

export interface Shot {
  src: string
  caption: string
}

/**
 * Visualizador de telas cheias, aberto a partir da galeria do projeto.
 *
 * Os prints são de interface de desktop: no celular, caber inteiro na
 * largura significa texto ilegível. Por isso o toque alterna entre caber
 * na tela e tamanho real com rolagem lateral — que é como a pessoa
 * realmente consegue ler um painel de estoque no telefone.
 */
export default function Lightbox({
  shots,
  index,
  onIndex,
  onClose,
}: {
  shots: Shot[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement | null>(null)
  // no celular, caber inteiro deixa o print ilegível: já abre ampliado
  const telaEstreita = () =>
    typeof window !== 'undefined' && window.innerWidth < 640
  const [zoom, setZoom] = useState(telaEstreita)

  const aberto = index !== null
  const atual = aberto ? shots[index] : null

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (aberto && !el.open) el.showModal()
    if (!aberto && el.open) el.close()
  }, [aberto])

  useEffect(() => setZoom(telaEstreita()), [index])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fechar = () => onClose()
    el.addEventListener('close', fechar)
    return () => el.removeEventListener('close', fechar)
  }, [onClose])

  // setas do teclado passam de uma tela pra outra
  useEffect(() => {
    if (!aberto || index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onIndex((index + 1) % shots.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + shots.length) % shots.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aberto, index, shots.length, onIndex])

  const navegar = (passo: number) => {
    if (index === null) return
    onIndex((index + passo + shots.length) % shots.length)
  }

  return (
    <dialog
      ref={ref}
      aria-label="Telas do projeto"
      className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 backdrop:bg-ink"
    >
      {atual && (
        <div className="flex h-dvh flex-col">
          <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <p className="font-mono text-sm text-cream/60">
              {(index ?? 0) + 1} / {shots.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom((v) => !v)}
                className="border-2 border-cream/40 px-3 py-1.5 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-ink"
              >
                {zoom ? 'Caber na tela' : 'Ampliar'}
              </button>
              <form method="dialog">
                <button
                  aria-label="Fechar"
                  className="flex size-10 items-center justify-center border-2 border-cream/40 text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
                    <path
                      d="M4 4l12 12M16 4L4 16"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </header>

          <div
            className={`flex min-h-0 flex-1 ${
              zoom ? 'items-start overflow-auto' : 'items-center justify-center'
            } px-4 pb-2 sm:px-6`}
          >
            <img
              src={asset(atual.src)}
              alt={atual.caption}
              onClick={() => setZoom((v) => !v)}
              className={
                zoom
                  ? 'h-full w-auto max-w-none cursor-zoom-out sm:h-auto sm:w-[1600px]'
                  : 'max-h-full max-w-full cursor-zoom-in object-contain'
              }
            />
          </div>

          <footer className="shrink-0 px-4 pb-5 sm:px-6">
            <p className="mx-auto max-w-[70ch] text-center text-sm leading-relaxed text-cream/80">
              {atual.caption}
            </p>

            {shots.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navegar(-1)}
                  className="border-2 border-cream/40 px-4 py-2 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => navegar(1)}
                  className="border-2 border-cream/40 px-4 py-2 text-sm font-bold text-cream transition-colors hover:bg-cream hover:text-ink"
                >
                  Próxima
                </button>
              </div>
            )}
          </footer>
        </div>
      )}
    </dialog>
  )
}
