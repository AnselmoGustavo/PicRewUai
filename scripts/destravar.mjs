// Destrava um participante que enviou o personagem (ex.: enviou por engano): apaga a carta
// dele (linha na tabela `cartas` + PNG no Storage) e ele volta a editar e pode enviar de novo.
// O progresso (itens, códigos, títulos) é mantido. Antes de apagar, a carta é guardada em
// cartas-destravadas/ por segurança.
//
// Uso: npm run destravar -- <usuario>
//
// No aparelho da pessoa: basta abrir o app de novo (ou recarregar a página de criar) — o app
// pergunta ao servidor e sai da tela "Personagem enviado!".
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

// encerra sem process.exit() logo após fetch (evita um erro do Node no Windows)
const falhar = () => { process.exitCode = 1; };

async function main() {
  const usuarioRaw = process.argv[2];
  if (!usuarioRaw) {
    console.error("Uso: npm run destravar -- <usuario>");
    return falhar();
  }
  const usuario = usuarioRaw.trim().toLowerCase();
  const filtro = `usuario=eq.${encodeURIComponent(usuario)}`;

  const [carta] = await (await fetch(`${URL_SUPA}/rest/v1/cartas?${filtro}&select=*`, { headers: H })).json();
  if (!carta) {
    const [conta] = await (await fetch(`${URL_SUPA}/rest/v1/usuarios?${filtro}&select=usuario`, { headers: H })).json();
    console.error(conta ? `"${usuario}" não enviou carta — já está destravado.` : `Usuário "${usuario}" não existe.`);
    return falhar();
  }

  // backup
  const DEST = "cartas-destravadas";
  mkdirSync(DEST, { recursive: true });
  const carimbo = new Date().toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(DEST, `${usuario}-${carimbo}.json`), JSON.stringify(carta, null, 2));
  const png = await fetch(`${URL_SUPA}/storage/v1/object/cartas/${carta.arquivo}`, { headers: H });
  if (png.ok) writeFileSync(join(DEST, `${usuario}-${carimbo}.png`), Buffer.from(await png.arrayBuffer()));

  // apaga PNG + linha
  const s = await fetch(`${URL_SUPA}/storage/v1/object/cartas`, {
    method: "DELETE",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: [carta.arquivo] }),
  });
  const d = await fetch(`${URL_SUPA}/rest/v1/cartas?${filtro}`, { method: "DELETE", headers: H });
  if (!d.ok) {
    console.error(`Erro ao apagar a carta: ${d.status} ${await d.text()}`);
    return falhar();
  }
  console.log(`"${usuario}" destravado (carta "${carta.nome_personagem ?? "?"}" apagada${s.ok ? "" : " — o PNG não foi apagado do Storage, apague à mão"}).`);
  console.log(`Cópia da carta antiga em ${DEST}/. A pessoa só precisa abrir o app de novo.`);
  console.log("Se você já tinha baixado as cartas, apague o PNG antigo dela de cartas-baixadas/.");
}

await main();
