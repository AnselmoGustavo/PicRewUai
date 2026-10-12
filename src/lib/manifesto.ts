// Manifesto de itens e cenários — FONTE DA VERDADE.
// Dados ainda PLACEHOLDER (arte da Ana Beatriz a caminho). Ver docs/05-modelo-de-dados.md.
import type {
  Animal,
  CenarioDef,
  Classe,
  Categoria,
  GrupoDesbloqueio,
  ItemDef,
} from "./tipos";
import { CLASSES, CATEGORIAS } from "./tipos";

const GRUPOS: GrupoDesbloqueio[] = ["inicial", "dia1", "dia2", "dia3", "dia4"];

const ROTULO_GRUPO: Record<GrupoDesbloqueio, string> = {
  inicial: "Inicial",
  dia1: "Dia 1",
  dia2: "Dia 2",
  dia3: "Dia 3",
  dia4: "Dia 4",
};

// cor placeholder por categoria (varia o tom por grupo)
const COR_CATEGORIA: Record<Categoria, string> = {
  vestimenta: "#6d8f57",
  arma: "#9c6b4a",
  cabeca: "#c8952b",
  acessorio1: "#6b7fa8",
  acessorio2: "#a86b8f",
};

function corPlaceholder(cat: Categoria, indice: number): string {
  // varia a opacidade (alpha em hex) conforme o grupo, só para diferenciar os placeholders
  const base = COR_CATEGORIA[cat];
  const alpha = ["ff", "e6", "cc", "b3", "99"][indice] ?? "ff";
  return base + alpha;
}

// Gera ~5 itens por (classe × categoria), um por grupo de desbloqueio → ~125 itens placeholder.
function gerarItens(): ItemDef[] {
  const itens: ItemDef[] = [];
  for (const classe of CLASSES) {
    for (const cat of CATEGORIAS) {
      GRUPOS.forEach((grupo, i) => {
        itens.push({
          id: `${cat.id}_${classe.id}_${grupo}`,
          nome: `${cat.nome} ${ROTULO_GRUPO[grupo]}`,
          categoria: cat.id,
          classe: classe.id as Classe,
          grupo,
          cor: corPlaceholder(cat.id, i),
        });
      });
    }
  }
  return itens;
}

// ---- ITENS REAIS (arte por animal+classe, ADR-016) ----
// Gerados automaticamente a partir de "Assets Prontos/" por scripts/gerar-assets.mjs.
import gerados from "./itens-gerados.json";

const ITENS_REAIS = gerados.itens as ItemDef[];

export const ITENS: ItemDef[] = [...gerarItens(), ...ITENS_REAIS];

// Base (corpo) por animal+classe, chave "animal-classe". Gerada dos personagens pelados.
const BASES: Record<string, string> = gerados.bases;

export function baseDoPersonagem(
  animal: Animal | null,
  classe: Classe | null,
): string | undefined {
  if (!animal || !classe) return undefined;
  return BASES[`${animal}-${classe}`];
}

export const CENARIOS: CenarioDef[] = [
  // 'inicial' é um fundo neutro padrão (dev) para nunca ficar sem cenário. (arte a definir)
  { id: "cen_padrao", nome: "Padrão", tema: "claro", grupo: "inicial", cor: "#dce6cf" },
  // PRONTOS (arte da Ana Beatriz) — ambos de dia (claros):
  { id: "cen_floresta", nome: "Floresta", tema: "claro", grupo: "dia1", arquivo: "/assets/cenarios/floresta.jpg" },
  { id: "cen_montanhas", nome: "Montanhas", tema: "claro", grupo: "dia2", arquivo: "/assets/cenarios/montanhas.jpg" },
  // PLACEHOLDERS (aguardando arte):
  { id: "cen_dia3", nome: "Cenário (dia 3)", tema: "claro", grupo: "dia3", cor: "#efe3c8" },
  { id: "cen_dia4", nome: "Cenário (dia 4)", tema: "escuro", grupo: "dia4", cor: "#26304a" },
];

// ---- helpers de consulta ----

export function itensDe(
  animal: Animal | null,
  classe: Classe,
  categoria: Categoria,
): ItemDef[] {
  // prefere itens reais do animal+classe; se não houver, cai nos placeholders genéricos
  const reais = ITENS.filter(
    (i) => i.animal === animal && i.classe === classe && i.categoria === categoria,
  );
  if (reais.length) return reais;
  return ITENS.filter(
    (i) => !i.animal && i.classe === classe && i.categoria === categoria,
  );
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
