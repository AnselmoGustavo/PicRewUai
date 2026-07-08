// Manifesto de itens e cenários — FONTE DA VERDADE.
// Dados ainda PLACEHOLDER (arte da Ana Beatriz a caminho). Ver docs/05-modelo-de-dados.md.
import type {
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

export const ITENS: ItemDef[] = gerarItens();

export const CENARIOS: CenarioDef[] = [
  // 'inicial' é um fundo neutro padrão (dev) para nunca ficar sem cenário.
  { id: "cen_padrao", nome: "Campo (padrão)", tema: "claro", grupo: "inicial", cor: "#dce6cf" },
  { id: "cen_castelo_dia", nome: "Castelo (dia)", tema: "claro", grupo: "dia1", cor: "#cfe3f0" },
  { id: "cen_floresta_noite", nome: "Floresta (noite)", tema: "escuro", grupo: "dia2", cor: "#2b3a2f" },
  { id: "cen_torre_dia", nome: "Torre (dia)", tema: "claro", grupo: "dia3", cor: "#efe3c8" },
  { id: "cen_ruinas_noite", nome: "Ruínas (noite)", tema: "escuro", grupo: "dia4", cor: "#26304a" },
];

// ---- helpers de consulta ----

export function itensDe(classe: Classe, categoria: Categoria): ItemDef[] {
  return ITENS.filter((i) => i.classe === classe && i.categoria === categoria);
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
