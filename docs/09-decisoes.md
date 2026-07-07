# 09 — Registro de Decisões (ADR)

Decisões de arquitetura/produto e o porquê. Formato leve.

---

### ADR-001 — Web app em vez de app nativo
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Público com Android e iPhone; sem conta de desenvolvedor Apple para publicar na App Store.
**Decisão:** Construir um web app (PWA), acessível pelo navegador de qualquer celular.
**Consequências:** Uma base de código só; sem processo de loja; instalável como PWA. Limitações de APIs nativas (ex.: download no iOS) precisam de contorno.

---

### ADR-002 — Assets universais (não por animal)
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Itens poderiam ser desenhados por animal (~1200 arquivos) ou universais (~150).
**Decisão:** Assets **universais** — o mesmo item serve para os 8 animais.
**Consequências:** Reduz o volume de arte de ~1200 para ~150. Em troca, exige que os corpos dos animais sigam um gabarito comum (zonas de cabeça/tronco/mãos alinhadas) e um teste de validação cedo. Ver [04](04-guia-de-assets.md).

---

### ADR-003 — Persistência local + código de backup (sem backend)
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Precisamos salvar personagem e progresso; backend traria custo, complexidade e risco de prazo.
**Decisão:** Salvar em `localStorage` e oferecer um **código de backup** exportável para recuperar em outro dispositivo.
**Consequências:** Custo zero de infraestrutura; app estático e offline-first; aguenta picos sem servidor. Risco de perda de dados se o usuário não fizer backup — mitigado pelo código de backup (+ QR).

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
**Decisão:** O app envia a carta para um **endpoint serverless** (`/api/enviar-carta`) que grava em **storage** (Supabase ou Vercel Blob). Identificação apenas por dados do personagem (nome do personagem, classe, status, habilidade) — **sem dados pessoais**.
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
**Decisão:** O picrew inclui uma categoria de **cenário** (fundo opaco que preenche a carta). **3 a 4 cenários no total, liberados 1 por dia** (mesmo código do dia). Cada cenário é marcado `claro`/`escuro`, e isso **decide automaticamente** a moldura dia/noite — sem toggle manual nem detecção de brilho.
**Consequências:** Adiciona uma categoria de arte (3–4 cenários, equilibrar claros/escuros). Simplifica a lógica de dia/noite (determinística). Ver [11](11-carta-composicao.md).

---

### ADR-010 — Formato da carta: 744 × 1039 px @ 300 DPI, sem sangria
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** Os designs finais foram entregues nesse formato (`Assets Finais/`) e **a gráfica aceita sem sangria**.
**Decisão:** Montar a carta em **744 × 1039 px (300 DPI)**, o mesmo tamanho da imagem gerada pelo participante, **sem sangria**. `Borda pra corte.png` como guia de corte no PDF.
**Consequências:** Alinha o canvas do personagem à carta. 600 DPI exigiria re-export a 2× (não planejado). Ver [11](11-carta-composicao.md).

---

### ADR-011 — Status = 4 atributos digitados pelo participante
**Data:** 07/2026 · **Status:** Aceito
**Decisão:** "Status" são **4 valores** exibidos na carta: **Vida, Força, Intelecto, Velocidade** (ícones já embutidos no frame). O **nome e os 4 status são escritos pelo participante** e enviados em **JSON junto com a imagem**. "Habilidade" é campo da ficha e **não** vai na carta.
**Consequências:** Define os campos da ficha e o payload de envio. Validar entrada (a caixa de status comporta ~1–2 dígitos). Ver [05](05-modelo-de-dados.md), [11](11-carta-composicao.md).

---

### ADR-012 — Carta é surpresa: gerada e enviada silenciosamente
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** A carta de TCG impressa deve ser uma surpresa; o participante não deve saber que ela existe.
**Decisão:** Não há "exportar carta" na UI. O participante **envia o personagem**, vê **sucesso**, e o app **monta a carta offscreen e a envia por trás**. A palavra "carta", qualquer prévia da moldura e download da carta **não aparecem** para o participante.
**Consequências:** Composição da carta acontece sem UI; nada da carta é salvo no aparelho; feedback de sucesso é imediato e o upload pode ser reenviado depois. Exige cuidado para a UI **não vazar** a existência da carta. Ver [06](06-exportacao-carta.md).

---

## Decisões ainda em aberto

- [ ] Tratamento definitivo de **carpa e coruja** no gabarito universal.
- [ ] Escolha do storage (**Supabase** vs Vercel Blob) e **limite de envios** por pessoa.
- [ ] Layout do **PDF de impressão** (cartas por folha, tamanho da folha).
- [ ] **Neutros** da paleta (fundo, texto, bordas) e confirmação do uso das fontes.
- [ ] Validação de entrada dos **status** (faixa/limite de dígitos).
