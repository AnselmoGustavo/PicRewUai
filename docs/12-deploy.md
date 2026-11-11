# 12 — Deploy (colocar o app no ar)

**Vercel** hospeda o app (grátis, publica sozinho a cada `git push`).
**Supabase** guarda as contas, o progresso dos personagens e as cartas enviadas (grátis até ~500 MB de banco e 1 GB de arquivos).

Sem as variáveis do Supabase o app continua funcionando localmente com o mock em arquivo (`.dev-data/`, `envios/`).

## 1. Supabase (banco + cartas)

1. Crie uma conta em <https://supabase.com> → **New project**. Região: **South America (São Paulo)**. Guarde a senha do banco (não é usada pelo app, mas o Supabase pede).
2. No projeto: **SQL Editor → New query** → cole todo o conteúdo de [`supabase/schema.sql`](../supabase/schema.sql) → **Run**. Isso cria:
   - tabelas `usuarios`, `progresso` e `cartas`;
   - o bucket **privado** `cartas` (Storage), onde ficam os PNGs (`<usuario>.png`).
3. Em **Project Settings → API** (ou **API Keys**), copie:
   - **Project URL** → vai em `SUPABASE_URL`
   - chave **`service_role`** (secreta) → vai em `SUPABASE_SERVICE_KEY`

> ⚠️ A `service_role` dá acesso total ao banco. Ela só fica no servidor (Vercel) e no seu `.env.local` — **nunca** no código nem no GitHub (o `.env.local` já está no `.gitignore`).

## 2. Vercel (o app)

1. Faça **commit e push** de tudo (inclusive `public/assets/` e `src/lib/itens-gerados.json`, que o app usa).
2. Crie uma conta em <https://vercel.com> entrando com o GitHub → **Add New → Project** → importe o repositório `PicRewUai`. O framework (Next.js) é detectado sozinho; não mude nada do build.
3. Antes de clicar em **Deploy**, abra **Environment Variables** e adicione:
   | Nome | Valor |
   |------|-------|
   | `SUPABASE_URL` | Project URL do passo 1.3 |
   | `SUPABASE_SERVICE_KEY` | chave `service_role` do passo 1.3 |
4. **Deploy.** Em ~2 min sai o link (`picrewuai-xxx.vercel.app`). Dá para trocar o nome em **Settings → Domains** (ex.: `picrewuai.vercel.app`) ou ligar um domínio próprio.

Depois disso, todo `git push` na `main` publica uma versão nova sozinho.

> Mudou variável de ambiente na Vercel? Ela só vale após um **Redeploy** (Deployments → ⋯ → Redeploy).

## 3. Conferir se está tudo ligado

1. Abra o link, **crie uma conta de teste**, monte um personagem e **envie**.
2. No Supabase:
   - **Table Editor → usuarios**: a conta aparece;
   - **Table Editor → progresso**: o estado do personagem aparece;
   - **Table Editor → cartas** + **Storage → cartas**: a carta (`<usuario>.png`) aparece.
3. Apague a conta de teste em `usuarios` (apaga junto o progresso e a linha da carta) e o PNG em **Storage → cartas**.

## 4. Durante o evento: baixar as cartas para a gráfica

No seu computador, com o `.env.local` preenchido (mesmas 2 variáveis da Vercel):

```bash
npm run baixar-cartas
```

Baixa todos os PNGs para `cartas-baixadas/` e gera `cartas-baixadas/cartas.csv` (usuário, nome, título, animal, classe, cenário, status, data). Pode rodar quantas vezes quiser: só baixa as novas.

## Como os dados ficam guardados

| O quê | Onde | Observação |
|-------|------|------------|
| Conta | tabela `usuarios` | senha com hash pbkdf2 (nunca em texto); token estável → mesma conta em vários aparelhos |
| Personagem em edição | tabela `progresso` (`estado` jsonb) | salvo automaticamente a cada mudança, enquanto logado |
| Carta final | Storage `cartas/<usuario>.png` + tabela `cartas` | **1 envio por usuário**; reenviar não sobrescreve (responde "já enviado") |

O navegador nunca fala direto com o Supabase: tudo passa pelas API routes (`/api/auth`, `/api/progresso`, `/api/enviar-carta`), que validam usuário + token. Por isso o RLS fica ligado **sem** políticas.

## Limites a ter em mente

- **Vercel (Hobby):** corpo de requisição até 4,5 MB — a carta tem ~1,6 MB. O plano Hobby é para uso não comercial; para um evento interno é o usual.
- **Supabase (Free):** 1 GB de Storage ≈ 600 cartas. Projeto **pausa após 7 dias sem uso** — abra o painel/app antes do evento para "acordar" se ficou parado.
