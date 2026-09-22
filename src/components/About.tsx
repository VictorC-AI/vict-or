import { about } from '../data/site'

export default function About() {
  return (
    <section id="sobre" className="bg-cream">
      <div className="shell py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-20">
          <div>
            <h2 className="type-display text-big">{about.title}</h2>
            <div className="mt-8 space-y-6">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-lead max-w-[58ch] text-ink/85">
                  {p}
                </p>
              ))}
            </div>
          </div>

          <aside className="shadow-hard-blue self-start border-2 border-ink bg-paper p-7">
            <h3 className="text-lg font-bold">Como eu trabalho</h3>
            <ul className="mt-5 space-y-4">
              {about.principles.map((item) => (
                <li key={item} className="flex gap-3 leading-snug">
                  <span
                    aria-hidden="true"
                    className="mt-[0.42em] size-2 shrink-0 bg-ink"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
