import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Fontes servidas pelo próprio site — sem chamada ao Google.
// 'standard' traz os dois eixos variáveis da Archivo: peso e largura.
import '@fontsource-variable/archivo/standard.css'
import '@fontsource/jetbrains-mono/500.css'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
