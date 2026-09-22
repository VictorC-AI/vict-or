import { hero, profile } from '../data/site'
import GridField from './GridField'

export default function Hero() {
  return (
    <section
      id="topo"
      className="relative overflow-hidden pt-28 pb-0 sm:pt-36"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'linear-gradient(100deg, transparent 6%, black 44%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(100deg, transparent 6%, black 44%, black 100%)',
        }}
      >
        <GridField className="absolute inset-0 h-full w-full" />
      </div>

      <div className="shell relative pb-14 sm:pb-20">
        <h1 className="type-display text-mega rise max-w-[13ch]">
          {hero.headline.map((line, i) => (
            <span key={line} className="block">
              {line}
              {i === hero.headline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="ml-[0.09em] inline-block h-[0.66em] w-[0.16em] translate-y-[0.02em] bg-blue align-baseline"
                />
              )}
            </span>
          ))}
        </h1>

        <div className="mt-9 grid gap-9 sm:mt-12 lg:grid-cols-[minmax(0,34rem)_auto] lg:items-end lg:gap-16">
          <p className="text-lead max-w-[46ch] text-ink/80">{hero.lead}</p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={hero.primaryCta.href}
              className="shadow-hard border-2 border-ink bg-ink px-6 py-3.5 text-base font-bold text-cream transition-transform duration-150 ease-[var(--ease-snap)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none sm:text-lg"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              className="border-2 border-ink px-6 py-3.5 text-base font-bold transition-colors hover:bg-ink hover:text-cream sm:text-lg"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <div className="shell relative">
        <dl className="rule grid grid-cols-2 gap-x-8 gap-y-6 py-7 sm:grid-cols-4 sm:py-8">
          <div>
            <dt className="text-sm text-muted">Onde estou</dt>
            <dd className="mt-1 text-lg font-bold">{profile.location}</dd>
          </div>
          {hero.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-1 text-lg font-bold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
