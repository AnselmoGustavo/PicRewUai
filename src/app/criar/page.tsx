"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Editor from "@/components/Editor";
import { usePersonagem } from "@/lib/store";
import { ANIMAIS, CLASSES } from "@/lib/tipos";

type Etapa = "animal" | "classe" | "editor";

export default function CriarPage() {
  const [montado, setMontado] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("animal");

  const animal = usePersonagem((s) => s.animal);
  const classe = usePersonagem((s) => s.classe);
  const setAnimal = usePersonagem((s) => s.setAnimal);
  const setClasse = usePersonagem((s) => s.setClasse);

  // guarda de hidratação (o estado vem do localStorage no cliente)
  useEffect(() => {
    setMontado(true);
    if (usePersonagem.getState().animal && usePersonagem.getState().classe) {
      setEtapa("editor");
    } else if (usePersonagem.getState().animal) {
      setEtapa("classe");
    }
  }, []);

  if (!montado) {
    return <Centro><p style={{ color: "var(--cor-texto-suave)" }}>Carregando…</p></Centro>;
  }

  return (
    <main style={{ minHeight: "100vh", padding: "1.25rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
      <Link href="/" style={{ alignSelf: "flex-start", color: "var(--cor-primaria)", fontSize: "0.9rem" }}>← início</Link>

      {etapa === "animal" && (
        <>
          <h1 style={titulo}>Escolha seu animal</h1>
          <Grade largura={520}>
            {ANIMAIS.map((a) => (
              <Cartao
                key={a.id}
                selecionado={animal === a.id}
                onClick={() => {
                  setAnimal(a.id);
                  setEtapa(classe ? "editor" : "classe");
                }}
              >
                <div style={{ fontSize: "2.2rem" }}>{a.emoji}</div>
                <div>{a.nome}</div>
              </Cartao>
            ))}
          </Grade>
        </>
      )}

      {etapa === "classe" && (
        <>
          <h1 style={titulo}>Escolha sua classe</h1>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--cor-texto-suave)", textAlign: "center", maxWidth: 420 }}>
            A classe define quais itens ficam disponíveis. Trocar de classe depois zera os itens escolhidos.
          </p>
          <Grade largura={520}>
            {CLASSES.map((c) => (
              <Cartao
                key={c.id}
                selecionado={classe === c.id}
                onClick={() => {
                  setClasse(c.id);
                  setEtapa("editor");
                }}
              >
                <div style={{ fontSize: "2rem" }}>{c.emoji}</div>
                <div><strong>{c.nome}</strong></div>
                <div style={{ fontSize: "0.72rem", color: "var(--cor-texto-suave)" }}>{c.desc}</div>
              </Cartao>
            ))}
          </Grade>
        </>
      )}

      {etapa === "editor" && (
        <Editor
          onTrocarAnimal={() => setEtapa("animal")}
          onTrocarClasse={() => setEtapa("classe")}
        />
      )}
    </main>
  );
}

function Centro({ children }: { children: React.ReactNode }) {
  return <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</main>;
}

function Grade({ children, largura }: { children: React.ReactNode; largura: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem", width: `min(92vw, ${largura}px)` }}>
      {children}
    </div>
  );
}

function Cartao({ children, selecionado, onClick }: { children: React.ReactNode; selecionado?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="superficie"
      style={{
        padding: "0.9rem 0.6rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        textAlign: "center",
        cursor: "pointer",
        border: `2px solid ${selecionado ? "var(--cor-primaria)" : "var(--cor-borda)"}`,
        color: "var(--cor-texto)",
      }}
    >
      {children}
    </button>
  );
}

const titulo: React.CSSProperties = { color: "var(--cor-primaria)", fontSize: "1.5rem", margin: 0, textAlign: "center" };
