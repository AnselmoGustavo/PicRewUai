// Códigos de desbloqueio. Ver docs/05-modelo-de-dados.md.
// NOTA: por enquanto os códigos estão em texto puro (dev). Antes do evento,
// trocar por comparação de HASH (sha256) para não deixá-los legíveis no fonte.
import type { GrupoDesbloqueio } from "./tipos";

// Códigos de exemplo (placeholder) — definir os reais perto do evento.
const CODIGOS: Record<Exclude<GrupoDesbloqueio, "inicial">, string> = {
  dia1: "UAI-DIA1",
  dia2: "UAI-DIA2",
  dia3: "UAI-DIA3",
  dia4: "UAI-DIA4",
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
];
