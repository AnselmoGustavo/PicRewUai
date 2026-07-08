"use client";

import { useEffect, useRef } from "react";
import layout from "@/lib/cartaLayout.json";
import { usePersonagem } from "@/lib/store";
import { desenharCarta, garantirFonteAdamScript } from "@/lib/desenharCartaBrowser";

export default function PreviewCarta({
  mostrarMoldura = false,
}: {
  mostrarMoldura?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cenario = usePersonagem((s) => s.cenario);
  const selecao = usePersonagem((s) => s.selecao);
  const ficha = usePersonagem((s) => s.ficha);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      await garantirFonteAdamScript();
      const canvas = ref.current;
      if (!canvas || cancelado) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await desenharCarta(
        ctx,
        {
          cenario,
          selecao,
          nome: ficha.nomePersonagem,
          status: ficha.status as unknown as Record<string, number>,
        },
        mostrarMoldura,
      );
    })();
    return () => {
      cancelado = true;
    };
  }, [cenario, selecao, ficha, mostrarMoldura]);

  return (
    <canvas
      ref={ref}
      width={layout.card.w}
      height={layout.card.h}
      style={{
        width: "100%",
        maxWidth: 320,
        height: "auto",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(43,38,32,0.3)",
      }}
    />
  );
}
