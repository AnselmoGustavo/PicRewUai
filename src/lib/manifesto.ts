// Manifesto de itens e cenários — FONTE DA VERDADE.
// Ver docs/05-modelo-de-dados.md.
import type {
  Animal,
  CenarioDef,
  Classe,
  Categoria,
  GrupoDesbloqueio,
  ItemDef,
} from "./tipos";
import { CATEGORIAS } from "./tipos";
import { CODIGOS_ITENS } from "./codigosItens";

// ---- ITENS (arte por animal+classe, ADR-016) ----
// Gerados automaticamente a partir de "Assets Prontos/" por scripts/gerar-assets.mjs.
// (Os itens placeholder genéricos saíram: todas as 25 combinações já têm arte.)
import gerados from "./itens-gerados.json";

export const ITENS: ItemDef[] = gerados.itens as ItemDef[];

// Base (corpo) por animal+classe, chave "animal-classe". Gerada dos personagens pelados.
const BASES: Record<string, string> = gerados.bases;

export function baseDoPersonagem(
  animal: Animal | null,
  classe: Classe | null,
): string | undefined {
  if (!animal || !classe) return undefined;
  return BASES[`${animal}-${classe}`];
}

// 3 cenários no total (arte da Ana Beatriz).
export const CENARIOS: CenarioDef[] = [
  { id: "cen_floresta", nome: "Floresta", tema: "escuro", grupo: "dia1", arquivo: "/assets/cenarios/floresta.jpg" },
  { id: "cen_montanhas", nome: "Montanhas", tema: "claro", grupo: "dia2", arquivo: "/assets/cenarios/montanhas.jpg" },
  // PLACEHOLDER (aguardando arte) — ajustar nome/tema/dia quando chegar:
  { id: "cen_dia3", nome: "Cenário (dia 3)", tema: "claro", grupo: "dia3", cor: "#efe3c8" },
];

// ---- helpers de consulta ----

export function itensDe(
  animal: Animal | null,
  classe: Classe,
  categoria: Categoria,
): ItemDef[] {
  return ITENS.filter(
    (i) => i.animal === animal && i.classe === classe && i.categoria === categoria,
  );
}

/** Categorias que têm pelo menos 1 item para o animal+classe (as outras abas ficam escondidas). */
export function categoriasDe(animal: Animal | null, classe: Classe): Categoria[] {
  return CATEGORIAS.map((c) => c.id).filter((c) => itensDe(animal, classe, c).length > 0);
}

export function cenarioPorId(id: string | null): CenarioDef | undefined {
  return CENARIOS.find((c) => c.id === id);
}

export function itemPorId(id: string | null): ItemDef | undefined {
  if (!id) return undefined;
  return ITENS.find((i) => i.id === id);
}

export function estaDesbloqueado(
  grupo: GrupoDesbloqueio,
  desbloqueios: GrupoDesbloqueio[],
): boolean {
  return grupo === "inicial" || desbloqueios.includes(grupo);
}

/** "animal-classe-tipo-nome-dia" -> "classe/tipo/nome" (chave dos arquivos de bônus e de códigos). */
export function chaveItem(itemId: string): string {
  const [, classe, tipo, nome] = itemId.split("-");
  return `${classe}/${tipo}/${nome}`;
}

/** Item com código próprio (codigosItens.ts) só libera com o código; os outros seguem o dia. */
export function itemDesbloqueado(
  item: ItemDef,
  desbloqueios: GrupoDesbloqueio[],
  itensLiberados: string[] | undefined,
): boolean {
  const chave = chaveItem(item.id);
  if (CODIGOS_ITENS[chave]?.trim()) return (itensLiberados ?? []).includes(chave);
  return estaDesbloqueado(item.grupo, desbloqueios);
}

export function itemTemCodigo(item: ItemDef): boolean {
  return Boolean(CODIGOS_ITENS[chaveItem(item.id)]?.trim());
}
