# 10 — Identidade Visual

Cores, tipografia e tema do app. Viram os *design tokens* (variáveis CSS / tema Tailwind) no código.

> **Tema único, claro/creme** (sem modo escuro). Fundo creme + texto escuro, combinando com o verde-floresta primário e a temática de fantasia.

## Paleta

| Cor | Hex | Papel |
|-----|-----|-------|
| 🟢 Verde-floresta | `#45754a` | **Primária** — botões principais, cabeçalhos, seleção ativa, tema |
| 🟡 Âmbar/dourado | `#f4ab20` | **Secundária** — destaques, chamadas, elementos de atenção |
| 🔴 Coral | `#f46364` | **Acento/ação** — avisos, erros, elementos pontuais de destaque |

## Design tokens

```css
:root {
  /* Marca */
  --cor-verde:  #45754a;
  --cor-ambar:  #f4ab20;
  --cor-coral:  #f46364;

  /* Papéis semânticos */
  --cor-primaria:   var(--cor-verde);
  --cor-secundaria: var(--cor-ambar);
  --cor-acento:     var(--cor-coral);

  /* Neutros — tema claro/creme (proposta, a refinar) */
  --cor-fundo:        #f7f0e0;  /* creme (fundo da página) */
  --cor-superficie:   #fbf7ec;  /* cartões/painéis, levemente mais claro */
  --cor-texto:        #2b2620;  /* marrom quase preto (texto principal) */
  --cor-texto-suave:  #6b6152;  /* texto secundário */
  --cor-borda:        #e3d6bc;  /* bordas/divisórias */
  --cor-desabilitado: #cdbfa4;  /* estados inativos */
}
```

Equivalente para tema Tailwind (`tailwind.config`):

```js
theme: {
  extend: {
    colors: {
      verde: '#45754a',   // primária
      ambar: '#f4ab20',   // secundária
      coral: '#f46364',   // acento
    },
    fontFamily: {
      sans: ['Poppins', 'system-ui', 'sans-serif'],
      display: ['ArcaneFable', 'Poppins', 'serif'],
    },
  },
}
```

## Assets de marca (pasta `identidade/`)

| Asset | Arquivo | Tamanho | Uso |
|-------|---------|:-------:|-----|
| Fundo texturizado | `identidade/Fundo.png` | 1080 × 1080 | **Fundo do app** — papel envelhecido (florais + caligrafia + vinheta) |
| Logo (transparente) | `identidade/Logo uai - sem fundo.png` | 746 × 528 | Logotipo "uai" para cabeçalho, splash, tela inicial |
| Logo composto | `identidade/Logo final.png` | 1080 × 1080 | Logo sobre o fundo — ícone PWA, imagem de compartilhamento |

### Direção visual
Estética de **pergaminho / livro antigo de RPG**: papel envelhecido, tinta verde, ornamentos. Combina com as molduras ornamentadas das cartas ([11](11-carta-composicao.md)). As superfícies da UI (painéis, cartões, botões) devem seguir esse clima — verde primário sobre creme, cantos/bordas com um toque ornamental quando fizer sentido.

### Notas de uso do fundo
- Usar `Fundo.png` como **fundo fixo cobrindo a tela** (`background-size: cover`, centralizado), com o creme `--cor-fundo` (#f7f0e0) como **cor de fallback** enquanto a imagem carrega.
- A imagem tem **vinheta e florais** → não é 100% ladrilhável. Para telas muito altas, ou usa-se fundo fixo (`background-attachment: fixed`) ou geramos uma variante mais neutra/ladrilhável depois.
- **Otimizar** (comprimir / gerar `.webp`) para carregar rápido no celular.
- Garantir **legibilidade do texto** sobre a textura: onde houver bastante texto, usar um painel de `--cor-superficie` (creme mais liso) por cima do fundo.

## Tipografia

| Fonte | Uso | Origem |
|-------|-----|--------|
| **Poppins** (family) | Texto de interface e leitura (corpo, botões, labels, ficha) | Google Fonts, **auto-hospedada** via `next/font` |
| **Arcane Fable** | Títulos e elementos temáticos de destaque na **interface do app** (logo, cabeçalhos) | Arquivo local `font/arcane-fable.otf` |
| **Adam Script** | Textos **na carta**: nome do personagem e os 4 valores de status | Arquivo local `font/RTL-AdamScript-Regular.ttf` |

> Interpretação de uso a confirmar: Poppins = texto legível/corpo; Arcane Fable = display/temático da UI. Ajustar se for o contrário.
> A carta usa **Adam Script** (ver [11-carta-composicao](11-carta-composicao.md)); ela é montada por trás, sem UI (a carta é surpresa).

### Notas técnicas de fontes
- **Auto-hospedar as duas** (não usar CDN do Google Fonts) porque o app é **offline-first/PWA** — precisa funcionar sem internet no evento.
- Converter `arcane-fable.otf` → **`.woff2`** para carregar mais rápido no celular; manter o `.otf` como arquivo de origem em `font/`.
- Declarar a Arcane Fable via `@font-face` (ou `next/font/local`) apontando para o `.woff2` servido de `/public/font/`.

```css
@font-face {
  font-family: 'ArcaneFable';
  src: url('/font/arcane-fable.woff2') format('woff2'),
       url('/font/arcane-fable.otf') format('opentype');
  font-display: swap;
}
```

## Contraste e acessibilidade

App usado no celular, possivelmente ao sol. Observações da paleta:

- **Verde `#45754a`** é escuro → **texto branco** funciona bem sobre ele. ✅
- **Âmbar `#f4ab20`** é claro → use **texto escuro** sobre ele (não branco).
- **Coral `#f46364`** é tom médio → texto branco fica no limite; validar antes de usar em botão com texto.
- Validar todas as combinações texto/fundo no padrão **WCAG AA** (contraste ≥ 4,5:1 para texto normal).

## Pendências

- [ ] Confirmar interpretação de uso das fontes (qual é display / qual é corpo).
- [ ] Converter Arcane Fable para `.woff2` (Adam Script só é usada no canvas de export, então o `.ttf` já serve).
- [ ] Refinar/validar os **neutros** e o contraste WCAG AA de todas as combinações na prática.

## Resolvido

- ✅ Tema **único, claro/creme** (sem modo escuro).
- ✅ Cor primária: **verde `#45754a`**; neutros creme + texto escuro definidos (proposta).
- ✅ Fontes: **Poppins** (texto), **Arcane Fable** (display UI), **Adam Script** (carta).
- ✅ Assets de marca disponíveis em `identidade/` (logo + fundo texturizado).
