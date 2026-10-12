import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { categoryLabel, projects, type Project } from '../data/site'
import ProjectCover from './ProjectCover'
import Lightbox, { type Shot } from './Lightbox'
import Showcase from './Showcase'
import Notebook from './Notebook'
import { BotaoStory } from './CompartilharStory'
import Reacoes from './Reacoes'
import { Padrao } from './CoverArt'
import { asset } from '../lib/asset'
import { coresDoProjeto } from '../lib/cores'
import { useReducedMotion } from '../lib/motion'
import { PASSAGEM } from '../lib/passagem'

/** quebra o texto em parágrafos onde houver linha em branco */
function Paragrafos({ texto, className = '' }: { texto: string; className?: string }) {
  return (
    <>
      {texto.split(/\n{2,}/).map((p, i) => (
        <p
          key={p.slice(0, 24)}
          className={`max-w-[62ch] text-lg leading-relaxed ${i === 0 ? '' : 'mt-4'} ${className}`}
        >
          {p}
        </p>
      ))}
    </>
  )
}

const TITULO_CAPITULO =
  'text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.9] font-black tracking-[-0.035em] [font-variation-settings:"wdth"_70]'

/** lista título + texto em duas colunas, separados por régua fina */
function Itens({ itens }: { itens: { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2">
      {itens.map((it) => (
        <li key={it.title} className="border-t border-ink/20 py-5">
          <h4 className="text-lg font-bold">{it.title}</h4>
          <p className="mt-1.5 leading-relaxed text-muted">{it.body}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * Detalhe do projeto em tela cheia, nas cores do cliente: topo com o nome
 * gigante e o notebook sobre o padrão da capa, depois o case em capítulos,
 * com um índice fixo ao lado. Abre e fecha por trás da onda de pixels (Work).
 */
export default function ProjectDialog({
  project,
  onClose,
  onRequestClose,
}: {
  project: Project | null
  /** o diálogo já fechou (avisa o estado) */
  onClose: () => void
  /** pedido de fechar (botão, Esc): quem chama decide como anima */
  onRequestClose: () => void
}) {
  const ref = useRef<HTMLDialogElement | null>(null)
  const [aberta, setAberta] = useState<number | null>(null)
  const [pronto, setPronto] = useState(false)
  const reduzido = useReducedMotion()

  // telas da vitrine, só imagens (vídeo não abre no visualizador)
  const telasDaVitrine: Shot[] = (project?.showcase ?? []).flatMap((b) =>
    b.screens
      .filter((s) => !/\.(mp4|webm)(\?|$)/i.test(s.src))
      .map((s) => ({ src: s.src, caption: s.alt })),
  )
  const shots: Shot[] = project ? (project.showcase ? telasDaVitrine : (project.gallery ?? [])) : []
  const abrirTela = (src: string) => {
    const i = shots.findIndex((s) => s.src === src)
    if (i >= 0) setAberta(i)
  }

  // abre e fecha no mesmo commit da troca de estado: a onda cobre a tela nesse instante
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (project && !el.open) el.showModal()
    if (!project && el.open) el.close()
    el.scrollTop = 0
  }, [project])

  // o título sobe quando a onda começa a descobrir a tela
  useEffect(() => {
    setPronto(false)
    if (!project) return
    const t = window.setTimeout(() => setPronto(true), reduzido ? 0 : PASSAGEM / 4)
    return () => window.clearTimeout(t)
  }, [project, reduzido])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleClose = () => onClose()
    // Esc não fecha direto: vira pedido, pra fechar com a onda
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

  const capitulos = project
    ? [
        { id: 'cap-problema', label: 'O problema' },
        { id: 'cap-solucao', label: 'O que eu fiz' },
        ...(project.result ? [{ id: 'cap-resultado', label: 'Como ficou' }] : []),
        ...(project.showcase?.length || project.gallery?.length
          ? [{ id: 'cap-telas', label: 'Por dentro' }]
          : []),
        ...(project.decisions?.length ? [{ id: 'cap-decisoes', label: 'Decisões' }] : []),
        ...(project.infra ? [{ id: 'cap-infra', label: 'Infraestrutura' }] : []),
        ...(project.role ? [{ id: 'cap-papel', label: 'Meu papel' }] : []),
        { id: 'cap-gostou', label: 'Gostou?' },
      ]
    : []
  const irPara = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: reduzido ? 'auto' : 'smooth', block: 'start' })

  const links = project?.links?.filter((l) => l.href) ?? []
  const logo = project?.cover?.bannerLogo ?? project?.logo
  const temTela = Boolean(project?.cover?.laptop ?? project?.image)

  return (
    <dialog
      ref={ref}
      aria-labelledby="detalhe-titulo"
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain bg-cream p-0 text-ink backdrop:bg-coal"
    >
      {project && (
        <article
          data-pronto={pronto ? '' : undefined}
          // clip e não hidden: corta o notebook em 3D sem quebrar o índice grudado
          className="min-h-full overflow-x-clip bg-cream"
          style={coresDoProjeto(project)}
        >
          <button
            type="button"
            onClick={onRequestClose}
            aria-label="Fechar detalhe"
            className="fixed top-4 right-4 z-20 flex size-12 items-center justify-center rounded-lg bg-ink text-cream transition-transform active:scale-95 sm:top-6 sm:right-6"
          >
            <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>

          <header className="relative isolate overflow-hidden">
            {project.cover && (
              <svg
                viewBox="0 0 160 90"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
                className="absolute inset-0 -z-10 size-full opacity-70"
              >
                <Padrao cover={project.cover} id={`padrao-detalhe-${project.slug}`} h={90} />
              </svg>
            )}
            <div className="shell grid min-h-[min(88svh,780px)] items-center gap-10 pt-24 pb-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="flex min-w-0 flex-col items-start gap-5">
                {logo && (
                  <img
                    src={asset(logo)}
                    alt=""
                    className="max-h-10 w-auto max-w-[200px] object-contain object-left lg:max-h-12"
                  />
                )}
                <p className="font-mono text-sm opacity-80">
                  {[categoryLabel[project.category], project.year, project.status]
                    .filter(Boolean)
                    .join(' / ')}
                </p>
                <h2
                  id="detalhe-titulo"
                  className="text-[clamp(3.2rem,9vw,10rem)] leading-[0.84] font-black tracking-[-0.045em]"
                  style={{ fontVariationSettings: "'wdth' 68" }}
                >
                  {project.title.split(' ').map((palavra, j) => (
                    <span key={palavra} className="linha block overflow-hidden pb-[0.05em]">
                      <span style={{ transitionDelay: `${j * 70}ms` }}>{palavra}</span>
                    </span>
                  ))}
                </h2>
                <p className="entra max-w-[36ch] text-xl leading-snug" style={{ transitionDelay: '200ms' }}>
                  {project.summary}
                </p>
                {links.length > 0 && (
                  <div className="entra flex flex-wrap gap-3" style={{ transitionDelay: '280ms' }}>
                    {links.map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rounded-lg bg-ink px-5 py-3 font-bold text-cream transition-transform active:scale-[0.98]"
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {temTela ? (
                <div className="flex items-center justify-center [perspective:1600px]">
                  <Notebook project={project} className="w-[min(100%,720px)]" />
                </div>
              ) : (
                <ProjectCover
                  category={project.category}
                  index={projects.indexOf(project)}
                  className="aspect-[16/10] w-full"
                />
              )}
            </div>
          </header>

          <div className="shell grid gap-12 pt-14 pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            {/* no celular o case vem primeiro; story e stack ficam pro fim */}
            <aside className="order-last flex flex-col gap-9 lg:sticky lg:top-24 lg:order-none lg:self-start">
              <nav aria-label="Capítulos do case" className="hidden flex-col items-start gap-1 lg:flex">
                {capitulos.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => irPara(c.id)}
                    className="py-1 text-left text-lg font-bold opacity-60 transition-opacity hover:opacity-100 [font-variation-settings:'wdth'_80]"
                  >
                    {c.label}
                  </button>
                ))}
              </nav>
              <BotaoStory project={project} />
              <div>
                <h3 className="text-sm font-bold">Stack</h3>
                <p className="mt-2 font-mono text-sm leading-relaxed">{project.stack.join(', ')}</p>
                {project.stackNote && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{project.stackNote}</p>
                )}
              </div>
            </aside>

            <div className="flex min-w-0 flex-col gap-20">
              <section id="cap-problema" className="scroll-mt-24">
                <h3 className={TITULO_CAPITULO}>O problema</h3>
                <div className="mt-6">
                  <Paragrafos texto={project.problem} />
                </div>
              </section>

              <section id="cap-solucao" className="scroll-mt-24">
                <h3 className={TITULO_CAPITULO}>O que eu fiz</h3>
                <div className="mt-6">
                  <Paragrafos texto={project.solution} />
                </div>
                {project.features && project.features.length > 0 && (
                  <div className="mt-8">
                    <Itens itens={project.features} />
                  </div>
                )}
                {project.featuresNote && (
                  <p className="mt-6 max-w-[62ch] text-lg leading-relaxed">{project.featuresNote}</p>
                )}
              </section>

              {project.result && (
                <section id="cap-resultado" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Como ficou</h3>
                  <div className="mt-6">
                    <Paragrafos texto={project.result} />
                  </div>
                </section>
              )}

              {project.showcase && project.showcase.length > 0 && (
                <section id="cap-telas" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Por dentro</h3>
                  <p className="mt-3 text-muted">
                    Toque numa tela para ampliar, ou num número para ler a nota.
                  </p>
                  <Showcase blocks={project.showcase} slug={project.slug} onOpen={abrirTela} />
                </section>
              )}

              {!project.showcase && project.gallery && project.gallery.length > 0 && (
                <section id="cap-telas" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Por dentro</h3>
                  <p className="mt-3 text-muted">Toque em qualquer uma para ampliar.</p>
                  <ul className="mt-6 space-y-8">
                    {project.gallery.map((shot, i) => (
                      <li key={shot.src}>
                        <button
                          type="button"
                          onClick={() => setAberta(i)}
                          aria-label={`Ampliar: ${shot.caption}`}
                          className="block w-full cursor-zoom-in overflow-hidden rounded-xl"
                        >
                          <img src={asset(shot.src)} alt={shot.caption} loading="lazy" className="block w-full" />
                        </button>
                        <p className="mt-2.5 text-sm text-muted">{shot.caption}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.decisions && project.decisions.length > 0 && (
                <section id="cap-decisoes" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Por que foi feito assim</h3>
                  <div className="mt-8">
                    <Itens itens={project.decisions} />
                  </div>
                </section>
              )}

              {project.infra && (
                <section id="cap-infra" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Infraestrutura</h3>
                  <div className="mt-6">
                    <Paragrafos texto={project.infra} />
                  </div>
                </section>
              )}

              {project.role && (
                <section id="cap-papel" className="scroll-mt-24">
                  <h3 className={TITULO_CAPITULO}>Meu papel</h3>
                  <div className="mt-6">
                    <Paragrafos texto={project.role} />
                  </div>
                </section>
              )}

              <div id="cap-gostou" className="scroll-mt-24 [&>section]:mt-0">
                <Reacoes project={project} />
              </div>
            </div>
          </div>
        </article>
      )}

      <Lightbox shots={shots} index={aberta} onIndex={setAberta} onClose={() => setAberta(null)} />
    </dialog>
  )
}
