import { services } from '../data/site'

export default function Services() {
  return (
    <section id="servicos" className="on-dark bg-ink text-cream">
      <div className="shell py-20 sm:py-28">
        <div className="max-w-[52ch]">
          <h2 className="type-display text-big">Três coisas, bem feitas.</h2>
          <p className="text-lead mt-6 text-cream/70">
            Não pego tudo que aparece. Estes são os trabalhos em que eu entrego o
            projeto inteiro sem terceirizar nada.
          </p>
        </div>

        <div className="mt-12 grid divide-y divide-cream/20 sm:mt-16 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {services.map((s) => (
            <article
              key={s.id}
              className="flex flex-col py-10 first:pt-0 lg:px-9 lg:py-0 lg:first:pt-0 lg:first:pl-0 lg:last:pr-0"
            >
              <div>
                <h3 className="type-display text-4xl sm:text-5xl">{s.name}</h3>
                <p className="mt-4 max-w-[38ch] leading-relaxed text-cream/75">
                  {s.pitch}
                </p>
              </div>

              <ul className="mt-7 space-y-3">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.98rem] leading-snug">
                    <span
                      aria-hidden="true"
                      className="mt-[0.42em] size-2 shrink-0 bg-blue"
                    />
                    <span className="text-cream/90">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-7 text-sm text-cream/55">
                Prazo típico: <span className="text-cream">{s.deliverable}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
