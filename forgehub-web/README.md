# ForgeHub AI

Plataforma SaaS premium e multilíngue (pt-BR / es / en): uma **biblioteca de Kits de negócio digital remixáveis**. Cada Kit reúne App + Página de Vendas + Checkout + Ebook + Templates + Prompts + Criativos + Vídeos + Mockups, entregues como **links externos** (Lovable, Base44, Bolt, Canva, Google Drive, Kiwify, Hotmart…). A ForgeHub **organiza e entrega os links** — não hospeda os produtos.

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Supabase · React Query.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```

## Variáveis de ambiente

Veja [`.env.example`](.env.example) para a lista completa e comentada.

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Endpoint do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Chave pública (anon) do Supabase |
| `NEXT_PUBLIC_FORGEHUB_CHECKOUT_URL` | — | Checkout externo do CTA da `/oferta` (vazio → `/signup`) |
| `NEXT_PUBLIC_SKU_LIBRARY_URL` | — | Link externo da grade da biblioteca |
| `NEXT_PUBLIC_AUTH_VIDEO_URL` | — | Vídeo de fundo em login/cadastro |
| `OPENAI_API_KEY` | — | **Só build/dev**: gerar imagens dos nichos. Não usar em produção |

> As chaves reais ficam em `.env.local`, que é **gitignored**. Nunca comite `.env.local`.

## Banco de dados (Supabase)

As migrations ficam em [`supabase/migrations/`](supabase/migrations/). Rode cada arquivo **isolado** no SQL Editor do Supabase, na ordem numérica. **Não** rode `apply_all.sql`.

- A `0012_link_types.sql` adiciona os tipos de link dos entregáveis (`checkout`, `ebook_pdf`, `ebook_canva`, `criativos`, `videos`, `instrucoes`). Um `ALTER TYPE … ADD VALUE` precisa ser aplicado antes de ser consumido, por isso roda isolado.

## Build de produção

```bash
npm run build   # compila + checagem de tipos + páginas estáticas
npm start        # serve o build
```

## Deploy (Vercel)

1. Importe o repositório na Vercel e defina **Root Directory = `forgehub-web`**.
2. Em *Environment Variables*, adicione as duas obrigatórias do Supabase e as opcionais desejadas (o `OPENAI_API_KEY` **não** é necessário em produção).
3. Build Command `npm run build` e Output padrão do Next.js (detectado automaticamente).
4. Aplique as migrations pendentes no Supabase antes do primeiro acesso.

## Arquitetura orientada a dados ("Regra de Ouro")

Novo nicho, bônus, slide ou entregável = **uma entrada em arquivo de config**, nunca editar componentes React:

- `src/config/niches.ts` — nichos do Hero
- `src/config/bonus-library.ts` — Biblioteca de Bônus
- `src/data/heroSlides.ts` — carrossel do Hero
- `src/lib/assetSchema.ts` (`LINK_FIELDS`) — entregáveis/links dos Kits
- `src/lib/i18n/dictionary.ts` — traduções (pt-BR / es / en)
