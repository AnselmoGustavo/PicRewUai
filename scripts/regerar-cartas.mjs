// Regera cartas JÁ ENVIADAS a partir do que está salvo no Supabase (tabela `cartas` + `progresso`),
// usando o tema/moldura ATUAL de cada cenário. Útil quando muda algo na composição depois que
// pessoas já enviaram (ex.: a Floresta passou a ser "escuro" → moldura de noite).
//
// Uso:
//   npm run regerar-cartas -- --cenario cen_floresta          -> só gera prévias em cartas-regeradas/
//   npm run regerar-cartas -- --usuario jules --usuario santhi -> idem, por usuário
//   ... --enviar                                               -> SUBSTITUI o PNG no Storage
// Antes de --enviar, a versão antiga de cada carta é guardada em cartas-regeradas/antigas/.
//
// Espelha src/lib/desenharCartaBrowser.ts (mesma ordem de camadas e posições de cartaLayout.json).
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---- configuração ----
if (existsSync(".env.local")) {
  for (const l of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(l);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const URL_SUPA = process.env.SUPABASE_URL?.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const CHAVE = process.env.SUPABASE_SERVICE_KEY;
if (!URL_SUPA || !CHAVE) {
  console.error("Faltam SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local.");
  process.exit(1);
}
const H = { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` };

const args = process.argv.slice(2);
const valores = (flag) => args.flatMap((a, i) => (a === flag ? [args[i + 1]] : []));
const filtroUsuarios = valores("--usuario");
const filtroCenarios = valores("--cenario");
const enviar = args.includes("--enviar");
if (!filtroUsuarios.length && !filtroCenarios.length) {
  console.error("Informe --usuario <nome> e/ou --cenario <id> (ex.: --cenario cen_floresta).");
  process.exit(1);
}

const layout = JSON.parse(readFileSync("src/lib/cartaLayout.json", "utf8"));
const gerados = JSON.parse(readFileSync("src/lib/itens-gerados.json", "utf8"));
const ITENS = new Map(gerados.itens.map((i) => [i.id, i]));

// cenários: lidos do manifesto.ts (fonte da verdade)
const CENARIOS = new Map(
  [...readFileSync("src/lib/manifesto.ts", "utf8").matchAll(/\{\s*id:\s*"(cen_[^"]+)"[^}]*\}/g)].map((m) => [
    m[1],
    {
      tema: /tema:\s*"(\w+)"/.exec(m[0])?.[1],
      arquivo: /arquivo:\s*"([^"]+)"/.exec(m[0])?.[1],
      cor: /cor:\s*"([^"]+)"/.exec(m[0])?.[1],
    },
  ]),
);

GlobalFonts.registerFromPath("public/font/AdamScript.ttf", "AdamScript");
const pub = (p) => join("public", p);

// ---- composição (igual ao navegador) ----
async function comporCarta({ animal, classe, cenario, selecao, nome, titulo, status }) {
  const { w, h } = layout.card;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  const cen = CENARIOS.get(cenario);
  const tema = cen?.tema === "escuro" ? "noite" : "dia";

  if (cen?.arquivo) ctx.drawImage(await loadImage(pub(cen.arquivo)), 0, 0, w, h);
  else {
    ctx.fillStyle = cen?.cor ?? "#dce6cf";
    ctx.fillRect(0, 0, w, h);
  }

  const camadas = [];
  const base = gerados.bases[`${animal}-${classe}`];
  if (base) camadas.push({ z: 20, arq: base });
  // seleção nova (listas) ou antiga (1 id por tipo); escudo antigo era arma
  const ids = Object.values(selecao ?? {}).flat().filter(Boolean)
    .map((id) => id.replace("-arma-escudo_", "-escudo-escudo_"));
  for (const id of ids) {
    const item = ITENS.get(id);
    for (const c of item?.camadas ?? []) camadas.push({ z: c.z, arq: c.arquivo });
  }
  const imgs = await Promise.all(camadas.map((c) => loadImage(pub(c.arq))));
  camadas
    .map((c, i) => ({ ...c, img: imgs[i] }))
    .sort((a, b) => a.z - b.z)
    .forEach((c) => ctx.drawImage(c.img, 0, 0, w, h));

  const [nameFrame, statusPreench, statusFrame, borda] = await Promise.all([
    loadImage(pub(`/assets/carta/name-${tema}.png`)),
    loadImage(pub("/assets/carta/status-preench.png")),
    loadImage(pub(`/assets/carta/status-${tema}.png`)),
    loadImage(pub(`/assets/carta/borda-${tema}.png`)),
  ]);
  const { assets, textos, preenchOpacidade, corTexto, corTextoClaro, sombraNoite } = layout;
  ctx.drawImage(nameFrame, 0, 0, w, h);
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(
    statusPreench,
    assets.statusFrame.x + (statusFrame.width - statusPreench.width) / 2,
    assets.statusFrame.y + (statusFrame.height - statusPreench.height) / 2,
  );
  ctx.globalAlpha = 1;
  ctx.drawImage(statusFrame, assets.statusFrame.x, assets.statusFrame.y);
  ctx.drawImage(borda, 0, 0, w, h);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const noite = tema === "noite";
  const corAdapt = noite ? corTextoClaro : corTexto;
  if (noite) {
    ctx.shadowColor = sombraNoite.cor;
    ctx.shadowBlur = sombraNoite.blur;
  }
  const n = textos.nome;
  ctx.fillStyle = corAdapt;
  ctx.font = `${n.fontePx}px AdamScript`;
  ctx.fillText(nome || "Nome", n.x + n.w / 2, n.y + n.h / 2, n.w);
  if (titulo) {
    const t = textos.titulo;
    ctx.font = `${t.fontePx}px AdamScript`;
    ctx.fillText(titulo, t.x + t.w / 2, t.y + t.h / 2, t.w);
  }
  ctx.fillStyle = noite ? corTextoClaro : corTexto;
  for (const s of textos.status) {
    ctx.font = `${s.fontePx}px AdamScript`;
    ctx.fillText(String(status?.[s.key] ?? ""), s.x + s.w / 2, s.y + s.h / 2);
  }
  return canvas.toBuffer("image/png");
}

// ---- execução ----
const get = async (q) => {
  const r = await fetch(`${URL_SUPA}/rest/v1/${q}`, { headers: H });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
};
let cartas = await get("cartas?select=*");
cartas = cartas.filter(
  (c) => filtroUsuarios.includes(c.usuario) || (c.cenario && filtroCenarios.includes(c.cenario)),
);
if (!cartas.length) {
  console.log("Nenhuma carta encontrada com esse filtro.");
  process.exit(0);
}

const DEST = "cartas-regeradas";
mkdirSync(join(DEST, "antigas"), { recursive: true });

for (const c of cartas) {
  const [prog] = await get(`progresso?usuario=eq.${c.usuario}&select=estado`);
  const e = prog?.estado;
  if (!e?.selecao) {
    console.log(`  !! ${c.usuario}: sem progresso salvo — não dá para regerar`);
    continue;
  }
  const png = await comporCarta({
    animal: c.animal ?? e.animal,
    classe: c.classe ?? e.classe,
    cenario: c.cenario ?? e.cenario,
    selecao: e.selecao,
    nome: c.nome_personagem ?? e.ficha?.nomePersonagem,
    titulo: c.titulo ?? e.ficha?.titulo,
    status: c.status,
  });
  writeFileSync(join(DEST, c.arquivo), png);
  console.log(`  ok ${c.usuario} (${c.nome_personagem}, ${c.cenario}) -> ${DEST}/${c.arquivo}`);

  if (enviar) {
    const antiga = await fetch(`${URL_SUPA}/storage/v1/object/cartas/${c.arquivo}`, { headers: H });
    if (antiga.ok) writeFileSync(join(DEST, "antigas", c.arquivo), Buffer.from(await antiga.arrayBuffer()));
    const r = await fetch(`${URL_SUPA}/storage/v1/object/cartas/${c.arquivo}`, {
      method: "POST",
      headers: { ...H, "Content-Type": "image/png", "x-upsert": "true" },
      body: png,
    });
    console.log(r.ok ? "     substituída no Storage" : `     !! falha ao enviar: ${r.status} ${await r.text()}`);
  }
}
console.log(enviar ? "\nPronto. Rode `npm run baixar-cartas` apagando as antigas de cartas-baixadas/." : "\n(prévia — confira e rode de novo com --enviar para substituir)");
