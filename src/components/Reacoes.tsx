import { useEffect, useState } from 'react'
import type { Project } from '../data/site'
import { alternarCurtida, contagens, curtidosAqui, ErroCurtida } from '../lib/curtidas'

// uma busca por visita, dividida entre todos os projetos abertos
let contagensDaVisita: Promise<Record<string, number>> | null = null
const buscarContagens = () => (contagensDaVisita ??= contagens().catch((): Record<string, number> => ({})))

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
 * Fim do detalhe: curtir e deixar um recado (no lugar de comentários abertos).
 * O número de curtidas só aparece a partir de 10 — abaixo disso o banco nem
 * devolve o total.
 */
export default function Reacoes({
  project,
  onRecado,
}: {
  project: Project
  onRecado: () => void
}) {
  const [curtido, setCurtido] = useState(() => curtidosAqui().has(project.slug))
  const [total, setTotal] = useState<number | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    setCurtido(curtidosAqui().has(project.slug))
    setAviso('')
    let vivo = true
    buscarContagens().then((c) => vivo && setTotal(c[project.slug] ?? null))
    return () => {
      vivo = false
    }
  }, [project.slug])

  const alternar = async () => {
    const novo = !curtido
    setCurtido(novo) // na hora; volta atrás se o servidor recusar
    setOcupado(true)
    setAviso('')
    try {
      const t = await alternarCurtida(project.slug, novo)
      setTotal(t)
      contagensDaVisita = null
    } catch (e) {
      setCurtido(!novo)
      setAviso(e instanceof ErroCurtida ? e.message : 'Não deu pra registrar agora.')
    } finally {
      setOcupado(false)
    }
  }

  return (
    <section className="rule mt-9 pt-7" aria-labelledby="reacoes-titulo">
      <h3 id="reacoes-titulo" className="text-lg font-bold">
        Gostou do projeto?
      </h3>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-pressed={curtido}
          disabled={ocupado}
          onClick={alternar}
          className={`shadow-hard-sm inline-flex items-center gap-2 border-2 border-ink px-4 py-2 text-sm font-bold transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
            curtido ? 'bg-blue text-cream' : 'bg-paper'
          }`}
        >
          <Coracao cheio={curtido} />
          {curtido ? 'Curtido' : 'Curtir'}
          {total != null && (
            <span className={`font-mono text-xs ${curtido ? 'text-cream/75' : 'text-muted'}`}>
              {total} <span className="sr-only">curtidas</span>
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onRecado}
          className="shadow-hard-sm inline-flex items-center gap-2 border-2 border-ink bg-paper px-4 py-2 text-sm font-bold transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
        >
          Deixar um recado
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-muted">
        {aviso}
      </p>
    </section>
  )
}
