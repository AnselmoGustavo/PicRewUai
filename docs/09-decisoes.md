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

### ADR-006 — Exportação como carta TCG 63 × 88 mm
**Data:** 07/2026 · **Status:** Aceito
**Contexto:** O resultado final deve ser uma carta colecionável no tamanho padrão.
**Decisão:** Compor o personagem numa moldura de carta e exportar PNG em 63 × 88 mm, mirando ≥300 DPI.
**Consequências:** Precisamos do design da moldura com janela de arte definida; tratar download no iOS; possível sangria se houver impressão física. Ver [06](06-exportacao-carta.md).

---

## Decisões ainda em aberto

- [ ] Campos exatos da **ficha** de personagem (nome, título, bio, atributos?).
- [ ] Quais infos aparecem na **arte da carta** e se são texto do app ou embutidas.
- [ ] Haverá **impressão física** das cartas? (define sangria e DPI-alvo).
- [ ] Tratamento definitivo de **carpa e coruja** no gabarito universal.
- [ ] Estilo/tamanho final exato do **canvas mestre** (travar com a moldura).
