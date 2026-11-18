// Códigos de desbloqueio. Ver docs/05-modelo-de-dados.md.
// NOTA: por enquanto os códigos estão em texto puro (dev). Antes do evento,
// trocar por comparação de HASH (sha256) para não deixá-los legíveis no fonte.
import type { GrupoDesbloqueio } from "./tipos";
import { TITULOS } from "./titulos";
import { CODIGOS_ITENS } from "./codigosItens";

// Códigos REAIS do evento (gerados em 17/11/2026; lista completa em codigos-evento.csv).
// Os itens têm código próprio (codigosItens.ts): o código do dia libera só o CENÁRIO do dia.
const CODIGOS: Record<Exclude<GrupoDesbloqueio, "inicial">, string> = {
  dia1: "", // sem código: o dia 1 (Floresta + skin básica) é liberado desde o início
  dia2: "UAI-PM4NV",
  dia3: "UAI-GAN3X",
  dia4: "UAI-CWKMH",
  envio: "UAI-PJNNE", // libera o botão de enviar a carta (divulgar no último dia)
};

// Código de staff que libera tudo (testes/suporte).
const CODIGO_MESTRE = "UAI-7FHPQ";

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

/** Itens (chave "classe/tipo/nome") liberados por este código (lib/codigosItens.ts). Mestre libera todos. */
export function itensDoCodigo(input: string): string[] {
  const c = normalizar(input);
  if (!c) return [];
  const comCodigo = Object.entries(CODIGOS_ITENS).filter(([, cod]) => normalizar(cod));
  if (c === normalizar(CODIGO_MESTRE)) return comCodigo.map(([k]) => k);
  return comCodigo.filter(([, cod]) => normalizar(cod) === c).map(([k]) => k);
}
