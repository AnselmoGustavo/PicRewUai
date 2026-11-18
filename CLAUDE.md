# PicRewUai — contexto para o Claude Code

Lido automaticamente pelo Claude Code ao abrir este projeto (em qualquer computador).
**Não coloque segredos aqui** — o repositório é público. Chaves ficam só no `.env.local` (fora do Git).

## O projeto

Web app (Next.js 15 + TypeScript + Zustand + Canvas 2D) do evento **UAI 2026 (19–22/11/2026, ~30 pessoas)**.
O participante cria conta (usuário + senha + apelido), monta um personagem (5 animais × 5 classes),
equipa itens e envia. A **carta de TCG** (63 × 88 mm, 744 × 1039 px @300 DPI) é **surpresa**: é
composta no navegador e enviada por trás para impressão — o participante nunca vê a carta.

- No ar: https://pic-rew-uai.vercel.app (deploy automático a cada push na `main`).
- Backend: Supabase (tabelas `usuarios`, `progresso`, `cartas` + bucket privado `cartas`), acessado
  só pelas API routes com a service key. Schema em `supabase/schema.sql`.
- Ilustradora: Ana Beatriz. O usuário escreve em **PT-BR** — responda em PT-BR.
- **O usuário faz os commits e push ele mesmo.**
- Documentação completa em `docs/` (01–12) e no `README.md`. Decisões em `docs/09-decisoes.md`.

## Regras importantes (estado em 18/11/2026, véspera do evento)

- **Itens**: id `animal-classe-tipo-nome-dia[-zNN]`; bônus e códigos usam a chave `classe/tipo/nome`
  (vale para os 5 animais). 690 itens. 8 tipos: capa 10 · corpo 20 · calçado 30 · calça 40 ·
  camisa 50 · capa-frente 60 · arma 70 · escudo 72 · acessório 75 · chapéu 80. Acessório aceita vários.
  Acessórios flutuantes (Estrela 2023, Lampião 2022, Lanterna 2025) ficam em z5, atrás do corpo.
- **Desbloqueio**: um campo só de códigos (`src/lib/codigos.ts`, `titulos.ts`, `codigosItens.ts`;
  lista completa em `codigos-evento.csv`). **Todo item tem código próprio**; o código de cada dia
  libera só o cenário do dia. O **dia 1 (Floresta + skin básica) é livre**, sem código
  (`GRUPOS_SEMPRE_LIBERADOS` em `manifesto.ts`). Códigos são distribuídos em quests no evento.
  O usuário **não quer hash** dos códigos.
- **Status** = base 2 + classe + raça + bônus dos itens (`src/lib/bonusItens.ts`), **teto 15**.
  Tabela de níveis no topo de `bonusItens.ts` (dark e especiais mais fortes).
- **Cenários**: Floresta (dia1, escuro → moldura noite), Montanhas (dia2, claro), Vila das Lanternas
  (dia3, escuro), Pôr do Sol (dia4, claro). O tema decide a moldura dia/noite.
- **Envio único**: depois do envio o app trava em "Personagem enviado!" (o servidor decide pela
  tabela `cartas`, em qualquer aparelho).
- **Carta**: preenchimento atrás do nome e do título; ícones de status novos (pixel art) embutidos em
  `public/assets/carta/status-{dia,noite}.png`. Coordenadas em `src/lib/cartaLayout.json`.
  A carta é desenhada em 3 lugares que devem ficar iguais: `src/lib/desenharCartaBrowser.ts`,
  `scripts/regerar-cartas.mjs`, `scripts/gerar-carta-exemplo.mjs`.

## Fluxos do dia a dia

- **Lote novo da ilustradora** (pastas `<Animal> - <Classe>` em `Assets Prontos/itens/itens-para-formatacao/`):
  `npm run organizar` (simulação) → corrigir pendências → conferir encaixe nos corpos →
  `npm run organizar -- --mover` → `npm run assets` (acrescenta as peças novas em `bonusItens.ts` e
  `codigosItens.ts`) → dar bônus e código às peças novas (e acrescentar o código no CSV) → `npx next build`.
  Peças "de todos" (uma arte que serve a vários animais) são copiadas direto para `Assets Prontos/itens/<tipo>/`.
- **Cenário novo**: original em `Assets Prontos/Cenários/`, entrada em `scripts/otimizar-cenarios.mjs`,
  `npm run cenarios`, registrar em `CENARIOS` (`src/lib/manifesto.ts`).
- **Impressão**: `npm run baixar-cartas` (PNGs + `cartas.csv` com apelido em `cartas-baixadas/`) →
  arrastar a pasta para o `GerarPDFCartas.exe` (projeto irmão PrintingCardFormatter, que não está
  neste repositório): PDF A4 3×3, marcas de corte, contorno de corte em cada carta, verso intercalado.
- **Suporte no evento**: `npm run trocar-senha -- <usuario> <senha-nova>` ·
  `npm run destravar -- <usuario>` (apaga a carta enviada; a pessoa volta a editar) ·
  `npm run regerar-cartas -- --todas [--enviar]` (regera cartas já enviadas após mudar a composição).
- Scripts que falam com o Supabase precisam do `.env.local` (SUPABASE_URL, SUPABASE_SERVICE_KEY).

## Cuidados

- Antes de apagar/sobrescrever dados do Supabase, confirme com o usuário e faça backup local
  (pastas `backup-banco-*`, `cartas-destravadas/` ficam fora do Git — contêm dados pessoais/hash).
- Mudar o texto de um título depois que alguém o escolheu devolve a pessoa para "Recruta".
- Pendências conhecidas e aceitas: a Estrela 2023 fica atrás do título na carta; o título "드라마"
  sai na fonte coreana do celular (a Adam Script não tem Hangul).
