import { stack } from '../data/site'

/**
 * Ferramentas como texto corrido em vez de etiquetas: a primeira lista grande,
 * as seguintes (o que está aprendendo) menores e mais apagadas.
 */
export default function Stack() {
  return (
    <section id="stack" className="on-dark bg-ink text-cream">
      <div className="shell py-20 sm:py-28">
        <h2 className="type-display text-big">Ferramentas</h2>
        <p className="text-lead mt-5 max-w-[48ch] text-cream/70">
          O que eu uso sem consultar documentação a cada linha, e o que estou
          aprendendo agora. Este site foi escrito com a segunda lista.
        </p>

        <div className="mt-12 space-y-10 sm:mt-16">
          {stack.map((group, i) => (
            <div key={group.group}>
              <h3 className="text-sm font-bold text-cream/60">{group.group}</h3>
              <p
                className={`mt-3 max-w-[36ch] font-mono leading-snug ${
                  i === 0
                    ? 'text-[clamp(1.5rem,3.2vw,2.6rem)] text-cream'
                    : 'text-[clamp(1.2rem,2.2vw,1.75rem)] text-cream/70'
                }`}
              >
                {group.items.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
