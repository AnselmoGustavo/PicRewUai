import { NextResponse } from "next/server";
import { registrar, entrar } from "@/lib/authServidor";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const acao = body?.acao as string | undefined;
    const usuario = body?.usuario as string | undefined;
    const senha = body?.senha;
    if (!usuario) {
      return NextResponse.json({ ok: false, erro: "Informe o usuário." }, { status: 400 });
    }
    const r = acao === "registrar" ? await registrar(usuario, senha) : acao === "entrar" ? await entrar(usuario, senha) : null;
    if (!r) return NextResponse.json({ ok: false, erro: "Ação inválida." }, { status: 400 });
    return NextResponse.json(r, { status: r.ok ? 200 : 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}
