# 04 — Guia de Assets (para a ilustradora) ⭐

> **Ilustradora:** Ana Beatriz — responsável por todos os assets dos personagens (corpo, roupas, acessórios, equipamentos) e possivelmente os cenários.

> **Estado (17/11/2026):** arte entregue nas **25 combinações** (corpo + skin básica + skin avançada + skin dark + acessórios avulsos + Camisa São Paulo + 3 acessórios flutuantes) — **690 itens**. Novos lotes entram pelo fluxo de [Recebimento dos lotes](#recebimento-dos-lotes-fluxo-atual).

> 🔄 **ATUALIZAÇÃO (ADR-016):** o modelo mudou de "itens universais" para **itens por animal+classe** — cada peça é desenhada já encaixada no corpo daquele animal (ex.: chapéu que respeita os chifres do veado). Validado com o Veado-Mago. Ver detalhes abaixo em **"Estrutura confirmada (Veado-Mago)"**. As partes sobre canvas fixo/transparência/nomenclatura seguem valendo; o que mudou é que a arte é **específica por combinação**, não compartilhada entre animais.

## Estrutura confirmada + convenção de nomes (final)

Teste real (Veado-Mago) validou o pipeline. Padrões:
- **Canvas 3150×4400** (aspecto da carta), **PNG transparente**, cada peça **pré-posicionada**. O app reduz para 744×1039 automaticamente.
- **8 tipos de item:** camisa · calça · arma · escudo · calçado · capa · chapéu · acessório (acessório aceita vários ao mesmo tempo).
- **Base muda por classe** → um corpo por **animal+classe**.
- **z-index padrão por tipo** (menor = mais atrás) — o gerador aplica sozinho:

> capa **10** · corpo **20** · calçado **30** · calça **40** · camisa **50** · arma **70** · escudo **72** · acessório **75** · chapéu **80**

- Só peças com **várias camadas** (ou fora do z padrão) precisam de z no nome. Hoje: a **capa do mago** (frente z60 + atrás z10) e a **capa do guerreiro** (uma camada, **z60** — por cima da armadura; o organizador já aplica).

### Nomenclatura dos arquivos
**Personagem pelado:** `animal-classe.png` (em `personages-pelados/<animal>/`). Ex.: `veado-mago.png`.

**Itens:** `animal-classe-tipo-nome-dia.png` (em `itens/<tipo>/`)
- `tipo` = `camisa` · `calca` · `arma` · `escudo` · `calcado` · `capa` · `chapeu` · `acessorio`
- `nome` = slug, `_` entre palavras (ex.: `espada_madeira`)
- `dia` = `inicial` · `dia1` · `dia2` · `dia3` · `dia4` (código do dia que libera). Itens que devem liberar com um **código especial** recebem o código em `src/lib/codigosItens.ts` (aí o dia deixa de valer).
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
| Tamanho do canvas | **3150 × 4400 px** (mesmo aspecto da carta); o app reduz para **744 × 1039 @ 300 DPI** |
| Formato | **PNG com transparência** (fundo 100% transparente; exceto cenários, que são opacos) |
| Resolução | Se quisermos impressão a 600 DPI no futuro, **tudo** (personagem + frames) é re-exportado a 2× (1488 × 2078) |
| Nomeação | `animal-classe-tipo-nome-dia[-zNN].png` (ver acima) |

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
72  escudo
75  acessório
80  chapéu
```

Depois dessas camadas, o app coloca a **moldura da carta** (frames + textos) por cima — ver [11-carta-composicao](11-carta-composicao.md).

- Desenhe cada item pensando em **qual camada ele ocupa**.
- Se um item precisar furar essa ordem (ex.: uma arma nas costas, atrás do corpo), me avise — damos um **z-index especial** a ele no app.
- Itens que se sobrepõem a partes do corpo (ex.: camisa cobrindo o tronco) devem ser desenhados **cobrindo** essa parte, já que ficam por cima da base.

## Inventário (12/11/2026)

Por **animal+classe** (5 × 5 = 25 combinações), todas com arte:
- **1 corpo** (personagem pelado): `animal-classe.png`.
- **Skin básica (dia 1):** camisa (túnica), calça (short), arma básica.
- **Skin avançada (dia 2):** camisa, calça, calçado e arma; o **guerreiro** e o **mago** têm capa (duas camadas no mago) e o **mago** tem chapéu.
- **Skin dark (dia 3):** arqueiro — blusa com capuz, calça, botas e arco dark; bardo — jaqueta e blusa, calça com suspensório e cintos, botas dark e violino sombrio; guerreiro — armadura dark (camisa + calça), capa dark (2 camadas), elmo dark, botas dark e machado; mago — blusa e saia de babados, sapatinho mágico, chapéu dark e vassoura; ninja — blusa e calça dark, geta com meia, ombreiras e katana dark (tipo capa, por cima) e shuriken.
- **Acessórios avulsos (inicial)**, em todas as classes e ajustados a cada corpo: cachecol, girassol, laço, óculos de grau, óculos Squirtle, pokébola (acessório); cabeça de Godzilla, chapéu do Luffy, chapéu de maquinista (chapéu).
- **Exclusivos por classe (inicial):** ninja — bandana, leques katana; arqueiro — besta twich, Megaman; bardo — guitarra Brook, guitarra Larinha; guerreiro — escudo do Link (tipo **escudo**, usado junto com a arma), key blade, diário; mago — varinha das varinhas, chapéu de bruxa (Witch Hat Atelier).

**Pendente:** diário para arqueiro/bardo/mago/ninja (se for para todas as classes).

### Cenários (fundos) — 3 no total
- Imagens **opacas** que preenchem a carta atrás do personagem (otimizadas para 744 × 1039 com `npm run cenarios`).
- Cada cenário é **claro** ou **escuro** → define se a carta usa a moldura **dia** ou **noite**.
- Hoje: **Floresta** (dia 1, **escuro** → moldura noite), **Montanhas** (dia 2, claro → moldura dia), **Vila das Lanternas** (dia 3, **escuro** → moldura noite; original `Assets Prontos/Cenários/Dia 3 - Vila das Lanternas.png`), **Pôr do Sol** (dia 4, claro → moldura dia). Cenário novo: coloque o original em `Assets Prontos/Cenários/`, acrescente em `scripts/otimizar-cenarios.mjs`, rode `npm run cenarios` e registre em `CENARIOS` (`src/lib/manifesto.ts`).

### Moldura da carta — ✅ já entregue
Em `Assets Finais/`: bordas (dia/noite/corte), name frame (dia/noite + preenchimento), status (dia/noite + preenchimento). Composição documentada em [11](11-carta-composicao.md). **Nada a produzir aqui** (gráfica aceita sem sangria).

### UI (opcional)
- Ícones das classes, ícone de cadeado 🔒, logo do evento. (Os ícones de status já existem em `Assets Finais/Status/`.)

## Checklist de entrega de cada asset

- [ ] Canvas **3150 × 4400**, PNG com fundo 100% transparente (cenários são opacos)
- [ ] Peça na posição final, encaixada no corpo daquele animal+classe
- [ ] Mesma peça com o **mesmo nome** em todos os animais (o bônus e o código do item dependem do nome)
- [ ] Peça de várias camadas: uma imagem por camada

## Recebimento dos lotes (fluxo atual)

> **Peças "de todos"** (uma arte que serve para vários animais/classes, ex.: Camisa São Paulo por classe, ou os acessórios flutuantes Estrela 2023 / Lampião 2022 / Lanterna 2025, iguais nas 25 combinações) não passam pelo organizador: são copiadas direto para `Assets Prontos/itens/<tipo>/` com um arquivo por animal+classe. Os **acessórios flutuantes ficam atrás do personagem** (`-z5` no nome do arquivo, abaixo do corpo z20 e da capa de trás z10) e cada um tem **um código só** para todas as classes.

A ilustradora manda uma pasta por combinação, `<Animal> - <Classe>` (ex.: `Gato - Bardo`), podendo ter subpastas. Nomes aceitos pelo organizador:
- **Corpo:** `Gato - Bardo.png`, `gato-bardo.png`…
- **Skin:** `gato-bardo-[adv|basico|tipo]-peça-dia.png` (ex.: `veado-ninja-adv-blusa-dia2.png`) — a peça é traduzida pela tabela `PECAS` (blusa → camisa, short → calça…).
- **Capa em duas partes:** `…-capa_atras_dark-…` (z10) + `…-capa_frente_dark-…` (z60) viram a peça `capa_dark` com duas camadas. `armadura_calca_…` e `saia_…` vão para **calça**; tipo grudado no nome (`…-chapeu_dark-…`) também é aceito. Capa de uma camada do **guerreiro e do ninja** vai por cima (z60). O organizador **barra** peça com o mesmo nome de outra de outro dia (ex.: `blusa` dia 3 x `blusa` dia 2), porque bônus e código usam `classe/tipo/nome`.
- **Já na convenção:** `gato-arqueiro-calcado-botas_dark-dia3.png` (tipo e nome usados como vieram; `vestimenta` vira calça ou camisa pelo nome; `_cima`/`_baixo` saem do nome). Nesse caso a pasta pode ter qualquer nome (ex.: `Arqueiro - Dark`): animal e classe saem do começo do nome de cada arquivo.
- **Avulso com tipo na frente:** `acessorio pokebola Mescladas.PNG`, `arma besta twich.png` → dia `inicial`.
- **Avulso conhecido sem tipo:** `bandana Mescladas.PNG` (tabela `AVULSOS`).

Passos:
1. Colocar as pastas em `Assets Prontos/itens/itens-para-formatacao/`.
2. `npm run organizar` → mostra o que faria e lista as pendências (`??`).
3. `npm run organizar -- --mover` → move para as pastas de tipo, já com o nome da convenção. Arquivo idêntico ao que já existe é descartado; diferente vira pendência (nunca sobrescreve).
4. `npm run assets` → otimiza, gera miniaturas e o manifesto, e **acrescenta as peças novas** em `src/lib/bonusItens.ts` e `src/lib/codigosItens.ts` (sem bônus/código).
5. `npm run build`, commit e push (a Vercel publica sozinha).

Peças que já vieram com tipo diferente entre animais têm o tipo fixado em `TIPO_FIXO` (`scripts/organizar-itens.mjs`): Megaman e key blade = arma; escudo do Link = escudo; cabeça de Godzilla = chapéu. Grafias alternativas viram o nome padrão (`oculos grau` → `oculos_de_grau`, `besta twitch` → `besta_twich`, `sandalia` → `sapatos`).
