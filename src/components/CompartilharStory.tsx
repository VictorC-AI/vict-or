import { useEffect, useRef, useState } from 'react'
import { projects, urlDoProjeto, type Project } from '../data/site'
import { asset } from '../lib/asset'
import {
  compartilharStories,
  podeCompartilharArquivos,
  prepararStory,
  temStory,
  type Resultado,
} from '../lib/compartilhar'

const AVISO: Record<Resultado, string> = {
  compartilhado: '',
  cancelado: '',
  baixado: 'Pronto: abra o Instagram e poste nos Stories a partir da galeria.',
}

const BOTAO =
  'shadow-hard-sm inline-flex items-center gap-2 border-2 border-ink bg-paper px-4 py-2 text-sm font-bold transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60'

function IconeCompartilhar() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13V3M6 7l4-4 4 4M4 11v6h12v-6" strokeLinecap="square" />
    </svg>
  )
}

function IconeLink() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8.5 11.5l3-3M7 9.5l-2 2a2.5 2.5 0 003.5 3.5l2-2M13 10.5l2-2A2.5 2.5 0 0011.5 5l-2 2" strokeLinecap="square" />
    </svg>
  )
}

/** decide o texto do botão só no navegador (no celular compartilha, no computador baixa) */
function useCompartilha(quantos: number) {
  const [compartilha, setCompartilha] = useState(false)
  useEffect(() => setCompartilha(podeCompartilharArquivos(quantos)), [quantos])
  return compartilha
}

/** botão do detalhe do projeto: um story */
export function BotaoStory({ project }: { project: Project }) {
  const compartilha = useCompartilha(1)
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState('')

  // já busca a imagem quando o detalhe abre
  useEffect(() => {
    prepararStory(project.slug).catch(() => {})
    setAviso('')
  }, [project.slug])

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(urlDoProjeto(project.slug))
      setAviso('Link copiado. No WhatsApp e na DM ele aparece com a imagem do projeto.')
    } catch {
      setAviso(urlDoProjeto(project.slug))
    }
  }

  if (!temStory(project)) {
    return (
      <div className="mt-6">
        <button type="button" className={BOTAO} onClick={copiarLink}>
          <IconeLink />
          Copiar link
        </button>
        <p aria-live="polite" className="mt-2 text-sm text-muted">{aviso}</p>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-wrap items-start gap-3">
      <button
        type="button"
        className={BOTAO}
        disabled={ocupado}
        onClick={async () => {
          setOcupado(true)
          try {
            setAviso(AVISO[await compartilharStories([project])])
          } catch {
            setAviso('Não deu pra preparar a imagem agora. Tente de novo em instantes.')
          } finally {
            setOcupado(false)
          }
        }}
      >
        <IconeCompartilhar />
        {compartilha ? 'Compartilhar nos stories' : 'Baixar imagem para stories'}
      </button>
      <button type="button" className={BOTAO} onClick={copiarLink}>
        <IconeLink />
        Copiar link
      </button>
      <p aria-live="polite" className="w-full text-sm text-muted">
        {aviso}
      </p>
    </div>
  )
}

/** "Compartilhar trabalhos": escolhe 2 ou 3 projetos, um story por projeto */
export function CompartilharTrabalhos() {
  const ref = useRef<HTMLDialogElement | null>(null)
  const disponiveis = projects.filter(temStory)
  const [escolhidos, setEscolhidos] = useState<string[]>(() => disponiveis.slice(0, 3).map((p) => p.slug))
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState('')
  const compartilha = useCompartilha(Math.max(escolhidos.length, 1))

  if (disponiveis.length < 2) return null

  // na ordem da escolha: é a ordem dos stories
  const selecionados = escolhidos
    .map((s) => disponiveis.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p))
  const valido = selecionados.length >= 2 && selecionados.length <= 3

  const alternar = (slug: string) =>
    setEscolhidos((atual) =>
      atual.includes(slug)
        ? atual.filter((s) => s !== slug)
        : atual.length >= 3
          ? atual
          : [...atual, slug],
    )

  return (
    <>
      <button
        type="button"
        className={BOTAO}
        onClick={() => {
          setAviso('')
          disponiveis.forEach((p) => prepararStory(p.slug).catch(() => {}))
          ref.current?.showModal()
        }}
      >
        <IconeCompartilhar />
        Compartilhar trabalhos
      </button>

      <dialog
        ref={ref}
        aria-labelledby="compartilhar-titulo"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
        className="m-auto w-[min(34rem,calc(100%-2rem))] border-2 border-ink bg-paper p-0 backdrop:bg-ink/70"
      >
        <div className="p-6">
          <h3 id="compartilhar-titulo" className="type-display text-2xl">
            Compartilhar trabalhos
          </h3>
          <p className="mt-1 text-sm text-muted">
            Escolha 2 ou 3. Vira uma sequência de stories, na ordem em que você tocar.
          </p>

          <ul className="mt-5 grid grid-cols-3 gap-3">
            {disponiveis.map((p) => {
              const ordem = escolhidos.indexOf(p.slug)
              const marcado = ordem >= 0
              const cheio = !marcado && escolhidos.length >= 3
              return (
                <li key={p.slug}>
                  <label
                    className={`relative block cursor-pointer border-2 transition ${
                      marcado ? 'border-blue' : 'border-ink/20'
                    } ${cheio ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={marcado}
                      disabled={cheio}
                      onChange={() => alternar(p.slug)}
                    />
                    <img
                      src={asset(`/share/story-${p.slug}.jpg`)}
                      alt=""
                      loading="lazy"
                      className="block aspect-[9/16] w-full object-cover"
                    />
                    <span className="block truncate px-2 py-1.5 text-xs font-bold">{p.title}</span>
                    {marcado && (
                      <span
                        aria-hidden="true"
                        className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full border-2 border-ink bg-blue font-mono text-xs font-bold text-cream"
                      >
                        {ordem + 1}
                      </span>
                    )}
                  </label>
                </li>
              )
            })}
          </ul>

          <p aria-live="polite" className="mt-4 min-h-5 text-sm text-muted">
            {aviso}
          </p>

          <div className="mt-2 flex flex-wrap justify-end gap-3">
            <button type="button" className="px-3 py-2 text-sm font-bold underline" onClick={() => ref.current?.close()}>
              Fechar
            </button>
            <button
              type="button"
              disabled={!valido || ocupado}
              className="shadow-hard-sm border-2 border-ink bg-blue px-4 py-2 text-sm font-bold text-cream transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
              onClick={async () => {
                setOcupado(true)
                try {
                  const r = await compartilharStories(selecionados)
                  setAviso(
                    r === 'baixado'
                      ? `${selecionados.length} imagens baixadas, em ordem. Poste nos Stories a partir da galeria.`
                      : AVISO[r],
                  )
                } catch {
                  setAviso('Não deu pra preparar as imagens agora. Tente de novo em instantes.')
                } finally {
                  setOcupado(false)
                }
              }}
            >
              {compartilha
                ? `Compartilhar ${selecionados.length} stories`
                : `Baixar ${selecionados.length} imagens`}
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
