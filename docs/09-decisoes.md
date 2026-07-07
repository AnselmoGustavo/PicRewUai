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
**Decisão:** Compor o personagem numa moldura de carta e exportar PNG em 63 × 88 mm **com sangria de 3 mm**, mirando **600 DPI** (mínimo 300). No export, salvar a imagem no aparelho **e** enviá-la aos organizadores.
**Consequências:** Precisamos do design da moldura com sangria e janela de arte definida; tratar download no iOS; export em alta-res consome memória (testar). Introduz a necessidade de coleta (ADR-007) e de uma ferramenta de montagem de PDF. Ver [06](06-exportacao-carta.md).

---

### ADR-007 — Coleta das cartas via upload (mini-backend)
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** As cartas precisam chegar aos organizadores em alta qualidade para impressão. WhatsApp comprime e coletar por e-mail é trabalhoso.
**Decisão:** O app envia a carta para um **endpoint serverless** (`/api/enviar-carta`) que grava em **storage** (Supabase ou Vercel Blob). Identificação apenas por dados do personagem (nome do personagem, classe, status, habilidade) — **sem dados pessoais**.
**Consequências:** Introduz o único componente de servidor do projeto (o resto segue estático/offline). Montar o personagem funciona offline; só o envio precisa de internet (com re-tentativa). Exige gerir cota de storage, proteger o endpoint e construir a ferramenta de PDF. Ver [06](06-exportacao-carta.md).

---

### ADR-008 — Tema visual único + paleta + tipografia
**Data:** 07/2026 · **Status:** Aceito
**Decisão:** **Tema único** (sem modo claro/escuro). Cor **primária = verde `#45754a`**; secundária âmbar `#f4ab20`; acento coral `#f46364`. Fontes **Poppins** (texto) e **Arcane Fable** (display/temático), ambas auto-hospedadas para funcionar offline.
**Consequências:** Simplifica o design. Arcane Fable precisa virar `.woff2`. Ver [10](10-identidade-visual.md).

---

## Decisões ainda em aberto

- [ ] Definição de **status** e **habilidade** da ficha (o que são, formato).
- [ ] Quais infos aparecem na **arte da carta** e se são texto do app ou embutidas.
- [ ] Tratamento definitivo de **carpa e coruja** no gabarito universal.
- [ ] Estilo/tamanho final exato do **canvas mestre** (travar com a moldura + sangria).
- [ ] Escolha do storage (**Supabase** vs Vercel Blob) e **limite de envios** por pessoa.
- [ ] Layout do **PDF de impressão** (cartas por folha, tamanho da folha, marcas de corte).
- [ ] **Neutros** da paleta (fundo, texto, bordas) e confirmação do uso das fontes.
