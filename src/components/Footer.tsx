import { nav, profile } from '../data/site'
import { Wordmark } from './Logo'

export default function Footer() {
  const social = [
    { label: 'GitHub', href: profile.github },
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'Instagram', href: profile.instagram },
  ].filter((s) => s.href)

  return (
    <footer className="on-dark bg-ink text-cream">
      <div className="shell py-14 sm:py-16">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Wordmark tone="cream" />
            <p className="mt-4 max-w-[30ch] text-cream/60">
              {profile.role}. Disponível para projetos novos.
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <nav aria-label="Rodapé">
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-cream/70 transition-colors hover:text-cream"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {social.length > 0 && (
              <ul className="space-y-2.5">
                {social.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-cream/70 transition-colors hover:text-cream"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p className="mt-14 border-t border-cream/20 pt-6 text-sm text-cream/50">
          © {new Date().getFullYear()} {profile.name}. Feito à mão, linha por linha.
        </p>
      </div>
    </footer>
  )
}
