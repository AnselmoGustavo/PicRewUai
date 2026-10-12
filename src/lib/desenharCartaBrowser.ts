// Composição da carta no canvas (browser). Usado pelo preview do editor
// (sem moldura) e pelo envio (com moldura, offscreen). Ver docs/11-carta-composicao.md.
import layout from "./cartaLayout.json";
import { baseDoPersonagem, cenarioPorId, itemPorId } from "./manifesto";
import type { Animal, Categoria, Classe, Selecao } from "./tipos";

export interface DadosCarta {
  animal: Animal | null;
  classe: Classe | null;
  cenario: string | null;
  selecao: Selecao;
  nome: string;
  titulo: string;
  status: Record<string, number>;
}

const CATEGORIAS_ITEM: Categoria[] = [
  "vestimenta",
  "arma",
  "cabeca",
  "acessorio1",
  "acessorio2",
];

// z global dos placeholders (quando não há camadas reais). Ver tipos.ts.
const Z_PLACEHOLDER: Record<Categoria, number> = {
  acessorio1: 35,
  acessorio2: 30,
  vestimenta: 45,
  arma: 70,
  cabeca: 80,
};

export function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function garantirFonteAdamScript(): Promise<void> {
  try {
    const fonte = new FontFace("AdamScript", "url(/font/AdamScript.ttf)");
    await fonte.load();
    (document as unknown as { fonts: FontFaceSet }).fonts.add(fonte);
  } catch {
    /* fallback do canvas */
  }
}

function desenharItemPlaceholder(
  ctx: CanvasRenderingContext2D,
  cat: Categoria,
  cor: string,
) {
  const cx = layout.card.w * 0.4;
  ctx.fillStyle = cor;
  ctx.beginPath();
  switch (cat) {
    case "vestimenta":
      ctx.roundRect(cx - 70, 630, 140, 165, 22);
      break;
    case "acessorio1":
      ctx.roundRect(cx - 100, 650, 32, 150, 14);
      break;
    case "cabeca":
      ctx.roundRect(cx - 72, 448, 144, 58, 20);
      break;
    case "arma":
      ctx.roundRect(cx + 82, 540, 28, 300, 14);
      break;
    case "acessorio2":
      ctx.arc(cx + 32, 705, 20, 0, Math.PI * 2);
      break;
  }
  ctx.fill();
}

// silhueta do corpo (quando o animal ainda não tem base real)
function desenharSilhueta(ctx: CanvasRenderingContext2D) {
  const cx = layout.card.w * 0.4;
  ctx.fillStyle = "rgba(60,55,48,0.35)";
  ctx.beginPath();
  ctx.roundRect(cx - 90, 560, 180, 300, 60);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 520, 90, 0, Math.PI * 2);
  ctx.fill();
}

// Desenha o personagem: base (imagem real ou silhueta) + camadas dos itens,
// tudo empilhado por z-index (ADR-016).
async function desenharPersonagem(
  ctx: CanvasRenderingContext2D,
  dados: DadosCarta,
) {
  const { w, h } = layout.card;
  type Camada = { z: number; render: () => void };
  const camadas: Camada[] = [];
  const cargas: Promise<void>[] = [];

  // base do animal+classe
  const baseArq = baseDoPersonagem(dados.animal, dados.classe);
  if (baseArq) {
    cargas.push(
      carregarImagem(baseArq)
        .then((img) => {
          camadas.push({ z: 20, render: () => ctx.drawImage(img, 0, 0, w, h) });
        })
        .catch(() => {
          camadas.push({ z: 20, render: () => desenharSilhueta(ctx) });
        }),
    );
  } else {
    camadas.push({ z: 20, render: () => desenharSilhueta(ctx) });
  }

  // itens selecionados
  for (const cat of CATEGORIAS_ITEM) {
    const item = itemPorId(dados.selecao[cat]);
    if (!item) continue;
    if (item.camadas?.length) {
      for (const cam of item.camadas) {
        cargas.push(
          carregarImagem(cam.arquivo)
            .then((img) => {
              camadas.push({ z: cam.z, render: () => ctx.drawImage(img, 0, 0, w, h) });
            })
            .catch(() => {}),
        );
      }
    } else if (item.cor) {
      const cor = item.cor;
      camadas.push({ z: Z_PLACEHOLDER[cat], render: () => desenharItemPlaceholder(ctx, cat, cor) });
    }
  }

  await Promise.all(cargas);
  camadas.sort((a, b) => a.z - b.z);
  for (const c of camadas) c.render();
}

