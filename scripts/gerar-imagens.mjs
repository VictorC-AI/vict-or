/**
 * Gera as imagens de compartilhamento a partir do próprio site:
 *   public/share/story-<slug>.jpg   1080×1920, pro story do Instagram
 *   public/share/og-<slug>.jpg      1200×630, prévia do link (WhatsApp, DM)
 *
 * Rodar depois de mudar projeto, capa ou tela:
 *   npm run imagens                 todos os projetos com `cover`
 *   npm run imagens -- beacreative  só um
 *
 * Usa o Chrome instalado na máquina (sem dependência nova). Se ele estiver
 * em outro lugar: CHROME="caminho/do/chrome" npm run imagens
 */
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createServer } from 'vite'

const CHROMES = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const CHROME = CHROMES.find((c) => existsSync(c))
if (!CHROME) throw new Error('Chrome não encontrado. Defina CHROME com o caminho.')

const SAIDA = 'public/share'
const PORTA_CDP = 9339
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- site

const vite = await createServer({ server: { port: 5299, strictPort: false }, logLevel: 'error' })
await vite.listen()
const BASE = vite.resolvedUrls.local[0]

const { projects } = await vite.ssrLoadModule('/src/data/site.ts')
const pedidos = process.argv.slice(2)
const alvos = projects.filter((p) => p.cover && (!pedidos.length || pedidos.includes(p.slug)))

// ---------------------------------------------------------------- Chrome

const perfil = mkdtempSync(join(tmpdir(), 'imagens-'))
const chrome = spawn(CHROME, ['--headless=new', '--hide-scrollbars', `--remote-debugging-port=${PORTA_CDP}`, `--user-data-dir=${perfil}`, 'about:blank'])
let pagina
for (let i = 0; i < 40 && !pagina; i++) {
  await espera(250)
  try { pagina = (await (await fetch(`http://127.0.0.1:${PORTA_CDP}/json`)).json()).find((t) => t.type === 'page') } catch {}
}
if (!pagina) throw new Error('O Chrome não abriu.')

const ws = new WebSocket(pagina.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r))
let id = 0
const pendentes = new Map()
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pendentes.has(m.id)) { pendentes.get(m.id)(m); pendentes.delete(m.id) }
})
const cdp = (method, params = {}) => new Promise((ok, erro) => {
  const n = ++id
  pendentes.set(n, (m) => (m.error ? erro(new Error(m.error.message)) : ok(m.result)))
  ws.send(JSON.stringify({ id: n, method, params }))
})
const avaliar = async (expressao) =>
  (await cdp('Runtime.evaluate', { expression: expressao, awaitPromise: true, returnByValue: true })).result.value

// espera fontes e imagens: foto com fonte trocada ou tela em branco não serve
const PRONTO = `(async () => {
  // o modo de renderização é carregado sob demanda: espera ele montar
  for (let i = 0; i < 200 && !document.querySelector('[data-render]'); i++) await new Promise((r) => setTimeout(r, 50));
  if (!document.querySelector('[data-render]')) return ['(o componente não montou)'];
  await document.fonts.ready;
  const imgs = [...document.images];
  imgs.forEach((i) => (i.loading = 'eager'));
  await Promise.all(imgs.map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r })));
  return imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
})()`

async function fotografar(url, largura, altura, arquivo) {
  await cdp('Emulation.setDeviceMetricsOverride', { width: largura, height: altura, deviceScaleFactor: 2, mobile: false })
  await cdp('Page.navigate', { url })
  await espera(800)
  const quebradas = await avaliar(PRONTO)
  if (quebradas.length) console.warn('  imagens que não carregaram:', quebradas)
  await espera(200)
  const foto = await cdp('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 88,
    clip: { x: 0, y: 0, width: largura, height: altura, scale: 1 },
  })
  writeFileSync(arquivo, Buffer.from(foto.data, 'base64'))
}

await cdp('Page.enable')
mkdirSync(SAIDA, { recursive: true })

try {
  for (const p of alvos) {
    for (const [tipo, largura, altura] of [['story', 540, 960], ['og', 600, 315]]) {
      const arquivo = join(SAIDA, `${tipo}-${p.slug}.jpg`)
      await fotografar(`${BASE}?render=${tipo}&projeto=${p.slug}`, largura, altura, arquivo)
      console.log('✓', arquivo)
    }
  }
} finally {
  ws.close()
  chrome.kill()
  await vite.close()
}
