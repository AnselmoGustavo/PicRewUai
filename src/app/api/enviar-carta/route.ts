import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

export const runtime = "nodejs";

// MOCK DE DEV: grava a carta recebida em ./envios (gitignored) para conferência.
// Em produção, trocar por upload ao Supabase Storage + registro no Postgres
// (ver docs/06-exportacao-carta.md). O disco local é read-only na Vercel.
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const imagem = form.get("imagem");
    const meta = form.get("meta");

    if (!(imagem instanceof Blob)) {
      return NextResponse.json({ ok: false, erro: "imagem ausente" }, { status: 400 });
    }
    if (imagem.size > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, erro: "imagem muito grande" }, { status: 413 });
    }

    const dir = resolve(process.cwd(), "envios");
    await mkdir(dir, { recursive: true });

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const base = `carta-${ts}`;
    const buf = Buffer.from(await imagem.arrayBuffer());
    const caminho = resolve(dir, `${base}.png`);
    await writeFile(caminho, buf);
    if (typeof meta === "string") {
      await writeFile(resolve(dir, `${base}.json`), meta);
    }

    console.log(`[enviar-carta] carta salva em: ${caminho}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}
