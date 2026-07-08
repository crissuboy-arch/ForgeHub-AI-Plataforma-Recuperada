# Deploy da ForgeHub AI na Vercel

Guia passo a passo para publicar o projeto em produção. Todo o processo é feito
pelo site da Vercel (nenhum comando de terminal é necessário para o deploy).

> **Importante sobre a estrutura:** o app Next.js fica na subpasta **`forgehub-web/`**,
> não na raiz do repositório. Isso muda uma configuração no passo 2 (Root Directory).

---

## Pré-requisitos (já prontos ✅)

- [x] Build de produção passa sem erros (`npm run build`)
- [x] Repositório no GitHub: `crissuboy-arch/github.com-crissuboy-arch-ForgeHub-AI`
- [x] `.env.example` documentando todas as variáveis
- [x] Nenhuma URL `localhost` hardcoded no código
- [x] Imagens em `/public` com caminho relativo
- [x] Responsivo em mobile/tablet/desktop
- [x] `.env.local` (chaves reais) está no `.gitignore` — nunca vai para o repositório

---

## Passo 1 — Entrar na Vercel e conectar o GitHub

1. Acesse **https://vercel.com** e faça login (ou crie a conta) usando **"Continue with GitHub"**.
2. Autorize a Vercel a acessar sua conta do GitHub.
3. Se pedir para escolher repositórios, selecione **All repositories** ou apenas
   o repositório **`github.com-crissuboy-arch-ForgeHub-AI`**.

## Passo 2 — Importar o projeto

1. No painel da Vercel, clique em **"Add New…" → "Project"**.
2. Na lista de repositórios, encontre **`github.com-crissuboy-arch-ForgeHub-AI`** e clique em **"Import"**.
3. Na tela de configuração (**Configure Project**):
   - **Root Directory**: clique em **"Edit"** e selecione a pasta **`forgehub-web`**.
     ⚠️ Este passo é obrigatório — sem ele o build falha, porque o `package.json`
     do app está dentro de `forgehub-web/`, não na raiz.
   - **Framework Preset**: deve detectar **Next.js** automaticamente. Se não, selecione **Next.js**.
   - **Build Command / Output**: deixe o padrão do Next.js (a Vercel preenche sozinha).

## Passo 3 — Configurar as variáveis de ambiente

Ainda na tela de import (ou depois em **Project → Settings → Environment Variables**),
adicione as variáveis abaixo. Os **nomes** vêm do `forgehub-web/.env.example`;
os **valores reais** são seus (pegue no painel do Supabase).

### Obrigatórias

| Nome | Onde pegar o valor | Ambiente |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key | Production, Preview, Development |

### Opcionais (só se for usar)

| Nome | Para que serve |
| --- | --- |
| `NEXT_PUBLIC_FORGEHUB_CHECKOUT_URL` | Sobrescreve o link de checkout dos CTAs. **Não é obrigatória** — já existe um padrão Kiwify no código. Defina só se quiser trocar o destino sem alterar código. |
| `NEXT_PUBLIC_SKU_LIBRARY_URL` | Link externo da grade da biblioteca (hook `useSku`). |
| `NEXT_PUBLIC_AUTH_VIDEO_URL` | URL de um `.mp4` de fundo nas telas de login/cadastro. |

### NÃO configurar em produção

| Nome | Motivo |
| --- | --- |
| `OPENAI_API_KEY` | Usada só em build/dev para gerar as imagens dos nichos. As 15 imagens já estão versionadas em `public/images/niches/`. **Não coloque na Vercel.** |

> Dica: ao colar cada variável, marque os três ambientes (**Production, Preview, Development**)
> para o preview de branches também funcionar.

## Passo 4 — Deploy

1. Clique em **"Deploy"**.
2. Aguarde o build (alguns minutos). Ao terminar, a Vercel mostra a URL pública
   (algo como `https://forgehub-ai.vercel.app`).
3. Abra a URL e confira a home (`/`) e a página de vendas (`/oferta`).

## Passo 5 — (Opcional) Domínio próprio

Em **Project → Settings → Domains**, adicione seu domínio e siga as instruções de DNS.

---

## Banco de dados (Supabase) — antes do primeiro acesso

As migrations ficam em `forgehub-web/supabase/migrations/`. Rode cada arquivo
**isolado** no SQL Editor do Supabase, na ordem numérica. **Não** rode `apply_all.sql`.
(A `0012_link_types.sql` já foi aplicada.)

## Deploys seguintes

A Vercel faz deploy automático a cada `git push` na branch `main`.
Ex.: para publicar o vídeo do Hero, basta subir `forgehub-web/public/videos/hero-avatar.mp4`,
commitar e dar push — a Vercel reconstrói sozinha, sem mexer em código.
