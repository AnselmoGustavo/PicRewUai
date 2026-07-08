import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Animal,
  Categoria,
  Classe,
  EstadoPersonagem,
  GrupoDesbloqueio,
  Status,
} from "./tipos";
import { validarCodigo } from "./codigos";

const VERSAO = 1;

const estadoInicial: EstadoPersonagem = {
  versao: VERSAO,
  animal: null,
  classe: null,
  cenario: null,
  selecao: {
    vestimenta: null,
    arma: null,
    cabeca: null,
    acessorio1: null,
    acessorio2: null,
  },
  ficha: {
    nomePersonagem: "",
    status: { vida: 0, forca: 0, intelecto: 0, velocidade: 0 },
    habilidade: "",
  },
  desbloqueios: ["inicial"],
  enviado: false,
};

interface Acoes {
  setAnimal: (a: Animal) => void;
  setClasse: (c: Classe) => void;
  setCenario: (id: string) => void;
  selecionarItem: (cat: Categoria, id: string | null) => void;
  setNome: (nome: string) => void;
  setStatus: (chave: keyof Status, valor: number) => void;
  setHabilidade: (texto: string) => void;
  /** Aplica um código; retorna o resultado para feedback na UI. */
  aplicarCodigo: (input: string) => ReturnType<typeof validarCodigo>;
  marcarEnviado: () => void;
  resetar: () => void;
}

export const usePersonagem = create<EstadoPersonagem & Acoes>()(
  persist(
    (set, get) => ({
      ...estadoInicial,

      setAnimal: (a) => set({ animal: a }),

      // itens são específicos por classe → trocar de classe zera a seleção de itens
      setClasse: (c) =>
        set({
          classe: c,
          selecao: { ...estadoInicial.selecao },
        }),

      setCenario: (id) => set({ cenario: id }),

      selecionarItem: (cat, id) =>
        set((s) => ({ selecao: { ...s.selecao, [cat]: id } })),

      setNome: (nome) =>
        set((s) => ({ ficha: { ...s.ficha, nomePersonagem: nome } })),

      setStatus: (chave, valor) =>
        set((s) => ({
          ficha: {
            ...s.ficha,
            status: { ...s.ficha.status, [chave]: valor },
          },
        })),

      setHabilidade: (texto) =>
        set((s) => ({ ficha: { ...s.ficha, habilidade: texto } })),

      aplicarCodigo: (input) => {
        const r = validarCodigo(input);
        if (r.tipo === "grupo") {
          const atuais = get().desbloqueios;
          if (!atuais.includes(r.grupo)) {
            set({ desbloqueios: [...atuais, r.grupo] });
          }
        } else if (r.tipo === "mestre") {
          const todos: GrupoDesbloqueio[] = [
            "inicial",
            "dia1",
            "dia2",
            "dia3",
            "dia4",
          ];
          set({ desbloqueios: todos });
        }
        return r;
      },

      marcarEnviado: () => set({ enviado: true }),

      resetar: () => set({ ...estadoInicial }),
    }),
    {
      name: "picrewuai:personagem",
      version: VERSAO,
    },
  ),
);
