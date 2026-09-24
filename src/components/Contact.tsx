import { useState, type FormEvent } from 'react'
import { contact, profile } from '../data/site'

type State = 'idle' | 'sending' | 'sent' | 'error'

export default function Contact() {
  const [state, setState] = useState<State>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    // Sem endpoint configurado: abre o e-mail já preenchido.
    if (!contact.formEndpoint) {
      const body = [
        `Nome: ${data.get('nome')}`,
        `E-mail: ${data.get('email')}`,
        `Orçamento: ${data.get('orcamento')}`,
        '',
        String(data.get('mensagem') ?? ''),
      ].join('\n')
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        `Projeto — ${data.get('nome')}`,
      )}&body=${encodeURIComponent(body)}`
      setState('sent')
      return
    }

    // armadilha de robô: humano nunca preenche um campo escondido
    if (data.get('empresa')) {
      setState('sent')
      return
    }
    data.delete('empresa')

    // campos que o serviço exige (ex.: access_key do Web3Forms)
    for (const [k, v] of Object.entries(contact.formHiddenFields ?? {})) {
      data.set(k, v)
    }
    data.set('subject', `Novo contato pelo site — ${data.get('nome')}`)

    setState('sending')
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  const field =
    'w-full border-2 border-cream/35 bg-transparent px-4 py-3 text-cream placeholder:text-cream/45 focus:border-cream focus:outline-none'

  return (
    <section id="contato" className="on-dark bg-blue text-cream">
      <div className="shell py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="type-display text-big">{contact.title}</h2>
            <p className="text-lead mt-6 max-w-[42ch] text-cream/85">
              {contact.lead}
            </p>

            <div className="mt-10 space-y-2">
              <a
                href={`mailto:${profile.email}`}
                className="type-narrow block text-lg font-bold break-all underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
              >
                {profile.email}
              </a>
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block text-lg font-bold underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
                >
                  Chamar no WhatsApp
                </a>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5">
            {/* honeypot — invisível pra gente, irresistível pra robô */}
            <input
              type="text"
              name="empresa"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-semibold">Seu nome</span>
                <input name="nome" required autoComplete="name" className={field} />
              </label>
              <label className="grid gap-2">
                <span className="font-semibold">Seu e-mail</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={field}
                />
              </label>
            </div>

            <label className="grid gap-2">
              <span className="font-semibold">Orçamento previsto</span>
              <select
                name="orcamento"
                className={`${field} appearance-none`}
                defaultValue={contact.budgets[contact.budgets.length - 1]}
              >
                {contact.budgets.map((b) => (
                  <option key={b} value={b} className="text-ink">
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="font-semibold">O que você quer resolver</span>
              <textarea
                name="mensagem"
                rows={5}
                required
                placeholder="Uma loja pra vender doce por encomenda, com Pix e controle de pedido."
                className={`${field} resize-y`}
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={state === 'sending'}
                className="shadow-hard-cream border-2 border-cream bg-ink px-6 py-3.5 text-lg font-bold text-cream transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-60"
              >
                {state === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
              </button>

              <p role="status" aria-live="polite" className="text-sm text-cream/85">
                {state === 'sent' && 'Mensagem a caminho. Respondo em até um dia útil.'}
                {state === 'error' &&
                  `Não consegui enviar. Me escreva direto em ${profile.email}.`}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
