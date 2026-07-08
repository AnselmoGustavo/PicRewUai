# 04 — Guia de Assets (para a ilustradora) ⭐

> **Ilustradora:** Ana Beatriz — responsável por todos os assets dos personagens (corpo, vestimenta, acessórios, equipamentos) e possivelmente os cenários.

> **Documento mais importante para começar a arte.** Ele precisa ser combinado e aprovado **antes** de produzir os itens em volume. Se o padrão de canvas/ancoragem mudar depois, boa parte da arte precisa ser refeita.

## Conceito central: canvas fixo, tudo pré-posicionado

Como escolhemos **itens universais** (o mesmo item serve para os 8 animais), a técnica mais segura é:

> **Toda arte — a base de cada animal e cada item — é desenhada em uma tela (canvas) do mesmo tamanho, com fundo transparente, já na posição final onde ela aparece no personagem.**

Assim, montar o personagem no app é só **empilhar as imagens** na ordem certa. Não há redimensionamento nem reposicionamento — o que você desenha é exatamente onde aparece.

## Especificação técnica dos arquivos

Alinhado aos designs de carta já produzidos (`Assets Finais/`), que estão em **744 × 1039 px a 300 DPI**:

| Propriedade | Valor |
|-------------|-------|
| Tamanho do canvas | **744 × 1039 px @ 300 DPI** (igual à carta — o personagem preenche a carta) |
| Formato | **PNG com transparência** (fundo 100% transparente; exceto cenários, que são opacos) |
| Resolução | Se quisermos impressão a 600 DPI no futuro, **tudo** (personagem + frames) é re-exportado a 2× (1488 × 2078) |
| Nomeação | `categoria_classe_nome.png` (ex.: `arma_mago_cajado-cristal.png`) |

### Zonas cobertas pela moldura (evitar detalhes importantes aqui)
A moldura da carta cobre partes da imagem. Evite posicionar o rosto/detalhe-chave do personagem sob:
- **Faixa do nome** — topo, ~0 a 285 px de altura (banner ornamentado no canto superior-esquerdo).
- **Coluna de status** — canto inferior-direito, a partir de ~(514, 758) px.

Ver posições exatas em [11-carta-composicao](11-carta-composicao.md).

## O template do corpo (o mais importante!)

Para um item universal (ex.: um capacete) encaixar em **todos os 8 animais**, os corpos precisam estar **alinhados a um mesmo gabarito**:

- Todos os animais desenhados na **mesma pose base** (ex.: de frente, em pé/sentado, corpo inteiro).
- **Regiões do corpo na mesma posição** entre os animais:
  - **Zona da cabeça** — mesma altura/centro → onde chapéus/elmos/coroas se apoiam.
  - **Zona do tronco** — mesma área → onde a vestimenta assenta.
  - **Zona das mãos** — mesma posição → onde a arma/item é segurado.
  - **Zona dos pés/base** — mesma linha do chão.
- Recomendação: criar **1 gabarito (template) mestre** com essas zonas marcadas e desenhar os 8 animais por cima dele.

### Teste de validação (fazer cedo!)

Antes de produzir tudo: desenhe **1 item de cada categoria** e teste nos **8 animais**. Se um elmo encaixa bem no gato mas flutua acima da coruja, ajustamos o gabarito **agora**, não depois de 150 itens prontos.

### Animais problemáticos

Sapo, macaco, raposa, gato, veado, cachorro têm corpos "humanóides/quadrúpedes" relativamente parecidos. Mas:
- **Carpa** (peixe) e **coruja** (ave) têm anatomia bem diferente.
- A **Ana Beatriz** desenha todos os animais, então o encaixe fica sob controle dela — a tendência é dar a esses dois uma **pose antropomórfica coerente** (em pé, com "braços") para caber no mesmo gabarito dos demais.
- Ainda assim, **fazer o teste de validação acima** (1 item por categoria nos 8 animais) para confirmar o encaixe antes de escalar.

## Camadas e ordem (z-index)

O app empilha as imagens nesta ordem padrão (fundo → frente):

```
0. cenário (fundo)  ← imagem OPACA que preenche a carta e define o tema dia/noite
1. base do animal
2. vestimenta
3. acessório 1     (coisas atrás: capa, asas, mochila)
4. item de cabeça
5. arma
6. acessório 2     (coisas na frente: item na mão, colar, óculos)
```

Depois dessas camadas, o app coloca a **moldura da carta** (frames + textos) por cima — ver [11-carta-composicao](11-carta-composicao.md).

- Desenhe cada item pensando em **qual camada ele ocupa**.
- Se um item precisar furar essa ordem (ex.: uma arma nas costas, atrás do corpo), me avise — damos um **z-index especial** a ele no app.
- Itens que se sobrepõem a partes do corpo (ex.: vestimenta cobrindo o tronco) devem ser desenhados **cobrindo** essa parte, já que ficam por cima da base.

## Inventário de arte a produzir

### Bases de animais — 8 arquivos
`base_sapo.png`, `base_macaco.png`, `base_raposa.png`, `base_gato.png`, `base_veado.png`, `base_carpa.png`, `base_coruja.png`, `base_cachorro.png`

### Itens — ~150 arquivos
5 classes × 5 categorias × ~5–6 itens = **~125 a 150 itens**.

| Classe | vestimenta | arma | item de cabeça | acessório 1 | acessório 2 |
|--------|:----------:|:----:|:--------------:|:-----------:|:-----------:|
| Guerreiro | 5–6 | 5–6 | 5–6 | 5–6 | 5–6 |
| Arqueiro | 5–6 | 5–6 | 5–6 | 5–6 | 5–6 |
| Mago | 5–6 | 5–6 | 5–6 | 5–6 | 5–6 |
| Bardo | 5–6 | 5–6 | 5–6 | 5–6 | 5–6 |
| Ninja | 5–6 | 5–6 | 5–6 | 5–6 | 5–6 |

### Cenários (fundos) — N arquivos (a definir quantos)
- Imagens **opacas** de 744 × 1039 que preenchem a carta atrás do personagem.
- Cada cenário é **claro** ou **escuro** → define se a carta usa a moldura **dia** ou **noite**.
- Idealmente equilibrar a quantidade de claros e escuros.
- Nomeação sugerida: `cenario_nome_claro.png` / `cenario_nome_escuro.png`.

### Moldura da carta — ✅ já entregue
Em `Assets Finais/`: bordas (dia/noite/corte), name frame (dia/noite + preenchimento), status (dia/noite + preenchimento). Composição documentada em [11](11-carta-composicao.md). **Nada a produzir aqui** (gráfica aceita sem sangria).

### UI (opcional)
- Ícones das classes, ícone de cadeado 🔒, logo do evento. (Os ícones de status já existem em `Assets Finais/Status/`.)

## Checklist de entrega de cada asset

- [ ] Canvas **744 × 1039 px @ 300 DPI**
- [ ] Fundo 100% transparente (cenários são opacos)
- [ ] Elemento na posição final (não centralizado "solto")
- [ ] Nomeado no padrão `categoria_classe_nome.png`
- [ ] Dentro da camada/z-index correto
- [ ] Testado sobre pelo menos 2–3 animais diferentes

## Entrega e organização

- Entregar em pastas por classe/categoria, espelhando `public/assets/`.
- Um item = um arquivo PNG. Nada de spritesheets.
- Manter um arquivo/planilha listando cada item (nome exibido no app, classe, categoria, **em qual dia/código ele desbloqueia**). Isso alimenta o manifesto (ver [05](05-modelo-de-dados.md)).
