import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Animal,
  Categoria,
  Classe,
  EstadoPersonagem,
  GrupoDesbloqueio,
  Selecao,
} from "./tipos";
import { ANIMAIS } from "./tipos";
import { validarCodigo, TODOS_OS_GRUPOS } from "./codigos";
import { CENARIOS } from "./manifesto";

// v2: categorias passaram de 5 (vestimenta, acessorio1...) para 7 tipos (camisa, calca...)
// v3: saíram os animais sapo, coruja e carpa
// v4: saíram os cenários Padrão e dia 4 (3 cenários no total)
const VERSAO = 4;

const SELECAO_VAZIA: Selecao = {
  camisa: null,
  calca: null,
  arma: null,
  calcado: null,
  capa: null,
  chapeu: null,
  acessorio: null,
};

// Saves antigos (ou vindos do servidor) podem ter chaves de categorias que não existem mais:
// reconstrói a seleção só com os 7 tipos atuais.
function normalizarSelecao(s: Partial<Record<string, string | null>> | undefined): Selecao {
  const out = { ...SELECAO_VAZIA };
  for (const k of Object.keys(out) as Categoria[]) out[k] = s?.[k] ?? null;
  return out;
}

// Também descarta animais que saíram do jogo (sapo, coruja, carpa): a pessoa escolhe de novo.
function normalizarEstado(e: EstadoPersonagem): EstadoPersonagem {
  const animalValido = ANIMAIS.some((a) => a.id === e?.animal);
  return {
    ...e,
    animal: animalValido ? e.animal : null,
    selecao: animalValido ? normalizarSelecao(e?.selecao) : { ...SELECAO_VAZIA },
    // cenários que saíram (Padrão, dia 4) → escolhe de novo
    cenario: CENARIOS.some((c) => c.id === e?.cenario) ? e.cenario : null,
  };
}

const estadoInicial: EstadoPersonagem = {
  versao: VERSAO,
  animal: null,
  classe: null,
  cenario: null,
  selecao: { ...SELECAO_VAZIA },
  ficha: {
    nomePersonagem: "",
    titulo: "",
    habilidade: "",
  },
  desbloqueios: ["inicial"],
  enviado: false,
  atualizadoEm: 0,
};

const agora = () => Date.now();

interface Acoes {
  setAnimal: (a: Animal) => void;
  setClasse: (c: Classe) => void;
  setCenario: (id: string) => void;
  selecionarItem: (cat: Categoria, id: string | null) => void;
  setNome: (nome: string) => void;
  setTitulo: (titulo: string) => void;
  setHabilidade: (texto: string) => void;
  aplicarCodigo: (input: string) => ReturnType<typeof validarCodigo>;
  marcarEnviado: () => void;
  resetar: () => void;
  /** Substitui o estado inteiro (carga do servidor). */
  carregarEstado: (e: EstadoPersonagem) => void;
}

export const usePersonagem = create<EstadoPersonagem & Acoes>()(
  persist(
    (set, get) => ({
      ...estadoInicial,

      // itens são específicos por animal+classe → trocar qualquer um zera a seleção
      setAnimal: (a) =>
        set({
          animal: a,
          selecao: { ...estadoInicial.selecao },
          atualizadoEm: agora(),
        }),

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

      setTitulo: (titulo) =>
        set((s) => ({
          ficha: { ...s.ficha, titulo },
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
            desbloqueios: [...TODOS_OS_GRUPOS],
            atualizadoEm: agora(),
          });
        }
        return r;
      },

      marcarEnviado: () => set({ enviado: true, atualizadoEm: agora() }),

      resetar: () => set({ ...estadoInicial }),

      carregarEstado: (e) => set(normalizarEstado(e)),
    }),
    {
      name: "picrewuai:personagem",
      version: VERSAO,
      migrate: (salvo) => {
        const s = salvo as EstadoPersonagem;
        return normalizarEstado(s) as EstadoPersonagem & Acoes;
      },
    },
  ),
);
