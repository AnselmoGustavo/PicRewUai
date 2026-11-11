# 09 — Registro de Decisões (ADR)

Decisões de arquitetura/produto e o porquê. Formato leve.

---

### ADR-001 — Web app em vez de app nativo
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Público com Android e iPhone; sem conta de desenvolvedor Apple para publicar na App Store.
**Decisão:** Construir um web app (PWA), acessível pelo navegador de qualquer celular.
**Consequências:** Uma base de código só; sem processo de loja; instalável como PWA. Limitações de APIs nativas (ex.: download no iOS) precisam de contorno.

---

### ADR-002 — ~~Assets universais (não por animal)~~ — SUBSTITUÍDO por ADR-016
**Data:** 07/2026 · **Status:** ❌ Substituído
**Decisão original:** Assets universais (o mesmo item nos 8 animais) para reduzir ~1200 → ~150 arquivos.
**Por que mudou:** A arte real está sendo feita **por animal+classe** (peças posicionadas para cada corpo — ex.: chapéu que encaixa nos chifres do veado). Ver **ADR-016**.

---

### ADR-003 — Persistência local (base) — ~~sem backend~~
**Data:** 07/2026 · **Status:** Parcialmente substituído por **ADR-015**
**Contexto:** Precisamos salvar personagem e progresso.
**Decisão:** Salvar em `localStorage` (cache rápido/offline). *(Originalmente: só local + código de backup, sem backend.)*
**Atualização:** Como os participantes abrem o app poucas vezes ao longo de 4 dias e podem trocar de aparelho, decidimos **sincronizar o progresso no servidor** — ver **ADR-015**. O `localStorage` continua como cache offline.

---

### ADR-004 — Stack Next.js + React + TypeScript + Canvas
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Precisamos de boa DX, deploy fácil e composição de imagens em camadas.
**Decisão:** Next.js (App Router) + React + TypeScript; renderização do personagem via Canvas 2D; deploy estático na Vercel.
**Consequências:** Ecossistema maduro, deploy trivial, tipos no manifesto. Canvas dá controle total sobre composição e exportação em alta resolução.

---

### ADR-005 — Códigos de desbloqueio iguais para todos, validados no cliente
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Códigos poderiam ser únicos por pessoa (anti-compartilhamento) ou iguais para todos.
**Decisão:** Um código por dia, **igual para todos**, validado no próprio app comparando **hash** (não texto puro).
**Consequências:** Simples, sem backend, sem distribuição individual. Não impede trapaça determinada (localStorage editável), o que é aceitável para um app de evento. Ver [05](05-modelo-de-dados.md).

---

### ADR-006 — Exportação como carta TCG 63 × 88 mm, com impressão física
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** O resultado final é uma carta colecionável **impressa fisicamente**. Os organizadores montam um PDF com todas as cartas.
**Decisão:** Compor o personagem numa moldura de carta e exportar PNG em 63 × 88 mm. No export, salvar a imagem no aparelho **e** enviá-la aos organizadores.
**Consequências:** Tratar download no iOS; introduz a necessidade de coleta (ADR-007) e de uma ferramenta de montagem de PDF. Formato/resolução definidos em **ADR-010** (300 DPI, sem sangria). Ver [06](06-exportacao-carta.md), [11](11-carta-composicao.md).

---

### ADR-007 — Coleta das cartas via upload (mini-backend)
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** As cartas precisam chegar aos organizadores em alta qualidade para impressão. WhatsApp comprime e coletar por e-mail é trabalhoso.
**Decisão:** O app envia a carta para um **endpoint serverless** (`/api/enviar-carta`) que grava no **Supabase** (Storage + Postgres — ver ADR-013). Identificação apenas por dados do personagem — **sem dados pessoais**.
**Consequências:** Introduz o único componente de servidor do projeto (o resto segue estático/offline). Montar o personagem funciona offline; só o envio precisa de internet (com re-tentativa). Exige gerir cota de storage, proteger o endpoint e construir a ferramenta de PDF. Ver [06](06-exportacao-carta.md).

---

