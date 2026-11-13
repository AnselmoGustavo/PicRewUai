# PicRewUai 🎴

Criador de personagens (picrew) temático de RPG para o evento **UAI 2026** (19–22 de novembro).
Além de montar o personagem, o app funciona como **ficha de personagem** e permite **exportar o resultado como uma carta de TCG** (63 × 88 mm).

É um **web app** (funciona em Android e iPhone pelo navegador), disponível durante o mês de novembro apenas para o evento.

---

## Visão rápida

| Item | Decisão |
|------|---------|
| Plataforma | Web app (PWA), roda no navegador de qualquer celular |
| Stack | Next.js + React + TypeScript + Canvas API |
| Conta | **Usuário + senha** na tela inicial (identidade + progresso por pessoa) |
| Persistência | `localStorage` (offline) + sincronização por usuário (cross-device) |
| Backend | Vercel Functions + Supabase: auth, progresso por usuário, coleta das cartas |
| Hospedagem | **No ar:** https://pic-rew-uai.vercel.app (Vercel + Supabase, planos grátis) |
| Identidade | Tema único · primária verde `#45754a` · Poppins + Arcane Fable |
| Assets | **Por animal+classe** — cada peça desenhada para o corpo daquela combinação |
| Animais | 5: macaco, raposa, gato, veado, cachorro |
| Classes | 5: guerreiro, arqueiro, mago, bardo, ninja |
| Tipos de item | camisa, calça, arma, calçado, capa, chapéu, acessório |
| Cenário | 3 fundos, 1 por dia (Floresta = noite, Montanhas = dia, 3º a definir) — define a moldura dia/noite |
| Status | 4 atributos na carta (Vida, Força, Intelecto, Destreza), **calculados**: base + classe + raça + **bônus dos itens** |
| Título | **Recruta** para todos; outros títulos liberados por **códigos** (`src/lib/titulos.ts`) |
| Desbloqueio | Um campo só de códigos: **do dia** (itens + cenário), **de envio**, **de título** e **de item especial** |
| Carta (surpresa) | Participante "envia o personagem" → carta TCG 63 × 88 mm (744×1039, 300 DPI) gerada **por trás** e enviada para impressão. O participante nunca vê a carta |

**Prazo de entrega:** app pronto até **31/10/2026**.

---

## Documentação

Toda a documentação vive em [`docs/`](docs/):

1. [Visão e escopo](docs/01-visao-e-escopo.md)
2. [Especificação funcional](docs/02-especificacao-funcional.md)
3. [Arquitetura técnica](docs/03-arquitetura-tecnica.md)
4. [Guia de assets (para a ilustradora)](docs/04-guia-de-assets.md) ⭐
5. [Modelo de dados, códigos e save](docs/05-modelo-de-dados.md)
6. [Exportação da carta](docs/06-exportacao-carta.md)
7. [Roadmap e cronograma](docs/07-roadmap-e-cronograma.md)
8. [Riscos](docs/08-riscos.md)
9. [Registro de decisões (ADR)](docs/09-decisoes.md)
10. [Identidade visual](docs/10-identidade-visual.md)
11. [Composição da carta (assets e posições)](docs/11-carta-composicao.md)
12. [Deploy (Vercel + Supabase)](docs/12-deploy.md)

> ⭐ O **guia de assets** define a convenção de nomes, o canvas e a ordem das camadas — e o fluxo de organização dos lotes que a ilustradora manda.

---

## Como rodar localmente

Pré-requisitos: **Node.js 18+** (testado no 24).

```bash
npm install          # instala dependências (só na 1ª vez)
npm run dev          # sobe o app em http://localhost:3000
```

- Página inicial: `/` — logo sobre o fundo texturizado.
- **Criar personagem: `/criar`** — fluxo animal → classe → editor (cenário, itens por categoria filtrados por classe, códigos de desbloqueio, ficha). Estado persiste no navegador.
- Protótipo da carta (dev): `/poc-carta` — monta a carta com moldura + nome/status e alterna dia/noite.

