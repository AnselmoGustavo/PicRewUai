// Composição da carta no canvas (browser). Usado pelo preview do editor
// (sem moldura) e pelo envio (com moldura, offscreen). Ver docs/11-carta-composicao.md.
import layout from "./cartaLayout.json";
import { cenarioPorId, itemPorId } from "./manifesto";
import type { Categoria, Selecao } from "./tipos";

export interface DadosCarta {
  cenario: string | null;
  selecao: Selecao;
  nome: string;
  status: Record<string, number>;
}

const ORDEM: Categoria[] = [
  "vestimenta",
  "acessorio1",
  "cabeca",
  "arma",
  "acessorio2",
];

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

export async function desenharCarta(
  ctx: CanvasRenderingContext2D,
  dados: DadosCarta,
  mostrarMoldura: boolean,
) {
  const { w, h } = layout.card;
  const cen = cenarioPorId(dados.cenario);
  const tema = cen?.tema === "escuro" ? "noite" : "dia";

  ctx.clearRect(0, 0, w, h);

  // 0. cenário (placeholder = cor sólida)
  ctx.fillStyle = cen?.cor ?? (tema === "noite" ? "#26304a" : "#dce6cf");
  ctx.fillRect(0, 0, w, h);

  // 1. base do animal (silhueta placeholder)
  const cx = w * 0.4;
  ctx.fillStyle = "rgba(60,55,48,0.35)";
  ctx.beginPath();
  ctx.roundRect(cx - 90, 560, 180, 300, 60);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 520, 90, 0, Math.PI * 2);
  ctx.fill();

  // 2..6. itens selecionados, em ordem de camada
  for (const cat of ORDEM) {
    const item = itemPorId(dados.selecao[cat]);
    if (item?.cor) desenharItemPlaceholder(ctx, cat, item.cor);
  }

  // A moldura da carta só é desenhada quando pedida (envio / telas de dev).
  // No editor do participante NÃO é mostrada — a carta é surpresa.
  if (!mostrarMoldura) return;

  const [namePreench, nameFrame, statusPreench, statusFrame, borda] =
    await Promise.all([
      carregarImagem("/assets/carta/name-preench.png"),
      carregarImagem(`/assets/carta/name-${tema}.png`),
      carregarImagem("/assets/carta/status-preench.png"),
      carregarImagem(`/assets/carta/status-${tema}.png`),
      carregarImagem(`/assets/carta/borda-${tema}.png`),
    ]);

  const { assets, textos, preenchOpacidade, corTexto } = layout;

  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(namePreench, assets.namePreench.x, assets.namePreench.y);
  ctx.globalAlpha = 1;
  ctx.drawImage(nameFrame, assets.nameFrame.x, assets.nameFrame.y);

  // preenchimento de status CENTRALIZADO na moldura (asset menor que o frame)
  const spX =
    assets.statusFrame.x + (statusFrame.width - statusPreench.width) / 2;
  const spY =
    assets.statusFrame.y + (statusFrame.height - statusPreench.height) / 2;
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(statusPreench, spX, spY);
  ctx.globalAlpha = 1;
  ctx.drawImage(statusFrame, assets.statusFrame.x, assets.statusFrame.y);

  ctx.drawImage(borda, 0, 0, w, h);

  ctx.fillStyle = corTexto;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const n = textos.nome;
  ctx.font = `${n.fontePx}px "AdamScript"`;
  ctx.fillText(dados.nome || "Nome", n.x + n.w / 2, n.y + n.h / 2, n.w);
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
