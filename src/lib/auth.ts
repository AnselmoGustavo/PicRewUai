// Auth do cliente. Fala com /api/auth e guarda a sessão (useSessao).
import { useSessao } from "./sessao";
import { usePersonagem } from "./store";

export type ResultadoAuth = { ok: true } | { ok: false; erro: string };

async function chamar(
  acao: "registrar" | "entrar",
  usuario: string,
  senha: string,
  apelido?: string,
): Promise<ResultadoAuth> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acao, usuario, senha, apelido }),
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

export const registrar = (usuario: string, senha: string, apelido: string) =>
  chamar("registrar", usuario, senha, apelido);
export const entrar = (usuario: string, senha: string) => chamar("entrar", usuario, senha);
// ao sair, limpa também o personagem guardado neste aparelho (outra pessoa pode entrar depois;
// o progresso de quem saiu continua salvo no servidor e volta quando ela entrar de novo)
export const sair = () => {
  useSessao.getState().sair();
  usePersonagem.getState().resetar();
};
