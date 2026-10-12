import type { MouseEvent } from 'react'
import { projects, services } from '../data/site'
import { abrirProjeto, caminhoDoProjeto } from '../lib/rota'
import { useReveal } from '../lib/motion'

type Service = (typeof services)[number]

/** projetos publicados de cada serviço: a prova vem junto da promessa */
const provasDe = (s: Service) => projects.filter((p) => p.category === s.id)

const abrir = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
  // ctrl/cmd + clique e botão do meio seguem abrindo a página do projeto
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  abrirProjeto(slug)
}

function Inclui({ items, className = 'space-y-3' }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.98rem] leading-snug">
          <span aria-hidden="true" className="mt-[0.42em] size-2 shrink-0 bg-blue" />
          <span className="text-cream/90">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Provas({ s }: { s: Service }) {
  const provas = provasDe(s)
  if (provas.length === 0) return null
  return (
    <p className="mt-7 text-sm text-cream/60">
      {provas.length === 1 ? 'Projeto no ar: ' : 'Projetos no ar: '}
      {provas.map((p, i) => (
        <span key={p.slug}>
          {i > 0 && ', '}
          <a
            href={caminhoDoProjeto(p.slug)}
            onClick={abrir(p.slug)}
            className="font-bold text-cream underline decoration-cream/35 underline-offset-4 transition-colors hover:decoration-blue"
          >
            {p.title}
          </a>
        </span>
      ))}
    </p>
  )
}

/**
 * Serviços com projeto entregue ganham coluna inteira, e o maior primeiro.
 * O que ainda não tem projeto (e-commerce hoje) vira faixa embaixo: aparece,
 * mas sem disputar espaço com o que já tem prova. A regra sai dos dados, então
 * quando a primeira loja for publicada ela sobe sozinha.
 */
export default function Services() {
  const comProva = services.filter((s) => provasDe(s).length > 0)
  const semProva = services.filter((s) => provasDe(s).length === 0)
  const titulo = useReveal<HTMLDivElement>()
  const grade = useReveal<HTMLDivElement>()

  return (
    <section id="servicos" className="on-dark bg-ink text-cream">
      <div className="shell py-20 sm:py-28">
        <div ref={titulo} className="reveal max-w-[52ch]">
          <h2 className="type-display text-big">Três coisas, bem feitas.</h2>
          <p className="text-lead mt-6 text-cream/70">
            Não pego tudo que aparece. Estes são os trabalhos em que eu entrego o
            projeto inteiro sem terceirizar nada.
          </p>
        </div>

        <div ref={grade} className="reveal mt-12 sm:mt-16">
          <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-y-0">
            {comProva.map((s, i) => (
              <article
                key={s.id}
                className={
                  i === 0
                    ? 'flex flex-col lg:col-span-7 lg:pr-12'
                    : 'flex flex-col border-t border-cream/20 pt-12 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12'
                }
              >
                <h3
                  className={`type-display ${
                    i === 0 ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'
                  }`}
                >
                  {s.name}
                </h3>
                <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-cream/75">
                  {s.pitch}
                </p>
                <div className="mt-7">
                  <Inclui items={s.includes} />
                </div>
                <div className="mt-auto">
                  <Provas s={s} />
                  <p className="mt-3 text-sm text-cream/55">
                    Prazo típico: <span className="text-cream">{s.deliverable}</span>
                  </p>
                </div>
              </article>
            ))}
          </div>

          {semProva.map((s) => (
            <article
              key={s.id}
              className="shadow-hard-blue mt-14 grid gap-8 border-2 border-cream/80 p-7 sm:p-9 lg:mt-20 lg:grid-cols-12 lg:gap-12"
            >
              <div className="lg:col-span-5">
                <h3 className="type-display text-3xl sm:text-4xl">{s.name}</h3>
                <p className="mt-4 max-w-[40ch] leading-relaxed text-cream/75">
                  {s.pitch}
                </p>
                <p className="mt-5 text-sm text-cream/55">
                  Prazo típico: <span className="text-cream">{s.deliverable}</span>
                </p>
              </div>
              <div className="lg:col-span-7 lg:pt-2">
                <Inclui items={s.includes} className="grid gap-x-10 gap-y-3 sm:grid-cols-2" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
