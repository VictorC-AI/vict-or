# vict.&lt;OR&gt; — site portfólio

Portfólio de desenvolvedor em React + TypeScript + Vite + Tailwind v4.
Uma página só, sem backend, sem dependência externa em tempo de execução
(as fontes são servidas pelo próprio site).

---

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve a dist/ pra conferir antes de publicar
```

Precisa de Node 20 ou mais novo.

---

## Onde mexer

**Praticamente tudo que é texto está em `src/data/site.ts`.** Trocar um
projeto, um serviço, o e-mail ou o título do hero é editar esse arquivo —
nenhum componente precisa ser aberto.

| O quê | Onde |
| --- | --- |
| Nome, e-mail, redes | `src/data/site.ts` → `profile` |
| Título e textos do topo | `src/data/site.ts` → `hero` |
| Serviços (Sites, E-commerce) | `src/data/site.ts` → `services` |
| Projetos do portfólio | `src/data/site.ts` → `projects` |
| Tecnologias | `src/data/site.ts` → `stack` |
| Texto do "Sobre" | `src/data/site.ts` → `about` |
| Cores, fontes, tamanhos | `src/index.css` → bloco `@theme` |
| Logo | `src/components/Logo.tsx` |
| Título da aba, SEO, Open Graph | `index.html` |

### Adicionar um projeto

Cole um objeto novo no array `projects`:

```ts
{
  slug: 'nome-curto',            // precisa ser único
  title: 'Nome do Projeto',
  summary: 'Uma linha que aparece no card.',
  year: '2026',
  category: 'site',              // 'site' | 'jogo' | 'ecommerce'
  status: 'No ar',               // opcional
  stack: ['React', 'PostgreSQL'],
  problem: 'O que estava errado antes.',
  solution: 'O que você construiu.',
  result: 'O que mudou depois.',
  links: [{ label: 'Abrir o site', href: 'https://...' }],
  image: '/shots/nome-curto.png' // opcional
}
```

O primeiro projeto da lista vira o destaque, ocupando a linha inteira.

### Quando o primeiro jogo ficar pronto

A categoria `'jogo'` continua no código, só não tem projeto por trás.
Adicione o projeto com `category: 'jogo'` e o filtro "Jogos" aparece
sozinho na seção Trabalhos — o filtro é montado a partir das categorias
que realmente têm projeto. Se quiser voltar a vender o serviço, reponha o
bloco de Jogos em `services` e troque "Duas coisas, bem feitas." por
"Três" em `src/components/Services.tsx` (e `lg:grid-cols-2` por
`lg:grid-cols-3`).

### Colocar screenshot de verdade

Enquanto `image` fica vazio, o card usa uma capa geométrica gerada
automaticamente (`src/components/ProjectCover.tsx`). Pra usar foto:

1. Salve a imagem em `public/shots/` — proporção 16:9 ou 160:112, largura ≥ 1280px.
2. Preencha `image: '/shots/arquivo.png'` no projeto.

### Fazer o formulário enviar de verdade

Hoje, sem configuração, o botão abre o e-mail do visitante já preenchido.
Pra receber por HTTP, crie um formulário grátis no
[Formspree](https://formspree.io) ou [Web3Forms](https://web3forms.com) e
cole a URL em `contact.formEndpoint` (`src/data/site.ts`). O envio passa a
ser por `fetch`, sem sair da página.

---

## Publicar

**Vercel ou Netlify** — importe o repositório. Build `npm run build`,
pasta de saída `dist`. Nada mais a configurar.

**GitHub Pages** — se a URL for `usuario.github.io/nome-do-repo`, abra
`vite.config.ts` e troque `base: '/'` por `base: '/nome-do-repo/'` antes
de buildar.

---

## Estrutura

```
src/
  data/site.ts            todo o conteúdo
  index.css               tokens da marca (@theme) e utilitários
  App.tsx                 ordem das seções
  components/
    Header.tsx            topo fixo + menu do celular
    Hero.tsx              título grande + malha interativa
    GridField.tsx         canvas que acende onde o cursor passa
    Services.tsx          sites / e-commerce
    Work.tsx              grade de projetos com filtro
    ProjectDialog.tsx     detalhe do projeto (<dialog> nativo)
    ProjectCover.tsx      capa geométrica gerada por projeto
    Stack.tsx             ferramentas
    About.tsx             sobre + princípios
    Contact.tsx           formulário
    Footer.tsx
    Logo.tsx              marca em SVG
public/brand/             favicon e imagem de compartilhamento
```

---

## Decisões de design

Paleta, tipografia e formas saem do próprio logo:

- **Creme `#F4EFE6`, azul `#233DFF`, preto `#000000`** — as três cores do
  wordmark, sem nenhuma quarta cor.
- **Archivo variável** no eixo de largura (`wdth 118`) para os títulos —
  o wordmark é largo e pesado, os títulos acompanham.
- **Sombra sólida deslocada**, sem blur, repetindo o bloco preto atrás do
  quadrado azul do logo. É o único efeito de profundidade do site.
- **Uma animação, no hero.** A malha só reage ao cursor; nada se move
  sozinho. Com `prefers-reduced-motion` ela fica estática.
- Foco de teclado visível em todos os controles, contraste conferido nas
  faixas clara e escura, e o site funciona inteiro sem JavaScript de
  terceiros.
