// Sincronização de progresso do personagem, por usuário logado (useSessao).
import { useEffect } from "react";
import { usePersonagem } from "./store";
import { useSessao } from "./sessao";
import type { EstadoPersonagem } from "./tipos";

export async function salvarProgressoRemoto(estado: EstadoPersonagem): Promise<void> {
  const { usuario, token } = useSessao.getState();
  if (!usuario || !token) return;
  try {
    await fetch("/api/progresso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, token, estado }),
    });
  } catch {
    /* offline — o localStorage mantém o estado; sincroniza na próxima mudança */
  }
}

export async function carregarProgressoRemoto(): Promise<EstadoPersonagem | null> {
  const { usuario, token } = useSessao.getState();
  if (!usuario || !token) return null;
  try {
    const q = `usuario=${encodeURIComponent(usuario)}&token=${encodeURIComponent(token)}`;
    const res = await fetch(`/api/progresso?${q}`);
    if (!res.ok) return null;
    const j = await res.json();
    return (j.estado as EstadoPersonagem) ?? null;
  } catch {
    return null;
  }
}

/** Liga a sincronização para o usuário logado: pull inicial (last-write-wins) + push com debounce. */
export function useSyncProgresso() {
  const carregarEstado = usePersonagem((s) => s.carregarEstado);
  const usuario = useSessao((s) => s.usuario);

  useEffect(() => {
    if (!usuario) return;
    let vivo = true;

    (async () => {
      const remoto = await carregarProgressoRemoto();
      if (!vivo || !remoto) return;
      const local = usePersonagem.getState();
      if ((remoto.atualizadoEm ?? 0) > (local.atualizadoEm ?? 0)) {
        carregarEstado(remoto);
      }
    })();

    let t: ReturnType<typeof setTimeout>;
    const unsub = usePersonagem.subscribe(() => {
      clearTimeout(t);
      t = setTimeout(() => salvarProgressoRemoto(usePersonagem.getState()), 1500);
    });

    return () => {
      vivo = false;
      clearTimeout(t);
      unsub();
    };
  }, [usuario, carregarEstado]);
}
