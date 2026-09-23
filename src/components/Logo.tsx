import { asset } from '../lib/asset'

/**
 * Marca vict.<OR> — os arquivos originais, recortados com fundo
 * transparente a partir dos PNGs da identidade.
 *
 * Duas versões porque a marca muda em fundo escuro: o V vira preto, o
 * bloco deslocado vira creme e o wordmark também. Não é a mesma imagem
 * invertida por CSS.
 *
 *   tone="ink"   → para fundo claro (creme)
 *   tone="cream" → para fundo escuro (preto)
 */
export function Wordmark({
  tone = 'ink',
  className = '',
}: {
  tone?: 'ink' | 'cream'
  className?: string
}) {
  const src =
    tone === 'ink' ? '/brand/wordmark-claro.png' : '/brand/wordmark-escuro.png'

  return (
    <img
      src={asset(src)}
      alt="vict.<OR>"
      width={1200}
      height={365}
      className={`h-7 w-auto sm:h-8 ${className}`}
    />
  )
}

export default Wordmark
