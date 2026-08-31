# Auditoria & Otimização SEO — ForgeHub AI

Referência de método: **Agentic-SEO-Skill** (Bhanunamikaze) — sub-skills *SEO Technical, SEO Page,
SEO Schema, SEO Images, SEO GEO, SEO AEO, SEO Sitemap*. A skill não foi adicionada como dependência
do projeto; foi usada como checklist/rubrica ("Finding → Evidence → Impact → Fix", JSON-LD only,
mobile-first, INP em vez de FID, cautela com FAQPage).

Data: 2026-08-31 · Alvo principal: `/` (home / página de vendas pública) · Secundário: `/oferta`.

---

## 1. Projeto analisado

| Item | Valor |
|---|---|
| Framework | Next.js 16.2.9 (App Router, Turbopack) + React 19 |
| Estilo | Tailwind v4 (`@theme` tokens), design system próprio (navy/azul/ciano/dourado) |
| i18n | Dicionário próprio pt-BR / es / en (client), `lang` do HTML = `pt-BR` |
| Deploy | Vercel → `https://www.devforgehub.online` |
| Rotas públicas | `/` (home), `/oferta` (vendas oficial), `/planos`, `/login`, `/signup` |
| Rotas privadas | `/dashboard`, `/admin`, `/settings`, `/perfil`, `/assets/*`, `/api/*` |
| Página de vendas | `/` e `/oferta` — ambas eram `'use client'` (não exportavam `metadata`) |

Design, copy, cores, layout e componentes **preservados**. A única mudança estrutural foi mover o
corpo visual da home para `HomeClient.tsx` (client) e transformar `page.tsx` em Server Component —
necessário para emitir `metadata`, canonical e JSON-LD. Nenhum componente foi alterado.

---

## 2. SEO CORRIGIDO

- **Home sem metadata própria** → `page.tsx` agora é Server Component com `title` absoluto,
  `description` (~155 car.), `canonical`, `keywords`, Open Graph e Twitter completos.
- **Canonical ausente** → `alternates.canonical` em `/` e `/oferta`.
- **`robots.txt` inexistente** → `src/app/robots.ts` (allow geral, disallow de áreas privadas,
  `Host` + `Sitemap`).
- **`sitemap.xml` inexistente** → `src/app/sitemap.ts` (`/`, `/oferta`, `/planos` com prioridade e
  `changefreq`).
- **`manifest` inexistente** → `src/app/manifest.ts` (`/manifest.webmanifest`, nome, cores da marca,
  ícones 512/1024).
- **OG image era um screenshot `.webp` 1440×900** (fora da proporção social, formato ruim para
  WhatsApp) → imagem social dedicada **1200×630 `.jpg` (~66 KB)** com identidade ForgeHub, em
  `app/opengraph-image.jpg` + `app/twitter-image.jpg` + `*.alt.txt`. URL absoluta e dimensões
  emitidas automaticamente pelo Next.
- **`apple-touch-icon` ausente** → `app/apple-icon.png` (180×180, hexágono da marca).
- **`googleBot` / limites de preview** → `max-image-preview:large`, `max-snippet:-1`,
  `max-video-preview:-1` (melhor exibição em SERP e AI Overviews).
- **Sem dados estruturados** → JSON-LD `@graph` na home: `Organization`, `WebSite`, `WebPage`,
  `SoftwareApplication` (com `Offer` real R$ 47,90 / BRL) e `FAQPage` (6 perguntas **reais** da
  página). `/oferta`: `BreadcrumbList` + `SoftwareApplication`/`Offer`.
- **`format-detection`** desligado (evita telefones/emails "clicáveis" falsos no iOS).

## 3. SEO QUE JÁ ESTAVA CERTO

- `metadataBase` correto (`https://www.devforgehub.online`).
- `<html lang="pt-BR">` — **idioma correto** (público BR: R$, "você", Kiwify/Hotmart). `pt-PT` seria
  incorreto. Mantido.
- `viewport` (`width=device-width, initial-scale=1`) injetado pelo Next.
- `favicon.ico` + `icon.svg` presentes e servidos.
- Hierarquia de headings: 1× `<h1>` na home, `<h2>` por seção, `<h3>` em cards. Correta.
- HTML semântico: `<header> <main> <section> <footer> <details>/<summary>` no FAQ.
- **Alt text**: todas as imagens têm `alt` descritivo (`HeroShowcase`, `platform-showcase`,
  `platform-types-showcase`, phone mockups, `lite-youtube`). Imagem decorativa da capa do vídeo com
  `alt=""` (correto).
