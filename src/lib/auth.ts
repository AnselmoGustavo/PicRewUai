// Auth do cliente. Fala com /api/auth e guarda a sessão (useSessao).
import { useSessao } from "./sessao";

export type ResultadoAuth = { ok: true } | { ok: false; erro: string };

async function chamar(
  acao: "registrar" | "entrar",
  usuario: string,
  senha: string,
): Promise<ResultadoAuth> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao, usuario, senha }),
    });
    const r = await res.json();
    if (r.ok) {
      useSessao.getState().definir(r.usuario, r.token);
      return { ok: true };
    }
    return { ok: false, erro: r.erro ?? "Erro desconhecido." };
  } catch {
    return { ok: false, erro: "Sem conexão. Tente de novo." };
  }
}

export const registrar = (usuario: string, senha: string) => chamar("registrar", usuario, senha);
export const entrar = (usuario: string, senha: string) => chamar("entrar", usuario, senha);
export const sair = () => useSessao.getState().sair();
