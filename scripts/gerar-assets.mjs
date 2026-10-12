// Gerador automático de assets + manifesto (ADR-016).
// Lê "Assets Prontos/", otimiza para 744x1039, agrupa as camadas de cada item,
// gera miniaturas e escreve src/lib/itens-gerados.json.
//
// Convenção (ver docs/04-guia-de-assets.md):
//   personagem pelado: animal-classe.png
//   item: animal-classe-tipo-nome-raridade-grupo-zNN.png  (camadas = mesmo nome, z diferente)
//
// Uso: npm run assets
import { createCanvas, loadImage } from "@napi-rs/canvas";
import {
  readdirSync, statSync, writeFileSync, mkdirSync, rmSync,
} from "node:fs";
import { join, basename } from "node:path";

const W = 744, H = 1039;
const RAIZ = "Assets Prontos";
const OUT = "public/assets/itens";
const JSON_SAIDA = "src/lib/itens-gerados.json";

function walk(dir) {
  let out = [];
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (/\.png$/i.test(f)) out.push(p);
  }
  return out;
}

const CONECTORES = new Set(["de", "da", "do", "dos", "das", "e"]);
function titulo(slug) {
  return slug
    .split("_")
    .map((p, i) =>
      i > 0 && CONECTORES.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1),
    )
    .join(" ");
}

async function otimizar(src, destRel) {
  const img = await loadImage(src);
  const c = createCanvas(W, H);
  c.getContext("2d").drawImage(img, 0, 0, img.width, img.height, 0, 0, W, H);
  const dest = join(OUT, destRel);
  mkdirSync(join(OUT, destRel, ".."), { recursive: true });
  writeFileSync(dest, c.toBuffer("image/png"));
}

// limpa saídas antigas
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// ---- BASES (personagem pelado) ----
const bases = {};
for (const src of walk(join(RAIZ, "personages-pelados"))) {
  const nome = basename(src, ".png"); // animal-classe
  if (!/^[a-z]+-[a-z]+$/.test(nome)) {
    console.warn(`base ignorada (nome fora do padrão): ${nome}`);
    continue;
  }
  await otimizar(src, `bases/${nome}.png`);
  bases[nome] = `/assets/itens/bases/${nome}.png`;
}

// ---- ITENS ----
const porItem = new Map(); // id -> item em construção
for (const src of walk(join(RAIZ, "itens"))) {
  const nome = basename(src, ".png");
  const p = nome.split("-");
  if (p.length !== 6 || !/^z\d+$/.test(p[5])) {
    console.warn(`item ignorado (nome fora do padrão): ${nome}`);
    continue;
  }
  const [animal, classe, tipo, nomeItem, grupo, zRaw] = p;
  const z = parseInt(zRaw.slice(1), 10);
  const id = p.slice(0, 5).join("-"); // sem o zNN
  const arquivo = `/assets/itens/${nome}.png`;
  await otimizar(src, `${nome}.png`);
  if (!porItem.has(id)) {
    porItem.set(id, {
      id, nome: titulo(nomeItem), categoria: tipo, classe, animal,
      grupo, camadas: [],
    });
  }
  porItem.get(id).camadas.push({ arquivo, z });
}

// miniaturas (compõe camadas, recorta ao conteúdo)
mkdirSync(join(OUT, "thumbs"), { recursive: true });
async function miniatura(item) {
  const full = createCanvas(W, H);
  const fctx = full.getContext("2d");
  for (const cam of [...item.camadas].sort((a, b) => a.z - b.z)) {
    fctx.drawImage(await loadImage(join("public", cam.arquivo)), 0, 0, W, H);
  }
  const d = fctx.getImageData(0, 0, W, H).data;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (d[(y * W + x) * 4 + 3] > 16) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
  if (maxX < 0) return undefined;
  const m = 6;
  minX = Math.max(0, minX - m); minY = Math.max(0, minY - m);
  maxX = Math.min(W - 1, maxX + m); maxY = Math.min(H - 1, maxY + m);
  const cw = maxX - minX + 1, ch = maxY - minY + 1;
  const s = 220 / Math.max(cw, ch);
  const tw = Math.round(cw * s), th = Math.round(ch * s);
  const t = createCanvas(tw, th);
  t.getContext("2d").drawImage(full, minX, minY, cw, ch, 0, 0, tw, th);
  writeFileSync(join(OUT, "thumbs", `${item.id}.png`), t.toBuffer("image/png"));
  return `/assets/itens/thumbs/${item.id}.png`;
}

const itens = [];
for (const item of porItem.values()) {
  item.camadas.sort((a, b) => a.z - b.z);
  item.thumb = await miniatura(item);
  itens.push(item);
}

writeFileSync(JSON_SAIDA, JSON.stringify({ bases, itens }, null, 2));
console.log(`bases: ${Object.keys(bases).length} | itens: ${itens.length} -> ${JSON_SAIDA}`);
