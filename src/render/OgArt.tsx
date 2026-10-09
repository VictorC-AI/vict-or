import type { Cover, Project } from '../data/site'
import DeviceFrame from '../components/DeviceFrame'
import { Padrao } from '../components/CoverArt'
import { asset } from '../lib/asset'
import { ENDERECO } from './StoryArt'

/** 160 de largura em 1200×630 */
const ALTURA = (160 * 630) / 1200

/**
 * Prévia de link (og:image) de um projeto: 600×315 desenhado, 1200×630 na foto.
 * WhatsApp e Instagram mostram a imagem pequena e às vezes cortam as bordas
 * num quadrado: o essencial (título e celular) fica longe dos cantos.
 */
export default function OgArt({ project }: { project: Project & { cover: Cover } }) {
  const { cover } = project
  const logo = cover.bannerLogo ?? project.logo

  return (
    <div
      data-render="og"
      className="relative isolate flex h-[315px] w-[600px] overflow-hidden"
      style={{ backgroundColor: cover.palette.bg, color: cover.palette.ink }}
    >
      <svg
        viewBox={`0 0 160 ${ALTURA}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full"
      >
        <Padrao cover={cover} id="padrao-og" h={ALTURA} />
      </svg>

      <div className="flex w-[300px] shrink-0 flex-col justify-center gap-3 pl-8">
        {logo && <img src={asset(logo)} alt="" className="h-[34px] w-[170px] object-contain object-left" />}
        <h1 className="type-display text-[30px] leading-[0.95]">{project.title}</h1>
        {cover.frase && <p className="text-[13.5px] leading-snug opacity-90">{cover.frase}</p>}
        <div className="mt-1 flex items-center gap-2 self-start border-2 border-ink bg-paper px-2.5 py-1.5 shadow-hard-sm">
          <img src={asset('/brand/wordmark-claro.png')} alt="" className="h-[15px] w-auto" />
          <span className="font-mono text-[9px] text-ink/70">{ENDERECO}</span>
        </div>
      </div>

      <div className="relative flex-1">
        {cover.laptop && (
          <DeviceFrame
            screen={{ device: 'laptop', src: cover.laptop, alt: '' }}
            className="absolute top-1/2 left-0 w-[250px] -translate-y-[44%]"
          />
        )}
        <div className={`absolute top-1/2 w-[96px] -translate-y-1/2 ${cover.laptop ? 'right-6' : 'left-1/2 -translate-x-1/2'}`}>
          <DeviceFrame
            screen={{ device: 'phone', src: cover.phone, widths: cover.phoneWidths, alt: '' }}
            className="shadow-hard-sm"
          />
        </div>
      </div>
    </div>
  )
}
