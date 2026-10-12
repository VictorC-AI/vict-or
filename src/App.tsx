import { useState } from 'react'
import Abertura from './components/Abertura'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Work from './components/Work'
import Stack from './components/Stack'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { projetoNoEndereco } from './lib/rota'

const VISTA = 'abertura-vista'

/**
 * A abertura roda uma vez por sessão do navegador, e nunca quando o endereço
 * já abre um projeto (link compartilhado vai direto pro detalhe).
 */
function deveAbrir() {
  if (projetoNoEndereco()) return false
  try {
    return !sessionStorage.getItem(VISTA)
  } catch {
    return true
  }
}

export default function App() {
  const [abrir] = useState(deveAbrir)
  const [pronto, setPronto] = useState(!abrir)

  const aoTerminarAbertura = () => {
    setPronto(true)
    try {
      sessionStorage.setItem(VISTA, '1')
    } catch {
      // sem armazenamento a abertura só roda de novo na próxima visita
    }
  }

  return (
    <>
      {abrir && <Abertura onPronto={aoTerminarAbertura} />}
      <Header />
      <main id="conteudo">
        <Hero pronto={pronto} />
        <Services />
        <Work />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