> Códigos de teste: `UAI-DIA1` … `UAI-DIA3` (itens + cenário do dia), `UAI-ENVIAR` (libera o envio), `UAI-BRAVO` / `UAI-TAVERNA` (títulos de exemplo) e `UAI-MESTRE` (libera tudo). ⚠️ Trocar pelos códigos reais antes do evento.

Outros comandos:

```bash
npm run build            # build de produção (rodar antes do push)
npm run organizar        # simula a organização dos lotes da ilustradora (-- --mover para mover)
npm run assets           # otimiza a arte, gera o manifesto e completa bônus/códigos dos itens
npm run baixar-cartas    # baixa as cartas enviadas (Supabase) para cartas-baixadas/ + CSV
npm run regerar-cartas   # regera cartas já enviadas (ver docs/12-deploy.md)
npm run carta:exemplo    # gera cartas de exemplo em docs/exemplos/ (validação headless)
```

## Status do projeto

🟢 **No ar e em uso** — https://pic-rew-uai.vercel.app (deploy automático a cada push na `main`).

- ✅ **Arte completa nas 25 combinações** (5 animais × 5 classes): corpo base + skin básica (dia 1) + skin avançada (dia 2) + acessórios avulsos (liberados desde o início) — **465 itens**. Toda peça existe para os 5 animais da classe.
- ✅ **Pipeline de assets**: a ilustradora manda pastas `<Animal> - <Classe>` em `Assets Prontos/itens/itens-para-formatacao/` → `npm run organizar` (simulação) / `npm run organizar -- --mover` → `npm run assets` (otimiza, gera miniaturas, o manifesto `src/lib/itens-gerados.json` e **acrescenta as peças novas** nos arquivos de bônus e de códigos). Ver [doc 04](docs/04-guia-de-assets.md).
- ✅ **Editor**: animal → classe → abas (cenário + só os tipos de item que existem para aquele animal+classe + ficha). Preview ao vivo sem moldura (a carta é surpresa). Botão **Salvar progresso** (além do auto-save).
- ✅ **Status** = base 2 + classe + raça + **bônus dos itens equipados** (`src/lib/bonusItens.ts`, teto 9). Mostrado na ficha e desenhado na carta.
- ✅ **Títulos**: todos começam como **Recruta**; os demais (`src/lib/titulos.ts`) são liberados por código e ficam escondidos até lá.
- ✅ **Códigos**: do dia, de envio (`UAI-ENVIAR` — o botão Enviar fica bloqueado até lá), de título e de **item especial** (`src/lib/codigosItens.ts` — item com código só libera com ele).
- ✅ **Envio surpresa**: a carta completa (moldura dia/noite conforme o cenário + nome + título + status) é composta **offscreen** e enviada. 1 envio por pessoa.
- ✅ **Backend real (Supabase)**: contas (`usuarios`, senha pbkdf2), progresso (`progresso`) e cartas (tabela `cartas` + Storage privado `cartas/<usuario>.png`). Schema em [`supabase/schema.sql`](supabase/schema.sql); guia em [doc 12](docs/12-deploy.md). Sem as variáveis de ambiente, cai num mock local (`.dev-data/`, `envios/`).
- ✅ **Gráfica**: `npm run baixar-cartas` baixa os PNGs + `cartas.csv`; o projeto irmão **PrintingCardFormatter** (`GerarPDFCartas.exe`) monta o PDF A4 (9 por folha, marcas de corte, verso intercalado).
- ✅ `npm run regerar-cartas` regera cartas já enviadas a partir do progresso salvo (usado quando a Floresta passou a ter moldura de noite).

**Antes do evento (18/11):** tirar o botão "recomeçar (teste)", trocar os códigos de exemplo pelos reais (escondidos do bundle), apagar contas de teste no Supabase e abrir o painel do Supabase (pausa após 7 dias parado).

**Arte pendente:** diário para arqueiro/bardo/mago/ninja e pokébola para o ninja (se forem para todas as classes); 3º cenário.
