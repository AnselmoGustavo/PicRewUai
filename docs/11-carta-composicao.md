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
| Name Frame | `Name Frame/Frames novos/Name Frame {Dia,Noite} Title 1.png` | **744 × 1039** | dia / noite · **full-canvas** (banner + linha de título), traço escuro/claro |
| Name Frame Preench. | — (removido) | — | agora o preenchimento do nome é **gerado por código** (ver abaixo) |
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
7.  Name Frame [Dia|Noite]   ← full-canvas em (0,0): banner + linha de título
8.  Status Preenchimento     (semitransparente, centralizado no frame)
9.  Status [Dia|Noite]
10. Borda [Dia|Noite]
11. Texto: Nome do personagem  (no banner; SEM preenchimento; cor acompanha o tema)
12. Texto: Título             (acima da linha de título; cor acompanha o tema)
13. Textos: Status 1–4
```

> **Dia ou Noite** é escolhido pelo **`tema` do cenário** selecionado (cada cenário é marcado `claro`→dia ou `escuro`→noite no manifesto). Ver [05](05-modelo-de-dados.md).

## Posições (cm → px @ 300 DPI)

### Assets (canto superior-esquerdo)

Fonte da verdade das coordenadas: `src/lib/cartaLayout.json`.

| Elemento | X (px) | Y (px) | Obs. |
|----------|:------:|:------:|------|
| Name Frame (Dia/Noite) | 0 | 0 | full-canvas 744 × 1039 |
| Status Frame (Dia/Noite) | 514 | 758 | |
| Status Preenchimento | *centralizado* | *no frame* | ver aviso abaixo |

> ⚠️ **Preenchimento de status:** o asset (160 × 231) é **menor** que a moldura de status (169 × 240). Ele deve ser **centralizado dentro da moldura** (offset de +4,5 px em X e Y a partir de 514, 758), e **não** colado no mesmo canto (514, 758) — senão fica desalinhado (sobra ~9 px embaixo/à direita). No código isso é calculado a partir dos tamanhos reais das imagens. A moldura de status contém só os ornamentos das quinas + ícones; a "borda retangular" visível é do próprio preenchimento.

### Textos (caixa X, Y, largura, altura em px) · fonte **Adam Script**

| Texto | X | Y | L | A | fontePx | cor |
|-------|:-:|:-:|:-:|:-:|:-------:|-----|
| Nome do personagem | 224 | 158 | 414 | 60 | 44 | **acompanha o tema** (escura no dia, clara na noite) |
| Título | 205 | 246 | 330 | 34 | 26 | **acompanha o tema** (escura no dia, clara na noite) |
| Status 1 (Vida ❤️) | 607 | 781 | 35 | 45 | 34 | escura |
| Status 2 (Força ⚔️) | 607 | 829 | 35 | 45 | 34 | escura |
| Status 3 (Intelecto 📖) | 607 | 880 | 35 | 45 | 34 | escura |
| Status 4 (Velocidade ⚡) | 607 | 926 | 35 | 45 | 34 | escura |

> Mapeamento Status 1–4 → Vida / Força / Intelecto / Velocidade (ordem dos ícones no frame, cima → baixo) — ✅ confirmado. O participante **digita** nome, **título** e status na ficha; o **app os desenha na carta** nestas posições (fonte Adam Script). A caixa de status comporta ~1–2 dígitos — validar a entrada.
> **Sem preenchimento** atrás do nome nem do título (decisão de design). Ambos ficam direto sobre a ribbon/cenário, então a **cor acompanha o tema** (`corTexto` no dia, `corTextoClaro` na noite) para manter a legibilidade.

> 🎨 **Pendente (calibrar com cenários reais):** cores/opacidades foram definidas sobre fundo placeholder. Ao integrar os cenários reais, revisar o **contraste dos números de status** (e do título) — ajustar cor/opacidade se necessário.

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
