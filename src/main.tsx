import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Fontes servidas pelo próprio site — sem chamada ao Google.
// 'standard' traz os dois eixos variáveis da Archivo: peso e largura.
import '@fontsource-variable/archivo/standard.css'
import '@fontsource/jetbrains-mono/500.css'

import './index.css'

const raiz = createRoot(document.getElementById('root')!)
const busca = new URLSearchParams(location.search)
const render = busca.get('render')

if (render) {
  // imagens de compartilhamento (npm run imagens): carregado só neste modo,
  // o site normal não baixa esse código
  import('./render/Render').then(({ default: Render }) =>
    raiz.render(
      <StrictMode>
        <Render tipo={render} slug={busca.get('projeto') ?? ''} />
      </StrictMode>,
    ),
  )
} else {
  raiz.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
