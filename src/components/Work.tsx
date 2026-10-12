import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { categoryLabel, projects, type Project } from '../data/site'
import ProjectDialog from './ProjectDialog'
import { srcSet } from './DeviceFrame'
import { CompartilharTrabalhos } from './CompartilharStory'
import { Curtir } from './Reacoes'
import { asset } from '../lib/asset'
import { useInView, useReducedMotion } from '../lib/motion'
import { useCanvasAnimado } from '../lib/simbolo'
import { caminhoDoProjeto, caminhoDoSite, projetoNoEndereco } from '../lib/rota'

const N = projects.length
/** duração da onda de pixels entre um projeto e outro, em ms */
const PASSAGEM = 1400
const limita = (v: number) => Math.max(0, Math.min(1, v))
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const sorteio = (c: number, r: number) => {
  const s = Math.sin(c * 12.9898 + r * 78.233) * 43758.5453
  return s - Math.floor(s)
}

/**
 * Cores do projeto no palco: as da capa (são a marca do cliente, valem nos
 * dois temas). Os componentes da casa (Curtir, botões) leem --color-ink e
 * --color-paper, então eles também passam a usar as cores do projeto.
 */
function coresDe(p: Project): React.CSSProperties {
  if (!p.cover) return {}
  const { bg, ink } = p.cover.palette
  return {
    background: bg,
    color: ink,
    '--color-ink': ink,
    '--color-paper': bg,
    '--color-cream': bg,
    '--color-muted': ink,
    '--color-blue-soft': `color-mix(in oklab, ${ink} 18%, ${bg})`,
  } as React.CSSProperties
}

