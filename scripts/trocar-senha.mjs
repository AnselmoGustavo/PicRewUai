// Troca a senha de um participante que esqueceu (suporte durante o evento).
// O progresso e a carta continuam como estão; a pessoa entra com a senha nova.
//
// Uso: npm run trocar-senha -- <usuario> <senha-nova>
//   ex.: npm run trocar-senha -- fulano uai2026
//
// Mesmo hash do app (src/lib/authServidor.ts): pbkdf2-sha256, 100.000 iterações, salt novo.
import { existsSync, readFileSync } from "node:fs";
import { pbkdf2Sync, randomBytes } from "node:crypto";

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
const H = { apikey: CHAVE, Authorization: `Bearer ${CHAVE}`, "Content-Type": "application/json" };

// encerra sem process.exit() logo após fetch (evita um erro do Node no Windows)
const falhar = () => { process.exitCode = 1; };

async function main() {
  const [usuarioRaw, senha] = process.argv.slice(2);
  if (!usuarioRaw || !senha) {
    console.error("Uso: npm run trocar-senha -- <usuario> <senha-nova>");
    return falhar();
  }
  if (senha.length < 4 || senha.length > 100) {
    console.error("A senha precisa ter de 4 a 100 caracteres (mesma regra do app).");
    return falhar();
  }
  const usuario = usuarioRaw.trim().toLowerCase();

  const r = await fetch(
    `${URL_SUPA}/rest/v1/usuarios?usuario=eq.${encodeURIComponent(usuario)}&select=usuario,apelido`,
    { headers: H },
  );
  const [conta] = await r.json();
  if (!conta) {
    console.error(`Usuário "${usuario}" não existe. Confira a grafia (a pessoa pode ter criado com outro nome).`);
    return falhar();
  }

  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(senha, salt, 100_000, 32, "sha256").toString("hex");
  const u = await fetch(`${URL_SUPA}/rest/v1/usuarios?usuario=eq.${encodeURIComponent(usuario)}`, {
    method: "PATCH",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify({ hash, salt }),
  });
  if (!u.ok) {
    console.error(`Erro ao trocar a senha: ${u.status} ${await u.text()}`);
    return falhar();
  }
  console.log(`Senha de "${usuario}"${conta.apelido ? ` (${conta.apelido})` : ""} trocada. A pessoa já pode entrar com a senha nova.`);
}

await main();
