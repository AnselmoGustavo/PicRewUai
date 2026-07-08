// Persistência de progresso no servidor (ADR-015). Usa Supabase se configurado
// (SUPABASE_URL + SUPABASE_SERVICE_KEY); senão cai num mock em arquivo (dev).
// Importado apenas pela API route (server).
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_KEY;
const usandoSupabase = Boolean(SUPA_URL && SUPA_KEY);

const DIR = resolve(process.cwd(), ".dev-data", "progresso");

function sanitizar(codigo: string): string {
  return codigo.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export const backendProgresso = usandoSupabase ? "supabase" : "dev-file";

export async function salvarProgresso(codigo: string, estado: unknown): Promise<void> {
  const c = sanitizar(codigo);
  if (!c) throw new Error("código inválido");

  if (usandoSupabase) {
    const res = await fetch(`${SUPA_URL}/rest/v1/progresso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPA_KEY as string,
        Authorization: `Bearer ${SUPA_KEY}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify([
        { codigo: c, estado, atualizado_em: new Date().toISOString() },
      ]),
    });
    if (!res.ok) throw new Error(`supabase ${res.status}: ${await res.text()}`);
    return;
  }

  await mkdir(DIR, { recursive: true });
  await writeFile(resolve(DIR, `${c}.json`), JSON.stringify(estado));
}

export async function carregarProgresso(codigo: string): Promise<unknown | null> {
  const c = sanitizar(codigo);
  if (!c) return null;

  if (usandoSupabase) {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/progresso?codigo=eq.${c}&select=estado`,
      { headers: { apikey: SUPA_KEY as string, Authorization: `Bearer ${SUPA_KEY}` } },
    );
    if (!res.ok) throw new Error(`supabase ${res.status}`);
    const linhas = (await res.json()) as { estado: unknown }[];
    return linhas?.[0]?.estado ?? null;
  }

  try {
    const txt = await readFile(resolve(DIR, `${c}.json`), "utf8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}
