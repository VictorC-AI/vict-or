# vict.<OR>: portfólio

Redesign em andamento na branch `redesign`: apresentação nova, mesma marca e mesmas funções.

## Direção escolhida (2026-10-12)

Protótipo aprovado: https://claude.ai/artifact/BUBAFaki8pbL35opwQmmrr

- Abertura: símbolo do logo em pixels 3D (canvas 2D, sem biblioteca) que se monta, ondula e explode revelando o site; contador real de carregamento e botão Pular.
- Topo: o mesmo símbolo vivo, inclina com o ponteiro, onda contínua. O logo aparece só na abertura e no topo, não em todas as seções.
- Trabalhos: palco fixo em tela cheia, um projeto por vez nas cores do cliente, notebook girando em 3D com a rolagem, passagem entre projetos por uma onda de pixels azuis.
- Serviços, Sobre e Contato: quietos.
- Movimento reduzido: abertura curta, símbolo parado, troca sem onda.

## Marca (não muda)

- Cores: creme `#F4EFE6`, azul `#233DFF`, preto `#000000`. Nenhuma outra cor.
- Logo em `/public/brand`, versões clara e escura. A forma do logo (quadrado azul com bloco sólido deslocado atrás, sem blur) é a assinatura visual.
- Fontes self-hosted já instaladas: Archivo variável (eixo `wdth`) e JetBrains Mono. Outra combinação só com justificativa, sempre self-hosted.

## Funções (não mudam, só a apresentação)

- Conteúdo vem de `src/data/site.ts`; lógica de `src/lib/` (`curtidas.ts`, `rota.ts`, `compartilhar.ts`, `asset.ts`, `motion.ts`). Não reescrever esses arquivos. Componentes podem ser todos refeitos.
- Precisa continuar existindo:
  - serviços;
  - trabalhos com detalhe em `<dialog>` (capa, texto, showcase/galeria, stack, links);
  - curtir no card e no detalhe (número só a partir de 10);
  - feedback privado;
  - compartilhar story;
  - formulário de contato (Web3Forms);
  - modo escuro pela preferência do sistema;
  - imagens OG/story geradas por `src/render`.
- Rotas `/projetos/<slug>/` abrem o detalhe. Deploy no GitHub Pages com `VITE_BASE`.
- Sem cookies nem rastreamento; manter a linha que explica isso perto do feedback.

## Conteúdo

- Sem travessão (— ou –) em nenhum texto visível.
- Não citar cidade em lugar nenhum.
- Um único rótulo de contato: `contactCta` ("Começar um projeto").
- Não citar ano de início na programação.
- Prints do LAEG mantêm nome da orientadora e avatar borrados.
- Título da página: "vict.<OR> | sites e sistemas sob medida".

## Conflitos com a skill da taste (a marca vence)

- Preto puro, fundo creme e faixas alternando claro/escuro são da marca, não são erro.
