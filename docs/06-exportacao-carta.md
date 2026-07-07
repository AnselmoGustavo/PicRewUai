# 06 — Geração da Carta (surpresa) e Coleta para Impressão

## Objetivo e o conceito de surpresa 🎁

A carta final é uma **surpresa**: o participante **não sabe** que uma carta de TCG será gerada. Do ponto de vista dele, ele só **monta e envia o personagem**.

Fluxo percebido pelo participante:
1. Monta o personagem (cenário + animal + itens) e preenche **nome** e os **4 status**.
2. Clica em **Enviar** (o personagem).
3. Vê uma mensagem de **sucesso**.

O que acontece **por trás**, sem ele ver:
1. O app **monta a carta** (imagem do personagem + moldura de TCG + nome + status).
2. **Envia a carta** (imagem) + os dados (JSON) para os organizadores.
3. Os organizadores montam depois um **PDF com todas as cartas** para impressão física — que vira a surpresa entregue.

> ⚠️ **Regra de ouro da UI:** em nenhum lugar visível ao participante deve aparecer a palavra "carta", uma prévia da carta, ou a opção de baixar a carta. A moldura de TCG **nunca** é mostrada na tela dele. Ver [ADR-012](09-decisoes.md).

## Dimensões e resolução (assets reais)

| Config | Largura × Altura | Observação |
|--------|:----------------:|-----------|
| 63 × 88 mm @ **300 DPI** | **744 × 1039 px** | Formato real dos assets, **sem sangria** |

- A carta é montada **exatamente em 744 × 1039 px** — o mesmo tamanho da imagem do personagem.
- ✅ **A gráfica aceita sem sangria.** A carta é gerada nos assets como estão (744 × 1039, 300 DPI). `Borda pra corte.png` serve de guia de corte no PDF.
- Para 600 DPI (se um dia quiserem), tudo teria de ser re-exportado a 2× (1488 × 2078). Hoje o alvo é 300 DPI.

> A **composição exata** (camadas, posições em px, fontes, dia/noite) está em **[11-carta-composicao](11-carta-composicao.md)** — fonte da verdade para o render.

## Anatomia da carta (resumo)

Carta = **imagem do participante** (cenário + animal + itens, 744 × 1039) + **moldura por cima** (preenchimentos semitransparentes, name frame, status frame, borda) + **textos** (nome + 4 status, fonte Adam Script). Versão **dia/noite** definida pelo **cenário**. Coordenadas em [11](11-carta-composicao.md).

## Fluxo técnico de envio (silencioso)

```
[Enviar personagem] → confirmação →
   mostra "Enviado com sucesso! ✅"   (feedback imediato ao participante)
   │
   └── (por trás, sem UI de carta)
        1. compõe a carta 744×1039 num canvas OFFSCREEN
        2. canvas.toBlob('image/png')
        3. POST /api/enviar-carta  → imagem da carta + JSON (nome, status, classe, animal, cenário)
             ├── sucesso → nada muda para o participante (já viu o sucesso)
             └── falha (sem internet) → guarda na fila local e reenvia depois
```

- **Nada de carta é mostrado nem salvo no aparelho do participante** (para não estragar a surpresa).
- Montar o personagem funciona **offline**; só o envio precisa de internet.
- **Fila de reenvio:** se o upload falhar, o app guarda a carta+dados localmente e tenta de novo quando houver conexão. Como o feedback de sucesso já foi dado, o reenvio é transparente. (Aceita-se o risco de, em raríssimos casos de troca de aparelho antes do reenvio, um envio se perder — ver [08-riscos](08-riscos.md).)

## Algoritmo de composição da carta (offscreen)

```
1. Canvas offscreen 744 × 1039.
2. Desenhar a imagem do participante (cenário + camadas do personagem).
3. Aplicar a moldura conforme [11]: preenchimentos, name frame, status frame, borda (dia/noite pelo cenário).
4. Desenhar textos: nome do personagem + Status 1–4 (Adam Script, RTL-AdamScript-Regular.ttf).
5. toBlob('image/png') → enviar.
```

## Dados enviados

O participante **escreve** o nome e os 4 status; eles vão como **JSON junto com a imagem** da carta:

- **Imagem**: PNG da carta montada (744 × 1039).
- **JSON**: `nomePersonagem`, `status` (vida/força/intelecto/velocidade), `classe`, `animal`, `cenario`, `enviadoEm`.
- O JSON dá aos organizadores dados estruturados (para registro/organização) além da imagem já pronta. Ver [05](05-modelo-de-dados.md).

## Backend de coleta (mini-backend)

Único componente de servidor do projeto. Recebe as cartas e guarda para os organizadores.

- **Endpoint**: `POST /api/enviar-carta` (Vercel Route Handler / função serverless).
- **Recebe**: imagem PNG da carta + JSON (ver acima).
- **Armazena**: imagem em object storage + metadados em tabela.
- **Stack sugerida**: **Supabase** (Storage + Postgres, free tier) — painel pronto para os organizadores verem/baixarem os envios. Alternativa: **Vercel Blob**.
- **Sem dados pessoais**: identificamos pelo **nome do personagem**, não pelo nome real/contato → privacidade baixa por design.

### Dimensionamento de armazenamento
- PNG 744×1039 costuma ter ~1–3 MB. Estimar nº de participantes × envios.
- Supabase free = ~1 GB. Se estourar: otimizar PNG, limitar a **1 envio final por pessoa**, ou avaliar JPEG de alta qualidade (pode criar artefatos em arte de traço).

### Proteção do endpoint (anti-abuso)
- Endpoint aberto pode receber spam. Mitigações: **segredo/chave** embutido, **rate limit** básico, validação de tamanho/tipo. Apostas baixas, mas não deixar totalmente aberto.

## Montagem do PDF de impressão (ferramenta dos organizadores)

Etapa **do lado dos organizadores**, não do participante. Compila as cartas coletadas num PDF pronto para gráfica.

- **Entrada**: imagens coletadas no storage.
- **Saída**: PDF com as cartas dispostas em folhas (ex.: A4/A3), **no tamanho físico real** (63 × 88 mm), com **guias de corte** (`Borda pra corte.png`).
- **Como**: script Node (ex.: `pdf-lib`) ou página de admin protegida no app.
- **A definir**: layout (quantas cartas por folha), tamanho da folha da gráfica, agrupamento.

## Download/compartilhamento no aparelho

Não se aplica ao participante nesta versão (a carta é surpresa e não é exposta). As notas de compatibilidade de download/`navigator.share` no iOS ficam reservadas caso, no futuro, se decida entregar alguma imagem ao participante.

## Pontos a fechar

- [x] Moldura, posições e camadas definidas → [11-carta-composicao](11-carta-composicao.md).
- [x] Gráfica aceita **sem sangria**.
- [x] Fonte **Adam Script** no projeto (`font/RTL-AdamScript-Regular.ttf`).
- [x] Mapeamento Status 1–4 (Vida/Força/Intelecto/Velocidade) confirmado.
- [x] Nome e status são **escritos pelo participante** e enviados em JSON com a imagem.
- [ ] Layout do PDF de impressão (cartas por folha, tamanho da folha).
- [ ] Escolha final do storage (Supabase vs Vercel Blob) e limite de envios por pessoa.
- [ ] Garantir que a UI **não vaza** a existência da carta (revisar textos/telas).
