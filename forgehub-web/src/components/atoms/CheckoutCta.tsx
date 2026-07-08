// src/components/atoms/CheckoutCta.tsx
// CTA de checkout compartilhado (landing / e página de vendas /oferta).
// Aponta para o checkout real (Kiwify com UTM); env var sobrescreve se definida.
// Abre em nova aba mantendo a página de vendas aberta. Se a URL ficar vazia,
// cai para /signup.
import Link from 'next/link';

export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_FORGEHUB_CHECKOUT_URL ||
  'https://pay.kiwify.com.br/iY5RLP7?utm_source=forgehub_site&utm_medium=landing_page';

export const CheckoutCta = ({ label, className = '' }: { label: string; className?: string }) =>
  CHECKOUT_URL ? (
    <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href="/signup" className={className}>
      {label}
    </Link>
  );
