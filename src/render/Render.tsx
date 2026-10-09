import { projects, type Cover, type Project } from '../data/site'
import StoryArt from './StoryArt'
import OgArt from './OgArt'

// a página inteira é a imagem: sem barra de rolagem nem espaço reservado pra ela
document.documentElement.style.scrollbarGutter = 'auto'
document.documentElement.style.overflow = 'hidden'

/**
 * Modo de renderização das imagens de compartilhamento — não é uma página do
 * site. O script `npm run imagens` abre ?render=story|og&projeto=<slug> no Chrome
 * e fotografa o resultado.
 */
export default function Render({ tipo, slug }: { tipo: string; slug: string }) {
  const project = projects.find((p) => p.slug === slug)
  if (!project?.cover) return <p>Projeto sem capa: {slug}</p>
  const comCapa = project as Project & { cover: Cover }

  if (tipo === 'story') return <StoryArt project={comCapa} />
  if (tipo === 'og') return <OgArt project={comCapa} />
  return <p>Tipo desconhecido: {tipo}</p>
}
