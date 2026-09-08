# Meta Pixel — ForgeHub AI

**Pixel ID:** `1610553524011173` (Gerenciador de Eventos da Meta)
**Domínio:** https://www.devforgehub.online

## Como está instalado

| Onde | O quê |
|---|---|
| `src/components/analytics/MetaPixel.tsx` | Tag base **oficial** (copiada do Gerenciador de Eventos), carregada com `next/script` `strategy="afterInteractive"` — não bloqueia render nem hidratação. Inclui o `<noscript>` 1×1. |
| `src/app/layout.tsx` | `<MetaPixel />` montado **uma única vez** no root layout → cobre todas as páginas públicas (`/`, `/oferta`, `/planos`, `/login`, `/signup`) e também as privadas, sem duplicar o Pixel. |
| `src/lib/analytics/meta-pixel.ts` | `META_PIXEL_ID`, dados do produto do checkout e o helper `trackMeta(event, params)` (no-op seguro no SSR / antes do Pixel carregar). |

### PageView (sem duplicação)

- **Carga dura** (F5 / primeiro acesso): o `fbq('track', 'PageView')` da **própria tag base** dispara.
- **Navegação SPA** (App Router, sem reload): re-disparado por `useEffect` sobre o `usePathname()`, **pulando o primeiro render** (`firstRender` ref) para não duplicar o PageView inicial.
- Não usamos `useSearchParams` de propósito — evita opt-out do render estático (SSG) das páginas de marketing.

## Eventos configurados

| Evento | Disparo | Parâmetros | Por quê |
|---|---|---|---|
| `PageView` | toda página, toda navegação | — | Base do Pixel / remarketing. |
| `ViewContent` | ao abrir **`/oferta`** (1× por montagem) | `content_ids: ['iY5RLP7']`, `content_name`, `content_type: 'product'`, `value: 47.90`, `currency: 'BRL'` | `/oferta` é a página oficial de oferta — visualizá-la é interesse no produto. |
| `InitiateCheckout` | clique em **qualquer CTA de checkout** (`CheckoutCta` → link da Kiwify), em `/` e `/oferta` | `content_ids`, `content_name`, `content_type`, `num_items: 1`, `value: 47.90`, `currency: 'BRL'` | O clique leva o usuário ao checkout externo — é o início real do checkout. |

### Purchase — **NÃO disparado neste domínio**

A compra é finalizada na **Kiwify** (`pay.kiwify.com.br`), fora de `devforgehub.online`. Não há retorno/thank-you page neste domínio que confirme pagamento, então disparar `Purchase` aqui seria uma conversão falsa.

**Para ter `Purchase` real:**
- Integração nativa **Kiwify → Meta** (a Kiwify tem campo para o Pixel ID + envia Purchase/CAPI), **ou**
- Conversions API via webhook de compra da Kiwify, **ou**
- Pixel no domínio de obrigado da Kiwify, se existir.

Enquanto isso, otimize campanhas por **`InitiateCheckout`** (evento de conversão mais fundo disponível neste domínio).

## Verificação em produção

1. **Meta Pixel Helper** (extensão Chrome) em `https://www.devforgehub.online` → deve mostrar o Pixel `1610553524011173` ativo, 1 `PageView`.
2. Em `/oferta` → `PageView` + `ViewContent`.
3. Clicar num botão de compra → `InitiateCheckout` (aba do checkout abre em paralelo).
4. **Gerenciador de Eventos → Testar Eventos**: colar a URL e repetir os passos.
5. HTML servido: `connect.facebook.net/en_US/fbevents.js` e `connect.facebook.net/signals/config/1610553524011173` são carregados após a hidratação (não aparecem no `view-source`, aparecem no DOM/painel Network).
