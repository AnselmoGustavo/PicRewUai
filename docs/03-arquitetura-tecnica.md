# 03 — Arquitetura Técnica

## Stack

| Camada | Tecnologia | Motivo |
|--------|-----------|--------|
| Framework | **Next.js (App Router)** | React moderno, deploy trivial, exportação estática possível |
| Linguagem | **TypeScript** | Segurança de tipos no manifesto de itens/estado |
| UI | **React** + CSS Modules ou Tailwind | Componentes das telas e painéis de seleção |
| Renderização do personagem | **HTML Canvas 2D** | Compõe camadas de PNG e exporta imagem |
| Estado | **Zustand** (store leve) + persistência em `localStorage` | Simples, sem boilerplate |
| Cache offline | **Service Worker (PWA)** via `next-pwa` ou manual | Funcionar offline no evento |
| Backend | **Serverless (Vercel Functions)** + **Supabase** (Storage + Postgres) | (1) sincronizar progresso cross-device; (2) receber as cartas para impressão + painel |
| Hospedagem | **Vercel** (free) | App estático + funções serverless |

> **Backend enxuto.** A lógica do app (montar personagem, códigos, gerar imagem) roda no navegador e funciona offline via `localStorage`. O servidor entra em três pontos: **conta (usuário+senha)** e **sincronização do progresso por usuário** (ADR-015, ver [05](05-modelo-de-dados.md)) e **receber a carta final** para impressão (ver [06](06-exportacao-carta.md)). Editar funciona offline; logar/sincronizar/enviar precisa de internet. Em dev, auth/progresso usam mock em arquivo; em produção, tabelas no Supabase com auth própria (ADR-021, [12](12-deploy.md)).

## Princípios de arquitetura

1. **Estático e offline-first.** O app inteiro é HTML/JS/assets servidos de um CDN. Depois do primeiro load, funciona offline (importante se o wi-fi do evento cair).
2. **Manifesto como fonte da verdade.** Um único arquivo (`items.manifest.ts/json`) descreve todos os itens: id, categoria, classe, grupo de desbloqueio, arquivo de imagem, z-index. Telas, filtros e códigos leem desse manifesto.
3. **Assets universais, canvas fixo.** Todo asset (base de animal e itens) é um PNG transparente **do tamanho exato do canvas mestre**, já posicionado. Compor = empilhar na ordem de z-index. Sem cálculo de âncora em runtime. (Ver [04-guia-de-assets](04-guia-de-assets.md).)
4. **Separação preview × export.** O preview na tela usa um canvas menor (rápido); a exportação usa um canvas offscreen em alta resolução.

## Estrutura de pastas proposta

```
/
├── docs/                      # esta documentação
├── public/
│   └── assets/
│       ├── animais/           # (bases geradas em public/assets/itens/bases/)
│       ├── itens/             # organizados por classe/categoria
│       │   ├── guerreiro/
│       │   ├── mago/
│       │   └── ...
│       ├── molduras/          # carta_frente.png, (verso?)
│       └── ui/                # ícones, placeholders
├── public/font/               # fontes auto-hospedadas (arcane-fable .woff2/.otf)
├── src/
│   ├── app/
│   │   ├── (telas)/           # rotas Next.js (App Router)
│   │   └── api/
│   │       ├── auth/          # criar conta / entrar (usuário + senha)
│   │       ├── progresso/     # sync do progresso por usuário (GET/POST)
│   │       └── enviar-carta/  # upload da carta final
│   ├── admin/                 # ferramenta de montagem do PDF de impressão
│   ├── components/            # Editor, PainelCategoria, PreviewCanvas, FichaForm, ...
│   ├── lib/
│   │   ├── manifest.ts        # manifesto de itens (fonte da verdade)
│   │   ├── codigos.ts         # códigos de desbloqueio (hash) e validação
│   │   ├── render.ts          # composição de camadas no canvas
│   │   ├── export.ts          # geração da carta em alta resolução
│   │   ├── save.ts            # serialização / código de backup
│   │   └── store.ts           # estado (Zustand) + persistência
│   └── types/                 # tipos compartilhados
├── package.json
└── next.config.js
```

## Componentes-chave

- **PreviewCanvas** — desenha as camadas do personagem em tempo real conforme o estado muda.
- **PainelCategoria** — lista os itens da categoria ativa filtrados por classe, marcando bloqueados/desbloqueados.
- **CodigoModal** — entrada e validação de códigos de desbloqueio.
- **FichaForm** — campos da ficha de personagem.
- **ExportButton** — dispara a renderização em alta resolução + download/compartilhamento.
- **BackupCode** — gera/restaura o estado via string.

## Modelo de renderização (resumo)

```
ordem de desenho (fundo → frente), por z-index:
   0  cenário (fundo opaco)
  10  capa (parte de trás)
  20  corpo (animal+classe)
  30  calçado
  40  calça
  50  camisa
  60  capa (parte da frente)
  70  arma
  72  escudo
  75  acessório
  80  chapéu
```

> O z vem do **tipo** (`Z_POR_TIPO` em `src/lib/tipos.ts`); peças de várias camadas (a capa) informam o z no nome do arquivo (`-zNN`). Ver [04](04-guia-de-assets.md) e [05](05-modelo-de-dados.md).

## Considerações de compatibilidade mobile

- **iOS Safari** tem limitações conhecidas com download de blobs e memória de canvas — testar exportação em iPhone real cedo (ver [08-riscos](08-riscos.md)).
- **Memória**: 150+ imagens não devem ser todas carregadas de uma vez. Carregar sob demanda (por classe/animal ativos) e liberar as não usadas.
- **Resolução de export**: canvas grande consome memória; em aparelhos antigos pode falhar. Definir resolução-alvo e testar limites.

## Deploy

- Push no repositório → Vercel faz build e publica automaticamente.
- Domínio: subdomínio Vercel gratuito ou domínio próprio do evento.
- O app (parte estática) aguenta picos de acesso sem custo/servidor.
- A função de upload (`/api/enviar-carta`) roda serverless; configurar as **variáveis de ambiente** do Supabase (URL + chave de serviço) e um **segredo** do endpoint no painel da Vercel.
- A carga real no servidor é baixa: cada participante faz poucos uploads (idealmente só a carta final).
