// Cliente de sincronização de progresso (ADR-015).
import { useEffect } from "react";
import { usePersonagem } from "./store";
import { normalizarCodigo } from "./codigoPessoal";
import type { EstadoPersonagem } from "./tipos";

export async function salvarProgressoRemoto(estado: EstadoPersonagem): Promise<void> {
  if (!estado.codigoPessoal) return;
  try {
    await fetch("/api/progresso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo: estado.codigoPessoal, estado }),
    });
  } catch {
    /* offline — o localStorage mantém o estado; sincroniza na próxima mudança */
  }
}

export async function carregarProgressoRemoto(
  codigo: string,
): Promise<EstadoPersonagem | null> {
  try {
    const res = await fetch(`/api/progresso?codigo=${encodeURIComponent(codigo)}`);
    if (!res.ok) return null;
    const j = await res.json();
    return (j.estado as EstadoPersonagem) ?? null;
  } catch {
    return null;
  }
}

/** Recupera um personagem por código (usado na tela inicial). */
export async function recuperarPorCodigo(codigo: string): Promise<boolean> {
  const c = normalizarCodigo(codigo);
  const remoto = await carregarProgressoRemoto(c);
  if (!remoto) return false;
  usePersonagem.getState().carregarEstado({ ...remoto, codigoPessoal: c });
  return true;
}

/**
 * Liga a sincronização: garante o código pessoal, adota a versão do servidor se
 * for mais recente e salva (com debounce) a cada mudança. Usar em /criar.
 */
export function useSyncProgresso() {
  const carregarEstado = usePersonagem((s) => s.carregarEstado);
  const garantirCodigoPessoal = usePersonagem((s) => s.garantirCodigoPessoal);

  useEffect(() => {
    let vivo = true;
    const codigo = garantirCodigoPessoal();

    // pull inicial: adota o servidor se estiver mais recente (last-write-wins)
    (async () => {
      const remoto = await carregarProgressoRemoto(codigo);
      if (!vivo || !remoto) return;
      const local = usePersonagem.getState();
      if ((remoto.atualizadoEm ?? 0) > (local.atualizadoEm ?? 0)) {
        carregarEstado({ ...remoto, codigoPessoal: codigo });
      }
    })();

    // push com debounce a cada mudança
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
  }, [carregarEstado, garantirCodigoPessoal]);
}
