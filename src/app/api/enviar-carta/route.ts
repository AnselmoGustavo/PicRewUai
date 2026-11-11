import { NextResponse } from "next/server";
import { writeFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { validarToken, normalizarUsuario } from "@/lib/authServidor";
import {
  usandoSupabase,
  selecionar,
  inserir,
  enviarArquivo,
  BUCKET_CARTAS,
} from "@/lib/supabaseServidor";

export const runtime = "nodejs";

// Recebe a carta final (PNG composto no navegador) — 1 envio por usuário.
// PRODUÇÃO: PNG no Storage (bucket "cartas", arquivo <usuario>.png) + linha na tabela `cartas`.
// DEV (sem Supabase): grava em ./envios (gitignored).
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const imagem = form.get("imagem");
    const metaTxt = form.get("meta");

    if (!(imagem instanceof Blob)) {
      return NextResponse.json({ ok: false, erro: "imagem ausente" }, { status: 400 });
    }
    // a Vercel limita o corpo da requisição a ~4,5 MB; a carta tem ~1,6 MB
    if (imagem.size > 4 * 1024 * 1024) {
      return NextResponse.json({ ok: false, erro: "imagem muito grande" }, { status: 413 });
    }

    let meta: Record<string, unknown> = {};
    try {
      meta = typeof metaTxt === "string" ? JSON.parse(metaTxt) : {};
    } catch {
      return NextResponse.json({ ok: false, erro: "meta inválido" }, { status: 400 });
    }
    const usuario = normalizarUsuario(String(meta.usuario ?? ""));
    const token = String(form.get("token") ?? "");
    if (!usuario || !(await validarToken(usuario, token))) {
      return NextResponse.json({ ok: false, erro: "não autorizado" }, { status: 401 });
    }

    const buf = Buffer.from(await imagem.arrayBuffer());

    if (usandoSupabase) {
      // envio único: se já existe, responde OK (ex.: a 1ª resposta se perdeu e a pessoa tentou de novo)
      const ja = await selecionar<{ usuario: string }>("cartas", `usuario=eq.${usuario}&select=usuario`);
      if (ja.length) return NextResponse.json({ ok: true, jaEnviado: true });

      const arquivo = `${usuario}.png`;
      await enviarArquivo(BUCKET_CARTAS, arquivo, buf, "image/png", true);
      const status = await inserir("cartas", {
        usuario,
        arquivo,
        nome_personagem: meta.nomePersonagem ?? null,
        titulo: meta.titulo ?? null,
        animal: meta.animal ?? null,
        classe: meta.classe ?? null,
        cenario: meta.cenario ?? null,
        status: meta.status ?? null,
      });
      return NextResponse.json({ ok: true, jaEnviado: status === 409 });
    }

    // ---- mock de dev ----
    const dir = resolve(process.cwd(), "envios");
    await mkdir(dir, { recursive: true });
    if ((await readdir(dir)).includes(`${usuario}.png`)) {
      return NextResponse.json({ ok: true, jaEnviado: true });
    }
    await writeFile(resolve(dir, `${usuario}.png`), buf);
    await writeFile(resolve(dir, `${usuario}.json`), JSON.stringify(meta, null, 2));
    console.log(`[enviar-carta] carta de ${usuario} salva em envios/`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[enviar-carta]", e);
    return NextResponse.json({ ok: false, erro: "falha ao salvar" }, { status: 500 });
  }
}
