// Tipos centrais do domínio. Ver docs/05-modelo-de-dados.md.

export type Animal =
  | "sapo"
  | "macaco"
  | "raposa"
  | "gato"
  | "veado"
  | "carpa"
  | "coruja"
  | "cachorro";

export type Classe = "guerreiro" | "arqueiro" | "mago" | "bardo" | "ninja";

export type Categoria =
  | "vestimenta"
  | "arma"
  | "cabeca"
  | "acessorio1"
  | "acessorio2";

// 'inicial' sempre liberado; um grupo por dia do evento.
export type GrupoDesbloqueio = "inicial" | "dia1" | "dia2" | "dia3" | "dia4";

export type Tema = "claro" | "escuro"; // claro → moldura dia · escuro → moldura noite

export interface ItemDef {
  id: string;
  nome: string;
  categoria: Categoria;
  classe: Classe;
  grupo: GrupoDesbloqueio;
  arquivo?: string; // caminho do PNG (ainda placeholder)
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

export interface Selecao {
  vestimenta: string | null;
  arma: string | null;
  cabeca: string | null;
  acessorio1: string | null;
  acessorio2: string | null;
}

export interface Status {
  vida: number;
  forca: number;
  intelecto: number;
  velocidade: number;
}

export interface Ficha {
  nomePersonagem: string;
  status: Status;
  habilidade?: string;
}

export interface EstadoPersonagem {
  versao: number;
  animal: Animal | null;
  classe: Classe | null;
  cenario: string | null;
  selecao: Selecao;
  ficha: Ficha;
  desbloqueios: GrupoDesbloqueio[];
  enviado: boolean;
}

export const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: "vestimenta", nome: "Vestimenta" },
  { id: "arma", nome: "Arma" },
  { id: "cabeca", nome: "Item de cabeça" },
  { id: "acessorio1", nome: "Acessório 1" },
  { id: "acessorio2", nome: "Acessório 2" },
];

export const ANIMAIS: { id: Animal; nome: string; emoji: string }[] = [
  { id: "sapo", nome: "Sapo", emoji: "🐸" },
  { id: "macaco", nome: "Macaco", emoji: "🐵" },
  { id: "raposa", nome: "Raposa", emoji: "🦊" },
  { id: "gato", nome: "Gato", emoji: "🐱" },
  { id: "veado", nome: "Veado", emoji: "🦌" },
  { id: "carpa", nome: "Carpa", emoji: "🐟" },
  { id: "coruja", nome: "Coruja", emoji: "🦉" },
  { id: "cachorro", nome: "Cachorro", emoji: "🐶" },
];

export const CLASSES: { id: Classe; nome: string; emoji: string; desc: string }[] = [
  { id: "guerreiro", nome: "Guerreiro", emoji: "⚔️", desc: "Força e defesa em combate corpo a corpo." },
  { id: "arqueiro", nome: "Arqueiro", emoji: "🏹", desc: "Precisão e ataques à distância." },
  { id: "mago", nome: "Mago", emoji: "🔮", desc: "Magia arcana e conhecimento." },
  { id: "bardo", nome: "Bardo", emoji: "🎵", desc: "Música, carisma e suporte." },
  { id: "ninja", nome: "Ninja", emoji: "🥷", desc: "Agilidade e furtividade." },
];
