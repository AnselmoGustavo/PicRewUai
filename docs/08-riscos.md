# 08 — Riscos

| # | Risco | Impacto | Prob. | Mitigação |
|---|-------|:-------:|:-----:|-----------|
| R1 | **Atraso na entrega da arte** (150 itens é bastante) | Alto | Média | Desenvolver com placeholders; congelar o guia de assets cedo; integrar arte em lotes; priorizar itens do "dia 1" primeiro |
| R2 | **Itens universais não encaixam em todos os animais** (ex.: carpa/coruja) | Alto | Média | Gabarito mestre com zonas alinhadas; **teste de validação** (1 item por categoria nos 8 animais) antes de escalar; aceitar exceções pontuais |
| R3 | **Exportação/download falha no iPhone Safari** | Alto | Média | Testar em iPhone real cedo (Fase 4); usar Web Share API + fallback de "abrir imagem e salvar" |
| R4 | **Usuário perde o personagem** (limpou navegador / trocou de aparelho) | Médio | Média | Código de backup exportável (+ QR); salvar automático; avisar sobre backup |
| R5 | **Memória insuficiente em celular antigo** ao exportar em alta resolução | Médio | Baixa | Carregar assets sob demanda; oferecer resolução padrão/alta; testar limites |
| R6 | **Wi-fi do evento cai / lento** | Médio | Média | PWA offline-first: app funciona após o primeiro carregamento |
| R7 | **Código vazado antes da hora** | Baixo | Média | Guardar hash (não texto) dos códigos; apostas baixas; opção de trocar código de última hora |
| R8 | **Alguém "trapaceia"** editando localStorage para liberar itens | Baixo | Baixa | Aceitável — é app de evento, sem competição real (decisão consciente) |
| R9 | **Campos da ficha / regras de conteúdo mudam tarde** | Médio | Média | Manifesto e ficha desacoplados do código; definir cedo com a organização |
| R10 | **Design da moldura da carta atrasa** | Médio | Média | Export funciona com moldura placeholder; janela da arte parametrizável |

## Riscos que exigem ação cedo (não esperar)

1. **R2 (encaixe universal)** — rodar o teste de validação de arte assim que houver 1 item por categoria. É o que pode obrigar a refazer arte se descoberto tarde.
2. **R3 (export no iPhone)** — validar o mecanismo de download em iPhone real antes de investir no resto do export.
3. **R1 (volume de arte)** — alinhar cronograma de entrega da arte com a ilustradora já na aprovação do guia.
