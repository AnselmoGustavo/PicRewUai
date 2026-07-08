"use client";

import { useEffect, useRef } from "react";
import layout from "@/lib/cartaLayout.json";

export type Tema = "dia" | "noite";
export interface StatusPersonagem {
  vida: number;
  forca: number;
  intelecto: number;
  velocidade: number;
}

interface Props {
  nome: string;
  status: StatusPersonagem;
  tema: Tema;
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Placeholder do personagem (enquanto a arte da Ana Beatriz não chega). */
function desenharPlaceholderPersonagem(
  ctx: CanvasRenderingContext2D,
  tema: Tema,
) {
  const { w, h } = layout.card;

  // Fundo (cenário placeholder): gradiente claro (dia) ou escuro (noite)
  const g = ctx.createLinearGradient(0, 0, 0, h);
  if (tema === "dia") {
    g.addColorStop(0, "#cfe3f0");
    g.addColorStop(1, "#e9dcc0");
  } else {
    g.addColorStop(0, "#26304a");
    g.addColorStop(1, "#3a2f4a");
  }
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Silhueta simples do "animal" (corpo + cabeça), na região central-baixa
  ctx.fillStyle =
    tema === "dia" ? "rgba(69,117,74,0.55)" : "rgba(220,220,230,0.35)";
  const cx = w * 0.4;
  // corpo
  ctx.beginPath();
  ctx.roundRect(cx - 90, 560, 180, 300, 60);
  ctx.fill();
  // cabeça
  ctx.beginPath();
  ctx.arc(cx, 520, 90, 0, Math.PI * 2);
  ctx.fill();

  // etiqueta
  ctx.fillStyle = tema === "dia" ? "#5c5346" : "#cfc9d6";
  ctx.font = "italic 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("personagem (placeholder)", cx, 900);
}

async function desenharCarta(
  ctx: CanvasRenderingContext2D,
  nome: string,
  status: StatusPersonagem,
  tema: Tema,
) {
  const { assets, textos, preenchOpacidade, corTexto } = layout;

  const [namePreench, nameFrame, statusPreench, statusFrame, borda] =
    await Promise.all([
      carregarImagem("/assets/carta/name-preench.png"),
      carregarImagem(`/assets/carta/name-${tema}.png`),
      carregarImagem("/assets/carta/status-preench.png"),
      carregarImagem(`/assets/carta/status-${tema}.png`),
      carregarImagem(`/assets/carta/borda-${tema}.png`),
    ]);

  // 0. imagem do participante (placeholder)
  desenharPlaceholderPersonagem(ctx, tema);

  // 2. preenchimento do nome (semitransparente)
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(namePreench, assets.namePreench.x, assets.namePreench.y);
  ctx.globalAlpha = 1;

  // 3. moldura do nome
  ctx.drawImage(nameFrame, assets.nameFrame.x, assets.nameFrame.y);

  // 4. preenchimento do status — CENTRALIZADO dentro da moldura de status
  //    (o preench é menor que o frame; centralizar evita o desalinhamento)
  const spX =
    assets.statusFrame.x + (statusFrame.width - statusPreench.width) / 2;
  const spY =
    assets.statusFrame.y + (statusFrame.height - statusPreench.height) / 2;
  ctx.globalAlpha = preenchOpacidade;
  ctx.drawImage(statusPreench, spX, spY);
  ctx.globalAlpha = 1;

  // 5. moldura do status (ícones embutidos)
  ctx.drawImage(statusFrame, assets.statusFrame.x, assets.statusFrame.y);

  // 6. borda decorativa
  ctx.drawImage(borda, 0, 0, layout.card.w, layout.card.h);

  // 7 + 8. textos (nome + status), fonte Adam Script
  ctx.fillStyle = corTexto;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const n = textos.nome;
  ctx.font = `${n.fontePx}px "AdamScript"`;
  ctx.fillText(nome || "Nome", n.x + n.w / 2, n.y + n.h / 2, n.w);

  for (const s of textos.status) {
    const valor = String(status[s.key as keyof StatusPersonagem] ?? "");
    ctx.font = `${s.fontePx}px "AdamScript"`;
    ctx.fillText(valor, s.x + s.w / 2, s.y + s.h / 2, s.w);
  }
}

export default function CartaCanvas({ nome, status, tema }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      // garante a fonte carregada antes de desenhar no canvas
      try {
        const fonte = new FontFace(
          "AdamScript",
          "url(/font/AdamScript.ttf)",
        );
        await fonte.load();
        (document as unknown as { fonts: FontFaceSet }).fonts.add(fonte);
      } catch {
        /* se falhar, cai no fallback do canvas */
      }

      const canvas = ref.current;
      if (!canvas || cancelado) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await desenharCarta(ctx, nome, status, tema);
    })();
    return () => {
      cancelado = true;
    };
  }, [nome, status, tema]);

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