export async function desenharCarta(
  ctx: CanvasRenderingContext2D,
  dados: DadosCarta,
  mostrarMoldura: boolean,
) {
  const { w, h } = layout.card;
  const cen = cenarioPorId(dados.cenario);
  const tema = cen?.tema === "escuro" ? "noite" : "dia";

  ctx.clearRect(0, 0, w, h);

  // 0. cenário — imagem real (se houver arquivo) ou cor placeholder
  if (cen?.arquivo) {
    try {
      const bg = await carregarImagem(cen.arquivo);
      ctx.drawImage(bg, 0, 0, w, h);
    } catch {
      ctx.fillStyle = cen.cor ?? "#dce6cf";
      ctx.fillRect(0, 0, w, h);
    }
  } else {
    ctx.fillStyle = cen?.cor ?? (tema === "noite" ? "#26304a" : "#dce6cf");
    ctx.fillRect(0, 0, w, h);
  }

  // 1. personagem: base + itens, empilhados por z-index
  await desenharPersonagem(ctx, dados);

  // A moldura da carta só é desenhada quando pedida (envio / telas de dev).
  // No editor do participante NÃO é mostrada — a carta é surpresa.
  if (!mostrarMoldura) return;

  const [nameFrame, statusPreench, statusFrame, borda] = await Promise.all([
    carregarImagem(`/assets/carta/name-${tema}.png`),
    carregarImagem("/assets/carta/status-preench.png"),
    carregarImagem(`/assets/carta/status-${tema}.png`),
    carregarImagem(`/assets/carta/borda-${tema}.png`),
  ]);

  const { assets, textos, preenchOpacidade, corTexto, corTextoClaro } = layout;

  // banner + linha de título (full-canvas, em 0,0)
  ctx.drawImage(nameFrame, 0, 0, w, h);

  // status: preenchimento CENTRALIZADO na moldura + moldura
  const spX =
    assets.statusFrame.x + (statusFrame.width - statusPreench.width) / 2;
  const spY =
    assets.statusFrame.y + (statusFrame.height - statusPreench.height) / 2;
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(statusPreench, spX, spY);
  ctx.globalAlpha = 1;
  ctx.drawImage(statusFrame, assets.statusFrame.x, assets.statusFrame.y);

  ctx.drawImage(borda, 0, 0, w, h);

  // textos
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // nome e título ficam sobre a ribbon/cenário (sem preenchimento) → cor acompanha o tema
  const corAdapt = tema === "noite" ? corTextoClaro : corTexto;

  const n = textos.nome;
  ctx.fillStyle = corAdapt;
  ctx.font = `${n.fontePx}px "AdamScript"`;
  ctx.fillText(dados.nome || "Nome", n.x + n.w / 2, n.y + n.h / 2, n.w);

  if (dados.titulo) {
    const t = textos.titulo;
    ctx.fillStyle = corAdapt;
    ctx.font = `${t.fontePx}px "AdamScript"`;
    ctx.fillText(dados.titulo, t.x + t.w / 2, t.y + t.h / 2, t.w);
  }

  // status ficam sobre o frame de status (claro) → cor escura
  ctx.fillStyle = corTexto;
  for (const s of textos.status) {
    ctx.font = `${s.fontePx}px "AdamScript"`;
    ctx.fillText(String(dados.status[s.key] ?? ""), s.x + s.w / 2, s.y + s.h / 2);
  }
}

/** Compõe a carta COMPLETA (com moldura) num canvas offscreen e devolve o PNG. */
export async function comporCartaBlob(dados: DadosCarta): Promise<Blob> {
  await garantirFonteAdamScript();
  const canvas = document.createElement("canvas");
  canvas.width = layout.card.w;
  canvas.height = layout.card.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d indisponível");
  await desenharCarta(ctx, dados, true);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob falhou"))),
      "image/png",
    );
  });
}