- **Lazy loading**: componentes pesados (embla, recharts, motion) via `next/dynamic`; imagens do
  carrossel com `loading="lazy"`; hero com `priority` no 1º slide + `sizes`.
- Fontes via `next/font` (Inter + Montserrat, self-host, sem CLS de fonte).
- Vídeo YouTube via *lite embed* + capa própria (0 requisições ao YouTube antes do clique).
- HTTPS + domínio único (Vercel). URLs limpas, sem `.html`, sem query desnecessária.
- Página 404 personalizada (`not-found.tsx`) retornando status 404.
- Checkout externo (Kiwify) é link público com UTM — **não é secret**.

## 4. MELHORIAS REALIZADAS (on-page / GEO / AEO / performance)

- **On-page**: `title`/`description`/OG/keywords passam a citar naturalmente *plataforma de IA,
  produtos digitais, biblioteca de produtos digitais, aplicativos de IA, templates, agentes de IA,
  ferramentas para criadores e empreendedores* — **sem keyword stuffing**, posicionamento comercial
  intacto.
- **AEO**: `FAQPage` com as 6 perguntas reais → elegível para *People Also Ask* e para respostas
  diretas; respostas já são curtas e objetivas na copy.
- **GEO**: entidades explícitas e ligadas por `@id` (`Organization` ↔ `WebSite` ↔ `WebPage` ↔
  `SoftwareApplication`) — facilita interpretação por Google AI Overviews / ChatGPT / Perplexity.
  `SoftwareApplication` + `Offer` dão a um motor generativo o "o que é / quanto custa / onde" de
  forma inequívoca. `description` longa e factual reservada ao JSON-LD.
- **Social**: prévia bonita garantida em WhatsApp / Facebook / LinkedIn / Telegram (imagem
  1200×630 `.jpg` < 300 KB, `og:title`, `og:description`, `og:url`, `og:type`, `og:image:width/height/alt`,
  `twitter:card=summary_large_image`).
- **Performance**: removida a referência à OG `.webp` pesada; imagem social agora 66 KB. Sem novos
  scripts, sem novas dependências, sem preload desnecessário. Home continua **estática (SSG)** —
  LCP/CLS/INP inalterados (mesma árvore visual).

## 5. PENDÊNCIAS QUE EXIGEM AÇÃO MANUAL

1. **Google Search Console**: adicionar a propriedade `https://www.devforgehub.online`, enviar
   `sitemap.xml` e solicitar indexação de `/` e `/oferta`. (Opcional: colar o token em
   `verification.google` no `metadata` da raiz.)
2. **Redirecionar apex → www** (ou vice-versa) na Vercel/DNS, para não competir com o canonical.
3. **`/planos` e `/assets`** hoje renderizam dentro do chrome do app (sidebar). Se quiser
   indexá-las como páginas de marketing, avaliar um layout público — fora do escopo desta tarefa
   (mexeria em layout).
4. **Perfis sociais** (`Organization.sameAs`) não foram inventados — adicionar quando existirem
   Instagram/LinkedIn/YouTube oficiais.
5. **Core Web Vitals de campo**: medir no PageSpeed Insights / CrUX após o deploy (o build local
   não reporta dados de campo).
6. **`llms.txt`** (padrão emergente para motores de IA): pode ser adicionado depois se desejar
   políticas explícitas para crawlers de IA.

## 6. ARQUIVOS MODIFICADOS / CRIADOS

**Criados**
- `src/app/HomeClient.tsx` (corpo da home movido de `page.tsx`, sem alteração de conteúdo)
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/manifest.ts`
- `src/app/opengraph-image.jpg` + `src/app/opengraph-image.alt.txt`
- `src/app/twitter-image.jpg` + `src/app/twitter-image.alt.txt`
- `src/app/apple-icon.png`
- `SEO-AUDIT.md` (este arquivo)

**Modificados**
- `src/app/page.tsx` → Server Component: `metadata` + JSON-LD; renderiza `<HomeClient />`
- `src/app/layout.tsx` → OG/Twitter sem a imagem `.webp` (passa a usar a convenção de arquivo),
  `robots.googleBot`, `authors/creator/publisher`, `format-detection`
- `src/app/oferta/layout.tsx` → `metadata` completa + canonical + JSON-LD (`BreadcrumbList`,
  `SoftwareApplication`/`Offer`)

## 7. Segurança

Nenhum secret exposto. Nenhuma chave adicionada ao frontend. Nenhuma variável de ambiente alterada.
Nenhum dado privado enviado a serviço externo. Imagens sociais geradas localmente.
