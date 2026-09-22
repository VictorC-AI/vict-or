import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Work from './components/Work'
import Stack from './components/Stack'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
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
