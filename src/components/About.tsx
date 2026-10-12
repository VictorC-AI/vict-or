import { about, hero } from '../data/site'

/**
 * Sobre: o título e os fatos (que saíram do topo) numa coluna; o primeiro
 * parágrafo em destaque, o resto em texto corrido e o jeito de trabalhar em
 * linhas grandes, na outra.
 */
export default function About() {
  const [primeiro, ...resto] = about.paragraphs

  return (
    <section id="sobre" className="bg-cream">
      <div className="shell grid gap-12 py-20 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <div>
          <h2 className="type-display text-big">{about.title}</h2>
          <dl className="mt-10 space-y-5">
            {hero.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse">
                <dt className="text-ink/65">{f.label}</dt>
                <dd className="text-xl font-bold">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="min-w-0">
          {primeiro && (
            <p className="max-w-[34ch] text-[clamp(1.4rem,2.4vw,2rem)] leading-snug font-medium">
              {primeiro}
            </p>
          )}
          <div className="mt-8 space-y-5">
            {resto.map((p) => (
              <p key={p.slice(0, 24)} className="max-w-[60ch] text-lg leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </div>

          <h3 className="mt-14 text-sm font-bold text-ink/65">Como eu trabalho</h3>
          <ul className="mt-3">
            {about.principles.map((item) => (
              <li key={item} className="type-wide border-t border-ink/15 py-4 text-xl font-bold sm:text-2xl">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
