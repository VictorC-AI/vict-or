import type { Project } from '../data/site'
import { asset } from './asset'

/**
 * Stories do Instagram: as imagens são geradas antes (npm run imagens) e ficam
 * em /share. Aqui só se baixa o arquivo e se entrega pro compartilhamento do
 * celular — onde a pessoa escolhe Instagram → Stories.
 */

/** só projeto com capa desenhada tem story gerado */
export const temStory = (p: Project) => Boolean(p.cover)

const caminho = (slug: string) => `/share/story-${slug}.jpg`

// o arquivo é buscado antes do clique: navigator.share precisa ser chamado
// logo depois do toque, e um download no meio pode fazer o navegador recusar
const cache = new Map<string, Promise<File>>()

export function prepararStory(slug: string): Promise<File> {
  let arquivo = cache.get(slug)
  if (!arquivo) {
    arquivo = fetch(asset(caminho(slug)))
      .then((r) => {
        if (!r.ok) throw new Error(`story não encontrado: ${slug}`)
        return r.blob()
      })
      .then((b) => new File([b], `vict-or-${slug}.jpg`, { type: 'image/jpeg' }))
    arquivo.catch(() => cache.delete(slug))
    cache.set(slug, arquivo)
  }
  return arquivo
}

/**
 * Vale compartilhar em vez de baixar? Precisa aceitar arquivo E ser tela de
 * toque: o Chrome do Windows também aceita, mas abre o painel do Windows, que
 * não leva ao Instagram — no computador, baixar é mais útil.
 */
export function podeCompartilharArquivos(quantos = 1): boolean {
  if (typeof navigator === 'undefined' || !navigator.canShare) return false
  if (!window.matchMedia('(pointer: coarse)').matches) return false
  const teste = Array.from({ length: quantos }, (_, i) => new File([''], `t${i}.jpg`, { type: 'image/jpeg' }))
  try {
    return navigator.canShare({ files: teste })
  } catch {
    return false
  }
}

function baixar(arquivo: File) {
  const url = URL.createObjectURL(arquivo)
  const a = Object.assign(document.createElement('a'), { href: url, download: arquivo.name })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export type Resultado = 'compartilhado' | 'baixado' | 'cancelado'

/**
 * Compartilha os stories na ordem dada. Se o navegador não aceitar arquivo
 * (ou recusar vários de uma vez), baixa todos, um por um, na mesma ordem.
 */
export async function compartilharStories(projetos: Project[]): Promise<Resultado> {
  const arquivos = await Promise.all(projetos.map((p) => prepararStory(p.slug)))

  if (podeCompartilharArquivos(arquivos.length) && navigator.canShare({ files: arquivos })) {
    try {
      // só os arquivos: com texto junto, o Instagram oferece o feed e a DM
      // em vez dos Stories
      await navigator.share({ files: arquivos })
      return 'compartilhado'
    } catch (erro) {
      // a pessoa fechou a folha de compartilhamento: não é erro, não baixa nada
      if (erro instanceof DOMException && erro.name === 'AbortError') return 'cancelado'
      // qualquer outra recusa cai no download
    }
  }

  for (const [i, arquivo] of arquivos.entries()) {
    // intervalo pequeno: alguns navegadores juntam ou bloqueiam downloads seguidos
    if (i > 0) await new Promise((r) => setTimeout(r, 400))
    // vários: o número na frente mantém a ordem na pasta, que lista por nome
    baixar(arquivos.length > 1 ? new File([arquivo], `${i + 1}-${arquivo.name}`, { type: arquivo.type }) : arquivo)
  }
  return 'baixado'
}