### ADR-008 — Tema visual único + paleta + tipografia
**Data:** 07/2026 · **Status:** Aceito
**Decisão:** **Tema único** (sem modo claro/escuro). Cor **primária = verde `#45754a`**; secundária âmbar `#f4ab20`; acento coral `#f46364`. Fontes: **Poppins** (texto), **Arcane Fable** (display/temático da UI) e **Adam Script** (textos da carta), auto-hospedadas para funcionar offline.
**Consequências:** Simplifica o design. Arcane Fable e Adam Script precisam virar `.woff2`; **falta o arquivo da Adam Script**. Ver [10](10-identidade-visual.md).

---

### ADR-009 — Cenários selecionáveis e dia/noite pelo cenário
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** As cartas têm fundos ilustrados; a moldura tem versões dia (tinta escura) e noite (tinta branca).
**Decisão:** O picrew inclui uma categoria de **cenário** (fundo opaco que preenche a carta). **3 cenários no total, liberados 1 por dia** (mesmo código do dia). Cada cenário é marcado `claro`/`escuro`, e isso **decide automaticamente** a moldura dia/noite — sem toggle manual nem detecção de brilho.
**Consequências:** Adiciona uma categoria de arte (3 cenários). Simplifica a lógica de dia/noite (determinística). Ver [11](11-carta-composicao.md).

---

### ADR-010 — Formato da carta: 744 × 1039 px @ 300 DPI, sem sangria
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Os designs finais foram entregues nesse formato (`Assets Finais/`) e **a gráfica aceita sem sangria**.
**Decisão:** Montar a carta em **744 × 1039 px (300 DPI)**, o mesmo tamanho da imagem gerada pelo participante, **sem sangria**. `Borda pra corte.png` como guia de corte no PDF.
**Consequências:** Alinha o canvas do personagem à carta. 600 DPI exigiria re-export a 2× (não planejado). Ver [11](11-carta-composicao.md).

---

### ADR-011 — Status = 4 atributos ~~digitados~~ CALCULADos (base 2 + classe + raça)
**Data:** 07/2026 · **Atualizado:** 08/2026 · **Status:** Aceito
**Decisão:** "Status" são **4 valores** na carta: **Vida, Força, Intelecto, Destreza** (ícones embutidos no frame). ~~Digitados pelo participante.~~ **Agora são CALCULADOS**: base **2** em cada + bônus de **classe** (+2 principal, +1 secundário) + bônus de **raça/animal** (+1), aditivo e sem penalidade (ficam entre 2 e 5). Tabelas em `src/lib/status.ts`. O participante digita só **nome e título**; a aba **Ficha** continua, mas o status é **somente leitura**.
**Consequências:** Status deixa de ser estado armazenado (derivado de animal+classe). Cada combinação animal×classe tem um perfil próprio. Ver [02](02-especificacao-funcional.md), [05](05-modelo-de-dados.md).

---

### ADR-012 — Carta é surpresa: gerada e enviada silenciosamente
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** A carta de TCG impressa deve ser uma surpresa; o participante não deve saber que ela existe.
**Decisão:** Não há "exportar carta" na UI. O participante **envia o personagem**, vê **sucesso**, e o app **monta a carta offscreen e a envia por trás**. A palavra "carta", qualquer prévia da moldura e download da carta **não aparecem** para o participante.
**Consequências:** Composição da carta acontece sem UI; nada da carta é salvo no aparelho; feedback de sucesso é imediato e o upload pode ser reenviado depois. Exige cuidado para a UI **não vazar** a existência da carta. Ver [06](06-exportacao-carta.md).

---

### ADR-013 — Envio único e definitivo + Supabase
**Data:** 07/2026 · **Status:** Aceito
**Decisão:** Cada participante faz **1 envio final** — depois disso o editor **trava** (somente-leitura, flag `enviado`). As cartas são armazenadas no **Supabase** (Storage + Postgres, free tier), que também dá o painel para os organizadores.
**Consequências:** 1 imagem por pessoa → armazenamento previsível (ex.: 300 × ~2 MB ≈ 600 MB, cabe no free tier). A confirmação de envio precisa deixar claro que é definitivo. Ver [05](05-modelo-de-dados.md), [06](06-exportacao-carta.md).

---

