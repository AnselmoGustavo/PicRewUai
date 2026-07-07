# 07 — Roadmap e Cronograma

**Hoje:** 07/07/2026 · **Entrega do app pronto:** 31/10/2026 · **Evento:** 19–22/11/2026

Temos ~16 semanas até a entrega — folga confortável se começarmos a arte cedo. A **produção de assets é o caminho crítico**: o código pode andar com placeholders, mas sem a arte final não fechamos.

## Estratégia geral

- **Desenvolver com placeholders** desde já (silhuetas/retângulos coloridos no tamanho do canvas), para o código não depender da arte.
- **Travar o guia de assets ([04](04-guia-de-assets.md)) primeiro** e rodar o teste de validação (1 item por categoria nos 8 animais) antes de escalar a arte.
- Integrar a arte real em lotes conforme for entregue.

## Fases

### Fase 0 — Fundação (Jul, ~1 semana)
- [ ] Aprovar esta documentação.
- [ ] Scaffold Next.js + TypeScript + estrutura de pastas.
- [ ] Deploy inicial "hello world" na Vercel (pipeline funcionando).
- [ ] Definir e travar o guia de assets com a ilustradora.

### Fase 1 — Motor de renderização (Jul–Ago, ~2 semanas)
- [ ] Canvas mestre + composição de camadas por z-index.
- [ ] Assets placeholder no tamanho do canvas.
- [ ] Prova de conceito: trocar animal e itens e ver o preview mudar.
- [ ] **Teste de validação de arte** com a ilustradora (item real nos 8 animais).

### Fase 2 — Editor + classes + códigos (Ago, ~2–3 semanas)
- [ ] Manifesto de itens (com dados placeholder).
- [ ] Telas: escolher animal, escolher classe, editor com abas de categoria.
- [ ] Filtro de itens por classe; estado "Nenhum".
- [ ] Sistema de códigos: bloqueado/desbloqueado, validação por hash.
- [ ] Persistência em `localStorage`.

### Fase 3 — Ficha + backup (Set, ~1–2 semanas)
- [ ] Definir campos da ficha com a organização.
- [ ] Formulário da ficha.
- [ ] Código de backup: gerar e restaurar (+ QR opcional).

### Fase 4 — Exportação da carta + coleta (Set, ~2 semanas)
- [ ] Integrar moldura da carta **com sangria** (quando o design estiver pronto).
- [ ] Export em alta resolução (600 DPI + sangria 3mm) no tamanho 63 × 88 mm.
- [ ] Salvar/compartilhar a imagem no aparelho (lembrança) + tratamento iPhone.
- [ ] **Endpoint serverless `/api/enviar-carta`** + storage (Supabase/Vercel Blob) + segredo/rate-limit.
- [ ] Envio com re-tentativa quando offline; feedback de sucesso/erro.
- [ ] **Teste em iPhone e Android reais** (export + upload).

### Fase 4b — Ferramenta de PDF de impressão (Set–Out, ~1 semana)
- [ ] Script/página admin que baixa as cartas coletadas e monta o **PDF** (tamanho real + marcas de corte).
- [ ] Definir layout (cartas por folha, tamanho da folha da gráfica).
- [ ] Testar um PDF de amostra com a gráfica cedo (validar sangria/corte/cor).

### Fase 5 — Integração de arte + polish (Out, ~2 semanas)
- [ ] Substituir placeholders pela arte final (em lotes).
- [ ] PWA/offline (service worker, ícone na tela inicial).
- [ ] Ajuste fino de layout mobile, contraste, alvos de toque.
- [ ] Otimização de carregamento (assets sob demanda).

### Fase 6 — QA final e congelamento (Out, até dia 31)
- [ ] Teste completo em vários aparelhos (Android + iPhone, telas pequenas/grandes).
- [ ] Testar o fluxo dos 4 códigos como no evento real.
- [ ] Testar recuperação por código de backup entre dispositivos.
- [ ] Revisar textos/erros.
- [ ] **Congelar versão até 31/10.** 🎯

### Durante o evento (19–22/11)
- [ ] Divulgar os códigos ao fim de cada dia.
- [ ] Suporte/monitoramento leve (código mestre para ajudar quem travar).

## Marcos (milestones)

| Marco | Alvo |
|-------|------|
| Documentação aprovada + guia de assets travado | meados de Julho |
| Teste de validação de arte OK | fim de Julho |
| Editor funcional com placeholders (animal/classe/itens/códigos) | fim de Agosto |
| Exportação de carta funcionando em iPhone e Android | meados de Setembro |
| Arte final integrada | meados de Outubro |
| **App pronto e congelado** | **31/10/2026** |

## Dependências externas (não são código)

- 🎨 **Arte** (ilustradora): bases dos 8 animais, ~150 itens, moldura da carta **com sangria**.
- 🗂️ **Conteúdo**: itens que desbloqueiam em cada dia; definição de **status** e **habilidade** da ficha.
- 🔑 **Códigos**: os 4 textos dos códigos diários (definir perto do evento).
- 🖨️ **Gráfica**: especificação de impressão (tamanho da folha, sangria, perfil de cor); rodar uma amostra cedo.
- 🔤 **Fontes**: converter `arcane-fable.otf` → `.woff2` (auto-hospedar Poppins + Arcane Fable).
