import { SITE_URL, type Cover, type Project } from '../data/site'
import DeviceFrame from '../components/DeviceFrame'
import { Padrao } from '../components/CoverArt'
import { asset } from '../lib/asset'

/** endereço impresso nas imagens (sem https:// e sem a barra final, que ninguém lê) */
export const ENDERECO = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

/** 160 de largura em 9:16 */
const ALTURA = (160 * 16) / 9

/**
 * Story do Instagram (desenhado em 540×960, capturado em 2x = 1080×1920).
 * Mesmo molde das capas: paleta, padrão, aparelhos com telas reais e a logo.
 *
 * O Instagram cobre ~14% do topo (barra de progresso e perfil) e ~18% da base
 * (campo de resposta): o conteúdo vive numa coluna entre as duas faixas, e o
 * espaço que sobra vai pros aparelhos — título longo nunca empurra nada por cima.
 */
export default function StoryArt({ project }: { project: Project & { cover: Cover } }) {
  const { cover } = project
  const logo = cover.bannerLogo ?? project.logo

  return (
    <div
      data-render="story"
      className="relative isolate flex h-[960px] w-[540px] flex-col overflow-hidden px-9 pt-[136px] pb-[176px]"
      style={{ backgroundColor: cover.palette.bg, color: cover.palette.ink }}
    >
      <svg
        viewBox={`0 0 160 ${ALTURA}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full"
      >
        <Padrao cover={cover} id="padrao-story" h={ALTURA} />
      </svg>

      {logo && (
        // caixa, não altura fixa: wordmark largo bate na largura, marca
        // quadrada (LAEG) bate na altura — os dois com o mesmo peso visual
        <img src={asset(logo)} alt="" className="mx-auto h-[68px] w-[280px] object-contain" />
      )}

      {/* aparelhos: o notebook de fundo, o celular na frente e maior */}
      <div className="relative my-7 min-h-0 flex-1">
        {cover.laptop && (
          <DeviceFrame
            screen={{ device: 'laptop', src: cover.laptop, alt: '' }}
            className="absolute top-1/2 -left-2 w-[372px] -translate-y-[44%]"
          />
        )}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            cover.laptop ? '-right-1 w-[148px]' : 'left-1/2 w-[168px] -translate-x-1/2'
          }`}
        >
          <DeviceFrame
            screen={{ device: 'phone', src: cover.phone, widths: cover.phoneWidths, alt: '' }}
            className="shadow-hard"
          />
          {cover.badge && (
            <span
              className="absolute top-full left-1/2 mt-4 -translate-x-1/2 rounded-full border-2 border-ink px-3.5 py-1 text-[15px] font-bold whitespace-nowrap shadow-hard-sm"
              style={{ backgroundColor: cover.palette.accent, color: cover.palette.bg }}
            >
              {cover.badge}
            </span>
          )}
        </div>
      </div>

      <h1 className="type-display text-[40px] leading-[0.95]">{project.title}</h1>
      {cover.frase && (
        <p className="mt-3 max-w-[30ch] text-[19px] leading-snug opacity-90">{cover.frase}</p>
      )}

      {/* assinatura: o cartão creme com borda preta é o mesmo em todos os fundos */}
      <div className="shadow-hard mt-6 flex items-center justify-between gap-4 border-2 border-ink bg-paper px-4 py-3">
        <img src={asset('/brand/wordmark-claro.png')} alt="vict.<OR>" className="h-[26px] w-auto" />
        <span className="font-mono text-[12.5px] text-ink/75">{ENDERECO}</span>
      </div>
    </div>
  )
}
