import { stack } from '../data/site'
import Reveal from './Reveal'

export default function Stack() {
  return (
    <section id="stack" className="bg-sand/45">
      <div className="shell py-20 sm:py-28">
        <Reveal className="max-w-[48ch]">
          <h2 className="type-display text-big">Ferramentas</h2>
          <p className="text-lead mt-5 text-ink/75">
            O que eu uso sem consultar documentação a cada linha, e o que estou
            aprendendo agora. Este site foi escrito com a segunda lista.
          </p>
        </Reveal>

        <dl className="mt-12 sm:mt-16">
          {stack.map((group) => (
            <Reveal
              key={group.group}
              ordem={1}
              className="rule grid gap-3 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-7"
            >
              <dt className="type-display self-start text-xl sm:text-2xl">
                {group.group}
              </dt>
              <dd className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border-2 border-ink bg-paper px-3 py-1.5 text-[0.9rem] font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
