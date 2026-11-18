// Sincronização de progresso do personagem, por usuário logado (useSessao).
import { useEffect, useState } from "react";
import { usePersonagem } from "./store";
import { useSessao } from "./sessao";
import type { EstadoPersonagem } from "./tipos";

/** Salva no servidor. Retorna true se gravou (false = offline/sem sessão; o localStorage mantém o estado). */
export async function salvarProgressoRemoto(estado: EstadoPersonagem): Promise<boolean> {
  const { usuario, token } = useSessao.getState();
  if (!usuario || !token) return false;
  try {
    const res = await fetch("/api/progresso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, token, estado }),
    });
    return res.ok;
  } catch {
    return false; // offline — sincroniza na próxima mudança
  }
}

export type ProgressoRemoto = { estado: EstadoPersonagem | null; enviado: boolean };

/** Lê o progresso do servidor + se a carta já foi enviada. null = offline/sem sessão. */
export async function carregarProgressoRemoto(): Promise<ProgressoRemoto | null> {
  const { usuario, token } = useSessao.getState();
  if (!usuario || !token) return null;
  try {
    const q = `usuario=${encodeURIComponent(usuario)}&token=${encodeURIComponent(token)}`;
    const res = await fetch(`/api/progresso?${q}`);
    if (!res.ok) return null;
    const j = await res.json();
    return { estado: (j.estado as EstadoPersonagem) ?? null, enviado: Boolean(j.enviado) };
  } catch {
    return null;
  }
}

/**
 * Liga a sincronização para o usuário logado: pull inicial (last-write-wins) + push com debounce.
 * Retorna true quando a checagem inicial com o servidor terminou (ou falhou por estar offline).
 * Se o servidor diz que a carta já foi enviada, marca o personagem como enviado (tela final).
 */
export function useSyncProgresso(): boolean {
  const carregarEstado = usePersonagem((s) => s.carregarEstado);
  const marcarEnviado = usePersonagem((s) => s.marcarEnviado);
  const usuario = useSessao((s) => s.usuario);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let vivo = true;

    (async () => {
      const r = await carregarProgressoRemoto();
      if (!vivo) return;
      const remoto = r?.estado;
      const local = usePersonagem.getState();
      if (remoto && (remoto.atualizadoEm ?? 0) > (local.atualizadoEm ?? 0)) {
        carregarEstado(remoto);
      }
      if (r?.enviado && !usePersonagem.getState().enviado) marcarEnviado();
      setPronto(true);
    })();

    let t: ReturnType<typeof setTimeout>;
    const unsub = usePersonagem.subscribe((s) => {
      if (s.enviado) return; // travado depois do envio
      clearTimeout(t);
      t = setTimeout(() => salvarProgressoRemoto(usePersonagem.getState()), 1500);
    });

    return () => {
      vivo = false;
      clearTimeout(t);
      unsub();
    };
  }, [usuario, carregarEstado, marcarEnviado]);

  return pronto;
}
