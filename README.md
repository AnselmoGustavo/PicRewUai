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
| Persistência | `localStorage` (offline) + **sincronização no Supabase** via código pessoal (cross-device) |
| Backend | Vercel Functions + Supabase: sincronizar progresso + coletar as cartas |
| Hospedagem | Vercel free tier |
| Identidade | Tema único · primária verde `#45754a` · Poppins + Arcane Fable |
| Assets | **Universais** — o mesmo item serve para os 8 animais |
| Animais | 8: sapo, macaco, raposa, gato, veado, carpa, coruja, cachorro |
| Classes | 5: guerreiro, arqueiro, mago, bardo, ninja |
| Categorias de item | vestimenta, arma, item de cabeça, acessório 1, acessório 2 |
| Cenário | fundo selecionável (define moldura dia/noite da carta) |
| Status | 4 atributos na carta: Vida, Força, Intelecto, Velocidade |
| Desbloqueio | Códigos diários iguais para todos, validados no app |
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

> ⭐ O **guia de assets** é o documento mais urgente: ele precisa ser combinado com a ilustradora **antes** de ela produzir a arte em volume, porque define tamanho de canvas, ancoragem e ordem das camadas.

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

> Códigos de teste: `UAI-DIA1` … `UAI-DIA4` (liberam itens + cenário do dia) e `UAI-MESTRE` (libera tudo).

Outros comandos:

```bash
npm run build            # build de produção
npm run carta:exemplo    # gera cartas de exemplo em docs/exemplos/ (validação headless)
```

## Status do projeto

🟢 **Fluxo de criação funcional (com placeholders).**

- ✅ Documentação completa ([`docs/`](docs/)).
- ✅ App Next.js rodando (paleta creme + verde, fundo texturizado, 3 fontes, logo).
- ✅ Composição da carta validada com os assets reais — exemplos em [`docs/exemplos/`](docs/exemplos/). Coordenadas do [doc 11](docs/11-carta-composicao.md) confirmadas.
- ✅ Estado global (Zustand) + persistência no `localStorage`; manifesto de itens/cenários ([`src/lib/`](src/lib/)).
- ✅ Fluxo `/criar`: seleção de animal → classe → editor com abas (cenário + 5 categorias + ficha), itens filtrados por classe, bloqueio/desbloqueio por código, preview ao vivo (sem moldura — a carta é surpresa).
- ✅ **Envio surpresa**: botão "Enviar personagem" → confirmação de que é definitivo → a carta completa (moldura + nome + status) é composta **offscreen** e enviada; editor trava (`enviado`) com tela de agradecimento. A palavra "carta" e a moldura nunca aparecem para o participante.
- ✅ Endpoint `POST /api/enviar-carta` — **mock de dev** que salva em `./envios` (verificado de ponta a ponta).
- ✅ **Sincronização cross-device** (ADR-015): código pessoal gerado pelo app, auto-save com debounce e recuperação por código na tela inicial. Endpoint `/api/progresso` com **mock de dev** em `.dev-data/` (verificado); troca para Supabase via env vars.

> ⚠️ **Personagem e itens usam placeholders** (cores/silhuetas) até a arte da Ana Beatriz chegar. A lógica do fluxo, filtros, códigos, envio e sincronização já está pronta.

**Próximos passos:** configurar o **Supabase** (env vars) para ligar o backend real de progresso e envio; polir a ficha; integrar a arte final quando chegar.
