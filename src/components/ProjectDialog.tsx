import { useEffect, useRef } from 'react'
import { categoryLabel, type Project } from '../data/site'
import ProjectCover from './ProjectCover'
import { asset } from '../lib/asset'

/** quebra o texto em parágrafos onde houver linha em branco */
function Paragrafos({ texto, className = '' }: { texto: string; className?: string }) {
  return (
    <>
      {texto.split(/\n{2,}/).map((p, i) => (
        <p
          key={p.slice(0, 24)}
          className={`max-w-[62ch] leading-relaxed text-ink/80 ${
            i === 0 ? '' : 'mt-4'
          } ${className}`}
        >
          {p}
        </p>
      ))}
    </>
  )
}

export default function ProjectDialog({
  project,
  index,
  onClose,
}: {
  project: Project | null
  index: number
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (project && !el.open) el.showModal()
    if (!project && el.open) el.close()
  }, [project])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleClose = () => onClose()
    el.addEventListener('close', handleClose)
    return () => el.removeEventListener('close', handleClose)
  }, [onClose])

  // trava o scroll do fundo enquanto o detalhe está aberto
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [project])

  const blocks = project
    ? [
        { head: 'O problema', body: project.problem },
        { head: 'O que eu fiz', body: project.solution },
        ...(project.result ? [{ head: 'Como ficou', body: project.result }] : []),
      ]
    : []

  return (
    <dialog
      ref={ref}
      aria-labelledby="detalhe-titulo"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-[2px]"
    >
      {project && (
        <div className="flex min-h-full items-start justify-center p-0 sm:p-6">
          <article className="w-full max-w-3xl border-2 border-ink bg-paper sm:my-6">
            <div className="relative">
              {project.image ? (
                <img
                  src={asset(project.image)}
                  alt={`Tela do projeto ${project.title}`}
                  className="aspect-[16/9] w-full border-b-2 border-ink object-cover"
                />
              ) : (
                <ProjectCover
                  category={project.category}
                  index={index}
                  className="h-40 w-full border-b-2 border-ink sm:h-56"
                />
              )}
              <form method="dialog" className="absolute top-3 right-3">
                <button
                  className="shadow-hard-sm flex size-10 items-center justify-center border-2 border-ink bg-paper transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                  aria-label="Fechar detalhe"
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

            <div className="p-6 sm:p-10">
              {project.logo && (
                <img
                  src={asset(project.logo)}
                  alt=""
                  className="mb-5 max-h-11 w-auto max-w-[190px] object-contain object-left sm:max-h-14 sm:max-w-[220px]"
                />
              )}

              <h2 id="detalhe-titulo" className="type-display text-4xl sm:text-5xl">
                {project.title}
              </h2>

              <dl className="rule mt-6 grid grid-cols-2 gap-x-6 gap-y-4 pt-5 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-muted">Tipo</dt>
                  <dd className="mt-0.5 font-bold">
                    {categoryLabel[project.category]}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted">Ano</dt>
                  <dd className="mt-0.5 font-bold">{project.year}</dd>
                </div>
                {project.status && (
                  <div>
                    <dt className="text-sm text-muted">Situação</dt>
                    <dd className="mt-0.5 font-bold">{project.status}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 space-y-7">
                {blocks.map((b) => (
                  <section key={b.head}>
                    <h3 className="mb-2 text-lg font-bold">{b.head}</h3>
                    <Paragrafos texto={b.body} />
                  </section>
                ))}
              </div>

              {project.features && project.features.length > 0 && (
                <ul className="mt-7 space-y-5">
                  {project.features.map((f) => (
                    <li key={f.title} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="mt-[0.5em] size-2 shrink-0 bg-blue"
                      />
                      <p className="max-w-[60ch] leading-relaxed text-ink/80">
                        <span className="font-bold text-ink">{f.title}.</span>{' '}
                        {f.body}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {project.featuresNote && (
                <p className="mt-6 max-w-[62ch] leading-relaxed text-ink/80">
                  {project.featuresNote}
                </p>
              )}

              {project.decisions && project.decisions.length > 0 && (
                <section className="rule mt-9 pt-7">
                  <h3 className="text-lg font-bold">Decisões de projeto</h3>
                  <ul className="mt-5 space-y-5">
                    {project.decisions.map((d) => (
                      <li key={d.title} className="flex gap-3.5">
                        <span
                          aria-hidden="true"
                          className="mt-[0.5em] size-2 shrink-0 bg-ink"
                        />
                        <p className="max-w-[60ch] leading-relaxed text-ink/80">
                          <span className="font-bold text-ink">{d.title}.</span>{' '}
                          {d.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.infra && (
                <section className="rule mt-9 pt-7">
                  <h3 className="mb-2 text-lg font-bold">Infraestrutura</h3>
                  <Paragrafos texto={project.infra} />
                </section>
              )}

              {project.role && (
                <section className="rule mt-9 pt-7">
                  <h3 className="mb-2 text-lg font-bold">Meu papel</h3>
                  <Paragrafos texto={project.role} />
                </section>
              )}

              {project.gallery && project.gallery.length > 0 && (
                <section className="rule mt-9 pt-7">
                  <h3 className="text-lg font-bold">Outras telas</h3>
                  <ul className="mt-5 space-y-7">
                    {project.gallery.map((shot) => (
                      <li key={shot.src}>
                        <img
                          src={asset(shot.src)}
                          alt={shot.caption}
                          loading="lazy"
                          className="w-full border-2 border-ink"
                        />
                        <p className="mt-2.5 text-sm text-muted">
                          {shot.caption}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="rule mt-9 pt-6">
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="border border-ink/25 px-2.5 py-1 font-mono text-[0.78rem]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {project.stackNote && (
                  <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-muted">
                    {project.stackNote}
                  </p>
                )}
              </div>

              {project.links && project.links.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shadow-hard-sm border-2 border-ink bg-blue px-5 py-2.5 font-bold text-cream transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      )}
    </dialog>
  )
}
