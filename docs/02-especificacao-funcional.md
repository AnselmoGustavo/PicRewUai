# 02 — Especificação Funcional

Descreve **o que** o app faz, tela a tela e fluxo a fluxo. (O **como** técnico está em [03-arquitetura-tecnica](03-arquitetura-tecnica.md).)

## Fluxo geral

```
Início → Escolher animal → Escolher classe → Editor (picrew) ⇄ Ficha
                                                  │
                                                  ├── Inserir código (desbloquear itens)
                                                  ├── Salvar / código de backup
                                                  └── Exportar carta
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
- **Área de preview**: o personagem renderizado em tempo real (camadas empilhadas).
- **Abas de categoria**: vestimenta, arma, item de cabeça, acessório 1, acessório 2.
- Ao abrir uma categoria, mostra os itens **daquela classe**:
  - Itens **desbloqueados**: selecionáveis.
  - Itens **bloqueados**: aparecem esmaecidos com um cadeado 🔒 (mostrar que existem, mas indisponíveis — cria expectativa/coleção).
  - Opção **"Nenhum"** para não usar item naquela categoria.
- Botão para **trocar animal** e **trocar classe**.
- Ações: **Inserir código**, **Ficha**, **Salvar/Backup**, **Exportar**.

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
  - **Nome do personagem** (texto) — aparece na carta
  - **Animal** (preenchido automaticamente)
  - **Classe** (preenchida automaticamente)
  - **Status** (a definir com a organização — ex.: atributos/estado do personagem)
  - **Habilidade** (a definir — campo de "habilidade" do personagem)
- Nome do personagem, classe, status e habilidade **entram na carta exportada** — definir com o design da carta onde/como cada um aparece.

### 7. Salvar / Código de backup
- O save é **automático** no `localStorage` a cada mudança.
- Botão **Gerar código de backup**: gera uma string que representa todo o estado do personagem.
- O usuário pode copiar esse código e colar em outro dispositivo (tela inicial → restaurar).
- Ver formato em [05-modelo-de-dados](05-modelo-de-dados.md).

### 8. Exportar carta
- Compõe o personagem dentro da moldura de carta TCG.
- Gera imagem PNG no tamanho 63 × 88 mm (ver [06-exportacao-carta](06-exportacao-carta.md)).
- Em Android: download direto.
- Em iPhone/Safari: pode exigir abrir a imagem e usar "compartilhar/salvar" — tratado no código.

## Regras de negócio

| Regra | Comportamento |
|-------|---------------|
| Item bloqueado | Visível mas não selecionável até desbloqueio por código |
| Troca de classe | Confirma antes; remove itens incompatíveis da seleção |
| Troca de animal | Livre; mantém itens (são universais) |
| Código correto | Desbloqueia grupo de itens; idempotente |
| Código do último dia | Após todos os códigos, 100% dos itens da classe liberados |
| Categoria vazia | Sempre permitido ("Nenhum") |
| Sem conexão | App funciona offline após primeiro carregamento (PWA) |

## Requisitos não-funcionais

- **Mobile-first**: layout pensado primeiro para tela de celular em pé.
- **Offline**: após carregar uma vez, funciona sem internet (assets em cache).
- **Performance**: carregar só os assets da classe/animal ativos; preview fluido.
- **Compatibilidade**: Chrome (Android) e Safari (iOS) recentes; testar em aparelho real.
- **Acessibilidade básica**: contraste, alvos de toque grandes, textos legíveis.
