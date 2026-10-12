import { useEffect, useRef, useState } from 'react'
import type { Device, Project } from '../data/site'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../lib/motion'
import { srcSet } from './DeviceFrame'

type Foco = Device | null

interface Tela {
  src: string
  widths?: number[]
}

/** tempo de cada tela quando um aparelho está em foco, em ms */
const TROCA_DE_TELA = 1700

/** a tela da capa primeiro, depois as da vitrine desse aparelho, sem repetir */
function telasDo(project: Project, device: Device): Tela[] {
  const capa: Tela | null =
    device === 'laptop'
      ? (project.cover?.laptop ?? project.image)
        ? { src: (project.cover?.laptop ?? project.image)! }
        : null
      : project.cover?.phone
        ? { src: project.cover.phone, widths: project.cover.phoneWidths }
        : null
  const vitrine = (project.showcase ?? [])
    .flatMap((b) => b.screens)
    .filter((s) => s.device === device && !/\.(mp4|webm)(\?|$)/i.test(s.src))
    .map((s) => ({ src: s.src, widths: s.widths }))
  const todas = capa ? [capa, ...vitrine] : vitrine
  return todas.filter((t, i) => todas.findIndex((o) => o.src === t.src) === i)
}

/** telas empilhadas: só a atual aparece; as outras só carregam depois do primeiro foco */
function Telas({
  telas,
  atual,
  carregar,
  alt,
  sizes,
}: {
  telas: Tela[]
  atual: number
  carregar: boolean
  alt: string
  sizes?: string
}) {
  return (
    <>
      {telas.map((t, i) =>
        i === 0 || carregar ? (
          <img
            key={t.src}
            src={asset(t.src)}
            srcSet={srcSet(t.src, t.widths)}
            sizes={t.widths ? sizes : undefined}
            alt={i === atual ? alt : ''}
            aria-hidden={i === atual ? undefined : true}
            loading={i === 0 ? 'lazy' : 'eager'}
            className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-500 ${
              i === atual ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null,
      )}
    </>
  )
}

/**
 * Notebook com o celular na frente, em 3D. A cena inclina seguindo o ponteiro.
 * Passar o mouse (ou tocar, ou focar pelo teclado) num aparelho traz ele de
 * frente, maior, passando pelas telas do projeto daquele tamanho.
 */
export default function Notebook({ project, className = '' }: { project: Project; className?: string }) {
  const reduzido = useReducedMotion()
  const cena = useRef<HTMLDivElement | null>(null)
  const [foco, setFoco] = useState<Foco>(null)
  const [tela, setTela] = useState(0)
  const [carregar, setCarregar] = useState(false)
  // o último ponteiro usado: no mouse o foco segue o hover, no toque o clique alterna
  const ponteiro = useRef('mouse')

  const laptop = telasDo(project, 'laptop')
  const phone = telasDo(project, 'phone')
  const telasEmFoco = foco === 'laptop' ? laptop : foco === 'phone' ? phone : []

  useEffect(() => {
    setTela(0)
    if (!foco) return
    setCarregar(true)
    if (reduzido || telasEmFoco.length < 2) return
    const t = window.setInterval(() => setTela((i) => (i + 1) % telasEmFoco.length), TROCA_DE_TELA)
    return () => window.clearInterval(t)
  }, [foco, reduzido, telasEmFoco.length])

  // trocou de projeto: tudo volta pro repouso
  useEffect(() => {
    setFoco(null)
    setCarregar(false)
  }, [project.slug])

  if (laptop.length === 0) return null

  // inclinação pelo ponteiro: -0.5 a 0.5 nos dois eixos, direto no CSS (sem re-render)
  const inclina = (e: React.PointerEvent) => {
    ponteiro.current = e.pointerType
    if (reduzido || e.pointerType !== 'mouse' || !cena.current) return
    const r = cena.current.getBoundingClientRect()
    cena.current.style.setProperty('--tx', String((e.clientX - r.left) / r.width - 0.5))
    cena.current.style.setProperty('--ty', String((e.clientY - r.top) / r.height - 0.5))
  }
  const solta = () => {
    cena.current?.style.setProperty('--tx', '0')
    cena.current?.style.setProperty('--ty', '0')
  }

  const eventos = (device: Device) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setFoco(device)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setFoco((f) => (f === device ? null : f))
    },
    onClick: () => {
      if (ponteiro.current !== 'mouse') setFoco((f) => (f === device ? null : device))
    },
    onFocus: () => setFoco(device),
    onBlur: () => setFoco((f) => (f === device ? null : f)),
    'aria-pressed': foco === device,
  })

  // posição de cada parte por estado; a inclinação do ponteiro soma por cima
  const giro =
    foco === 'laptop'
      ? { y: 0, x: 2, s: 1.06, k: 4 }
      : foco === 'phone'
        ? { y: -8, x: 4, s: 1, k: 6 }
        : { y: -16, x: 6, s: 1, k: 14 }
  const rig = `rotateY(calc(${giro.y}deg + var(--tx, 0) * ${giro.k}deg)) rotateX(calc(${giro.x}deg - var(--ty, 0) * ${giro.k * 0.7}deg)) scale(${giro.s})`
  const notebook =
    foco === 'phone' ? 'translateZ(-140px)' : foco === 'laptop' ? 'translateZ(40px)' : 'translateZ(0)'
  const celular =
    foco === 'phone'
      ? 'translate3d(-95%, 6%, 200px) rotateY(16deg) scale(1.5)'
      : foco === 'laptop'
        ? // recua pro canto, mas continua ao alcance do mouse
          'translate3d(28%, 22%, 120px) rotateY(-10deg) scale(0.82)'
        : 'translate3d(0, 0, 80px)'

  return (
    <div
      ref={cena}
      onPointerMove={inclina}
      onPointerLeave={solta}
      className={`[perspective:1600px] ${className}`}
    >
      <div
        className="relative transition-transform duration-700 ease-[var(--ease-snap)] [transform-style:preserve-3d]"
        style={{ transform: rig }}
      >
        <button
          type="button"
          aria-label={`Ver as telas de ${project.title} no notebook`}
          {...eventos('laptop')}
          className={`block w-full cursor-zoom-in text-left transition-[transform,opacity] duration-700 ease-[var(--ease-snap)] [transform-style:preserve-3d] ${
            foco === 'phone' ? 'opacity-40' : ''
          }`}
          style={{ transform: notebook }}
        >
          <span className="block rounded-t-2xl rounded-b-sm bg-coal p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)] sm:p-3">
            <span className="relative block aspect-[16/10] overflow-hidden rounded">
              <Telas
                telas={laptop}
                atual={foco === 'laptop' ? tela : 0}
                carregar={carregar}
                alt={`Tela do projeto ${project.title} no notebook`}
              />
            </span>
          </span>
          <span className="mx-[-7%] block h-3 origin-top rounded-b-xl bg-coal [transform:rotateX(-60deg)] sm:h-4" />
        </button>

        {phone.length > 0 && (
          <button
            type="button"
            aria-label={`Ver as telas de ${project.title} no celular`}
            {...eventos('phone')}
            className="absolute right-[2%] bottom-[8%] block w-[24%] max-w-[190px] cursor-zoom-in overflow-hidden rounded-[22px] border-[5px] border-coal bg-coal shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] transition-[transform,opacity] duration-700 ease-[var(--ease-snap)] sm:rounded-[30px] sm:border-[7px]"
            style={{ transform: celular }}
          >
            <span className="relative block aspect-[390/844]">
              <Telas
                telas={phone}
                atual={foco === 'phone' ? tela : 0}
                carregar={carregar}
                alt={`Tela do projeto ${project.title} no celular`}
                sizes="(min-width: 640px) 290px, 40vw"
              />
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