### ADR-014 — Tema claro/creme + neutros + carpa/coruja
**Data:** 07/2026 · **Status:** Aceito
**Decisão:** Interface em **tema claro/creme** (fundo `#f7f0e0`, texto `#2b2620`, etc. — ver [10](10-identidade-visual.md)). Toda a arte dos personagens é da **Ana Beatriz**; carpa e coruja provavelmente em **pose antropomórfica** para caber no gabarito universal, confirmado no teste de validação de arte.
**Consequências:** Define os neutros da UI. O encaixe universal fica sob controle da ilustradora + teste. Ver [04](04-guia-de-assets.md), [10](10-identidade-visual.md).

---

### ADR-015 — Identidade por **conta (usuário + senha)**; progresso por usuário
**Data:** 07/2026 · **Atualizado:** 08/2026 · **Status:** Aceito (substitui a parte "sem backend" da ADR-003)
**Contexto:** O app fica online ~1 mês. Precisamos **diferenciar quem é quem** e manter o progresso por pessoa, cross-device.
**Decisão:** A tela inicial pede **criar conta / entrar (usuário + senha)**. O progresso é sincronizado **por usuário** (`localStorage` como cache + servidor). *(Decisão original: código pessoal auto-gerado — substituída por contas.)*
- **Senhas com hash** (pbkdf2 + salt) no servidor — **nunca em texto puro**. Login devolve um **token** (guardado na sessão local) que autentica as chamadas de progresso (um usuário não sobrescreve o de outro → 401).
- Hoje: **mock de dev** em arquivo (`.dev-data/usuarios`, `.dev-data/progresso`). API: `/api/auth` (registrar/entrar) e `/api/progresso` (GET/POST com usuario+token).
**Consequências:** Cross-device via login. Sem recuperação de senha por enquanto (esqueceu → nova conta / reset manual). **Recomendação para produção:** usar **Supabase Auth** (hash/sessão/segurança prontos) em vez da auth caseira — a UI de login/cadastro já serve; só o backend troca. Ver [05](05-modelo-de-dados.md), [03](03-arquitetura-tecnica.md).

---

### ADR-016 — Itens por animal+classe, mix-and-match, multi-camada com z-index
**Data:** 08/2026 · **Status:** Aceito (substitui ADR-002)
**Contexto:** Teste de posicionamento com arte real (Veado-Mago) confirmou que as peças são **específicas por animal+classe**, desenhadas full-canvas (3150×4400) já posicionadas.
**Decisão:** Itens são **por animal+classe** (não universais), montados **peça a peça (mix-and-match)** em **7 tipos**: camisa, calça, arma, calçado, capa, chapéu, acessório *(atualizado 11/2026; antes eram 5 categorias, com camisa+calça juntas em "vestimenta")*. Cada item é um ou mais PNGs full-canvas pré-posicionados; o app só **empilha por z-index**. O z vem do **tipo** (padrão em `Z_POR_TIPO`); só peças de várias camadas, como a capa (frente + atrás), informam o z no nome do arquivo.
**Consequências:** Encaixe perfeito e customização máxima. **Custo de arte muito maior** que o universal (volta a tendência de centenas/milhares de arquivos — ver flag de escopo abaixo). O modelo de dados muda: `ItemDef` passa a ter uma lista de camadas `{arquivo, z}`. Ver [04](04-guia-de-assets.md), [05](05-modelo-de-dados.md).

> ⚠️ **Escopo de arte em aberto:** por animal+classe com mix-and-match pode gerar MUITOS assets (5 animais × 5 classes × itens × camadas). Definir com a ilustradora quantos itens por categoria por combinação e se **todas as 40 combinações** terão arte completa até 31/10 — isso é crítico para o prazo.

---

## Decisões (resolvidas com padrão, ajustável)

- **Validação dos status:** inteiros de **0 a 99** (até 2 dígitos, cabe na caixa da carta). Ajustar se a organização definir outra faixa.
- **Layout do PDF de impressão:** proposta inicial **A4 retrato**, cartas 63 × 88 mm em grade com guias de corte (`Borda pra corte.png`). Detalhar na Fase 4b com a gráfica.

## Decisões ainda em aberto

- [ ] Confirmar interpretação de uso das fontes Poppins/Arcane Fable (qual corpo / qual display).
- [ ] Textos dos 4 **códigos diários** (definir perto do evento).
