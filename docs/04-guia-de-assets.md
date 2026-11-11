# 04 — Guia de Assets (para a ilustradora) ⭐

> **Ilustradora:** Ana Beatriz — responsável por todos os assets dos personagens (corpo, roupas, acessórios, equipamentos) e possivelmente os cenários.

> **Documento mais importante para começar a arte.** Ele precisa ser combinado e aprovado **antes** de produzir os itens em volume. Se o padrão de canvas/ancoragem mudar depois, boa parte da arte precisa ser refeita.

> 🔄 **ATUALIZAÇÃO (ADR-016):** o modelo mudou de "itens universais" para **itens por animal+classe** — cada peça é desenhada já encaixada no corpo daquele animal (ex.: chapéu que respeita os chifres do veado). Validado com o Veado-Mago. Ver detalhes abaixo em **"Estrutura confirmada (Veado-Mago)"**. As partes sobre canvas fixo/transparência/nomenclatura seguem valendo; o que mudou é que a arte é **específica por combinação**, não compartilhada entre animais.

## Estrutura confirmada + convenção de nomes (final)

Teste real (Veado-Mago) validou o pipeline. Padrões:
- **Canvas 3150×4400** (aspecto da carta), **PNG transparente**, cada peça **pré-posicionada**. O app reduz para 744×1039 automaticamente.
- **7 tipos de item:** camisa · calça · arma · calçado · capa · chapéu · acessório.
- **Base muda por classe** → um corpo por **animal+classe**.
- **z-index padrão por tipo** (menor = mais atrás) — o gerador aplica sozinho:

> capa **10** · corpo **20** · calçado **30** · calça **40** · camisa **50** · arma **70** · acessório **75** · chapéu **80**

- Só peças com **várias camadas** precisam de z no nome. Hoje isso acontece com a **capa** (frente z60 + atrás z10).

### Nomenclatura dos arquivos
**Personagem pelado:** `animal-classe.png` (em `personages-pelados/<animal>/`). Ex.: `veado-mago.png`.

**Itens:** `animal-classe-tipo-nome-dia.png` (em `itens/<tipo>/`)
- `tipo` = `camisa` · `calca` · `arma` · `calcado` · `capa` · `chapeu` · `acessorio`
- `nome` = slug, `_` entre palavras (ex.: `espada_madeira`)
- `dia` = `inicial` · `dia1` · `dia2` · `dia3` · `dia4` (código do dia que libera). *Itens com código especial/à parte: a definir depois.*
- **Peça com várias camadas:** acrescenta `-zNN` em cada arquivo (mesmo nome, z diferente).

**Regras:** só `-` separa campos; dentro de um campo use `_`. Tudo **minúsculo, sem acento/espaço**.

Ex.:
```
raposa-guerreiro-arma-espada_madeira-dia1.png
raposa-guerreiro-camisa-tunica-dia1.png
raposa-guerreiro-calca-short-dia1.png
veado-mago-chapeu-chapeu-dia2.png
veado-mago-calcado-botas-dia2.png
veado-mago-capa-capa-dia2-z10.png          (capa, parte de trás)
veado-mago-capa-capa-dia2-z60.png          (capa, parte da frente)
```

> O gerador (`scripts/gerar-assets.mjs`) lê a pasta `Assets Prontos/`, agrupa as camadas, otimiza para `public/` e **monta o manifesto automaticamente**. Adicionar item = soltar arquivo(s) + rodar o script.

## Conceito central: canvas fixo, tudo pré-posicionado

A técnica (mantida):

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

## Encaixe das peças

Como cada peça é desenhada **para o corpo daquele animal+classe** (ADR-016), não há gabarito comum entre animais: basta que todas as peças de uma combinação usem **o mesmo canvas e a mesma pose** do corpo pelado dela. Para conferir um conjunto novo, monte-o com `npm run assets` e veja no editor (ou peça uma carta de exemplo).

**Animais (5):** macaco, raposa, gato, veado, cachorro.

## Camadas e ordem (z-index)

O app empilha as imagens nesta ordem padrão (fundo → frente):

```
 0  cenário (fundo)    ← imagem OPACA que preenche a carta e define o tema dia/noite
10  capa (parte de trás)
20  corpo (personagem pelado)
30  calçado
40  calça
50  camisa
60  capa (parte da frente)
70  arma
75  acessório
80  chapéu
```

Depois dessas camadas, o app coloca a **moldura da carta** (frames + textos) por cima — ver [11-carta-composicao](11-carta-composicao.md).

- Desenhe cada item pensando em **qual camada ele ocupa**.
- Se um item precisar furar essa ordem (ex.: uma arma nas costas, atrás do corpo), me avise — damos um **z-index especial** a ele no app.
- Itens que se sobrepõem a partes do corpo (ex.: camisa cobrindo o tronco) devem ser desenhados **cobrindo** essa parte, já que ficam por cima da base.

## Inventário de arte a produzir

Por **animal+classe** (5 animais × 5 classes = 25 combinações):
- **1 corpo** (personagem pelado): `animal-classe.png`
- **Itens** nos 7 tipos (camisa, calça, arma, calçado, capa, chapéu, acessório). Nem todo tipo precisa existir em toda combinação; o editor mostra "Nenhum" quando não há.

Pronto hoje: **Veado-Mago** e **Raposa** (as 5 classes), com roupa básica (dia 1) e avançada (dia 2).

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
