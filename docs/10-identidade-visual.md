# 10 — Identidade Visual

Cores da marca do app e como aplicá-las na interface. Estas viram os *design tokens* (variáveis CSS / tema Tailwind) no código.

## Paleta principal

| Cor | Hex | Sugestão de papel |
|-----|-----|-------------------|
| 🟡 Âmbar/dourado | `#f4ab20` | **Primária** — destaques, botões principais, seleção ativa |
| 🔴 Coral | `#f46364` | **Secundária/ação** — acentos, avisos, elementos de destaque |
| 🟢 Verde-floresta | `#45754a` | **Apoio/tema** — fundos temáticos, cabeçalhos, estados "confirmado" |

> Os papéis acima são uma **proposta**. Podemos trocar qual cor é primária/secundária conforme o design das telas evoluir.

## Design tokens (proposta)

```css
:root {
  /* Marca */
  --cor-ambar:  #f4ab20;
  --cor-coral:  #f46364;
  --cor-verde:  #45754a;

  /* Papéis semânticos (ajustar conforme o design) */
  --cor-primaria:   var(--cor-ambar);
  --cor-secundaria: var(--cor-coral);
  --cor-acento:     var(--cor-verde);

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
      ambar: '#f4ab20',
      coral: '#f46364',
      verde: '#45754a',
    },
  },
}
```

## Contraste e acessibilidade

A especificação funcional pede contraste adequado (mobile, ao sol, telas variadas). Observações:

- **Âmbar `#f4ab20`** é claro → use **texto escuro** sobre ele (não branco).
- **Coral `#f46364`** é tom médio → texto branco tende a ficar no limite; validar antes de usar em botão com texto.
- **Verde `#45754a`** é escuro o suficiente → **texto branco** funciona bem sobre ele.
- Validar todas as combinações texto/fundo no padrão **WCAG AA** (contraste ≥ 4,5:1 para texto normal) antes de fechar.

## Pendências

- [ ] Definir **neutros**: cor de fundo, cor de texto, bordas, estados desabilitados.
- [ ] Definir se há **modo claro/escuro** ou só um tema.
- [ ] Confirmar os papéis (qual cor é primária) com o design das telas.
- [ ] Fonte(s)/tipografia da marca — ainda não definida.
- [ ] Validar contraste WCAG AA de todas as combinações.
