import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { categoryLabel, type Project } from '../data/site'
import ProjectCover from './ProjectCover'
import Lightbox, { type Shot } from './Lightbox'
import Showcase from './Showcase'
import { CoverBanner, camada, nomeDaCapa } from './CoverArt'
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
  onRequestClose,
}: {
  project: Project | null
  index: number
  /** o diálogo já fechou (avisa o estado) */
  onClose: () => void
  /** pedido de fechar (botão, Esc, clique fora): quem chama decide se anima */
  onRequestClose: () => void
}) {
  const ref = useRef<HTMLDialogElement | null>(null)
  const [aberta, setAberta] = useState<number | null>(null)

  // telas da vitrine, só imagens (vídeo não abre no visualizador)
  const telasDaVitrine: Shot[] = (project?.showcase ?? []).flatMap((b) =>
    b.screens
      .filter((s) => !/\.(mp4|webm)(\?|$)/i.test(s.src))
      .map((s) => ({ src: s.src, caption: s.alt })),
  )

  // com banner de marca, o print da capa não aparece no topo
  const printNoTopo = project && !project.cover ? project.image : undefined

  // capa + vitrine (ou galeria) formam um conjunto só no visualizador
  const shots: Shot[] = project
    ? [
        ...(printNoTopo
          ? [{ src: printNoTopo, caption: project.summary }]
          : []),
        ...(project.showcase ? telasDaVitrine : (project.gallery ?? [])),
      ]
    : []
  const primeiraDaGaleria = printNoTopo ? 1 : 0
  const abrirTela = (src: string) => {
    const i = shots.findIndex((s, j) => j >= primeiraDaGaleria && s.src === src)
    if (i >= 0) setAberta(i)
  }

  // layout effect: abre no mesmo commit, a tempo da View Transition vinda do card
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (project && !el.open) el.showModal()
    if (!project && el.open) el.close()
  }, [project])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleClose = () => onClose()
    // Esc não fecha direto: vira pedido, pra poder animar a volta pro card
    const handleCancel = (e: Event) => {
      e.preventDefault()
      onRequestClose()
    }
    el.addEventListener('close', handleClose)
    el.addEventListener('cancel', handleCancel)
    return () => {
      el.removeEventListener('close', handleClose)
      el.removeEventListener('cancel', handleCancel)
    }
  }, [onClose, onRequestClose])

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
        if (e.target === ref.current) onRequestClose()
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 backdrop:bg-ink/70 backdrop:backdrop-blur-[2px]"
    >
      {project && (
        <div className="flex min-h-full items-start justify-center p-0 sm:p-6">
          <article
            className="w-full max-w-3xl border-2 border-ink bg-paper sm:my-6"
            // com capa desenhada, o painel inteiro é a capa do card crescida
            style={project.cover ? camada(nomeDaCapa(project.slug), 'capa') : undefined}
          >
            <div className="relative">
              {project.cover ? (
                <div className="border-b-2 border-ink">
                  <CoverBanner project={{ ...project, cover: project.cover }} />
                </div>
              ) : printNoTopo ? (
                <button
                  type="button"
                  onClick={() => setAberta(0)}
                  aria-label="Ampliar esta tela"
                  className="block w-full cursor-zoom-in"
                >
                  <img
                    src={asset(printNoTopo)}
                    alt={`Tela do projeto ${project.title}`}
                    className="aspect-[16/9] w-full border-b-2 border-ink object-cover"
                  />
                </button>
              ) : (
                <ProjectCover
                  category={project.category}
                  index={index}
                  className="h-40 w-full border-b-2 border-ink sm:h-56"
                />
              )}
              {/* fundo creme e borda preta: legível sobre qualquer banner */}
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={onRequestClose}
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
              </div>
            </div>

            <div className="p-6 sm:p-10">
              {project.logo && !project.cover && (
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

              {project.showcase && project.showcase.length > 0 && (
                <section className="rule mt-9 pt-7">
                  <h3 className="text-lg font-bold">Por dentro</h3>
                  <p className="mt-1 text-sm text-muted">
                    Toque numa tela para ampliar, ou num número para ler a nota.
                  </p>
                  <Showcase
                    blocks={project.showcase}
                    slug={project.slug}
                    onOpen={abrirTela}
                  />
                </section>
              )}

              {!project.showcase && project.gallery && project.gallery.length > 0 && (
                <section className="rule mt-9 pt-7">
                  <h3 className="text-lg font-bold">Outras telas</h3>
                  <p className="mt-1 text-sm text-muted">
                    Toque em qualquer uma para ampliar.
                  </p>
                  <ul className="mt-5 space-y-7">
                    {project.gallery.map((shot, i) => (
                      <li key={shot.src}>
                        <button
                          type="button"
                          onClick={() => setAberta(primeiraDaGaleria + i)}
                          aria-label={`Ampliar: ${shot.caption}`}
                          className="block w-full cursor-zoom-in border-2 border-ink"
                        >
                          <img
                            src={asset(shot.src)}
                            alt={shot.caption}
                            loading="lazy"
                            className="block w-full"
                          />
                        </button>
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

              {/* link sem href (ex: demonstração ainda sem conta) fica escondido */}
              {project.links && project.links.some((l) => l.href) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {project.links.filter((l) => l.href).map((l) => (
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

      <Lightbox
        shots={shots}
        index={aberta}
        onIndex={setAberta}
        onClose={() => setAberta(null)}
      />
    </dialog>
  )
}
