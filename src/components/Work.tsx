import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { categoryLabel, projects, type Project } from '../data/site'
import ProjectDialog from './ProjectDialog'
import Notebook from './Notebook'
import { CompartilharTrabalhos } from './CompartilharStory'
import { Curtir } from './Reacoes'
import { asset } from '../lib/asset'
import { coresDoProjeto } from '../lib/cores'
import { useInView, useReducedMotion } from '../lib/motion'
import { desenharOnda, passar, PASSAGEM } from '../lib/passagem'
import { useCanvasAnimado } from '../lib/simbolo'
import { caminhoDoProjeto, caminhoDoSite, projetoNoEndereco } from '../lib/rota'

const N = projects.length
/** quanto o dedo ou o mouse precisa andar de lado pra trocar de projeto, em px */
const ARRASTO = 60

function Seta({ direcao }: { direcao: 'anterior' | 'proximo' }) {
  return (
    <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
      <path
        d={direcao === 'proximo' ? 'M7 4l6 6-6 6' : 'M13 4l-6 6 6 6'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Work() {
  const [open, setOpen] = useState<{ project: Project; index: number } | null>(null)

  /** abre ou fecha o detalhe por trás da onda de pixels */
  const comOnda = (mudar: () => void) => passar(() => flushSync(mudar))

  // ---------------------------------------------------------------- endereço
  // Cada projeto tem endereço próprio (/projetos/<slug>/). Abrir empilha esse
  // endereço no histórico: o "voltar" do celular fecha o detalhe.
  const aberto = useRef(open)
  aberto.current = open
  // chegou direto pelo link (WhatsApp, DM): fechar não pode "voltar" pra fora do site
  const veioPeloLink = useRef(false)

  const indiceDe = (slug: string) => projects.findIndex((p) => p.slug === slug)

  useEffect(() => {
    const slug = projetoNoEndereco()
    const i = slug ? indiceDe(slug) : -1
    if (i >= 0) {
      veioPeloLink.current = true
      history.replaceState({ projeto: slug }, '', caminhoDoProjeto(slug!))
      setOpen({ project: projects[i], index: i })
      setAtivo(i)
    } else if (slug) {
      // projeto que não existe (ou saiu do portfólio): mostra o portfólio
      history.replaceState(null, '', caminhoDoSite())
    }

    const aoNavegar = () => {
      const slug = (history.state as { projeto?: string } | null)?.projeto ?? projetoNoEndereco()
      const i = slug ? indiceDe(slug) : -1
      const atual = aberto.current
      if (i >= 0 && atual?.project.slug !== slug) {
        comOnda(() => setOpen({ project: projects[i], index: i }))
      } else if (i < 0 && atual) {
        comOnda(() => setOpen(null))
      }
    }
    window.addEventListener('popstate', aoNavegar)
    return () => window.removeEventListener('popstate', aoNavegar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // título da aba acompanha o detalhe aberto
  useEffect(() => {
    const original = document.title
    if (open) document.title = `${open.project.title} | vict.<OR>`
    return () => {
      document.title = original
    }
  }, [open])

  const abrir = (project: Project, index: number) => {
    history.pushState({ projeto: project.slug }, '', caminhoDoProjeto(project.slug))
    comOnda(() => setOpen({ project, index }))
  }

  const fechar = () => {
    if (!veioPeloLink.current && (history.state as { projeto?: string } | null)?.projeto) {
      // desfaz o pushState do abrir; o popstate acima fecha com a onda
      history.back()
      return
    }
    // chegou pelo link: volta pro endereço do portfólio, já com os trabalhos na tela
    veioPeloLink.current = false
    history.replaceState(null, '', caminhoDoSite())
    comOnda(() => {
      setOpen(null)
      document.getElementById('trabalhos')?.scrollIntoView({ block: 'start', behavior: 'instant' })
    })
  }

  // ------------------------------------------------------------------ palco
  // Um projeto por vez, numa tela. A rolagem da página passa direto; trocar de
  // projeto é pro lado (arrastar, touchpad, setas do teclado ou os botões),
  // sempre por trás da onda de pixels, no sentido do gesto.
  const reduzido = useReducedMotion()
  const palco = useRef<HTMLDivElement | null>(null)
  const naTela = useInView(palco)
  const [ativo, setAtivo] = useState(0)
  const ativoRef = useRef(0)
  ativoRef.current = ativo
  // a passagem em andamento: pra qual projeto, em que sentido e quando começou
  const troca = useRef<{ para: number; sentido: 1 | -1; inicio: number | null } | null>(null)

  const ir = (para: number, sentido: 1 | -1) => {
    if (troca.current || para === ativoRef.current) return
    if (reduzido) {
      setAtivo(para)
      return
    }
    troca.current = { para, sentido, inicio: null }
  }
  // circular: depois do último volta pro primeiro
  const proximo = () => ir((ativoRef.current + 1) % N, -1)
  const anterior = () => ir((ativoRef.current - 1 + N) % N, 1)

  const passagem = useCanvasAnimado(({ ctx, largura, altura }, _cores, agora) => {
    const t = troca.current
    if (!t) return
    t.inicio ??= agora
    const tt = (agora - t.inicio) / PASSAGEM
    // no meio da onda, com a tela coberta, o projeto troca por baixo
    if (tt >= 0.5 && ativoRef.current !== t.para) {
      ativoRef.current = t.para
      setAtivo(t.para)
    }
    if (tt >= 1) {
      troca.current = null
      return
    }
    desenharOnda(ctx, largura, altura, tt, t.sentido)
  }, naTela && N > 0)

  // setas do teclado, enquanto o palco está na tela e nada está aberto por cima
  useEffect(() => {
    if (!naTela || open) return
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement
      if (alvo.closest('input, textarea, select, dialog, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') proximo()
      if (e.key === 'ArrowLeft') anterior()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // arrastar de lado (dedo ou mouse); a rolagem vertical continua com o navegador
  const inicioDoArrasto = useRef<{ x: number; y: number } | null>(null)
  const aoApertar = (e: React.PointerEvent) => {
    inicioDoArrasto.current = { x: e.clientX, y: e.clientY }
  }
  const aoSoltar = (e: React.PointerEvent) => {
    const i = inicioDoArrasto.current
    inicioDoArrasto.current = null
    if (!i) return
    const dx = e.clientX - i.x
    const dy = e.clientY - i.y
    if (Math.abs(dx) < ARRASTO || Math.abs(dx) < Math.abs(dy) * 1.3) return
    if (dx < 0) proximo()
    else anterior()
  }

  // gesto horizontal do touchpad: soma o deslocamento até passar do limite
  const rodinha = useRef({ soma: 0, ultimo: 0 })
  const aoRolar = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    const r = rodinha.current
    if (e.timeStamp - r.ultimo > 250) r.soma = 0
    r.ultimo = e.timeStamp
    r.soma += e.deltaX
    if (Math.abs(r.soma) < 80) return
    if (r.soma > 0) proximo()
    else anterior()
    r.soma = 0
  }

  if (N === 0) return null
  const atual = projects[ativo]

  return (
    <section id="trabalhos" aria-labelledby="trabalhos-titulo" aria-roledescription="carrossel">
      <h2 id="trabalhos-titulo" className="sr-only">
        Trabalhos
      </h2>
      <div
        ref={palco}
        onPointerDown={aoApertar}
        onPointerUp={aoSoltar}
        onPointerCancel={() => {
          inicioDoArrasto.current = null
        }}
        onWheel={aoRolar}
        className="relative h-[100svh] min-h-[640px] touch-pan-y overflow-hidden overscroll-x-contain select-none"
      >
        {projects.map((p, i) => {
          const eAtivo = i === ativo
          const logo = p.cover?.bannerLogo ?? p.logo
          return (
            <article
              key={p.slug}
              aria-labelledby={`case-${p.slug}`}
              aria-roledescription="trabalho"
              data-pronto={eAtivo ? '' : undefined}
              inert={!eAtivo}
              className={`absolute inset-0 bg-cream ${eAtivo ? 'visible' : 'invisible'}`}
              style={coresDoProjeto(p)}
            >
              <div className="shell grid h-full grid-rows-[auto_minmax(0,1fr)] items-center gap-4 pt-24 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:gap-8">
                <div className="relative z-[2] flex min-w-0 flex-col items-start gap-4 lg:gap-5">
                  {logo && (
                    <img
                      src={asset(logo)}
                      alt=""
                      loading="lazy"
                      draggable={false}
                      className="max-h-9 w-auto max-w-[180px] object-contain object-left lg:max-h-11"
                    />
                  )}
                  <p className="font-mono text-sm opacity-80">
                    {[categoryLabel[p.category], p.year, p.status].filter(Boolean).join(' / ')}
                  </p>
                  <h3
                    id={`case-${p.slug}`}
                    className="text-[clamp(3rem,8.4vw,9.5rem)] leading-[0.86] font-black tracking-[-0.04em]"
                    style={{ fontVariationSettings: "'wdth' 70" }}
                  >
                    {p.title.split(' ').map((palavra, j) => (
                      <span key={palavra} className="linha block overflow-hidden pb-[0.05em]">
                        <span style={{ transitionDelay: `${j * 70}ms` }}>{palavra}</span>
                      </span>
                    ))}
                  </h3>
                  <p className="max-w-[32ch] text-lg leading-snug lg:text-2xl">
                    {p.cover?.frase ?? p.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => abrir(p, i)}
                      className="rounded-lg bg-ink px-5 py-3 font-bold text-cream transition-transform active:scale-[0.98]"
                    >
                      Ver o case
                    </button>
                    <Curtir project={p} compacto />
                  </div>
                </div>

                <div className="flex h-full min-h-0 items-center justify-center">
                  <Notebook project={p} className="w-[min(100%,760px)]" />
                </div>
              </div>
            </article>
          )
        })}

        <canvas
          ref={passagem}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[3] size-full"
        />

        <div
          className="absolute inset-x-0 bottom-0 z-[4]"
          style={{ ...coresDoProjeto(atual), background: 'transparent' }}
        >
          <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-5 sm:pb-7">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={anterior}
                  aria-label="Trabalho anterior"
                  className="flex size-11 items-center justify-center rounded-lg border-2 border-current transition-transform active:scale-95"
                >
                  <Seta direcao="anterior" />
                </button>
                <button
                  type="button"
                  onClick={proximo}
                  aria-label="Próximo trabalho"
                  className="flex size-11 items-center justify-center rounded-lg bg-ink text-cream transition-transform active:scale-95"
                >
                  <Seta direcao="proximo" />
                </button>
              </div>
              <nav aria-label="Escolher trabalho" className="hidden flex-wrap gap-x-5 gap-y-1 sm:flex">
                {projects.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    aria-current={i === ativo}
                    onClick={() => ir(i, i > ativo ? -1 : 1)}
                    className="border-b-2 border-transparent py-1.5 text-[0.95rem] font-bold opacity-55 transition-opacity hover:opacity-100 aria-[current=true]:border-current aria-[current=true]:opacity-100"
                  >
                    {p.title}
                  </button>
                ))}
              </nav>
            </div>
            <CompartilharTrabalhos />
          </div>
        </div>
      </div>

      <ProjectDialog
        project={open?.project ?? null}
        onClose={() => setOpen(null)}
        onRequestClose={fechar}
      />
    </section>
  )
}
