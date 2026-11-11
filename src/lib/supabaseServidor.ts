// Acesso ao Supabase pelo SERVIDOR (API routes), via REST — sem dependência extra.
// Usa a chave de serviço (service_role): NUNCA importar isto em componente do navegador.
// Sem SUPABASE_URL/SUPABASE_SERVICE_KEY, as API routes caem no mock em arquivo (.dev-data/, envios/).

const URL_SUPA = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const CHAVE = process.env.SUPABASE_SERVICE_KEY;

export const usandoSupabase = Boolean(URL_SUPA && CHAVE);

/** Bucket privado onde ficam as cartas (PNG). */
export const BUCKET_CARTAS = "cartas";

function cabecalhos(extra?: Record<string, string>): Record<string, string> {
  return { apikey: CHAVE as string, Authorization: `Bearer ${CHAVE}`, ...extra };
}

/** GET em uma tabela. `filtro` no formato PostgREST, ex.: "usuario=eq.joao&select=*". */
export async function selecionar<T>(tabela: string, filtro: string): Promise<T[]> {
  const res = await fetch(`${URL_SUPA}/rest/v1/${tabela}?${filtro}`, {
    headers: cabecalhos(),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`supabase select ${tabela} ${res.status}: ${await res.text()}`);
  return (await res.json()) as T[];
}

/**
 * INSERT (ou UPSERT com `mesclar`). Retorna o status HTTP:
 * 201 = criado, 409 = já existe (violação de chave única, quando sem `mesclar`).
 */
export async function inserir(
  tabela: string,
  linha: Record<string, unknown>,
  opcoes: { mesclar?: boolean } = {},
): Promise<number> {
  const res = await fetch(`${URL_SUPA}/rest/v1/${tabela}`, {
    method: "POST",
    headers: cabecalhos({
      "Content-Type": "application/json",
      Prefer: opcoes.mesclar ? "resolution=merge-duplicates,return=minimal" : "return=minimal",
    }),
    body: JSON.stringify([linha]),
  });
  if (res.status === 409) return 409;
  if (!res.ok) throw new Error(`supabase insert ${tabela} ${res.status}: ${await res.text()}`);
  return res.status;
}

/** Envia um arquivo ao Storage. `sobrescrever` = upsert. */
export async function enviarArquivo(
  bucket: string,
  caminho: string,
  dados: ArrayBuffer | Buffer,
  tipo: string,
  sobrescrever = true,
): Promise<void> {
  const res = await fetch(`${URL_SUPA}/storage/v1/object/${bucket}/${caminho}`, {
    method: "POST",
    headers: cabecalhos({ "Content-Type": tipo, "x-upsert": sobrescrever ? "true" : "false" }),
    body: dados as BodyInit,
  });
  if (!res.ok) throw new Error(`supabase storage ${res.status}: ${await res.text()}`);
}
