import Link from "next/link";

export default function Home() {
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
      <img
        src="/identidade/logo.png"
        alt="uai"
        style={{ width: "min(60vw, 320px)", height: "auto" }}
      />

      <div className="superficie" style={{ padding: "1.5rem 1.75rem", maxWidth: 440 }}>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.4rem", color: "var(--cor-primaria)" }}>
          Crie seu personagem
        </h1>
        <p style={{ margin: "0 0 1.25rem", color: "var(--cor-texto-suave)" }}>
          Monte seu herói para o evento UAI 2026.
        </p>
        <Link href="/criar" className="botao">
          Criar personagem
        </Link>
      </div>

      <Link href="/poc-carta" style={{ fontSize: "0.8rem", color: "var(--cor-texto-suave)" }}>
        (protótipo da carta · dev)
      </Link>
    </main>
  );
}
