'use client';
// src/components/atoms/CheckoutCta.tsx
// CTA de checkout compartilhado (landing / e página de vendas /oferta).
// Aponta para o checkout real (Kiwify com UTM); env var sobrescreve se definida.
// Abre em nova aba mantendo a página de vendas aberta. Se a URL ficar vazia,
// cai para /signup.
//
// Meta Pixel: o clique nesse CTA (ir para o checkout externo) dispara
// `InitiateCheckout`. NÃO dispara Purchase — a compra acontece na Kiwify,
// fora deste domínio, e não é confirmável aqui.
import Link from 'next/link';
import { trackMeta, CHECKOUT_PRODUCT } from '../../lib/analytics/meta-pixel';

export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_FORGEHUB_CHECKOUT_URL ||
  'https://pay.kiwify.com.br/iY5RLP7?utm_source=forgehub_site&utm_medium=landing_page';

function onCheckoutClick() {
  trackMeta('InitiateCheckout', {
    content_ids: [CHECKOUT_PRODUCT.id],
    content_name: CHECKOUT_PRODUCT.name,
    content_type: 'product',
    num_items: 1,
    value: CHECKOUT_PRODUCT.value,
    currency: CHECKOUT_PRODUCT.currency,
  });
}

export const CheckoutCta = ({ label, className = '' }: { label: string; className?: string }) =>
  CHECKOUT_URL ? (
    <a
      href={CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onCheckoutClick}
    >
      {label}
    </a>
  ) : (
    <Link href="/signup" className={className}>
      {label}
    </Link>
  );
