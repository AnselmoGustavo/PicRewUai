// Gera um código pessoal legível usado como chave de sincronização (ADR-015).
// Ex.: "raposa-7k3q". Palavra temática + sufixo de 4 chars sem caracteres ambíguos.

const PALAVRAS = [
  "raposa", "sapo", "macaco", "gato", "veado", "carpa", "coruja", "cachorro",
  "mago", "bardo", "ninja", "arqueiro", "guerreiro", "dragao", "grifo", "fenix",
  "elfo", "anao", "druida", "golem", "sereia", "centauro", "quimera", "hidra",
  "basilisco", "minotauro", "valquiria", "feiticeira", "cavaleiro", "trovador",
];

// sem 0/1/i/l/o para evitar confusão ao digitar
const CHARS = "23456789abcdefghjkmnpqrstuvwxyz";

export function gerarCodigoPessoal(): string {
  const palavra = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
  let sufixo = "";
  for (let i = 0; i < 4; i++) {
    sufixo += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `${palavra}-${sufixo}`;
}

export function normalizarCodigo(c: string): string {
  return c.trim().toLowerCase();
}

// valida o formato palavra-XXXX (só para feedback rápido de digitação)
export function formatoValido(c: string): boolean {
  return /^[a-zç]+-[23456789abcdefghjkmnpqrstuvwxyz]{4}$/.test(normalizarCodigo(c));
}
