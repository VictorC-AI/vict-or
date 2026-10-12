import { useEffect, useId, useState, useSyncExternalStore, type FormEvent } from 'react'
import type { Project } from '../data/site'
import {
  alternar,
  assinar,
  carregarTotais,
  deixarRecado,
  ErroCurtida,
  estadoAtual,
} from '../lib/curtidas'

function Coracao({ cheio }: { cheio: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
      <path
        d="M10 17s-6.5-4-6.5-8.5A3.5 3.5 0 0110 6a3.5 3.5 0 016.5 2.5C16.5 13 10 17 10 17z"
        fill={cheio ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Botão de curtir. Fica no card de cada projeto e no detalhe; os dois leem o
 * mesmo estado (lib/curtidas.ts). O número só aparece a partir de 10: abaixo
 * disso o banco nem devolve o total.
 */
export function Curtir({
  project,
  compacto = false,
}: {
  project: Project
  compacto?: boolean
}) {
  const { curtidos, totais } = useSyncExternalStore(assinar, estadoAtual)
  const curtido = curtidos.has(project.slug)
  const total = totais[project.slug]
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(carregarTotais, [])

  const clicar = async () => {
    setOcupado(true)
    setAviso('')
    try {
      await alternar(project.slug)
    } catch (e) {
      setAviso(e instanceof ErroCurtida ? e.message : 'Não deu pra registrar agora.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <span className="relative z-10 inline-flex flex-col items-start">
      <button
        type="button"
        aria-pressed={curtido}
        aria-label={compacto ? `Curtir ${project.title}` : undefined}
        disabled={ocupado}
        onClick={clicar}
        className={`inline-flex items-center gap-2 border-2 border-ink font-bold transition-transform active:scale-[0.96] ${
          compacto
            ? 'px-2.5 py-1 text-xs'
            : 'shadow-hard-sm px-4 py-2 text-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
        } ${curtido ? 'bg-blue text-bone' : 'bg-paper hover:bg-blue-soft'}`}
      >
        <Coracao cheio={curtido} />
        {curtido ? 'Curtido' : 'Curtir'}
        {total != null && (
          <span className={`font-mono text-xs ${curtido ? 'text-bone/75' : 'text-muted'}`}>
            {total} <span className="sr-only">curtidas</span>
          </span>
        )}
      </button>
      <span aria-live="polite" className="text-xs text-muted empty:hidden">
        {aviso}
      </span>
    </span>
  )
}

/**
 * Fim do detalhe: curtir e um feedback sobre o projeto. O feedback chega por
 * e-mail pro Victor e não aparece no site; não é o formulário de orçamento.
 */
export default function Reacoes({ project }: { project: Project }) {
  const id = useId()
  const [nome, setNome] = useState('')
  const [texto, setTexto] = useState('')
  const [estado, setEstado] = useState<'livre' | 'enviando' | 'enviado' | 'erro'>('livre')
  const [erro, setErro] = useState('')

  // trocou de projeto com o detalhe aberto: formulário limpo
  useEffect(() => {
    setNome('')
    setTexto('')
    setEstado('livre')
    setErro('')
  }, [project.slug])

  const enviar = async (e: FormEvent) => {
    e.preventDefault()
    setEstado('enviando')
    setErro('')
    try {
      await deixarRecado(project.slug, nome, texto)
      setEstado('enviado')
      setTexto('')
    } catch (e) {
      setEstado('erro')
      setErro(e instanceof ErroCurtida ? e.message : 'Não deu pra enviar agora.')
    }
  }

  const campo =
    'w-full border-2 border-ink bg-cream px-3.5 py-2.5 text-ink placeholder:text-muted focus:outline-none focus-visible:border-blue'

  return (
    <section className="rule mt-9 pt-7" aria-labelledby={`${id}-titulo`}>
      <h3 id={`${id}-titulo`} className="text-lg font-bold">
        Gostou do projeto?
      </h3>
      <div className="mt-4">
        <Curtir project={project} />
      </div>

      {estado === 'enviado' ? (
        <p role="status" className="mt-8 max-w-[52ch] leading-relaxed">
          <span className="font-bold">Valeu!</span> Seu feedback chegou pra mim.
          {' '}
          <button
            type="button"
            onClick={() => setEstado('livre')}
            className="font-bold underline underline-offset-4 hover:text-blue"
          >
            Escrever outro
          </button>
        </p>
      ) : (
        <form onSubmit={enviar} className="mt-8 grid max-w-xl gap-4">
          <label className="grid gap-2">
            <span className="font-semibold">O que você achou?</span>
            <textarea
              required
              minLength={3}
              maxLength={1000}
              rows={3}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="O que chamou atenção, o que ficou confuso, o que você mudaria."
              className={`${campo} resize-y`}
            />
          </label>
          <label className="grid gap-2">
            <span className="font-semibold">
              Seu nome <span className="font-normal text-muted">(opcional)</span>
            </span>
            <input
              maxLength={60}
              autoComplete="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={campo}
            />
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="shadow-hard-sm border-2 border-ink bg-ink px-5 py-2.5 font-bold text-cream transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviar feedback'}
            </button>
            {erro && (
              <p role="alert" className="text-sm font-semibold text-ink">
                {erro}
              </p>
            )}
          </div>
        </form>
      )}

      <p className="mt-6 max-w-[60ch] text-sm leading-relaxed text-muted">
        O feedback chega só pra mim e não aparece no site. Pra contar um voto por
        pessoa, guardo um código aleatório neste navegador. Sem cookies e sem
        rastreamento.
      </p>
    </section>
  )
}
