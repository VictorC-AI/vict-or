import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Vercel, Netlify e domínio próprio usam '/'.
  // O workflow do GitHub Pages passa VITE_BASE='/nome-do-repo/' sozinho.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
})
