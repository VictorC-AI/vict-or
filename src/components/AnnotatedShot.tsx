import { useLayoutEffect, useRef, useState } from 'react'
import type { Annotation, Area, Screen } from '../data/site'
import DeviceFrame from './DeviceFrame'

type Ponto = { x: number; y: number }

/**
 * Desenha a linha que liga o marcador (de) à nota (para), em pixels,
 * no sistema de coordenadas do bloco inteiro. Devolve o atributo `d` de um <path>.
 */
function caminhoDaLinha(de: Ponto, para: Ponto): string {
  if (Math.abs(de.y - para.y) < 1) return `M${de.x} ${de.y} H${para.x}`
  // cotovelo reto, com o joelho no corredor antes das notas — as linhas
  // descem em paralelo ali em vez de cruzar a moldura do aparelho
  const joelho = Math.max(de.x + 12, para.x - 20)
  return `M${de.x} ${de.y} H${joelho} V${para.y} H${para.x}`
}

/** folga padrão, em px, entre o conteúdo destacado e o contorno */
const FOLGA = 7
/** quanto o marcador se afasta do canto do contorno, pra não encostar no conteúdo */
const AFASTAMENTO = 4

/** o contorno fica por fora da área: cresce `folga` px pra cada lado */
function contornoDaArea(area: Area, folga: number): React.CSSProperties {
  return {
    left: `calc(${area.x}% - ${folga}px)`,
    top: `calc(${area.y}% - ${folga}px)`,
    width: `calc(${area.w}% + ${folga * 2}px)`,
    height: `calc(${area.h}% + ${folga * 2}px)`,
  }
}

/**
 * x/y explícitos mandam; sem eles, o marcador vai pro canto superior
 * direito do contorno, deslocado pra fora — nunca em cima do conteúdo.
 */
function posicaoDoMarcador(a: Annotation): React.CSSProperties {
  if (a.x !== undefined && a.y !== undefined) {
    return { left: `${a.x}%`, top: `${a.y}%`, translate: '-50% -50%' }
  }
  const { area } = a as { area: Area }
  const folga = a.padding ?? FOLGA
  return {
    left: `calc(${area.x + area.w}% + ${folga}px)`,
    top: `calc(${area.y}% - ${folga}px)`,
    translate: `calc(-50% + ${AFASTAMENTO}px) calc(-50% - ${AFASTAMENTO}px)`,
  }
}

