"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recuperarPorCodigo } from "@/lib/sync";

export default function RecuperarCodigo() {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function recuperar() {
    if (!codigo.trim() || carregando) return;
    setErro(null);
    setCarregando(true);
    const ok = await recuperarPorCodigo(codigo);
    setCarregando(false);
    if (ok) router.push("/criar");
    else setErro("Não encontramos esse código. Confira e tente de novo.");
  }

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)} style={{ background: "none", border: "none", color: "var(--cor-primaria)", textDecoration: "underline", cursor: "pointer", fontSize: "0.85rem" }}>
        Já tenho um código
      </button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "min(90vw, 300px)" }}>
      <input
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        placeholder="ex.: raposa-7k3q"
        onKeyDown={(e) => e.key === "Enter" && recuperar()}
        style={{ padding: "0.6rem 0.7rem", borderRadius: 8, border: "1px solid var(--cor-borda)", fontSize: "0.95rem" }}
      />
      <button className="botao" onClick={recuperar} disabled={carregando}>
        {carregando ? "Buscando…" : "Recuperar personagem"}
      </button>
      {erro && <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--cor-acento)" }}>{erro}</p>}
    </div>
  );
}
