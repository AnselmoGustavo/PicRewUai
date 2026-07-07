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
- Logo/tema do evento.
- Botão **Criar personagem** (novo) e **Continuar** (se já existe save local).
- Campo **Restaurar por código de backup**.

### 2. Escolha de animal
- Grade com os 8 animais (sapo, macaco, raposa, gato, veado, carpa, coruja, cachorro).
- Prévia do corpo base ao selecionar.
- O animal pode ser trocado depois sem perder itens escolhidos (itens são universais).

### 3. Escolha de classe
- 5 classes (guerreiro, arqueiro, mago, bardo, ninja), cada uma com ícone/descrição curta.
- **Aviso importante:** trocar de classe **pode remover itens já escolhidos** que não pertencem à nova classe (confirmar com o usuário antes de trocar).

### 4. Editor (picrew) — tela principal
- **Área de preview**: a carta renderizada em tempo real (cenário + personagem + moldura).
- **Abas de categoria**: **cenário**, vestimenta, arma, item de cabeça, acessório 1, acessório 2.
- **Cenário**: escolha do fundo (não depende de classe). **3 a 4 cenários**, liberados **1 por dia** via código. O cenário define se a moldura fica dia/noite (ver [11](11-carta-composicao.md)) — mas isso é interno; o participante só escolhe o fundo.
- Ao abrir uma categoria de item, mostra os itens **daquela classe**:
  - Itens **desbloqueados**: selecionáveis.
  - Itens **bloqueados**: aparecem esmaecidos com um cadeado 🔒 (mostrar que existem, mas indisponíveis — cria expectativa/coleção).
  - Opção **"Nenhum"** para não usar item naquela categoria.
- Botão para **trocar animal** e **trocar classe**.
- Ações: **Inserir código**, **Ficha**, **Salvar/Backup**, **Enviar** (personagem).

### 5. Inserir código
- Campo de texto para o código do dia.
- Ao validar um código correto:
  - Libera o conjunto de itens correspondente.
  - Feedback visual claro ("Itens do Dia 2 desbloqueados! +6 itens").
  - Persiste o desbloqueio no save local.
- Código inválido → mensagem de erro amigável.
- Código já usado → informar que já está ativo (idempotente).

### 6. Ficha de personagem
- Formulário com os dados do personagem.
- Campos definidos até agora:
  - **Nome do personagem** (texto, escrito pelo participante) — vai na carta (fonte Adam Script)
  - **Animal** e **Classe** (preenchidos automaticamente)
  - **Status** — 4 valores **escritos pelo participante**: **Vida ❤️, Força ⚔️, Intelecto 📖, Velocidade ⚡** — vão na carta
  - **Habilidade** (opcional) — campo de texto; **não** vai na carta
- Nome e os 4 status são **digitados pelo participante** e enviados junto com a imagem (JSON) — ver [05](05-modelo-de-dados.md) e posições na carta em [11](11-carta-composicao.md).
- Validar entrada dos status (ex.: numéricos, faixa/limite de dígitos — a caixa na carta comporta ~1–2 dígitos, ver [11](11-carta-composicao.md)).

### 7. Salvar / Código de backup
- O save é **automático** no `localStorage` a cada mudança.
- Botão **Gerar código de backup**: gera uma string que representa todo o estado do personagem.
- O usuário pode copiar esse código e colar em outro dispositivo (tela inicial → restaurar).
- Ver formato em [05-modelo-de-dados](05-modelo-de-dados.md).

### 8. Enviar personagem 🎁 (a carta é surpresa)
- Botão **Enviar** — do ponto de vista do participante, ele está enviando **o personagem** (a palavra "carta" **não aparece**).
- Pede uma **confirmação** ("Deseja enviar seu personagem? Não dá pra editar depois." — ou similar).
- Ao confirmar, mostra **sucesso** imediatamente.
- **Por trás, sem UI:** o app monta a carta de TCG (personagem + moldura + nome + status) e envia a **imagem + JSON** para os organizadores (ver [06](06-exportacao-carta.md)).
- **Nada da carta é exibido ou baixado** no aparelho do participante — a carta impressa é a surpresa entregue depois.
- Se o envio falhar (sem internet), o app **reenvia depois** de forma transparente (o sucesso já foi mostrado).

## Regras de negócio

| Regra | Comportamento |
|-------|---------------|
| Item bloqueado | Visível mas não selecionável até desbloqueio por código |
| Troca de classe | Confirma antes; remove itens incompatíveis da seleção |
| Troca de animal | Livre; mantém itens (são universais) |
| Cenário | 3–4 no total; **1 liberado por dia** via código; troca livre entre os já liberados |
| Código correto | Desbloqueia o grupo do dia: itens **e** o cenário daquele dia; idempotente |
| Código do último dia | Após todos os códigos, 100% dos itens da classe + todos os cenários liberados |
| Envio | Participante "envia o personagem"; carta gerada e enviada por trás (surpresa) |
| Categoria vazia | Sempre permitido ("Nenhum") |
| Sem conexão | App funciona offline após primeiro carregamento (PWA) |

## Requisitos não-funcionais

- **Mobile-first**: layout pensado primeiro para tela de celular em pé.
- **Offline**: após carregar uma vez, funciona sem internet (assets em cache).
- **Performance**: carregar só os assets da classe/animal ativos; preview fluido.
- **Compatibilidade**: Chrome (Android) e Safari (iOS) recentes; testar em aparelho real.
- **Acessibilidade básica**: contraste, alvos de toque grandes, textos legíveis.
