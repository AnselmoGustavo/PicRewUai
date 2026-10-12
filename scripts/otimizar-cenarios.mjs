// Gera versões web otimizadas dos cenários (originais em "Assets Prontos/Cenários",
// alta resolução) para o tamanho da carta (744x1039), em JPEG leve.
// Uso: node scripts/otimizar-cenarios.mjs
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const LARG = 744;
const ALT = 1039;
const QUALIDADE = 88;

// Conforme novos cenários ficarem prontos, adicione aqui.
const MAPA = [
  { src: "Assets Prontos/Cenários/Dia 1 - Floresta.jpg.jpeg", dest: "public/assets/cenarios/floresta.jpg" },
  { src: "Assets Prontos/Cenários/Dia 2 - Montanhas.png", dest: "public/assets/cenarios/montanhas.jpg" },
];

for (const { src, dest } of MAPA) {
  const img = await loadImage(src);
  const c = createCanvas(LARG, ALT);
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, LARG, ALT);
  mkdirSync(dirname(dest), { recursive: true });
  const buf = c.toBuffer("image/jpeg", QUALIDADE);
  writeFileSync(dest, buf);
  console.log(`gerado ${dest}  (${(buf.length / 1024).toFixed(0)} KB)`);
}
console.log("pronto.");
