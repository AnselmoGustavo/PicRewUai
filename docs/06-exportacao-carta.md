# 06 — Exportação da Carta e Coleta para Impressão

## Objetivo

Ao clicar em **Exportar**, o personagem é composto dentro de uma **moldura de carta de TCG** e:

1. A imagem é **salva no aparelho** do participante (lembrança dele).
2. A imagem em alta resolução é **enviada para os organizadores** (upload), que depois montam um **PDF com todas as cartas para impressão física**.

Tamanho físico da carta: **6,3 cm × 8,8 cm** (63 × 88 mm).

> ⚠️ **Impressão física confirmada.** Isso exige sangria (bleed) e alta resolução — ver abaixo.

## Dimensões e resolução (para impressão)

| Config | Largura × Altura | Observação |
|--------|:----------------:|-----------|
| 63 × 88 mm @ 300 DPI | 744 × 1039 px | Mínimo aceitável |
| 63 × 88 mm @ 600 DPI | 1488 × 2079 px | **Recomendado** para nitidez de impressão |
| **Com sangria 3mm** @ 600 DPI | 69 × 94 mm → **1630 × 2220 px** | **Formato de envio para impressão** |

- **Exportar com sangria de 3 mm** por lado: a arte de fundo/moldura se estende além da linha de corte, para não sair com borda branca ao cortar.
- Marcar a **área de corte** e a **margem de segurança** (não colocar texto/elemento crítico a menos de ~3–4 mm da borda de corte).
- A ilustradora precisa desenhar a moldura já contando com a sangria (ver [04](04-guia-de-assets.md)).

## Anatomia da carta

```
┌───────────────────────────┐ ← sangria (3mm) — fundo se estende até aqui
│ ┌───────────────────────┐ │ ← linha de corte (63 × 88 mm)
│ │   [nome do personagem]│ │
│ │  ┌─────────────────┐  │ │
│ │  │   PERSONAGEM     │  │ │ ← janela da arte
│ │  │   (composto)     │  │ │
│ │  └─────────────────┘  │ │
│ │  classe · status · hab.│ │ ← infos da ficha na carta
│ └───────────────────────┘ │
└───────────────────────────┘
```

## Algoritmo de exportação

```
1. Canvas offscreen no tamanho de envio (ex.: 1630 × 2220 px, com sangria).
2. Desenhar fundo da carta (estendido até a sangria).
3. Desenhar as camadas do personagem na "janela da arte".
4. Desenhar a moldura por cima.
5. Desenhar textos da ficha (nome do personagem, classe, status, habilidade).
6. canvas.toBlob('image/png') → (a) salvar/compartilhar local + (b) upload.
```

## Fluxo de exportação + envio

```
[Exportar] →
   gera PNG alta-res com sangria
   ├── salva no aparelho / abre compartilhamento (lembrança do participante)
   └── envia para o backend de coleta (upload)
         ├── sucesso → "Carta enviada! ✅"
         └── falha (sem internet) → guarda localmente e oferece "tentar de novo"
```

- **Montar o personagem funciona offline.** Só o **envio** precisa de internet.
- Se o upload falhar, o app mantém a imagem/estado e permite reenviar quando houver conexão (não perde a carta).

## Backend de coleta (mini-backend)

Único componente de servidor do projeto. Recebe as cartas e guarda para os organizadores.

- **Endpoint**: `POST /api/enviar-carta` (Vercel Route Handler / função serverless).
- **Recebe**: a imagem PNG + metadados: `nomePersonagem`, `classe`, `animal`, `status` (a definir), `habilidade` (a definir), timestamp.
- **Armazena**: imagem em object storage + metadados em tabela.
- **Stack sugerida**: **Supabase** (Storage + Postgres, free tier) — dá um painel pronto para os organizadores verem/baixarem os envios. Alternativa: **Vercel Blob**.
- **Sem dados pessoais**: identificamos a carta pelo **nome do personagem** (e demais campos da ficha), não pelo nome real/contato do participante → footprint de privacidade baixo.

### Dimensionamento de armazenamento
- PNG 1630×2220 pode ter ~2–5 MB. Estimar nº de participantes × envios.
- Supabase free = ~1 GB. Se estourar: otimizar PNG, ou limitar a **1 envio final por pessoa**, ou usar JPEG de alta qualidade (atenção: JPEG pode criar artefatos em arte de traço — avaliar).

### Proteção do endpoint (anti-abuso)
- Endpoint aberto pode receber spam. Mitigações simples: um **segredo/chave** embutido, **rate limit** básico, validação de tamanho/tipo. Apostas baixas (app de evento), mas não deixar totalmente aberto.

## Montagem do PDF de impressão (ferramenta dos organizadores)

Etapa **do lado dos organizadores**, não do participante. Compila as cartas coletadas num PDF pronto para gráfica.

- **Entrada**: imagens coletadas no storage.
- **Saída**: PDF com as cartas dispostas em folhas (ex.: A4/A3), **no tamanho físico real** (63 × 88 mm + sangria), com **marcas de corte**.
- **Como**: um pequeno script Node (ex.: `pdf-lib`) ou uma página de admin protegida no próprio app.
- **A definir**: layout (quantas cartas por folha), tamanho da folha da gráfica, se agrupa por classe/animal.

## Download em cada plataforma (a lembrança local)

- **Android (Chrome):** `toBlob` + link `download` funciona direto.
- **iPhone (Safari):** usar **Web Share API** (`navigator.share` com arquivo) → salvar em Fotos; fallback: abrir imagem em nova aba para segurar e salvar.
- ⚠️ **Testar em iPhone real cedo** (ver [08-riscos](08-riscos.md)).

## Pontos a fechar

- [ ] Design da moldura **com sangria** e coordenadas exatas da janela da arte.
- [ ] Campos que aparecem na carta: nome do personagem, classe, **status** (definir), **habilidade** (definir).
- [ ] Textos desenhados pelo app ou embutidos na arte da moldura?
- [ ] Layout do PDF de impressão (cartas por folha, tamanho da folha, marcas de corte).
- [ ] Escolha final do storage (Supabase vs Vercel Blob) e limite de envios por pessoa.
