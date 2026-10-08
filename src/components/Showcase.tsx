import { Fragment, useState } from 'react'
import type { Screen, ShowcaseBlock } from '../data/site'
import AnnotatedShot, { Markers, Notes } from './AnnotatedShot'
import DeviceFrame from './DeviceFrame'
import { useReveal } from '../lib/motion'

type Abrir = (src: string) => void

/** número do primeiro marcador de cada tela, pra numeração seguir entre telas */
function inicios(screens: Screen[]) {
  let n = 1
  return screens.map((s) => {
    const atual = n
    n += s.annotations?.length ?? 0
    return atual
  })
}

/** notebook + celular; o celular avança sobre o canto do notebook */
function Duo({ block, prefixo, onOpen }: { block: ShowcaseBlock; prefixo: string; onOpen: Abrir }) {
  const [laptop, phone] = block.screens
  const [ativo, setAtivo] = useState<number | null>(null)
  const [a, b] = inicios(block.screens)
  return (
    <>
      <div className="relative pr-[14%] pb-[8%]">
        <DeviceFrame screen={laptop} onOpen={() => onOpen(laptop.src)}>
          <Markers annotations={laptop.annotations ?? []} inicio={a} prefixo={prefixo} ativo={ativo} onAtivo={setAtivo} />
        </DeviceFrame>
        {phone && (
          <DeviceFrame
            screen={phone}
            onOpen={() => onOpen(phone.src)}
            className="absolute right-0 bottom-0 w-[26%] shadow-hard-sm"
          >
            <Markers annotations={phone.annotations ?? []} inicio={b} prefixo={prefixo} ativo={ativo} onAtivo={setAtivo} />
          </DeviceFrame>
        )}
      </div>
      <TodasAsNotas screens={block.screens} prefixo={prefixo} ativo={ativo} onAtivo={setAtivo} />
    </>
  )
}

/** 2 a 4 celulares lado a lado; no celular, rolagem lateral com encaixe */
function Flow({ block, prefixo, onOpen }: { block: ShowcaseBlock; prefixo: string; onOpen: Abrir }) {
  const [ativo, setAtivo] = useState<number | null>(null)
  const comeco = inicios(block.screens)
  return (
    <>
      <ol className="-mx-6 flex snap-x snap-mandatory items-center gap-3 overflow-x-auto px-6 pt-1 pb-4 sm:mx-0 sm:px-0 sm:snap-none sm:overflow-visible">
        {block.screens.map((s, i) => (
          <Fragment key={s.src + i}>
            {i > 0 && (
              <li aria-hidden="true" className="shrink-0 text-ink/50">
                <svg viewBox="0 0 24 24" className="size-5 sm:size-6">
                  <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" />
                </svg>
              </li>
            )}
            <li className="relative w-[58vw] max-w-56 shrink-0 snap-center sm:w-auto sm:min-w-0 sm:flex-1 sm:shrink">
              <span className="sr-only">
                Passo {i + 1} de {block.screens.length}:
              </span>
              <DeviceFrame screen={s} onOpen={() => onOpen(s.src)} className="!shadow-none">
                <Markers annotations={s.annotations ?? []} inicio={comeco[i]} prefixo={prefixo} ativo={ativo} onAtivo={setAtivo} />
              </DeviceFrame>
            </li>
          </Fragment>
        ))}
      </ol>
      <TodasAsNotas screens={block.screens} prefixo={prefixo} ativo={ativo} onAtivo={setAtivo} />
    </>
  )
}

function TodasAsNotas({
  screens,
  prefixo,
  ativo,
  onAtivo,
}: {
  screens: Screen[]
  prefixo: string
  ativo: number | null
  onAtivo: (n: number | null) => void
}) {
  const todas = screens.flatMap((s) => s.annotations ?? [])
  if (todas.length === 0) return null
  return (
    <Notes
      annotations={todas}
      prefixo={prefixo}
      ativo={ativo}
      onAtivo={onAtivo}
      className="mt-6 grid gap-3 sm:grid-cols-2"
    />
  )
}

function Bloco({ block, prefixo, onOpen }: { block: ShowcaseBlock; prefixo: string; onOpen: Abrir }) {
  const ref = useReveal<HTMLElement>()
  return (
    <figure ref={ref} className="reveal">
      {block.layout === 'duo' && <Duo block={block} prefixo={prefixo} onOpen={onOpen} />}
      {block.layout === 'flow' && <Flow block={block} prefixo={prefixo} onOpen={onOpen} />}
      {block.layout === 'single' && (
        <AnnotatedShot screen={block.screens[0]} prefixo={prefixo} onOpen={() => onOpen(block.screens[0].src)} />
      )}
      <figcaption className="mt-5 text-sm text-muted">{block.caption}</figcaption>
    </figure>
  )
}

export default function Showcase({
  blocks,
  slug,
  onOpen,
}: {
  blocks: ShowcaseBlock[]
  slug: string
  onOpen: Abrir
}) {
  return (
    <div className="mt-6 space-y-14">
      {blocks.map((b, i) => (
        <Bloco key={i} block={b} prefixo={`${slug}-${i}`} onOpen={onOpen} />
      ))}
    </div>
  )
}
