// Composição da carta no canvas (browser). Usado pelo preview do editor
// (sem moldura) e pelo envio (com moldura, offscreen). Ver docs/11-carta-composicao.md.
import layout from "./cartaLayout.json";
import { baseDoPersonagem, cenarioPorId, itemPorId } from "./manifesto";
import { statusDe } from "./status";
import { CATEGORIAS, Z_POR_TIPO } from "./tipos";
import type { Animal, Categoria, Classe, Selecao, Status } from "./tipos";

export interface DadosCarta {
  animal: Animal | null;
  classe: Classe | null;
  cenario: string | null;
  selecao: Selecao;
  nome: string;
  titulo: string;
  /** só p/ a página de dev: força dia/noite independente do cenário */
  temaForcado?: "dia" | "noite";
}

const CATEGORIAS_ITEM: Categoria[] = CATEGORIAS.map((c) => c.id);

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
    case "camisa":
      ctx.roundRect(cx - 70, 630, 140, 100, 22);
      break;
    case "calca":
      ctx.roundRect(cx - 70, 730, 140, 90, 18);
      break;
    case "calcado":
      ctx.roundRect(cx - 75, 830, 150, 30, 12);
      break;
    case "capa":
      ctx.roundRect(cx - 100, 650, 32, 150, 14);
      break;
    case "chapeu":
      ctx.roundRect(cx - 72, 448, 144, 58, 20);
      break;
    case "arma":
      ctx.roundRect(cx + 82, 540, 28, 300, 14);
      break;
    case "escudo":
      ctx.roundRect(cx + 60, 640, 90, 110, 30);
      break;
    case "acessorio":
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
   for (const idItem of dados.selecao[cat] ?? []) {
    const item = itemPorId(idItem);
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
      camadas.push({ z: Z_POR_TIPO[cat], render: () => desenharItemPlaceholder(ctx, cat, cor) });
    }
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
  const tema = dados.temaForcado ?? (cen?.tema === "escuro" ? "noite" : "dia");

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

  const { assets, textos, preenchOpacidade, corTexto, corTextoClaro, sombraNoite } = layout;

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

  // nome e título ficam sobre a ribbon/cenário (sem preenchimento) → cor acompanha o tema.
  // Na noite o texto é claro + sombra escura, para ler tanto sobre partes claras quanto escuras.
  const noite = tema === "noite";
  const corAdapt = noite ? corTextoClaro : corTexto;
  if (noite) {
    ctx.shadowColor = sombraNoite.cor;
    ctx.shadowBlur = sombraNoite.blur;
  }

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

  // status: escuros no dia; claros (com a mesma sombra) na noite
  ctx.fillStyle = noite ? corTextoClaro : corTexto;
  const status = statusDe(dados.animal, dados.classe, dados.selecao);
  for (const s of textos.status) {
    ctx.font = `${s.fontePx}px "AdamScript"`;
    ctx.fillText(String(status[s.key as keyof Status]), s.x + s.w / 2, s.y + s.h / 2);
  }
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
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
