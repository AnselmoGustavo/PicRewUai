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
  tema: Tema;
}

export default function CartaCanvas({ nome, titulo, tema }: Props) {
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
        cenario: "cen_floresta",
        temaForcado: tema, // página de dev: força dia/noite
        selecao: { camisa: [], calca: [], arma: [], escudo: [], calcado: [], capa: [], chapeu: [], acessorio: [] },
        nome,
        titulo: titulo ?? "",
      };
      await desenharCarta(ctx, dados, true);
    })();
    return () => {
      cancelado = true;
    };
  }, [nome, titulo, tema]);

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
