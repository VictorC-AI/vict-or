import { stack } from '../data/site'

export default function Stack() {
  return (
    <section id="stack" className="bg-sand/45">
      <div className="shell py-20 sm:py-28">
        <div className="max-w-[48ch]">
          <h2 className="type-display text-big">Ferramentas</h2>
          <p className="text-lead mt-5 text-ink/75">
            Escolho a stack depois de entender o projeto. Estas são as que eu uso
            sem precisar consultar documentação a cada linha.
          </p>
        </div>

        <dl className="mt-12 sm:mt-16">
          {stack.map((group) => (
            <div
              key={group.group}
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
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
