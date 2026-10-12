import type { MouseEvent } from 'react'
import { projects, services } from '../data/site'
import { abrirProjeto, caminhoDoProjeto } from '../lib/rota'

type Service = (typeof services)[number]

/** projetos publicados de cada serviço: a prova vem junto da promessa */
const provasDe = (s: Service) => projects.filter((p) => p.category === s.id)

const abrir = (slug: string) => (e: MouseEvent<HTMLAnchorElement>) => {
  // ctrl/cmd + clique e botão do meio seguem abrindo a página do projeto
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  abrirProjeto(slug)
}

function Inclui({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item} className="border-t border-cream/15 py-3.5 text-[1.02rem] leading-snug text-cream/90">
          {item}
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
            className="font-bold text-cream underline decoration-cream/35 underline-offset-4 transition-colors hover:decoration-cream"
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

  return (
    <section id="servicos" className="on-dark bg-ink text-cream">
      <div className="shell py-20 sm:py-28">
        <div className="max-w-[52ch]">
          <h2 className="type-display text-big">Três coisas, bem feitas.</h2>
          <p className="text-lead mt-6 text-cream/70">
            Não pego tudo que aparece. Estes são os trabalhos em que eu entrego o
            projeto inteiro sem terceirizar nada.
          </p>
        </div>

        <div className="mt-12 grid gap-y-14 sm:mt-16 lg:grid-cols-12 lg:gap-y-0">
          {comProva.map((s, i) => (
            <article
              key={s.id}
              className={
                i === 0
                  ? 'flex flex-col lg:col-span-7 lg:pr-14'
                  : 'flex flex-col lg:col-span-5 lg:pt-24'
              }
            >
              <h3 className={`type-display ${i === 0 ? 'text-5xl sm:text-6xl' : 'text-4xl sm:text-5xl'}`}>
                {s.name}
              </h3>
              <p className="mt-4 max-w-[40ch] text-lg leading-relaxed text-cream/75">{s.pitch}</p>
              <Inclui items={s.includes} className="mt-7" />
              <div className="mt-auto">
                <Provas s={s} />
                <p className="mt-3 text-sm text-cream/60">
                  Prazo típico: <span className="text-cream">{s.deliverable}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {semProva.map((s) => (
          <article
            key={s.id}
            className="mt-16 grid gap-6 rounded-2xl border border-cream/20 p-7 sm:p-9 lg:mt-24 lg:grid-cols-12 lg:gap-12"
          >
            <div className="lg:col-span-5">
              <h3 className="type-display text-3xl sm:text-4xl">{s.name}</h3>
              <p className="mt-4 max-w-[40ch] leading-relaxed text-cream/75">{s.pitch}</p>
              <p className="mt-5 text-sm text-cream/60">
                Prazo típico: <span className="text-cream">{s.deliverable}</span>
              </p>
            </div>
            <Inclui items={s.includes} className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7" />
          </article>
        ))}
      </div>
    </section>
  )
}
