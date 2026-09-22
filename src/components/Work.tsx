import { useMemo, useState } from 'react'
import { categoryLabel, projects, type Category, type Project } from '../data/site'
import ProjectCover from './ProjectCover'
import ProjectDialog from './ProjectDialog'

type Filter = 'tudo' | Category

/** ordem fixa; só entra no filtro a categoria que tem projeto publicado */
const ORDER: { id: Category; label: string }[] = [
  { id: 'site', label: 'Sites' },
  { id: 'jogo', label: 'Jogos' },
  { id: 'ecommerce', label: 'E-commerce' },
]

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'tudo', label: 'Tudo' },
  ...ORDER.filter((c) => projects.some((p) => p.category === c.id)),
]

export default function Work() {
  const [filter, setFilter] = useState<Filter>('tudo')
  const [open, setOpen] = useState<{ project: Project; index: number } | null>(null)

  const visible = useMemo(
    () =>
      projects
        .map((p, i) => ({ p, i }))
        .filter(({ p }) => filter === 'tudo' || p.category === filter),
    [filter],
  )

  const count = (id: Filter) =>
    id === 'tudo'
      ? projects.length
      : projects.filter((p) => p.category === id).length

  return (
    <section id="trabalhos" className="bg-cream">
      <div className="shell py-20 sm:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[46ch]">
            <h2 className="type-display text-big">Trabalhos</h2>
            <p className="text-lead mt-5 text-ink/75">
              Clique em qualquer um para ver o problema, a decisão técnica e o
              resultado.
            </p>
          </div>

          {FILTERS.length > 2 && (
          <div
            role="group"
            aria-label="Filtrar trabalhos por tipo"
            className="flex flex-wrap gap-2"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`border-2 border-ink px-4 py-2 text-sm font-bold transition-colors ${
                    active
                      ? 'bg-ink text-cream'
                      : 'bg-transparent text-ink hover:bg-ink/10'
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-2 font-mono text-xs ${
                      active ? 'text-cream/60' : 'text-muted'
                    }`}
                  >
                    {count(f.id)}
                  </span>
                </button>
              )
            })}
          </div>
          )}
        </div>

        <ul className="mt-12 grid gap-x-8 gap-y-14 sm:mt-16 md:grid-cols-2">
          {visible.map(({ p, i }, pos) => {
            const featured = pos === 0
            return (
              <li
                key={p.slug}
                className={
                  featured
                    ? 'relative md:col-span-2 md:grid md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10'
                    : 'relative flex flex-col'
                }
              >
                <div className="border-2 border-ink">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt=""
                      loading="lazy"
                      className={`w-full object-cover ${
                        featured ? 'aspect-[16/9]' : 'aspect-[160/112]'
                      }`}
                    />
                  ) : (
                    <ProjectCover
                      category={p.category}
                      index={i}
                      className={`w-full ${
                        featured ? 'aspect-[16/9]' : 'aspect-[160/112]'
                      }`}
                    />
                  )}
                </div>

                <div className={featured ? 'mt-5 md:mt-0' : 'contents'}>
                  <h3
                    className={`type-display ${
                      featured ? 'text-4xl sm:text-5xl' : 'mt-5 text-3xl'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen({ project: p, index: i })}
                      aria-label={`Ver detalhes de ${p.title}`}
                      className="text-left after:absolute after:inset-0 after:content-[''] hover:text-blue"
                    >
                      {p.title}
                    </button>
                  </h3>

                  <p
                    className={`max-w-[42ch] leading-relaxed text-ink/75 ${
                      featured ? 'mt-4 text-lg' : 'mt-2'
                    }`}
                  >
                    {p.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
                    <span className="font-bold text-ink">
                      {categoryLabel[p.category]}
                    </span>
                    <span>{p.year}</span>
                    {p.status && (
                      <span className="border border-ink/25 px-2 py-0.5 font-mono text-[0.72rem] text-ink/70">
                        {p.status}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {visible.length === 0 && (
          <p className="mt-16 text-lg text-muted">
            Ainda não tem nada publicado nessa categoria.{' '}
            <a href="#contato" className="font-bold text-ink underline">
              Seja o primeiro projeto.
            </a>
          </p>
        )}
      </div>

      <ProjectDialog
        project={open?.project ?? null}
        index={open?.index ?? 0}
        onClose={() => setOpen(null)}
      />
    </section>
  )
}
