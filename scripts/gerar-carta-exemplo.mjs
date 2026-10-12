// Gera cartas de exemplo (dia e noite) de forma headless, para validar as
// coordenadas do doc 11 sem precisar abrir o navegador.
// Uso: npm run carta:exemplo
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import layout from "../src/lib/cartaLayout.json" with { type: "json" };

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const p = (...s) => resolve(raiz, ...s);

GlobalFonts.registerFromPath(p("public/font/AdamScript.ttf"), "AdamScript");

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function desenharFundo(ctx, tema, cenarioArquivo) {
  const { w, h } = layout.card;
  if (cenarioArquivo) {
    const bg = await loadImage(p(cenarioArquivo));
    ctx.drawImage(bg, 0, 0, w, h);
  } else {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    if (tema === "dia") {
      g.addColorStop(0, "#cfe3f0");
      g.addColorStop(1, "#e9dcc0");
    } else {
      g.addColorStop(0, "#26304a");
      g.addColorStop(1, "#3a2f4a");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // silhueta placeholder do personagem
  ctx.fillStyle =
    tema === "dia" ? "rgba(69,117,74,0.55)" : "rgba(220,220,230,0.35)";
  const cx = w * 0.4;
  roundRect(ctx, cx - 90, 560, 180, 300, 60);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 520, 90, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = tema === "dia" ? "#5c5346" : "#cfc9d6";
  ctx.font = "italic 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("personagem (placeholder)", cx, 900);
}

async function gerar(slug, tema, nome, titulo, status, cenarioArquivo) {
  const { assets, textos, preenchOpacidade, corTexto, corTextoClaro, card } =
    layout;
  const canvas = createCanvas(card.w, card.h);
  const ctx = canvas.getContext("2d");

  const [nameFrame, statusPreench, statusFrame, borda] = await Promise.all([
    loadImage(p(`public/assets/carta/name-${tema}.png`)),
    loadImage(p("public/assets/carta/status-preench.png")),
    loadImage(p(`public/assets/carta/status-${tema}.png`)),
    loadImage(p(`public/assets/carta/borda-${tema}.png`)),
  ]);

  await desenharFundo(ctx, tema, cenarioArquivo);

  // banner + linha de título (full-canvas)
  ctx.drawImage(nameFrame, 0, 0, card.w, card.h);

  const spX =
    assets.statusFrame.x + (statusFrame.width - statusPreench.width) / 2;
  const spY =
    assets.statusFrame.y + (statusFrame.height - statusPreench.height) / 2;
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(statusPreench, spX, spY);
  ctx.globalAlpha = 1;
  ctx.drawImage(statusFrame, assets.statusFrame.x, assets.statusFrame.y);

  ctx.drawImage(borda, 0, 0, card.w, card.h);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const corAdapt = tema === "noite" ? corTextoClaro : corTexto;

  const n = textos.nome;
  ctx.fillStyle = corAdapt;
  ctx.font = `${n.fontePx}px AdamScript`;
  ctx.fillText(nome, n.x + n.w / 2, n.y + n.h / 2);

  if (titulo) {
    const t = textos.titulo;
    ctx.fillStyle = corAdapt;
    ctx.font = `${t.fontePx}px AdamScript`;
    ctx.fillText(titulo, t.x + t.w / 2, t.y + t.h / 2);
  }

  ctx.fillStyle = corTexto;
  for (const s of textos.status) {
    ctx.font = `${s.fontePx}px AdamScript`;
    ctx.fillText(String(status[s.key]), s.x + s.w / 2, s.y + s.h / 2);
  }

  const saida = p(`docs/exemplos/carta-exemplo-${slug}.png`);
  writeFileSync(saida, canvas.toBuffer("image/png"));
  console.log("gerado:", saida);
}

const status = { vida: 9, forca: 7, intelecto: 5, velocidade: 8 };
// cenários reais (claros) + um exemplo noite com placeholder (sem cenário escuro ainda)
await gerar("floresta", "dia", "Fulano", "o Bravo", status, "public/assets/cenarios/floresta.jpg");
await gerar("montanhas", "dia", "Selena", "a Montanhesa", status, "public/assets/cenarios/montanhas.jpg");
await gerar("noite", "noite", "Dama da Lua", "Guardiã da Noite", status, null);
console.log("pronto.");
