// Cálculo de status: base 2 em tudo + bônus de classe + bônus de raça (animal).
// Aditivo, sem penalidade. Ajuste os números livremente aqui.
import type { Animal, Classe, Status } from "./tipos";

type Stat = keyof Status; // "vida" | "forca" | "intelecto" | "destreza"

export const STATUS_BASE = 2;

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

export function statusDe(animal: Animal | null, classe: Classe | null): Status {
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
  return s;
}

export const ROTULO_STATUS: Record<Stat, string> = {
  vida: "❤️ Vida",
  forca: "⚔️ Força",
  intelecto: "📖 Intelecto",
  destreza: "⚡ Destreza",
};
