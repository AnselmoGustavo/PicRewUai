"use client";

import { useState } from "react";
import PreviewCarta from "./PreviewCarta";
import { usePersonagem } from "@/lib/store";
import { comporCartaBlob } from "@/lib/desenharCartaBrowser";
import {
  CENARIOS,
  categoriasDe,
  estaDesbloqueado,
  itensDe,
} from "@/lib/manifesto";
import { statusDe, bonusDosItens, bonusDoItem, textoBonus, ROTULO_STATUS } from "@/lib/status";
import { titulosDisponiveis } from "@/lib/store";
import { titulosDoCodigo } from "@/lib/codigos";
import { TITULOS } from "@/lib/titulos";
import { useSessao } from "@/lib/sessao";
import { salvarProgressoRemoto } from "@/lib/sync";
import {
  ANIMAIS,
  CATEGORIAS,
  CLASSES,
  type Categoria,
  type Status,
} from "@/lib/tipos";

type Aba = Categoria | "cenario" | "ficha";


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
  const titulosLiberados = usePersonagem((s) => s.titulos);
  const setCenario = usePersonagem((s) => s.setCenario);
  const selecionarItem = usePersonagem((s) => s.selecionarItem);
  const setNome = usePersonagem((s) => s.setNome);
  const setTitulo = usePersonagem((s) => s.setTitulo);
  const aplicarCodigo = usePersonagem((s) => s.aplicarCodigo);
  const enviado = usePersonagem((s) => s.enviado);
  const marcarEnviado = usePersonagem((s) => s.marcarEnviado);
  const resetar = usePersonagem((s) => s.resetar);
  const usuario = useSessao((s) => s.usuario);
  const token = useSessao((s) => s.token);

  const [abaEscolhida, setAba] = useState<Aba>("cenario");
  const [codigo, setCodigo] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState<boolean | null>(null);
  const [salvoEm, setSalvoEm] = useState("");

  async function salvar() {
    setSalvando(true);
    const ok = await salvarProgressoRemoto(usePersonagem.getState());
    setSalvando(false);
    setSalvo(ok);
    if (ok) setSalvoEm(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  }

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
  const statusAtual = statusDe(animal, classe, selecao);
  const bonusItens = bonusDosItens(selecao);
  const meusTitulos = titulosDisponiveis(titulosLiberados);
  const titulosEscondidos = TITULOS.length - (meusTitulos.length - 1);

  // só mostra as abas de categoria que têm itens para este animal+classe
  const comItens = categoriasDe(animal, classe);
  const ABAS: { id: Aba; label: string }[] = [
    { id: "cenario", label: "Cenário" },
    ...CATEGORIAS.filter((c) => comItens.includes(c.id)).map((c) => ({ id: c.id as Aba, label: c.nome })),
    { id: "ficha", label: "Ficha" },
  ];
  // se a aba aberta sumiu (ex.: trocou de classe), volta para Cenário
  const aba: Aba = ABAS.some((a) => a.id === abaEscolhida) ? abaEscolhida : "cenario";

  function enviarCodigo() {
    const { resultado: r, titulosNovos } = aplicarCodigo(codigo);
    const partes: string[] = [];
    if (r.tipo === "mestre") partes.push("🔓 Tudo desbloqueado (mestre).");
    else if (r.tipo === "grupo" && r.grupo === "envio") partes.push("📨 Envio liberado! Quando terminar, é só enviar seu personagem.");
    else if (r.tipo === "grupo") partes.push(`🔓 ${r.grupo.toUpperCase()} desbloqueado!`);
    if (titulosNovos.length && r.tipo !== "mestre") {
      partes.push(`🏅 Novo título: ${titulosNovos.map((t) => `“${t}”`).join(", ")} — escolha na aba Ficha.`);
    }
    if (partes.length) setMsg({ ok: true, texto: partes.join(" ") });
    else if (titulosDoCodigo(codigo).length) setMsg({ ok: true, texto: "Você já tem esse título. 😉" });
    else setMsg({ ok: false, texto: "Código inválido." });
    setCodigo("");
  }

  const envioLiberado = desbloqueios.includes("envio");
  const podeEnviar = envioLiberado && !!cenario && ficha.nomePersonagem.trim().length > 0;

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
        animal,
        classe,
        cenario,
        selecao,
        nome: ficha.nomePersonagem,
        titulo: ficha.titulo ?? "",
      });
      const fd = new FormData();
      fd.append("imagem", blob, "carta.png");
      fd.append(
        "meta",
        JSON.stringify({
          usuario,
          nomePersonagem: ficha.nomePersonagem,
          titulo: ficha.titulo,
          classe,
          animal,
          cenario,
          status: statusDe(animal, classe, selecao),
        }),
      );
      fd.append("token", token ?? "");
      const res = await fetch("/api/enviar-carta", { method: "POST", body: fd });
      if (res.status === 401) {
        setErroEnvio("Sua sessão não foi reconhecida. Saia e entre de novo com seu usuário e senha.");
        return;
      }
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

      <PreviewCarta />

      {/* código do dia */}
      <div className="superficie" style={{ padding: "0.75rem", width: "min(92vw, 420px)" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarCodigo()}
            placeholder="Código do dia"
            style={{ ...inp, flex: 1, minWidth: 0 }}
          />
          <button className="botao" onClick={enviarCodigo} style={{ flexShrink: 0, padding: "0.5rem 0.9rem" }}>
            Desbloquear
          </button>
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
                  img={c.arquivo}
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
            {itensDe(animal, classe, aba).map((it) => {
              const lock = !estaDesbloqueado(it.grupo, desbloqueios);
              return (
                <Tile
                  key={it.id}
                  nome={[it.nome, textoBonus(bonusDoItem(it.id))].filter(Boolean).join(" · ")}
                  cor={it.cor}
                  img={it.thumb}
                  imgContain
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
            <div style={lbl}>
              Título
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {meusTitulos.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTitulo(t)}
                    className={`botao ${ficha.titulo === t ? "" : "botao--secundario"}`}
                    style={{ padding: "0.35rem 0.7rem", fontSize: "0.82rem" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {titulosEscondidos > 0 && (
                <span style={{ color: "var(--cor-texto-suave)", fontSize: "0.75rem" }}>
                  🔒 {titulosEscondidos} título{titulosEscondidos > 1 ? "s" : ""} para descobrir com códigos especiais.
                </span>
              )}
            </div>

            <div>
              <div style={{ fontSize: "0.82rem", marginBottom: 6 }}>
                Status <span style={{ color: "var(--cor-texto-suave)" }}>(raça + classe + itens)</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {(Object.keys(ROTULO_STATUS) as (keyof Status)[]).map((k) => (
                  <div key={k} style={{ flex: "1 1 45%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.6rem", borderRadius: 8, border: "1px solid var(--cor-borda)", background: "var(--cor-superficie)", fontSize: "0.85rem" }}>
                    <span>{ROTULO_STATUS[k]}</span>
                    <strong style={{ fontSize: "1.05rem", color: "var(--cor-primaria)" }}>
                      {statusAtual[k]}
                      {bonusItens[k] > 0 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--cor-texto-suave)", fontWeight: 400 }}> (+{bonusItens[k]})</span>
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* salvar + enviar (surpresa) */}
      <div className="superficie" style={{ padding: "0.9rem", width: "min(92vw, 420px)", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button
          onClick={salvar}
          disabled={salvando}
          className="botao botao--secundario"
          style={{ padding: "0.7rem" }}
        >
          {salvando ? "Salvando…" : "💾 Salvar progresso"}
        </button>
        <p style={{ margin: 0, fontSize: "0.75rem", color: salvo === false ? "var(--cor-acento)" : "var(--cor-texto-suave)" }}>
          {salvo === true
            ? `✓ Progresso salvo às ${salvoEm}. Você pode fechar e continuar depois.`
            : salvo === false
              ? "Não foi possível salvar agora (sem internet?). Suas escolhas ficam neste aparelho; tente de novo."
              : "Seu progresso também é salvo automaticamente."}
        </p>
        <hr style={{ border: "none", borderTop: "1px solid var(--cor-borda)", width: "100%", margin: "0.25rem 0" }} />
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
            {!envioLiberado
              ? "🔒 O envio será liberado com um código no último dia do evento. Até lá, monte seu personagem com calma!"
              : "Escolha um cenário e preencha o nome (aba Ficha) para enviar."}
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
  img,
  imgContain,
  selecionado,
  bloqueado,
  onClick,
}: {
  nome: string;
  cor?: string;
  img?: string;
  imgContain?: boolean;
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
          background: imgContain
            ? "#f3ecdb"
            : cor ?? "repeating-linear-gradient(45deg,#eee,#eee 6px,#e0e0e0 6px,#e0e0e0 12px)",
          backgroundImage: img ? `url(${img})` : undefined,
          backgroundSize: imgContain ? "contain" : "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
