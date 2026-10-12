/**
 * Curtidas dos projetos, guardadas no Supabase.
 *
 * O site só chama três funções do banco (supabase/migrations/…_curtidas.sql):
 * curtir, descurtir e contagem_curtidas. As tabelas são fechadas; o limite
 * contra abuso e o "só mostra a partir de 10" acontecem lá, não aqui.
 *
 * URL e chave publishable são públicas por natureza (vão pro navegador de
 * qualquer jeito). A chave secreta / service_role NUNCA entra aqui.
 */
const SUPABASE_URL = 'https://qzynlhbsckwfrynhlhsh.supabase.co'
const CHAVE_PUBLICA = 'sb_publishable_ViWRVS_Qk_dlRev8svUsuw_8ULnMFTH'

const GUARDADO_ID = 'vict-or:visitante'
const GUARDADO_CURTIDOS = 'vict-or:curtidos'

/** id aleatório deste navegador: é o "um voto por navegador" */
function visitante(): string {
  try {
    let id = localStorage.getItem(GUARDADO_ID)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(GUARDADO_ID, id)
    }
    return id
  } catch {
    // modo privado sem armazenamento: vale enquanto a página estiver aberta
    return (memoria ??= crypto.randomUUID())
  }
}
let memoria: string | undefined

/** projetos que este navegador curtiu (pra desenhar o coração cheio) */
export function curtidosAqui(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(GUARDADO_CURTIDOS) ?? '[]'))
  } catch {
    return new Set()
  }
}

function lembrar(slug: string, curtiu: boolean) {
  const atual = curtidosAqui()
  if (curtiu) atual.add(slug)
  else atual.delete(slug)
  try {
    localStorage.setItem(GUARDADO_CURTIDOS, JSON.stringify([...atual]))
  } catch {
    /* sem armazenamento: o estado vale só nesta visita */
  }
}

export class ErroCurtida extends Error {}

async function rpc<T>(funcao: string, corpo: object = {}): Promise<T> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${funcao}`, {
    method: 'POST',
    headers: { apikey: CHAVE_PUBLICA, 'Content-Type': 'application/json' },
    body: JSON.stringify(corpo),
  })
  const dados = await r.json().catch(() => null)
  if (!r.ok) {
    // mensagens das funções (P0001) já vêm prontas pra quem está vendo
    const msg = dados?.code === 'P0001' ? dados.message : 'Não deu pra registrar agora. Tente de novo em instantes.'
    throw new ErroCurtida(msg)
  }
  return dados as T
}

/** total público por projeto; ausente = ainda não chegou a 10 */
export async function contagens(): Promise<Record<string, number>> {
  const linhas = await rpc<{ projeto: string; total: number | null }[]>('contagem_curtidas')
  return Object.fromEntries(linhas.filter((l) => l.total != null).map((l) => [l.projeto, l.total!]))
}

/** curte ou descurte; devolve o total público novo (null abaixo de 10) */
export async function alternarCurtida(slug: string, curtir: boolean): Promise<number | null> {
  const total = await rpc<number | null>(curtir ? 'curtir' : 'descurtir', {
    p_projeto: slug,
    p_visitante: visitante(),
  })
  lembrar(slug, curtir)
  return total
}

// ------------------------------------------------------------------ estado
// O coração aparece no card e no detalhe ao mesmo tempo: os dois leem daqui,
// então curtir num lado acende o outro na hora.

type Estado = { curtidos: Set<string>; totais: Record<string, number> }
let estado: Estado = { curtidos: curtidosAqui(), totais: {} }
const ouvintes = new Set<() => void>()
const avisar = () => ouvintes.forEach((f) => f())

export function assinar(f: () => void) {
  ouvintes.add(f)
  return () => {
    ouvintes.delete(f)
  }
}
export const estadoAtual = () => estado

// uma busca por visita, dividida entre todos os botões da página
let buscou = false
export function carregarTotais() {
  if (buscou) return
  buscou = true
  contagens()
    .then((totais) => {
      estado = { ...estado, totais }
      avisar()
    })
    .catch(() => {
      buscou = false
    })
}

/** curte/descurte já mudando a tela; volta atrás se o banco recusar */
export async function alternar(slug: string): Promise<void> {
  const curtir = !estado.curtidos.has(slug)
  const antes = estado
  const curtidos = new Set(estado.curtidos)
  if (curtir) curtidos.add(slug)
  else curtidos.delete(slug)
  estado = { ...estado, curtidos }
  avisar()
  try {
    const total = await alternarCurtida(slug, curtir)
    const totais = { ...estado.totais }
    if (total == null) delete totais[slug]
    else totais[slug] = total
    estado = { ...estado, totais }
    avisar()
  } catch (e) {
    estado = antes
    avisar()
    throw e
  }
}

// ------------------------------------------------------------------ recados

/**
 * Feedback sobre um projeto: vai pro banco (função deixar_recado em
 * supabase/migrations/…_avisos_e_recados.sql) e chega por e-mail pro Victor.
 * Não aparece no site.
 */
export async function deixarRecado(slug: string, nome: string, texto: string): Promise<void> {
  await rpc<null>('deixar_recado', {
    p_projeto: slug,
    p_visitante: visitante(),
    p_nome: nome.trim() || null,
    p_texto: texto.trim(),
  })
}
