// Auth do servidor: usuário + senha (hash pbkdf2, nunca em texto puro) + token estável.
// PRODUÇÃO: tabela `usuarios` no Supabase (ver supabase/schema.sql).
// DEV (sem variáveis do Supabase): arquivos em .dev-data/usuarios/<usuario>.json.
// Importado só pelas API routes.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { usandoSupabase, selecionar, inserir } from "./supabaseServidor";

const DIR = resolve(process.cwd(), ".dev-data", "usuarios");

type UsuarioArmazenado = {
  hash: string;
  salt: string;
  token: string;
  criadoEm: string;
};

export function normalizarUsuario(u: string): string {
  return u.trim().toLowerCase();
}

export function usuarioValido(u: string): boolean {
  return /^[a-z0-9_]{3,20}$/.test(normalizarUsuario(u));
}

export function senhaValida(s: unknown): s is string {
  return typeof s === "string" && s.length >= 4 && s.length <= 100;
}

function hashSenha(senha: string, salt: string): string {
  return pbkdf2Sync(senha, salt, 100_000, 32, "sha256").toString("hex");
}

function conferir(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

async function ler(usuario: string): Promise<UsuarioArmazenado | null> {
  if (usandoSupabase) {
    const linhas = await selecionar<{ hash: string; salt: string; token: string; criado_em: string }>(
      "usuarios",
      `usuario=eq.${encodeURIComponent(usuario)}&select=hash,salt,token,criado_em`,
    );
    const l = linhas[0];
    return l ? { hash: l.hash, salt: l.salt, token: l.token, criadoEm: l.criado_em } : null;
  }
  try {
    return JSON.parse(await readFile(resolve(DIR, `${usuario}.json`), "utf8"));
  } catch {
    return null;
  }
}

/** Grava um usuário NOVO. Retorna false se o nome já existe. */
async function gravar(usuario: string, dados: UsuarioArmazenado): Promise<boolean> {
  if (usandoSupabase) {
    const status = await inserir("usuarios", {
      usuario,
      hash: dados.hash,
      salt: dados.salt,
      token: dados.token,
      criado_em: dados.criadoEm,
    });
    return status !== 409;
  }
  await mkdir(DIR, { recursive: true });
  await writeFile(resolve(DIR, `${usuario}.json`), JSON.stringify(dados));
  return true;
}

export type ResultadoAuth =
  | { ok: true; usuario: string; token: string }
  | { ok: false; erro: string };

export async function registrar(usuarioRaw: string, senha: unknown): Promise<ResultadoAuth> {
  const usuario = normalizarUsuario(usuarioRaw ?? "");
  if (!usuarioValido(usuario))
    return { ok: false, erro: "Usuário inválido (3–20 caracteres: letras, números ou _)." };
  if (!senhaValida(senha)) return { ok: false, erro: "Senha muito curta (mínimo 4)." };
  if (await ler(usuario)) return { ok: false, erro: "Esse usuário já existe." };

  const salt = randomBytes(16).toString("hex");
  const token = randomBytes(24).toString("hex");
  const criado = await gravar(usuario, {
    hash: hashSenha(senha, salt),
    salt,
    token,
    criadoEm: new Date().toISOString(),
  });
  // corrida: duas pessoas criando o mesmo nome ao mesmo tempo
  if (!criado) return { ok: false, erro: "Esse usuário já existe." };
  return { ok: true, usuario, token };
}

export async function entrar(usuarioRaw: string, senha: unknown): Promise<ResultadoAuth> {
  const usuario = normalizarUsuario(usuarioRaw ?? "");
  const u = await ler(usuario);
  if (!u || !senhaValida(senha) || !conferir(u.hash, hashSenha(senha, u.salt))) {
    return { ok: false, erro: "Usuário ou senha incorretos." };
  }
  // token estável (não regenera) → permite vários aparelhos
  return { ok: true, usuario, token: u.token };
}

export async function validarToken(usuarioRaw: string, token: string): Promise<boolean> {
  const usuario = normalizarUsuario(usuarioRaw ?? "");
  const u = await ler(usuario);
  return Boolean(u && token && u.token === token);
}
