# PicRewUai 🎴

Criador de personagens (picrew) temático de RPG para o evento **UAI 2026** (19–22 de novembro).
Além de montar o personagem, o app funciona como **ficha de personagem** e permite **exportar o resultado como uma carta de TCG** (63 × 88 mm).

É um **web app** (funciona em Android e iPhone pelo navegador), disponível durante o mês de novembro apenas para o evento.

---

## Visão rápida

| Item | Decisão |
|------|---------|
| Plataforma | Web app (PWA), roda no navegador de qualquer celular |
| Stack | Next.js + React + TypeScript + Canvas API |
| Persistência | `localStorage` + **código de backup** exportável (montagem funciona offline) |
| Backend | Só um endpoint de upload para coletar as cartas (Vercel Function + storage) |
| Hospedagem | Vercel free tier |
| Identidade | Tema único · primária verde `#45754a` · Poppins + Arcane Fable |
| Assets | **Universais** — o mesmo item serve para os 8 animais |
| Animais | 8: sapo, macaco, raposa, gato, veado, carpa, coruja, cachorro |
| Classes | 5: guerreiro, arqueiro, mago, bardo, ninja |
| Categorias de item | vestimenta, arma, item de cabeça, acessório 1, acessório 2 |
| Desbloqueio | Códigos diários iguais para todos, validados no app |
| Exportação | Carta TCG 63 × 88 mm (com sangria, 600 DPI) → salva no aparelho **e** enviada para impressão física |

**Prazo de entrega:** app pronto até **31/10/2026**.

---

## Documentação

Toda a documentação vive em [`docs/`](docs/):

1. [Visão e escopo](docs/01-visao-e-escopo.md)
2. [Especificação funcional](docs/02-especificacao-funcional.md)
3. [Arquitetura técnica](docs/03-arquitetura-tecnica.md)
4. [Guia de assets (para a ilustradora)](docs/04-guia-de-assets.md) ⭐
5. [Modelo de dados, códigos e save](docs/05-modelo-de-dados.md)
6. [Exportação da carta](docs/06-exportacao-carta.md)
7. [Roadmap e cronograma](docs/07-roadmap-e-cronograma.md)
8. [Riscos](docs/08-riscos.md)
9. [Registro de decisões (ADR)](docs/09-decisoes.md)
10. [Identidade visual](docs/10-identidade-visual.md)

> ⭐ O **guia de assets** é o documento mais urgente: ele precisa ser combinado com a ilustradora **antes** de ela produzir a arte em volume, porque define tamanho de canvas, ancoragem e ordem das camadas.

---

## Status do projeto

🟡 **Fase de planejamento** — documentação inicial criada. Próximo passo: scaffold do projeto Next.js + prova de conceito de renderização em camadas.
