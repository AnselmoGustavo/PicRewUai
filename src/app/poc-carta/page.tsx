"use client";

import { useState } from "react";
import Link from "next/link";
import CartaCanvas, { type Tema } from "@/components/CartaCanvas";

export default function PocCartaPage() {
  const [nome, setNome] = useState("Fulano, o Bravo");
  const [tema, setTema] = useState<Tema>("dia");
  const [vida, setVida] = useState(9);
  const [forca, setForca] = useState(7);
  const [intelecto, setIntelecto] = useState(5);
  const [velocidade, setVelocidade] = useState(8);

  const numero = (setter: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(0, Math.min(99, Number(e.target.value) || 0));
    setter(v);
  };

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
      <h1 style={{ color: "var(--cor-primaria)", fontSize: "1.5rem", margin: 0 }}>
        Protótipo da carta
      </h1>
      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--cor-texto-suave)", textAlign: "center", maxWidth: 420 }}>
        Validação da composição do <a href="#">doc 11</a>: molduras reais + personagem placeholder + nome/status desenhados. (Tela de dev — na versão final a carta é surpresa.)
      </p>

      <CartaCanvas
        nome={nome}
        tema={tema}
        status={{ vida, forca, intelecto, velocidade }}
      />

      <div className="superficie" style={{ padding: "1.25rem", width: "min(92vw, 360px)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.85rem" }}>
          Nome do personagem
          <input value={nome} onChange={(e) => setNome(e.target.value)} maxLength={22} style={inp} />
        </label>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Campo label="❤️ Vida" value={vida} onChange={numero(setVida)} />
          <Campo label="⚔️ Força" value={forca} onChange={numero(setForca)} />
          <Campo label="📖 Intelecto" value={intelecto} onChange={numero(setIntelecto)} />
          <Campo label="⚡ Velocidade" value={velocidade} onChange={numero(setVelocidade)} />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem" }}>Cenário:</span>
          <button className={`botao ${tema === "dia" ? "" : "botao--secundario"}`} onClick={() => setTema("dia")} style={{ flex: 1 }}>
            ☀️ Dia (fundo claro)
          </button>
          <button className={`botao ${tema === "noite" ? "" : "botao--secundario"}`} onClick={() => setTema("noite")} style={{ flex: 1 }}>
            🌙 Noite (fundo escuro)
          </button>
        </div>
      </div>

      <Link href="/" style={{ color: "var(--cor-primaria)", fontSize: "0.9rem" }}>
        ← voltar
      </Link>
    </main>
  );
}

const inp: React.CSSProperties = {
  padding: "0.5rem 0.65rem",
  borderRadius: 8,
  border: "1px solid var(--cor-borda)",
  background: "#fff",
  fontFamily: "var(--fonte-corpo)",
  fontSize: "0.95rem",
};

function Campo({ label, value, onChange }: { label: string; value: number; onChange: React.ChangeEventHandler<HTMLInputElement> }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "0.8rem", flex: "1 1 45%" }}>
      {label}
      <input type="number" min={0} max={99} value={value} onChange={onChange} style={inp} />
    </label>
  );
}
