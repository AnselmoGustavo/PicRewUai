"use client";

import { useEffect, useRef } from "react";
import layout from "@/lib/cartaLayout.json";
import {
  desenharCarta,
  garantirFonteAdamScript,
  type DadosCarta,
} from "@/lib/desenharCartaBrowser";

export type Tema = "dia" | "noite";

interface Props {
  nome: string;
  titulo?: string;
  status: { vida: number; forca: number; intelecto: number; velocidade: number };
  tema: Tema;
}

// Página de dev: usa cenários existentes só para forçar o tema dia/noite.
const CENARIO_POR_TEMA: Record<Tema, string> = {
  dia: "cen_castelo_dia",
  noite: "cen_ruinas_noite",
};

export default function CartaCanvas({ nome, titulo, status, tema }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      await garantirFonteAdamScript();
      const canvas = ref.current;
      if (!canvas || cancelado) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dados: DadosCarta = {
        animal: "veado",
        classe: "mago",
        cenario: CENARIO_POR_TEMA[tema],
        selecao: {
          vestimenta: null,
          arma: null,
          cabeca: null,
          acessorio1: null,
          acessorio2: null,
        },
        nome,
        titulo: titulo ?? "",
        status,
      };
      await desenharCarta(ctx, dados, true);
    })();
    return () => {
      cancelado = true;
    };
  }, [nome, titulo, status, tema]);

  return (
    <canvas
      ref={ref}
      width={layout.card.w}
      height={layout.card.h}
      style={{
        width: "min(90vw, 360px)",
        height: "auto",
        borderRadius: 12,
        boxShadow: "0 8px 30px rgba(43,38,32,0.35)",
      }}
    />
  );
}
