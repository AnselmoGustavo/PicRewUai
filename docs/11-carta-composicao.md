# 11 — Composição da Carta (assets, camadas e posições)

Especificação exata de como montar a carta a partir dos assets em `Assets Finais/`. Fonte da verdade para o código de render/export.

## Dados-base

- **Tamanho da carta:** 63 × 88 mm = **744 × 1039 px a 300 DPI**. Sem sangria (ver [nota de impressão](#nota-de-impressão)).
- **Conversão:** `1 cm = 300 / 2,54 = 118,11 px`. Todas as posições foram dadas em cm e convertidas abaixo.
- Todos os assets de carta estão a 300 DPI. As posições `(X, Y)` são o **canto superior-esquerdo** de cada asset.

## Assets disponíveis (`Assets Finais/`)

| Asset | Arquivo | Tamanho (px) | Variantes |
|-------|---------|:------------:|-----------|
| Borda | `Bordas/Borda dia.png` · `Borda noite.png` | 744 × 1039 | dia / noite |
| Borda p/ corte | `Bordas/Borda pra corte.png` | 744 × 1039 | guia de corte (só no PDF) |
| Name Frame | `Name Frame/Name Frame Dia.png` · `Noite.png` | 604 × 267 | dia / noite |
| Name Frame Preench. | `Name Frame/Name Frame Preenchimento.png` | 545 × 172 | semitransparente |
| Status Frame | `Status Completo/Status dia.png` · `noite.png` | 169 × 240 | dia / noite (ícones embutidos) |
| Status Preench. | `Status Completo/Preenchimento Status.png` | 160 × 231 | semitransparente |
| Ícones de status | `Status/{Vida,Força,Intelecto,Velocidade}.png` | 125 × 125 | uso na UI do app (na carta já vêm no frame) |

> Os ícones dos 4 status **já estão embutidos** no "Status dia/noite". Os PNGs soltos em `Status/` servem para a **interface do app** (ex.: tela da ficha).

## Ordem de composição (z-order, de baixo para cima)

### Parte A — imagem do participante (vira o "fundo" da carta) · 744 × 1039
```
0. Cenário (fundo escolhido)   ← define o tema dia/noite
1. Base do animal
2. Vestimenta
3. Acessório 1
4. Item de cabeça
5. Arma
6. Acessório 2
```
→ achatado, é a imagem que o app envia e que preenche a carta inteira.

### Parte B — moldura da carta (overlay) · aplicada no preview e no export
```
7.  Name Frame Preenchimento      (semitransparente)
8.  Name Frame [Dia|Noite]
9.  Status Preenchimento          (semitransparente)
10. Status [Dia|Noite]
11. Borda [Dia|Noite]
12. Texto: Nome do personagem
13. Textos: Status 1–4
```

> **Dia ou Noite** é escolhido pelo **`tema` do cenário** selecionado (cada cenário é marcado `claro`→dia ou `escuro`→noite no manifesto). Ver [05](05-modelo-de-dados.md).

## Posições (cm → px @ 300 DPI)

### Assets (canto superior-esquerdo)

| Elemento | X (cm) | Y (cm) | X (px) | Y (px) |
|----------|:------:|:------:|:------:|:------:|
| Name Frame (Dia/Noite) | 0,63 | 0,16 | 74 | 19 |
| Name Frame Preenchimento | 0,81 | 0,63 | 96 | 74 |
| Status Frame (Dia/Noite) | 4,35 | 6,42 | 514 | 758 |
| Status Preenchimento | 4,35 | 6,42 | 514 | 758 |

### Textos (caixa de texto: X, Y, largura, altura) · fonte **Adam Script**

| Texto | X (cm) | Y (cm) | L (cm) | A (cm) | X px | Y px | L px | A px |
|-------|:------:|:------:|:------:|:------:|:----:|:----:|:----:|:----:|
| Nome do personagem | 1,61 | 0,95 | 3,66 | 0,45 | 190 | 112 | 432 | 53 |
| Status 1 (Vida ❤️) | 5,14 | 6,61 | 0,30 | 0,38 | 607 | 781 | 35 | 45 |
| Status 2 (Força ⚔️) | 5,14 | 7,02 | 0,30 | 0,38 | 607 | 829 | 35 | 45 |
| Status 3 (Intelecto 📖) | 5,14 | 7,45 | 0,30 | 0,38 | 607 | 880 | 35 | 45 |
| Status 4 (Velocidade ⚡) | 5,14 | 7,84 | 0,30 | 0,38 | 607 | 926 | 35 | 45 |

> Mapeamento Status 1–4 → Vida / Força / Intelecto / Velocidade (ordem dos ícones no frame, cima → baixo) — ✅ confirmado. Os 4 valores e o nome são **digitados pelo participante** e enviados em JSON (ver [05](05-modelo-de-dados.md)). A caixa de status comporta ~1–2 dígitos — validar a entrada.

## Preenchimentos (transparência)

Os dois "Preenchimento" (Name e Status) são fundos claros aplicados **com transparência** atrás do texto, para dar legibilidade sem mudar a cor da fonte conforme o fundo.

- Aplicar com opacidade parcial (**calibrar visualmente, ~60–80%**).
- Ficam **abaixo** do respectivo frame decorativo e **acima** da imagem do participante.

## Fontes de texto da carta

- **Adam Script** — nome do personagem e os 4 valores de status. Arquivo: `font/RTL-AdamScript-Regular.ttf`.
- Carregar a fonte (via `FontFace` / `document.fonts.ready`) **antes** de desenhar os textos no canvas, senão o navegador desenha com fonte de fallback. Ver [10](10-identidade-visual.md).

## Nota de impressão

- Assets estão a **300 DPI, 744 × 1039, sem sangria (bleed)**.
- Como a imagem do participante **preenche a carta inteira até as bordas**, o risco de borda branca no corte é baixo, mas **um corte impreciso pode deixar fio branco**.
- `Borda pra corte.png` é o contorno (cantos arredondados) usado como **guia de corte no PDF**.
- ✅ **A gráfica aceita sem sangria** — geramos a carta nos assets como estão (744 × 1039).
- A carta é montada **offscreen** (nunca exibida ao participante — é surpresa; ver [06](06-exportacao-carta.md)).

## Verificação

- Os arquivos `Assets Finais/Designs Finais/Exemplo1–4.png` mostram o resultado final montado (dia e noite) — usar como referência visual e para validar posições/opacidades no código.