/** marcadores numerados e contornos, posicionados em % por cima da tela */
export function Markers({
  annotations,
  inicio = 1,
  prefixo,
  ativo,
  onAtivo,
  refs,
}: {
  annotations: Annotation[]
  /** número do primeiro marcador — no flow, a numeração continua entre telas */
  inicio?: number
  prefixo: string
  ativo: number | null
  onAtivo: (n: number | null) => void
  refs?: React.RefObject<(HTMLElement | null)[]>
}) {
  return (
    <>
      {annotations.map((a, i) => {
        const n = inicio + i
        const aceso = ativo === n
        const pos = posicaoDoMarcador(a)
        return (
          <div key={n}>
            {a.area && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute rounded-lg border-2 bg-transparent transition-colors ${
                  aceso ? 'border-blue' : 'border-blue/60'
                }`}
                style={contornoDaArea(a.area, a.padding ?? FOLGA)}
              />
            )}
            <button
              type="button"
              ref={(el) => {
                if (refs?.current) refs.current[i] = el
              }}
              aria-label={`Anotação ${n}: ${a.title}`}
              aria-describedby={`${prefixo}-nota-${n}`}
              onMouseEnter={() => onAtivo(n)}
              onMouseLeave={() => onAtivo(null)}
              onFocus={() => onAtivo(n)}
              onBlur={() => onAtivo(null)}
              onClick={() =>
                document
                  .getElementById(`${prefixo}-nota-${n}`)
                  ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
              }
              className={`absolute z-10 flex size-7 items-center justify-center rounded-full border-2 border-ink font-mono text-xs font-bold transition-[scale,background-color] ${
                aceso ? 'scale-110 bg-ink text-cream' : 'bg-blue text-cream'
              }`}
              style={pos}
            >
              <span aria-hidden="true">{n}</span>
            </button>
          </div>
        )
      })}
    </>
  )
}

/** a lista numerada das notas — embaixo no celular, ao lado no desktop */
export function Notes({
  annotations,
  inicio = 1,
  prefixo,
  ativo,
  onAtivo,
  refs,
  className = '',
}: {
  annotations: Annotation[]
  inicio?: number
  prefixo: string
  ativo: number | null
  onAtivo: (n: number | null) => void
  refs?: React.RefObject<(HTMLElement | null)[]>
  className?: string
}) {
  return (
    <ol className={className}>
      {annotations.map((a, i) => {
        const n = inicio + i
        return (
          <li
            key={n}
            id={`${prefixo}-nota-${n}`}
            ref={(el) => {
              if (refs?.current) refs.current[i] = el
            }}
            onMouseEnter={() => onAtivo(n)}
            onMouseLeave={() => onAtivo(null)}
            className={`flex gap-3 border-l-2 py-1 pl-3 transition-colors ${
              ativo === n ? 'border-blue' : 'border-transparent'
            }`}
          >
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-blue font-mono text-[0.7rem] font-bold text-cream"
            >
              {n}
            </span>
            <p className="text-sm leading-relaxed text-ink/80">
              <span className="font-bold text-ink">{a.title}.</span> {a.body}
            </p>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Um aparelho com anotações. Em blocos largos (container query, não a
 * largura da janela — o detalhe é um modal estreito), as notas vão pro
 * lado e ganham linhas até o marcador; em blocos estreitos viram lista.
 */
export default function AnnotatedShot({
  screen,
  prefixo,
  onOpen,
}: {
  screen: Screen
  prefixo: string
  onOpen?: () => void
}) {
  const notas = screen.annotations ?? []
  const [ativo, setAtivo] = useState<number | null>(null)
  const [linhas, setLinhas] = useState<{ d: string; n: number }[]>([])

  const caixa = useRef<HTMLDivElement | null>(null)
  const marcadores = useRef<(HTMLElement | null)[]>([])
  const itens = useRef<(HTMLElement | null)[]>([])

  // mede marcador e nota e redesenha as linhas sempre que o bloco muda de tamanho
  useLayoutEffect(() => {
    const el = caixa.current
    if (!el || notas.length === 0) return
    const medir = () => {
      const base = el.getBoundingClientRect()
      const novas = notas.flatMap((_, i) => {
        const m = marcadores.current[i]?.getBoundingClientRect()
        const t = itens.current[i]?.getBoundingClientRect()
        if (!m || !t) return []
        const de = { x: m.right - base.left, y: m.top + m.height / 2 - base.top }
        // a linha chega na altura da bolinha do número
        const para = { x: t.left - base.left, y: t.top + 16 - base.top }
        return [{ d: caminhoDaLinha(de, para), n: i + 1 }]
      })
      setLinhas(novas)
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [notas])

  const larguraAparelho =
    screen.device === 'phone' ? 'w-[min(16rem,72%)]' : 'w-full'

  return (
    <div className="@container">
      <div
        ref={caixa}
        className={`relative grid items-center gap-7 ${
          screen.device === 'phone'
            ? '@xl:grid-cols-[16rem_1fr] @xl:gap-16'
            : '@4xl:grid-cols-[1fr_16rem] @4xl:gap-16'
        }`}
      >
        <DeviceFrame
          screen={screen}
          onOpen={onOpen}
          className={`mx-auto ${larguraAparelho} @xl:w-full`}
        >
          <Markers
            annotations={notas}
            prefixo={prefixo}
            ativo={ativo}
            onAtivo={setAtivo}
            refs={marcadores}
          />
        </DeviceFrame>

        {notas.length > 0 && (
          <Notes
            annotations={notas}
            prefixo={prefixo}
            ativo={ativo}
            onAtivo={setAtivo}
            refs={itens}
            className="space-y-3 @xl:space-y-6"
          />
        )}

        <svg
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 hidden size-full overflow-visible ${
            screen.device === 'phone' ? '@xl:block' : '@4xl:block'
          }`}
        >
          {linhas.map((l) => (
            <path
              key={l.n}
              d={l.d}
              fill="none"
              strokeWidth="1.5"
              className={`transition-colors ${
                ativo === l.n ? 'stroke-blue' : 'stroke-ink/40'
              }`}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
