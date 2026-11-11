// Códigos de desbloqueio. Ver docs/05-modelo-de-dados.md.
// NOTA: por enquanto os códigos estão em texto puro (dev). Antes do evento,
// trocar por comparação de HASH (sha256) para não deixá-los legíveis no fonte.
import type { GrupoDesbloqueio } from "./tipos";
import { TITULOS } from "./titulos";

// Códigos de exemplo (placeholder) — definir os reais perto do evento.
const CODIGOS: Record<Exclude<GrupoDesbloqueio, "inicial">, string> = {
  dia1: "UAI-DIA1",
  dia2: "UAI-DIA2",
  dia3: "UAI-DIA3",
  dia4: "UAI-DIA4",
  envio: "UAI-ENVIAR", // libera o botão de enviar a carta (divulgar no último dia)
};

// Código de staff que libera tudo (testes/suporte).
const CODIGO_MESTRE = "UAI-MESTRE";

function normalizar(s: string): string {
  return s.trim().toUpperCase();
}

export type ResultadoCodigo =
  | { tipo: "grupo"; grupo: GrupoDesbloqueio }
  | { tipo: "mestre" }
  | { tipo: "invalido" };

export function validarCodigo(input: string): ResultadoCodigo {
  const c = normalizar(input);
  if (!c) return { tipo: "invalido" };
  if (c === normalizar(CODIGO_MESTRE)) return { tipo: "mestre" };
  for (const [grupo, codigo] of Object.entries(CODIGOS)) {
    if (c === normalizar(codigo)) {
      return { tipo: "grupo", grupo: grupo as GrupoDesbloqueio };
    }
  }
  return { tipo: "invalido" };
}

export const TODOS_OS_GRUPOS: GrupoDesbloqueio[] = [
  "inicial",
  "dia1",
  "dia2",
  "dia3",
  "dia4",
  "envio",
];

/** Títulos liberados por este código (lib/titulos.ts). O código mestre libera todos. */
export function titulosDoCodigo(input: string): string[] {
  const c = normalizar(input);
  if (!c) return [];
  if (c === normalizar(CODIGO_MESTRE)) return TITULOS.map((t) => t.titulo);
  return TITULOS.filter((t) => normalizar(t.codigo) === c).map((t) => t.titulo);
}
