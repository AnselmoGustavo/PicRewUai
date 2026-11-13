// Cálculo de status: base 2 em tudo + bônus de classe + bônus de raça (animal) + bônus dos itens
// equipados (lib/bonusItens.ts). Aditivo, sem penalidade. Ajuste os números livremente aqui.
import type { Animal, Classe, Selecao, Status } from "./tipos";
import { idsDaSelecao } from "./tipos";
import { BONUS_ITENS } from "./bonusItens";

type Stat = keyof Status; // "vida" | "forca" | "intelecto" | "destreza"

export const STATUS_BASE = 2;
/** Teto de cada status na carta (a caixa do número cabe 1 dígito). */
export const MAX_STATUS = 9;

// Bônus por classe: +2 no principal, +1 no secundário.
const BONUS_CLASSE: Record<Classe, Partial<Record<Stat, number>>> = {
  guerreiro: { forca: 2, vida: 1 },
  arqueiro: { destreza: 2, forca: 1 },
  mago: { intelecto: 2, vida: 1 },
  bardo: { intelecto: 2, destreza: 1 },
  ninja: { destreza: 2, intelecto: 1 },
};

// Bônus por raça/animal: +1 na "assinatura".
const BONUS_ANIMAL: Record<Animal, Stat> = {
  macaco: "forca",
  raposa: "intelecto",
  gato: "destreza",
  veado: "destreza",
  cachorro: "vida",
};

const STATS: Stat[] = ["vida", "forca", "intelecto", "destreza"];
const zerado = (): Status => ({ vida: 0, forca: 0, intelecto: 0, destreza: 0 });

/** "animal-classe-tipo-nome-dia[-zNN]" -> "classe/tipo/nome" (chave de BONUS_ITENS). */
export function chaveBonus(itemId: string): string {
  const [, classe, tipo, nome] = itemId.split("-");
  return `${classe}/${tipo}/${nome}`;
}

/** Bônus de um item (vazio se não tiver). */
export function bonusDoItem(itemId: string | null | undefined): Partial<Status> {
  return (itemId && BONUS_ITENS[chaveBonus(itemId)]) || {};
}

/** Soma dos bônus de todos os itens equipados. */
export function bonusDosItens(selecao?: Selecao | null): Status {
  const s = zerado();
  for (const id of idsDaSelecao(selecao)) {
    const b = bonusDoItem(id);
    for (const k of STATS) s[k] += b[k] ?? 0;
  }
  return s;
}

export function statusDe(
  animal: Animal | null,
  classe: Classe | null,
  selecao?: Selecao | null,
): Status {
  const s: Status = {
    vida: STATUS_BASE,
    forca: STATUS_BASE,
    intelecto: STATUS_BASE,
    destreza: STATUS_BASE,
  };
  if (classe) {
    for (const [k, v] of Object.entries(BONUS_CLASSE[classe])) {
      s[k as Stat] += v;
    }
  }
  if (animal) {
    s[BONUS_ANIMAL[animal]] += 1;
  }
  const itens = bonusDosItens(selecao);
  for (const k of STATS) s[k] = Math.min(MAX_STATUS, s[k] + itens[k]);
  return s;
}

export const ROTULO_STATUS: Record<Stat, string> = {
  vida: "❤️ Vida",
  forca: "⚔️ Força",
  intelecto: "📖 Intelecto",
  destreza: "⚡ Destreza",
};

const ICONE_STATUS: Record<Stat, string> = {
  vida: "❤️",
  forca: "⚔️",
  intelecto: "📖",
  destreza: "⚡",
};

/** Texto curto do bônus, ex.: "+2📖 +1❤️" (vazio se não tiver). */
export function textoBonus(b: Partial<Status>): string {
  return STATS.filter((k) => b[k])
    .map((k) => `${(b[k] as number) > 0 ? "+" : ""}${b[k]}${ICONE_STATUS[k]}`)
    .join(" ");
}
