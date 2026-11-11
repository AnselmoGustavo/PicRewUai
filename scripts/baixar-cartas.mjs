// Baixa TODAS as cartas enviadas (Supabase) para ./cartas-baixadas/, prontas para a gráfica.
// Também gera cartas-baixadas/cartas.csv com os dados de cada uma.
// Pula as que já foram baixadas → pode rodar várias vezes durante o evento.
//
// Uso:  npm run baixar-cartas
// Precisa de SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local (as mesmas da Vercel).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// lê o .env.local (sem dependência extra)
if (existsSync(".env.local")) {
  for (const linha of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(linha);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const URL_SUPA = process.env.SUPABASE_URL?.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
const CHAVE = process.env.SUPABASE_SERVICE_KEY;
if (!URL_SUPA || !CHAVE) {
  console.error("Faltam SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local.");
  process.exit(1);
}
const h = { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` };

const res = await fetch(`${URL_SUPA}/rest/v1/cartas?select=*&order=enviado_em.asc`, { headers: h });
if (!res.ok) {
  console.error(`Erro ao listar cartas: ${res.status} ${await res.text()}`);
  process.exit(1);
}
const cartas = await res.json();

const DEST = "cartas-baixadas";
mkdirSync(DEST, { recursive: true });

let novas = 0;
for (const c of cartas) {
  const destino = join(DEST, c.arquivo);
  if (existsSync(destino)) continue;
  const r = await fetch(`${URL_SUPA}/storage/v1/object/cartas/${c.arquivo}`, { headers: h });
  if (!r.ok) {
    console.log(`  !! ${c.arquivo}: ${r.status}`);
    continue;
  }
  writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  novas++;
  console.log(`  + ${c.arquivo}  (${c.nome_personagem ?? "?"} — ${c.animal}/${c.classe})`);
}

const csv = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const linhas = [
  "usuario,nome_personagem,titulo,animal,classe,cenario,vida,forca,intelecto,destreza,enviado_em,arquivo",
  ...cartas.map((c) =>
    [
      c.usuario, c.nome_personagem, c.titulo, c.animal, c.classe, c.cenario,
      c.status?.vida, c.status?.forca, c.status?.intelecto, c.status?.destreza,
      c.enviado_em, c.arquivo,
    ].map(csv).join(","),
  ),
];
writeFileSync(join(DEST, "cartas.csv"), "﻿" + linhas.join("\n")); // BOM → Excel abre com acento certo

console.log(`\n${cartas.length} carta(s) no total, ${novas} nova(s) baixada(s) em ${DEST}/`);
