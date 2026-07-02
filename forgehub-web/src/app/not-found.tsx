// src/app/not-found.tsx
import Link from 'next/link';
import { Typography } from '../components/atoms/Typography';
import { Icon } from '../components/atoms/Icon';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="text-brand-glow text-7xl font-bold tracking-tight">404</span>
      <Typography variant="h3" className="mt-4">
        Página não encontrada
      </Typography>
      <Typography variant="p" className="mt-2 max-w-md">
        O ativo ou a rota que você procura não existe ou foi movida.
      </Typography>
      <Link
        href="/dashboard"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
      >
        <Icon name="home" size={16} />
        Voltar ao Dashboard
      </Link>
    </div>
  );
}
