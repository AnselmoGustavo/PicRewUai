-- PicRewUai — estrutura do banco no Supabase.
-- Como usar: Supabase → SQL Editor → New query → cole TUDO isto → Run.
-- Pode rodar de novo sem problema (usa "if not exists").
--
-- Segurança: o app acessa o banco SÓ pelo servidor (API routes na Vercel), com a chave
-- service_role. Por isso o RLS fica LIGADO e SEM políticas: ninguém com a chave pública
-- (anon) consegue ler ou escrever nada direto.

-- Contas (usuário + senha com hash pbkdf2; o token mantém a pessoa logada em vários aparelhos)
create table if not exists public.usuarios (
  usuario    text primary key,
  hash       text not null,
  salt       text not null,
  token      text not null,
  criado_em  timestamptz not null default now()
);

-- Progresso do personagem (estado do editor), 1 linha por usuário
create table if not exists public.progresso (
  usuario        text primary key references public.usuarios (usuario) on delete cascade,
  estado         jsonb not null,
  atualizado_em  timestamptz not null default now()
);

-- Cartas enviadas (envio único por usuário). O PNG fica no Storage: bucket "cartas", <usuario>.png
create table if not exists public.cartas (
  usuario          text primary key references public.usuarios (usuario) on delete cascade,
  arquivo          text not null,
  nome_personagem  text,
  titulo           text,
  animal           text,
  classe           text,
  cenario          text,
  status           jsonb,
  enviado_em       timestamptz not null default now()
);

alter table public.usuarios  enable row level security;
alter table public.progresso enable row level security;
alter table public.cartas    enable row level security;

-- Bucket PRIVADO para os PNGs das cartas (só a service_role acessa)
insert into storage.buckets (id, name, public)
values ('cartas', 'cartas', false)
on conflict (id) do nothing;
