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
  const claro = '/brand/wordmark-claro.png'
  const escuro = '/brand/wordmark-escuro.png'
  const src = tone === 'ink' ? claro : escuro
  // no modo escuro as faixas trocam de cor, então a versão do logo troca junto
  const noEscuro = tone === 'ink' ? escuro : claro

  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={asset(noEscuro)} />
      <img
        src={asset(src)}
        alt="vict.<OR>"
        width={1200}
        height={365}
        className={`h-7 w-auto sm:h-8 ${className}`}
      />
    </picture>
  )
}

export default Wordmark
