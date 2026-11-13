# 01 — Visão e Escopo

## Objetivo

Entregar um **web app** para o evento UAI 2026 onde cada participante monta um personagem animalesco temático de RPG, evolui esse personagem ao longo dos 4 dias do evento desbloqueando itens por código, e ao final exporta o personagem no formato de uma **carta de TCG**.

O app tem dois papéis:

1. **Picrew (foco principal)** — o criador visual do personagem por camadas.
2. **Ficha de personagem** — dados do personagem (nome, classe, etc.) que acompanham a carta.

## Contexto do evento

- **Datas do evento:** 19 a 22 de novembro de 2026 (4 dias).
- **Janela de disponibilidade do app:** durante o mês de novembro de 2026.
- **Prazo de entrega (app pronto):** **31 de outubro de 2026**.
- **Público:** participantes do evento, usando **seus próprios celulares** (mix de Android e iPhone) — por isso web app, e não app nativo.

## Por que web app (e não app nativo)

- Público tem Android **e** iPhone.
- Não há conta de desenvolvedor Apple disponível para publicar na App Store.
- Um web app resolve os dois casos com uma base de código única e sem processo de aprovação de loja.
- Pode ser instalado como PWA (ícone na tela inicial) para dar sensação de app.

## Personagem — modelo conceitual

- Cada personagem tem **1 animal base** (o corpo completo do animal) — sem customização de olhos/boca/etc. nesta versão.
- **5 animais:** macaco, raposa, gato, veado, cachorro. *(Sapo, coruja e carpa saíram em 11/2026.)*
- Cada participante escolhe **1 classe** entre 5: guerreiro, arqueiro, mago, bardo, ninja.
- A classe **filtra** quais itens ficam disponíveis.
- **8 tipos de item:** camisa, calça, arma, escudo, calçado, capa, chapéu, acessório *(antes eram 5 categorias)*. Em **acessório** dá para equipar vários ao mesmo tempo; nos outros tipos, um só.
- Itens desenhados **por animal+classe** (ADR-016): skin básica (dia 1), skin avançada (dia 2) e acessórios avulsos (liberados desde o início). Hoje: **465 itens** nas 25 combinações.
- Cada item pode dar **bônus de status** e pode ter um **código especial** próprio (ver [05](05-modelo-de-dados.md)).
- **Título** do personagem: todos começam como **Recruta**; outros títulos são liberados por código.

## Sistema de progressão por código

- O evento dura 4 dias; ao fim de cada dia os participantes recebem **um código**.
- O código, inserido no app, **libera o conjunto de itens daquele dia**.
- No último dia, com todos os códigos inseridos, **todos os itens** ficam disponíveis.
- Os códigos são **iguais para todos** e validados dentro do próprio app (sem servidor).

## Exportação

- Botão **Exportar** compõe o personagem dentro de uma **moldura de carta de TCG**.
- Tamanho final: **6,3 cm × 8,8 cm** (63 × 88 mm — tamanho padrão de carta).
- A imagem é baixada/compartilhada pelo participante.

## Escopo desta versão (novembro 2026)

### Dentro do escopo ✅
- Seleção de animal e classe.
- Montagem por camadas (5 categorias de item).
- Filtro de itens por classe.
- Desbloqueio de itens por código diário.
- Ficha de personagem (campos a definir).
- Exportação como carta TCG no tamanho correto.
- Salvamento local + código de backup para recuperar em outro dispositivo.
- Funciona em Android e iPhone (navegador).

### Fora do escopo (possíveis versões futuras) ❌
- Customização de partes do rosto (olhos, boca, expressões).
- Itens específicos por animal (todos são universais nesta versão).
- Contas de usuário / login / backend.
- Galeria pública / compartilhamento social dentro do app.
- Multiplayer, trocas de cartas, ranking.
- Impressão física automatizada das cartas.

## Critérios de sucesso

- Um participante consegue, sozinho no celular, criar e exportar sua carta em menos de 5 minutos.
- Funciona de forma idêntica em Android (Chrome) e iPhone (Safari).
- A carta exportada sai no tamanho e resolução corretos para eventual impressão.
- O sistema de códigos libera itens corretamente em cada dia.
- Zero dependência de servidor durante o evento (não cai se muita gente usar ao mesmo tempo).
