import { NextResponse } from "next/server";
import { salvarProgresso, carregarProgresso } from "@/lib/progressoServidor";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const codigo = new URL(req.url).searchParams.get("codigo") ?? "";
  if (!codigo) {
    return NextResponse.json({ ok: false, erro: "codigo ausente" }, { status: 400 });
  }
  try {
    const estado = await carregarProgresso(codigo);
    return NextResponse.json({ ok: true, estado });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const codigo = body?.codigo as string | undefined;
    const estado = body?.estado;
    if (!codigo || !estado) {
      return NextResponse.json({ ok: false, erro: "payload inválido" }, { status: 400 });
    }
    await salvarProgresso(codigo, estado);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, erro: String(e) }, { status: 500 });
  }
}
