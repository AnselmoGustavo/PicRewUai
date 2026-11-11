import { NextResponse } from "next/server";
import { salvarProgresso, carregarProgresso } from "@/lib/progressoServidor";
import { validarToken } from "@/lib/authServidor";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const usuario = url.searchParams.get("usuario") ?? "";
  const token = url.searchParams.get("token") ?? "";
  if (!usuario || !token) {
    return NextResponse.json({ ok: false, erro: "credenciais ausentes" }, { status: 400 });
  }
  if (!(await validarToken(usuario, token))) {
    return NextResponse.json({ ok: false, erro: "não autorizado" }, { status: 401 });
  }
  try {
    const estado = await carregarProgresso(usuario);
    return NextResponse.json({ ok: true, estado });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const usuario = body?.usuario as string | undefined;
    const token = body?.token as string | undefined;
    const estado = body?.estado;
    if (!usuario || !token || !estado) {
      return NextResponse.json({ ok: false, erro: "payload inválido" }, { status: 400 });
    }
    if (!(await validarToken(usuario, token))) {
      return NextResponse.json({ ok: false, erro: "não autorizado" }, { status: 401 });
    }
    await salvarProgresso(usuario, estado);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}
