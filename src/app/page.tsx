"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSessao } from "@/lib/sessao";
import { entrar, registrar, sair } from "@/lib/auth";

export default function Home() {
  const [montado, setMontado] = useState(false);
  const usuario = useSessao((s) => s.usuario);

  useEffect(() => setMontado(true), []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/identidade/logo.png" alt="uai" style={{ width: "min(55vw, 300px)", height: "auto" }} />

      {!montado ? (
        <p style={{ color: "var(--cor-texto-suave)" }}>Carregando…</p>
      ) : usuario ? (
        <div className="superficie" style={{ padding: "1.5rem 1.75rem", maxWidth: 440, display: "flex", flexDirection: "column", gap: "1rem" }}>
          <p style={{ margin: 0, color: "var(--cor-texto-suave)" }}>
            Olá, <strong style={{ color: "var(--cor-primaria)" }}>{usuario}</strong>!
          </p>
          <Link href="/criar" className="botao">Criar / continuar personagem</Link>
          <button onClick={() => sair()} style={linkBtn}>sair</button>
        </div>
      ) : (
        <FormAuth />
      )}
    </main>
  );
}

function FormAuth() {
  const [modo, setModo] = useState<"entrar" | "registrar">("entrar");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (carregando) return;
    setErro(null);
    setCarregando(true);
    const r = modo === "entrar" ? await entrar(usuario, senha) : await registrar(usuario, senha);
    setCarregando(false);
    if (!r.ok) setErro(r.erro);
    // sucesso → a sessão muda e a Home re-renderiza para o estado logado
  }

  return (
    <form onSubmit={enviar} className="superficie" style={{ padding: "1.5rem", maxWidth: 360, width: "min(92vw, 360px)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <h1 style={{ margin: 0, fontSize: "1.3rem", color: "var(--cor-primaria)" }}>
        {modo === "entrar" ? "Entrar" : "Criar conta"}
      </h1>
      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--cor-texto-suave)" }}>
        Crie uma conta para salvar seu personagem durante o evento.
      </p>

      <input
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        placeholder="Usuário"
        autoCapitalize="none"
        autoCorrect="off"
        style={inp}
      />
      <input
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        placeholder="Senha"
        type="password"
        style={inp}
      />

      {erro && <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--cor-acento)" }}>{erro}</p>}

      <button type="submit" className="botao" disabled={carregando || !usuario || !senha}>
        {carregando ? "…" : modo === "entrar" ? "Entrar" : "Criar conta"}
      </button>

      <button
        type="button"
        onClick={() => { setModo(modo === "entrar" ? "registrar" : "entrar"); setErro(null); }}
        style={linkBtn}
      >
        {modo === "entrar" ? "Não tem conta? Criar uma" : "Já tenho conta — entrar"}
      </button>
    </form>
  );
}

const inp: React.CSSProperties = {
  padding: "0.6rem 0.7rem",
  borderRadius: 8,
  border: "1px solid var(--cor-borda)",
  background: "#fff",
  fontFamily: "var(--fonte-corpo)",
  fontSize: "0.95rem",
};

const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--cor-primaria)",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "0.85rem",
};
