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
import { gerarCodigoPessoal } from "./codigoPessoal";

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
  codigoPessoal: null,
  atualizadoEm: 0,
};

const agora = () => Date.now();

interface Acoes {
  setAnimal: (a: Animal) => void;
  setClasse: (c: Classe) => void;
  setCenario: (id: string) => void;
  selecionarItem: (cat: Categoria, id: string | null) => void;
  setNome: (nome: string) => void;
  setStatus: (chave: keyof Status, valor: number) => void;
  setHabilidade: (texto: string) => void;
  aplicarCodigo: (input: string) => ReturnType<typeof validarCodigo>;
  marcarEnviado: () => void;
  resetar: () => void;
  /** Garante que exista um código pessoal (gera na 1ª vez). Retorna o código. */
  garantirCodigoPessoal: () => string;
  /** Substitui o estado inteiro (recuperação por código / carga do servidor). */
  carregarEstado: (e: EstadoPersonagem) => void;
}

export const usePersonagem = create<EstadoPersonagem & Acoes>()(
  persist(
    (set, get) => ({
      ...estadoInicial,

      setAnimal: (a) => set({ animal: a, atualizadoEm: agora() }),

      // itens são específicos por classe → trocar de classe zera a seleção de itens
      setClasse: (c) =>
        set({
          classe: c,
          selecao: { ...estadoInicial.selecao },
          atualizadoEm: agora(),
        }),

      setCenario: (id) => set({ cenario: id, atualizadoEm: agora() }),

      selecionarItem: (cat, id) =>
        set((s) => ({
          selecao: { ...s.selecao, [cat]: id },
          atualizadoEm: agora(),
        })),

      setNome: (nome) =>
        set((s) => ({
          ficha: { ...s.ficha, nomePersonagem: nome },
          atualizadoEm: agora(),
        })),

      setStatus: (chave, valor) =>
        set((s) => ({
          ficha: { ...s.ficha, status: { ...s.ficha.status, [chave]: valor } },
          atualizadoEm: agora(),
        })),

      setHabilidade: (texto) =>
        set((s) => ({
          ficha: { ...s.ficha, habilidade: texto },
          atualizadoEm: agora(),
        })),

      aplicarCodigo: (input) => {
        const r = validarCodigo(input);
        if (r.tipo === "grupo") {
          const atuais = get().desbloqueios;
          if (!atuais.includes(r.grupo)) {
            set({ desbloqueios: [...atuais, r.grupo], atualizadoEm: agora() });
          }
        } else if (r.tipo === "mestre") {
          set({
            desbloqueios: ["inicial", "dia1", "dia2", "dia3", "dia4"],
            atualizadoEm: agora(),
          });
        }
        return r;
      },

      marcarEnviado: () => set({ enviado: true, atualizadoEm: agora() }),

      resetar: () => set({ ...estadoInicial }),

      garantirCodigoPessoal: () => {
        const atual = get().codigoPessoal;
        if (atual) return atual;
        const novo = gerarCodigoPessoal();
        set({ codigoPessoal: novo });
        return novo;
      },

      carregarEstado: (e) => set({ ...e }),
    }),
    {
      name: "picrewuai:personagem",
      version: VERSAO,
    },
  ),
);
