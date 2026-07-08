"use client";

import { useState } from "react";
import PreviewCarta from "./PreviewCarta";
import { usePersonagem } from "@/lib/store";
import { comporCartaBlob } from "@/lib/desenharCartaBrowser";
import {
  CENARIOS,
  estaDesbloqueado,
  itensDe,
} from "@/lib/manifesto";
import {
  ANIMAIS,
  CATEGORIAS,
  CLASSES,
  type Categoria,
  type Status,
} from "@/lib/tipos";

type Aba = Categoria | "cenario" | "ficha";

const ABAS: { id: Aba; label: string }[] = [
  { id: "cenario", label: "Cenário" },
  ...CATEGORIAS.map((c) => ({ id: c.id as Aba, label: c.nome })),
  { id: "ficha", label: "Ficha" },
];

const STATUS_CAMPOS: { chave: keyof Status; label: string }[] = [
  { chave: "vida", label: "❤️ Vida" },
  { chave: "forca", label: "⚔️ Força" },
  { chave: "intelecto", label: "📖 Intelecto" },
  { chave: "velocidade", label: "⚡ Velocidade" },
];

export default function Editor({
  onTrocarAnimal,
  onTrocarClasse,
}: {
  onTrocarAnimal: () => void;
  onTrocarClasse: () => void;
}) {
  const animal = usePersonagem((s) => s.animal);
  const classe = usePersonagem((s) => s.classe);
  const cenario = usePersonagem((s) => s.cenario);
  const selecao = usePersonagem((s) => s.selecao);
  const ficha = usePersonagem((s) => s.ficha);
  const desbloqueios = usePersonagem((s) => s.desbloqueios);
  const setCenario = usePersonagem((s) => s.setCenario);
  const selecionarItem = usePersonagem((s) => s.selecionarItem);
  const setNome = usePersonagem((s) => s.setNome);
  const setStatus = usePersonagem((s) => s.setStatus);
  const aplicarCodigo = usePersonagem((s) => s.aplicarCodigo);
  const enviado = usePersonagem((s) => s.enviado);
  const marcarEnviado = usePersonagem((s) => s.marcarEnviado);
  const resetar = usePersonagem((s) => s.resetar);
  const codigoPessoal = usePersonagem((s) => s.codigoPessoal);

  const [aba, setAba] = useState<Aba>("cenario");
  const [codigo, setCodigo] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  if (!classe) return null;

  // ---- tela final (envio feito) — a carta é surpresa, então não mostramos nada dela ----
  if (enviado) {
    return (
      <div className="superficie" style={{ padding: "2rem 1.5rem", maxWidth: 420, textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ fontSize: "3rem" }}>🎉</div>
        <h1 style={{ margin: 0, color: "var(--cor-primaria)", fontSize: "1.4rem" }}>Personagem enviado!</h1>
        <p style={{ margin: 0, color: "var(--cor-texto-suave)" }}>
          Prontinho — recebemos seu personagem. Uma surpresa te espera no evento! ✨
        </p>
        <button onClick={() => { if (confirm("Isto é só para testes: apagar o personagem e recomeçar?")) resetar(); }} style={linkBtn}>
          recomeçar (teste)
        </button>
      </div>
    );
  }
  const animalInfo = ANIMAIS.find((a) => a.id === animal);
  const classeInfo = CLASSES.find((c) => c.id === classe);

  function enviarCodigo() {
    const r = aplicarCodigo(codigo);
    if (r.tipo === "invalido") setMsg({ ok: false, texto: "Código inválido." });
    else if (r.tipo === "mestre") setMsg({ ok: true, texto: "🔓 Tudo desbloqueado (mestre)." });
    else setMsg({ ok: true, texto: `🔓 ${r.grupo.toUpperCase()} desbloqueado!` });
    setCodigo("");
  }

  const podeEnviar = !!cenario && ficha.nomePersonagem.trim().length > 0;

  async function enviar() {
    if (!podeEnviar || enviando) return;
    const ok = confirm(
      "Este é o envio final do seu personagem e não poderá ser alterado depois. Deseja enviar?",
    );
    if (!ok) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      // por trás: compõe a carta COMPLETA (moldura + nome + status) — surpresa
      const blob = await comporCartaBlob({
        cenario,
        selecao,
        nome: ficha.nomePersonagem,
        status: ficha.status as unknown as Record<string, number>,
      });
      const fd = new FormData();
      fd.append("imagem", blob, "carta.png");
      fd.append(
        "meta",
        JSON.stringify({
          nomePersonagem: ficha.nomePersonagem,
          classe,
          animal,
          cenario,
          status: ficha.status,
        }),
      );
      const res = await fetch("/api/enviar-carta", { method: "POST", body: fd });
      if (!res.ok) throw new Error("falha no envio");
      marcarEnviado();
    } catch {
      setErroEnvio("Não conseguimos enviar agora. Verifique a internet e tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
      {/* cabeçalho: animal + classe */}
      <div className="superficie" style={{ padding: "0.6rem 0.9rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <span>
          {animalInfo?.emoji} <strong>{animalInfo?.nome}</strong>{" "}
          <button onClick={onTrocarAnimal} style={linkBtn}>trocar</button>
        </span>
        <span>
          {classeInfo?.emoji} <strong>{classeInfo?.nome}</strong>{" "}
          <button onClick={onTrocarClasse} style={linkBtn}>trocar</button>
        </span>
      </div>

      {/* código pessoal (sincronização entre aparelhos) */}
      {codigoPessoal && (
        <div className="superficie" style={{ padding: "0.5rem 0.9rem", width: "min(92vw, 420px)", fontSize: "0.8rem", textAlign: "center" }}>
          🔑 Seu código: <strong style={{ letterSpacing: "0.05em" }}>{codigoPessoal}</strong>
          <div style={{ color: "var(--cor-texto-suave)", fontSize: "0.72rem" }}>
            Guarde este código para acessar seu personagem em outro aparelho.
          </div>
        </div>
      )}

      <PreviewCarta />

      {/* código do dia */}
      <div className="superficie" style={{ padding: "0.75rem", width: "min(92vw, 420px)" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código do dia (ex.: UAI-DIA1)"
            style={{ ...inp, flex: 1 }}
          />
          <button className="botao" onClick={enviarCodigo}>Desbloquear</button>
        </div>
        {msg && (
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: msg.ok ? "var(--cor-primaria)" : "var(--cor-acento)" }}>
            {msg.texto}
          </p>
        )}
      </div>

      {/* abas */}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "center", width: "min(92vw, 420px)" }}>
        {ABAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAba(a.id)}
            className={`botao ${aba === a.id ? "" : "botao--secundario"}`}
            style={{ padding: "0.4rem 0.7rem", fontSize: "0.8rem" }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* conteúdo da aba */}
      <div className="superficie" style={{ padding: "0.9rem", width: "min(92vw, 420px)" }}>
        {aba === "cenario" && (
          <Grade>
            {CENARIOS.map((c) => {
              const lock = !estaDesbloqueado(c.grupo, desbloqueios);
              return (
                <Tile
                  key={c.id}
                  nome={`${c.tema === "escuro" ? "🌙" : "☀️"} ${c.nome}`}
                  cor={c.cor}
                  selecionado={cenario === c.id}
                  bloqueado={lock}
                  onClick={() => !lock && setCenario(c.id)}
                />
              );
            })}
          </Grade>
        )}

        {aba !== "cenario" && aba !== "ficha" && (
          <Grade>
            <Tile nome="Nenhum" selecionado={selecao[aba] === null} onClick={() => selecionarItem(aba, null)} />
            {itensDe(classe, aba).map((it) => {
              const lock = !estaDesbloqueado(it.grupo, desbloqueios);
              return (
                <Tile
                  key={it.id}
                  nome={it.nome}
                  cor={it.cor}
                  selecionado={selecao[aba] === it.id}
                  bloqueado={lock}
                  onClick={() => !lock && selecionarItem(aba, it.id)}
                />
              );
            })}
          </Grade>
        )}

        {aba === "ficha" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label style={lbl}>
              Nome do personagem
              <input value={ficha.nomePersonagem} maxLength={22} onChange={(e) => setNome(e.target.value)} style={inp} />
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {STATUS_CAMPOS.map((c) => (
                <label key={c.chave} style={{ ...lbl, flex: "1 1 45%" }}>
                  {c.label}
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={ficha.status[c.chave]}
                    onChange={(e) => setStatus(c.chave, Math.max(0, Math.min(99, Number(e.target.value) || 0)))}
                    style={inp}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* enviar (surpresa) */}
      <div className="superficie" style={{ padding: "0.9rem", width: "min(92vw, 420px)", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button
          onClick={enviar}
          disabled={!podeEnviar || enviando}
          className="botao"
          style={{ background: "var(--cor-secundaria)", color: "var(--cor-texto)", fontSize: "1.05rem", padding: "0.9rem", opacity: !podeEnviar || enviando ? 0.55 : 1 }}
        >
          {enviando ? "Enviando…" : "Enviar personagem"}
        </button>
        {!podeEnviar && (
          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--cor-texto-suave)" }}>
            Escolha um cenário e preencha o nome (aba Ficha) para enviar.
          </p>
        )}
        {erroEnvio && (
          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--cor-acento)" }}>{erroEnvio}</p>
        )}
        <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--cor-texto-suave)" }}>
          O envio é único e definitivo.
        </p>
      </div>
    </div>
  );
}

function Grade({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: "0.5rem" }}>
      {children}
    </div>
  );
}

function Tile({
  nome,
  cor,
  selecionado,
  bloqueado,
  onClick,
}: {
  nome: string;
  cor?: string;
  selecionado?: boolean;
  bloqueado?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={bloqueado}
      title={bloqueado ? "Bloqueado — use o código do dia" : nome}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "0.4rem",
        borderRadius: 10,
        border: `2px solid ${selecionado ? "var(--cor-primaria)" : "var(--cor-borda)"}`,
        background: selecionado ? "color-mix(in srgb, var(--cor-primaria) 12%, #fff)" : "#fff",
        cursor: bloqueado ? "not-allowed" : "pointer",
        opacity: bloqueado ? 0.45 : 1,
        fontSize: "0.72rem",
        color: "var(--cor-texto)",
      }}
    >
      <span
        style={{
          width: "100%",
          height: 44,
          borderRadius: 8,
          background: cor ?? "repeating-linear-gradient(45deg,#eee,#eee 6px,#e0e0e0 6px,#e0e0e0 12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
        }}
      >
        {bloqueado ? "🔒" : ""}
      </span>
      {nome}
    </button>
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
const lbl: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4, fontSize: "0.82rem" };
const linkBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "var(--cor-primaria)",
  textDecoration: "underline",
  cursor: "pointer",
  fontSize: "0.8rem",
  padding: 0,
};
