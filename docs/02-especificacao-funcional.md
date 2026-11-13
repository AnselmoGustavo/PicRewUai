# 02 — Especificação Funcional

Descreve **o que** o app faz, tela a tela e fluxo a fluxo. (O **como** técnico está em [03-arquitetura-tecnica](03-arquitetura-tecnica.md).)

## Fluxo geral

```
Início → Escolher animal → Escolher classe → Editor (picrew) ⇄ Ficha
                                                  │
                                                  ├── Inserir código (desbloquear itens/cenários)
                                                  ├── Salvar / código de backup
                                                  └── Enviar personagem  → (carta gerada por trás)
```

## Telas / seções

### 1. Tela inicial
- **Logo "uai"** (`identidade/Logo uai - sem fundo.png`) sobre o fundo texturizado (`identidade/Fundo.png`) — ver [10](10-identidade-visual.md).
- Botão **Criar personagem** (novo) e **Continuar** (se já existe save local).
- Campo **Restaurar por código de backup**.

### 2. Escolha de animal
- Grade com os 5 animais (macaco, raposa, gato, veado, cachorro).
- Prévia do corpo base ao selecionar.
- Trocar o animal depois **zera os itens** escolhidos (a arte é específica por animal+classe).

### 3. Escolha de classe
- 5 classes (guerreiro, arqueiro, mago, bardo, ninja), cada uma com ícone/descrição curta.
- **Aviso importante:** trocar de classe **pode remover itens já escolhidos** que não pertencem à nova classe (confirmar com o usuário antes de trocar).

### 4. Editor (picrew) — tela principal
- **Área de preview**: a carta renderizada em tempo real (cenário + personagem + moldura).
- **Abas**: **cenário**, os tipos de item **que existem para aquele animal+classe** (camisa, calça, arma, calçado, capa, chapéu, acessório — abas vazias ficam escondidas), ficha.
- **Cenário**: escolha do fundo (não depende de classe). **3 cenários** (Floresta dia 1, Montanhas dia 2, 3º a definir no dia 3), liberados **1 por dia** via código. O cenário define se a moldura fica dia/noite (ver [11](11-carta-composicao.md)) — mas isso é interno; o participante só escolhe o fundo.
- Ao abrir uma categoria de item, mostra os itens **daquela classe**:
  - Itens **desbloqueados**: selecionáveis.
  - Itens **bloqueados**: aparecem esmaecidos com um cadeado 🔒 (mostrar que existem, mas indisponíveis — cria expectativa/coleção). Itens com **código especial** aparecem com 🎁.
  - Itens com **bônus de status** mostram o bônus no nome (ex.: "Cajado · +2📖").
  - Opção **"Nenhum"** para não usar item naquela categoria.
- Botão para **trocar animal** e **trocar classe**.
- Ações: **Inserir código**, **Ficha**, **Salvar progresso** (além do auto-save), **Enviar** (personagem — só depois do código de envio).

### 5. Inserir código
- Campo de texto para o código do dia.
- Ao validar um código correto:
  - Libera o conjunto de itens correspondente.
  - Feedback visual claro ("Itens do Dia 2 desbloqueados! +6 itens").
  - Persiste o desbloqueio no save local.
- Código inválido → mensagem de erro amigável.
- Código já usado → informar que já está ativo (idempotente).

### 6. Ficha de personagem
- A aba **Ficha** tem só os campos **editáveis** + o status **exibido** (não editável):
  - **Nome do personagem** (texto, escrito pelo participante) — vai na carta (fonte Adam Script)
  - **Título** — **escolhido** (não digitado) entre os títulos já liberados: todos começam com **Recruta**, os outros vêm de códigos (`src/lib/titulos.ts`). Títulos bloqueados ficam escondidos (só aparece quantos faltam). Vai na carta, abaixo do nome.
  - **Status** (somente leitura): **Vida ❤️, Força ⚔️, Intelecto 📖, Destreza ⚡** — **calculados** de `base 2 + classe + raça (animal) + bônus dos itens equipados`, não digitados. Ver `src/lib/status.ts`, `src/lib/bonusItens.ts` e [09](09-decisoes.md). A ficha mostra o bônus dos itens à parte, ex.: "6 (+2)".
- O app **desenha nome, título e status (calculado) na carta** nas posições de [11](11-carta-composicao.md).
- Cada status vai no máximo até **9** (1 dígito, cabe na caixa da carta).

### 7. Salvar
- O progresso é salvo **automaticamente** (no aparelho e, logado, no servidor) a cada mudança.
- Botão **💾 Salvar progresso** força o envio ao servidor e confirma com o horário ("✓ Progresso salvo às 13:05").
- A mesma conta (usuário + senha) abre o personagem em qualquer aparelho. *(O antigo "código de backup" foi substituído pela conta — ADR-015.)*

### 8. Enviar personagem 🎁 (a carta é surpresa)
- Botão **Enviar** — do ponto de vista do participante, ele está enviando **o personagem** (a palavra "carta" **não aparece**).
- **Envio é único e definitivo.** A confirmação deixa isso claro ("Este é o envio final do seu personagem e **não poderá ser alterado**. Deseja continuar?").
- Ao confirmar, mostra **sucesso** imediatamente e o editor **trava** (estado somente-leitura / tela de agradecimento). Não é possível reenviar.
- **Por trás, sem UI:** o app monta a carta de TCG (personagem + moldura + nome + status desenhados) e envia a **imagem** para os organizadores (ver [06](06-exportacao-carta.md)).
- **Nada da carta é exibido ou baixado** no aparelho do participante — a carta impressa é a surpresa entregue depois.
- Se o envio falhar (sem internet), o app **reenvia depois** de forma transparente (o sucesso já foi mostrado e o estado fica travado + persistido).

## Regras de negócio

| Regra | Comportamento |
|-------|---------------|
| Item bloqueado | Visível mas não selecionável até desbloqueio por código |
| Troca de classe | Confirma antes; remove itens incompatíveis da seleção |
| Troca de animal | **Zera a seleção de itens** (itens são por animal+classe) |
| Cenário | 3–4 no total; **1 liberado por dia** via código; troca livre entre os já liberados |
| Código correto | Desbloqueia o grupo do dia: itens **e** o cenário daquele dia; idempotente |
| Código do último dia | Após todos os códigos, 100% dos itens da classe + todos os cenários liberados |
| Envio | **Único e definitivo**: participante "envia o personagem" (1 vez), editor trava; carta gerada e enviada por trás (surpresa) |
| Categoria vazia | Sempre permitido ("Nenhum") |
| Sem conexão | App funciona offline após primeiro carregamento (PWA) |

## Requisitos não-funcionais

- **Mobile-first**: layout pensado primeiro para tela de celular em pé.
- **Offline**: após carregar uma vez, funciona sem internet (assets em cache).
- **Performance**: carregar só os assets da classe/animal ativos; preview fluido.
- **Compatibilidade**: Chrome (Android) e Safari (iOS) recentes; testar em aparelho real.
- **Acessibilidade básica**: contraste, alvos de toque grandes, textos legíveis.