export default function Work() {
  const [open, setOpen] = useState<{ project: Project; index: number } | null>(null)

  // Abrir e fechar o detalhe com View Transition (crossfade, e a capa do
  // detalhe entra como camada própria). Fica sem animação quando o navegador
  // não tem a API, a aba está oculta ou o sistema pede menos movimento.
  const comTransicao = async (project: Project | undefined, mudar: () => void) => {
    const semAnimacao =
      !document.startViewTransition ||
      !project?.cover ||
      document.visibilityState !== 'visible' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (semAnimacao) return mudar()
    // a logo do banner precisa estar pronta antes da "foto" do estado novo —
    // mas no máximo 300 ms: decode() pode nunca resolver (aba oculta, rede lenta)
    // e um clique que não abre nada é pior que uma logo que aparece atrasada
    const logo = project.cover?.bannerLogo ?? project.logo
    if (logo) {
      const img = new Image()
      img.src = asset(logo)
      await Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 300))])
    }
    // se o navegador abortar a transição antes de aplicar a mudança (ex.: aba
    // oculta), ela é aplicada do mesmo jeito, só que sem animação
    let aplicou = false
    const transicao = document.startViewTransition(() => {
      aplicou = true
      flushSync(mudar)
    })
    transicao.ready.catch(() => {})
    transicao.finished
      .finally(() => {
        if (!aplicou) mudar()
      })
      .catch(() => {})
  }

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
    } else if (slug) {
      // projeto que não existe (ou saiu do portfólio): mostra o portfólio
      history.replaceState(null, '', caminhoDoSite())
    }

    const aoNavegar = () => {
      const slug = (history.state as { projeto?: string } | null)?.projeto ?? projetoNoEndereco()
      const i = slug ? indiceDe(slug) : -1
      const atual = aberto.current
      if (i >= 0 && atual?.project.slug !== slug) {
        comTransicao(projects[i], () => setOpen({ project: projects[i], index: i }))
      } else if (i < 0 && atual) {
        comTransicao(atual.project, () => setOpen(null))
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
    comTransicao(project, () => setOpen({ project, index }))
  }

  const fechar = () => {
    if (!veioPeloLink.current && (history.state as { projeto?: string } | null)?.projeto) {
      // desfaz o pushState do abrir; o popstate acima fecha com a animação
      history.back()
      return
    }
    // chegou pelo link: volta pro endereço do portfólio, no projeto que estava aberto
    veioPeloLink.current = false
    history.replaceState(null, '', caminhoDoSite())
    if (open) irPara(open.index, 'instant')
    comTransicao(open?.project, () => setOpen(null))
  }

  // ------------------------------------------------------------------ palco
  // Um projeto por vez em tela cheia. A rolagem dentro da seção (N + 1 telas
  // de altura, palco grudado no topo) escolhe o projeto e gira o notebook;
  // no fim de cada trecho uma onda de pixels azuis cobre um e descobre o outro.
  const reduzido = useReducedMotion()
  const teatro = useRef<HTMLDivElement | null>(null)
  const naTela = useInView(teatro)
  const [ativo, setAtivo] = useState(0)
  const ativoRef = useRef(0)
  const notebooks = useRef<(HTMLDivElement | null)[]>([])

  // a passagem em andamento: de que projeto pra qual, e quando começou
  const troca = useRef<{ para: number; inicio: number } | null>(null)

  const passagem = useCanvasAnimado(({ ctx, largura, altura }, _cores, agora) => {
    const el = teatro.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const s = limita(-r.top / (r.height - window.innerHeight)) * N
    const idx = Math.min(Math.floor(s), N - 1)
    // a rolagem só escolhe o projeto (troca a 3/4 do trecho); a onda tem ritmo
    // próprio, então rolar rápido não atropela a passagem
    const alvo = idx < N - 1 && s - idx > 0.75 ? idx + 1 : idx
    const mostrando = ativoRef.current

    if (reduzido) {
      if (alvo !== mostrando) {
        ativoRef.current = alvo
        setAtivo(alvo)
      }
    } else if (!troca.current && alvo !== mostrando) {
      troca.current = { para: alvo, inicio: agora }
    }

    let tt = 0
    if (troca.current) {
      tt = (agora - troca.current.inicio) / PASSAGEM
      // no meio da onda, com a tela coberta, o projeto troca por baixo
      if (tt >= 0.5 && ativoRef.current !== troca.current.para) {
        ativoRef.current = troca.current.para
        setAtivo(troca.current.para)
      }
      if (tt >= 1) {
        troca.current = null
        tt = 0
      }
    }
    const mostra = ativoRef.current

    // o notebook gira enquanto você rola pelo projeto (local vai de -0.5 a 1)
    const nb = notebooks.current[mostra]
    if (nb && !reduzido) {
      const local = s - mostra
      nb.style.setProperty('--ry', `${-20 + local * 30}deg`)
      nb.style.setProperty('--rx', `${8 - local * 6}deg`)
      nb.style.setProperty('--py', `${(0.4 - local) * 90}px`)
    }

    if (reduzido || tt <= 0 || tt >= 1) return
    const lado = largura < 700 ? 34 : 56
    const cols = Math.ceil(largura / lado)
    const linhas = Math.ceil(altura / lado)
    const k = tt * 2
    ctx.fillStyle = '#233dff' // azul da marca, igual nos dois temas
    for (let c = 0; c < cols; c++) {
      for (let l = 0; l < linhas; l++) {
        // da esquerda pra direita, com um pouco de acaso pra não virar uma régua
        const d = (c / cols) * 0.62 + (l / linhas) * 0.14 + sorteio(c, l) * 0.24
        const cobre = k <= 1 ? limita((k * 1.7 - d) / 0.5) : 1 - limita(((k - 1) * 1.7 - d) / 0.5)
        if (cobre <= 0) continue
        const q = lado * suave(cobre) + 0.6
        ctx.fillRect(c * lado + (lado - q) / 2, l * lado + (lado - q) / 2, q, q)
      }
    }
  }, naTela && N > 0)

  /** rola até o trecho do projeto i, já com ele inteiro na tela */
  const irPara = (i: number, behavior: ScrollBehavior = reduzido ? 'auto' : 'smooth') => {
    const el = teatro.current
    if (!el) return
    const topo = el.getBoundingClientRect().top + window.scrollY
    const percurso = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: topo + percurso * (i / N) + 2, behavior })
  }

  if (N === 0) return null
  const atual = projects[ativo]

  return (
    <section id="trabalhos" aria-labelledby="trabalhos-titulo">
      <h2 id="trabalhos-titulo" className="sr-only">
        Trabalhos
      </h2>
      <div ref={teatro} className="relative" style={{ height: `${(N + 1) * 100}svh` }}>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {projects.map((p, i) => {
            const eAtivo = i === ativo
            const laptop = p.cover?.laptop ?? p.image
            const phone = p.cover?.phone
            const logo = p.cover?.bannerLogo ?? p.logo
            return (
              <article
                key={p.slug}
                aria-labelledby={`case-${p.slug}`}
                data-pronto={eAtivo ? '' : undefined}
                inert={!eAtivo}
                className={`absolute inset-0 bg-cream ${eAtivo ? 'visible' : 'invisible'}`}
                style={coresDe(p)}
              >
                <div className="shell grid h-full grid-rows-[auto_minmax(0,1fr)] items-center gap-4 pt-24 pb-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:grid-rows-1 lg:gap-8">
                  <div className="relative z-[2] flex min-w-0 flex-col items-start gap-4 lg:gap-5">
                    {logo && (
                      <img
                        src={asset(logo)}
                        alt=""
                        loading="lazy"
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

                  {laptop && (
                    <div className="flex h-full min-h-0 items-center justify-center [perspective:1600px]">
                      <div
                        ref={(n) => {
                          notebooks.current[i] = n
                        }}
                        className="relative w-[min(100%,760px)] [transform-style:preserve-3d] [transform:rotateY(var(--ry,-16deg))_rotateX(var(--rx,6deg))] motion-reduce:[transform:rotateY(-12deg)_rotateX(5deg)]"
                      >
                        <div className="rounded-t-2xl rounded-b-sm bg-coal p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)] sm:p-3">
                          <img
                            src={asset(laptop)}
                            alt={`Tela do projeto ${p.title} no notebook`}
                            loading="lazy"
                            className="block aspect-[16/10] w-full rounded object-cover object-top"
                          />
                        </div>
                        <div className="mx-[-7%] h-3 origin-top rounded-b-xl bg-coal [transform:rotateX(-60deg)] sm:h-4" />
                        {phone && (
                          <div className="absolute right-[2%] bottom-[8%] w-[24%] max-w-[190px] overflow-hidden rounded-[22px] border-[5px] border-coal bg-coal shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] [transform:translateZ(80px)_translateY(var(--py,0px))] sm:rounded-[30px] sm:border-[7px]">
                            <img
                              src={asset(phone)}
                              srcSet={srcSet(phone, p.cover?.phoneWidths)}
                              sizes="190px"
                              alt={`Tela do projeto ${p.title} no celular`}
                              loading="lazy"
                              className="block aspect-[390/844] w-full object-cover object-top"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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
            className="absolute inset-x-0 bottom-0 z-[4] transition-colors duration-300"
            style={{ ...coresDe(atual), background: 'transparent' }}
          >
            <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-5 sm:pb-7">
              <nav aria-label="Escolher trabalho" className="flex flex-wrap gap-x-5 gap-y-1">
                {projects.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    aria-current={i === ativo}
                    onClick={() => irPara(i)}
                    className="border-b-2 border-transparent py-1.5 text-sm font-bold opacity-55 transition-opacity hover:opacity-100 aria-[current=true]:border-current aria-[current=true]:opacity-100 sm:text-[0.95rem]"
                  >
                    {p.title}
                  </button>
                ))}
              </nav>
              <CompartilharTrabalhos />
            </div>
          </div>
        </div>
      </div>

      <ProjectDialog
        project={open?.project ?? null}
        index={open?.index ?? 0}
        onClose={() => setOpen(null)}
        onRequestClose={fechar}
      />
    </section>
  )
}
