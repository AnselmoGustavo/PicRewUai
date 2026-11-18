// Persistência de progresso no servidor, por USUÁRIO.
// PRODUÇÃO: tabela `progresso` no Supabase (ver supabase/schema.sql).
// DEV (sem variáveis do Supabase): arquivos em .dev-data/progresso/.
// Importado apenas pelas API routes.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { usandoSupabase, selecionar, inserir } from "./supabaseServidor";

const DIR = resolve(process.cwd(), ".dev-data", "progresso");

function sanitizar(usuario: string): string {
  return usuario.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

export const backendProgresso = usandoSupabase ? "supabase" : "dev-file";

export async function salvarProgresso(usuario: string, estado: unknown): Promise<void> {
  const u = sanitizar(usuario);
  if (!u) throw new Error("usuário inválido");

  if (usandoSupabase) {
    await inserir(
      "progresso",
      { usuario: u, estado, atualizado_em: new Date().toISOString() },
      { mesclar: true },
    );
    return;
  }

  await mkdir(DIR, { recursive: true });
  await writeFile(resolve(DIR, `${u}.json`), JSON.stringify(estado));
}

/** true se o usuário já enviou a carta (envio único — depois disso o personagem fica travado). */
export async function cartaJaEnviada(usuario: string): Promise<boolean> {
  const u = sanitizar(usuario);
  if (!u) return false;
  if (usandoSupabase) {
    const linhas = await selecionar<{ usuario: string }>("cartas", `usuario=eq.${u}&select=usuario`);
    return linhas.length > 0;
  }
  try {
    await readFile(resolve(process.cwd(), "envios", `${u}.png`));
    return true;
  } catch {
    return false;
  }
}

export async function carregarProgresso(usuario: string): Promise<unknown | null> {
  const u = sanitizar(usuario);
  if (!u) return null;

  if (usandoSupabase) {
    const linhas = await selecionar<{ estado: unknown }>("progresso", `usuario=eq.${u}&select=estado`);
    return linhas[0]?.estado ?? null;
  }

  try {
    return JSON.parse(await readFile(resolve(DIR, `${u}.json`), "utf8"));
  } catch {
    return null;
  }
}
