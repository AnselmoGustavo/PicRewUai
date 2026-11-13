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
import { ANIMAIS, CATEGORIAS_MULTIPLAS } from "./tipos";
import { validarCodigo, titulosDoCodigo, itensDoCodigo, TODOS_OS_GRUPOS } from "./codigos";
import { TITULOS, TITULO_INICIAL } from "./titulos";
import { CENARIOS } from "./manifesto";

// v2: categorias passaram de 5 (vestimenta, acessorio1...) para 7 tipos (camisa, calca...)
// v3: saíram os animais sapo, coruja e carpa
// v4: saíram os cenários Padrão e dia 4 (3 cenários no total)
// v5: título deixou de ser texto livre (lista em lib/titulos.ts, liberada por códigos)
// v6: itens com código próprio (lib/codigosItens.ts) → itensLiberados
// v7: seleção vira lista por tipo (vários acessórios) + escudo como tipo próprio
const VERSAO = 7;

/** Títulos que o personagem pode escolher: o inicial + os desbloqueados que ainda existem na lista. */
export function titulosDisponiveis(desbloqueados: string[] | undefined): string[] {
  const ok = new Set(desbloqueados ?? []);
  return [TITULO_INICIAL, ...TITULOS.map((t) => t.titulo).filter((t) => ok.has(t))];
}

const SELECAO_VAZIA: Selecao = {
  camisa: [],
  calca: [],
  arma: [],
  escudo: [],
  calcado: [],
  capa: [],
  chapeu: [],
  acessorio: [],
};
const selecaoVazia = (): Selecao =>
  Object.fromEntries(Object.keys(SELECAO_VAZIA).map((k) => [k, []])) as unknown as Selecao;

// Saves antigos (ou vindos do servidor) podem ter: 1 id por tipo (string) em vez de lista,
// tipos que não existem mais, ou o escudo ainda como arma. Reagrupa cada id pelo tipo que
// está no próprio id ("animal-classe-TIPO-nome-dia") e respeita o limite de 1 nos tipos simples.
function normalizarSelecao(s: Partial<Record<string, string | string[] | null>> | undefined): Selecao {
  const out = selecaoVazia();
  const ids = Object.values(s ?? {}).flat().filter((x): x is string => typeof x === "string" && !!x);
  for (const idOriginal of ids) {
    const id = idOriginal.replace("-arma-escudo_", "-escudo-escudo_"); // escudo virou tipo próprio
    const tipo = id.split("-")[2] as Categoria;
    if (!(tipo in out)) continue;
    if (CATEGORIAS_MULTIPLAS.includes(tipo)) {
      if (!out[tipo].includes(id)) out[tipo].push(id);
    } else {
      out[tipo] = [id];
    }
  }
  return out;
}

// Também descarta animais que saíram do jogo (sapo, coruja, carpa): a pessoa escolhe de novo.
function normalizarEstado(e: EstadoPersonagem): EstadoPersonagem {
  const animalValido = ANIMAIS.some((a) => a.id === e?.animal);
  return {
    ...e,
    animal: animalValido ? e.animal : null,
    selecao: animalValido ? normalizarSelecao(e?.selecao as never) : selecaoVazia(),
    // cenários que saíram (Padrão, dia 4) → escolhe de novo
    cenario: CENARIOS.some((c) => c.id === e?.cenario) ? e.cenario : null,
    titulos: e?.titulos ?? [],
    itensLiberados: e?.itensLiberados ?? [],
    // título fora da lista (texto livre antigo, ou título que foi renomeado) → volta ao inicial
    ficha: {
      ...e?.ficha,
      nomePersonagem: e?.ficha?.nomePersonagem ?? "",
      titulo: titulosDisponiveis(e?.titulos).includes(e?.ficha?.titulo ?? "")
        ? e.ficha.titulo
        : TITULO_INICIAL,
    },
  };
}

const estadoInicial: EstadoPersonagem = {
  versao: VERSAO,
  animal: null,
  classe: null,
  cenario: null,
  selecao: selecaoVazia(),
  ficha: {
    nomePersonagem: "",
    titulo: TITULO_INICIAL,
    habilidade: "",
  },
  desbloqueios: ["inicial"],
  titulos: [],
  itensLiberados: [],
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
  /** Aplica um código: grupo do dia/envio/mestre e/ou títulos. */
  aplicarCodigo: (input: string) => {
    resultado: ReturnType<typeof validarCodigo>;
    titulosNovos: string[];
    itensNovos: string[];
  };
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
          selecao: selecaoVazia(),
          atualizadoEm: agora(),
        }),

      setClasse: (c) =>
        set({
          classe: c,
          selecao: selecaoVazia(),
          atualizadoEm: agora(),
        }),

      setCenario: (id) => set({ cenario: id, atualizadoEm: agora() }),

      // id null = "Nenhum" (limpa o tipo). Tipo múltiplo: liga/desliga o item. Simples: troca.
      selecionarItem: (cat, id) =>
        set((s) => {
          const atual = s.selecao[cat] ?? [];
          let nova: string[];
          if (id === null) nova = [];
          else if (CATEGORIAS_MULTIPLAS.includes(cat))
            nova = atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id];
          else nova = [id];
          return { selecao: { ...s.selecao, [cat]: nova }, atualizadoEm: agora() };
        }),

      setNome: (nome) =>
        set((s) => ({
          ficha: { ...s.ficha, nomePersonagem: nome },
          atualizadoEm: agora(),
        })),

      setTitulo: (titulo) =>
        set((s) =>
          titulosDisponiveis(s.titulos).includes(titulo)
            ? { ficha: { ...s.ficha, titulo }, atualizadoEm: agora() }
            : {},
        ),

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
        const atuaisT = get().titulos ?? [];
        const titulosNovos = titulosDoCodigo(input).filter((t) => !atuaisT.includes(t));
        if (titulosNovos.length) {
          set({ titulos: [...atuaisT, ...titulosNovos], atualizadoEm: agora() });
        }
        const atuaisI = get().itensLiberados ?? [];
        const itensNovos = itensDoCodigo(input).filter((k) => !atuaisI.includes(k));
        if (itensNovos.length) {
          set({ itensLiberados: [...atuaisI, ...itensNovos], atualizadoEm: agora() });
        }
        return { resultado: r, titulosNovos, itensNovos };
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
