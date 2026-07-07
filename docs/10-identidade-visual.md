# 10 — Identidade Visual

Cores, tipografia e tema do app. Viram os *design tokens* (variáveis CSS / tema Tailwind) no código.

> **Tema único** (sem modo claro/escuro).

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

  /* Neutros — A DEFINIR (fundo, texto, bordas) */
  --cor-fundo:  #ffffff;   /* placeholder */
  --cor-texto:  #1e1b16;   /* placeholder */
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

- [ ] Definir **neutros**: cor de fundo, cor de texto, bordas, estados desabilitados.
- [ ] Confirmar interpretação de uso das fontes (qual é display / qual é corpo).
- [ ] Converter Arcane Fable e Adam Script para `.woff2` (Adam Script só é usada no canvas de export, então o `.ttf` já serve).
- [ ] Validar contraste WCAG AA de todas as combinações.

## Resolvido

- ✅ Tema único (sem modo claro/escuro).
- ✅ Cor primária: **verde `#45754a`**.
- ✅ Fontes: **Poppins** (texto) + **Arcane Fable** (display/temático).
