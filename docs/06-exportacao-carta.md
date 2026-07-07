# 06 — Exportação da Carta

## Objetivo

Ao clicar em **Exportar**, o personagem montado é composto dentro de uma **moldura de carta de TCG** e a imagem é salva no tamanho físico **6,3 cm × 8,8 cm** (63 × 88 mm — padrão de carta colecionável).

## Dimensões e resolução

Tamanho físico: **63 × 88 mm**. Em pixels, depende do DPI:

| DPI | Largura (px) | Altura (px) | Uso |
|-----|:------------:|:-----------:|-----|
| 300 | 744 | 1039 | Mínimo para impressão de qualidade |
| 600 | 1488 | 2079 | Impressão nítida / futura |

> **Recomendação:** produzir a arte e exportar visando **pelo menos 300 DPI** (744 × 1039). Se quisermos imprimir cartas físicas com ótima nitidez, mirar 600 DPI.

### Sangria (bleed) — se for imprimir fisicamente

Gráficas costumam pedir **3 mm de sangria** por lado. Com sangria: 69 × 94 mm → 815 × 1110 px a 300 DPI. Só necessário se houver impressão profissional; para compartilhamento digital, o tamanho sem sangria basta. **Decidir com base no uso final.**

## Anatomia da carta

```
┌─────────────────────────┐  ← moldura (frame) — arte da carta
│   [nome / título?]       │
│  ┌───────────────────┐  │
│  │                   │  │  ← janela da arte: onde o
│  │   PERSONAGEM      │  │     personagem (camadas) é desenhado
│  │   (composto)      │  │
│  │                   │  │
│  └───────────────────┘  │
│  classe · animal · ...   │  ← infos da ficha (opcional na arte)
└─────────────────────────┘
```

- A **moldura** é um PNG entregue pela ilustradora com uma **janela transparente** (ou uma área definida por coordenadas) onde o personagem entra.
- O **personagem** é o canvas mestre (ver [04](04-guia-de-assets.md)) escalado/posicionado dentro dessa janela.
- Textos da ficha (nome, classe) podem ser: (a) desenhados pelo app sobre a carta, ou (b) já fazer parte do design da moldura com espaço em branco. **A definir com o design da carta.**

## Algoritmo de exportação

```
1. Criar um canvas offscreen no tamanho-alvo (ex.: 744 × 1039 ou 1488 × 2079).
2. Desenhar o fundo da carta (se houver, atrás do personagem).
3. Desenhar as camadas do personagem, escaladas para a "janela da arte".
4. Desenhar a moldura por cima (frame com janela transparente).
5. Desenhar textos da ficha (nome, classe) se aplicável.
6. canvas.toBlob('image/png') → download / compartilhamento.
```

## Download em cada plataforma

- **Android (Chrome):** `toBlob` + link `download` funciona direto.
- **iPhone (Safari):** download de blob é problemático. Estratégias:
  - Usar a **Web Share API** (`navigator.share` com o arquivo) — abre a folha de compartilhamento nativa para salvar em Fotos.
  - Fallback: abrir a imagem em nova aba para o usuário segurar e "Salvar em Fotos".
- ⚠️ **Testar exportação em iPhone real cedo** (ver [08-riscos](08-riscos.md)).

## Qualidade e desempenho

- Exportar em alta resolução exige um canvas grande → mais memória. Em celulares antigos pode falhar; testar limites e, se preciso, oferecer resolução "padrão" e "alta".
- Renderizar a partir dos PNGs em resolução nativa (não esticar de um preview pequeno) para máxima nitidez.
- Considerar um leve indicador de "gerando imagem..." pois pode levar 1–2 s em aparelhos fracos.

## Pontos a fechar com o design da carta

- [ ] Tamanho exato da janela da arte (px) dentro da moldura.
- [ ] Quais infos da ficha aparecem na carta e onde.
- [ ] Textos desenhados pelo app ou embutidos na arte?
- [ ] Vai haver impressão física? (define necessidade de sangria/600 DPI)
- [ ] Verso da carta? (provavelmente não nesta versão)
