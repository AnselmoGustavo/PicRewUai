// Tipos centrais do domínio. Ver docs/05-modelo-de-dados.md.

export type Animal = "macaco" | "raposa" | "gato" | "veado" | "cachorro";

export type Classe = "guerreiro" | "arqueiro" | "mago" | "bardo" | "ninja";

export type Categoria =
  | "camisa"
  | "calca"
  | "arma"
  | "calcado"
  | "capa"
  | "chapeu"
  | "acessorio";

// 'inicial' sempre liberado; um grupo por dia do evento.
// 'envio' não libera itens: libera o botão "Enviar personagem" (código próprio, divulgado no último dia).
export type GrupoDesbloqueio = "inicial" | "dia1" | "dia2" | "dia3" | "dia4" | "envio";

export type Tema = "claro" | "escuro"; // claro → moldura dia · escuro → moldura noite

// z-index padrão de cada tipo (menor = mais atrás). O corpo fica em 20.
// Peças de várias camadas (ex.: capa frente z60 + atrás z10) informam o z no nome do arquivo.
// Manter em sincronia com scripts/gerar-assets.mjs.
export const Z_POR_TIPO: Record<Categoria, number> = {
  capa: 10,
  calcado: 30,
  calca: 40,
  camisa: 50,
  arma: 70,
  acessorio: 75,
  chapeu: 80,
};

// Uma camada de um item: PNG full-canvas pré-posicionado + z-index global.
export interface CamadaItem {
  arquivo: string;
  z: number;
}

export interface ItemDef {
  id: string;
  nome: string;
  categoria: Categoria;
  classe: Classe;
  animal?: Animal; // item específico deste animal (ADR-016); ausente = placeholder genérico
  grupo: GrupoDesbloqueio;
  camadas?: CamadaItem[]; // camadas reais (uma peça pode ter várias)
  thumb?: string; // miniatura recortada para a UI de seleção
  cor?: string; // cor do placeholder enquanto não há arte
}

export interface CenarioDef {
  id: string;
  nome: string;
  tema: Tema;
  grupo: GrupoDesbloqueio;
  arquivo?: string;
  cor?: string;
}

export type Selecao = Record<Categoria, string | null>;

export interface Status {
  vida: number;
  forca: number;
  intelecto: number;
  destreza: number;
}

export interface Ficha {
  nomePersonagem: string;
  titulo?: string; // título escolhido entre os desbloqueados (lib/titulos.ts) — vai na carta
  habilidade?: string;
  // status NÃO fica aqui: é calculado de animal+classe+itens (ver lib/status.ts)
}

export interface EstadoPersonagem {
  versao: number;
  animal: Animal | null;
  classe: Classe | null;
  cenario: string | null;
  selecao: Selecao;
  ficha: Ficha;
  desbloqueios: GrupoDesbloqueio[];
  titulos: string[]; // títulos desbloqueados por código (além do inicial)
  enviado: boolean;
  atualizadoEm: number; // epoch ms da última mudança (last-write-wins)
}

export const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: "camisa", nome: "Camisa" },
  { id: "calca", nome: "Calça" },
  { id: "arma", nome: "Arma" },
  { id: "calcado", nome: "Calçado" },
  { id: "capa", nome: "Capa" },
  { id: "chapeu", nome: "Chapéu" },
  { id: "acessorio", nome: "Acessório" },
];

export const ANIMAIS: { id: Animal; nome: string; emoji: string }[] = [
  { id: "macaco", nome: "Macaco", emoji: "🐵" },
  { id: "raposa", nome: "Raposa", emoji: "🦊" },
  { id: "gato", nome: "Gato", emoji: "🐱" },
  { id: "veado", nome: "Veado", emoji: "🦌" },
  { id: "cachorro", nome: "Cachorro", emoji: "🐶" },
];

export const CLASSES: { id: Classe; nome: string; emoji: string; desc: string }[] = [
  { id: "guerreiro", nome: "Guerreiro", emoji: "⚔️", desc: "Força e defesa em combate corpo a corpo." },
  { id: "arqueiro", nome: "Arqueiro", emoji: "🏹", desc: "Precisão e ataques à distância." },
  { id: "mago", nome: "Mago", emoji: "🔮", desc: "Magia arcana e conhecimento." },
  { id: "bardo", nome: "Bardo", emoji: "🎵", desc: "Música, carisma e suporte." },
  { id: "ninja", nome: "Ninja", emoji: "🥷", desc: "Agilidade e furtividade." },
];
