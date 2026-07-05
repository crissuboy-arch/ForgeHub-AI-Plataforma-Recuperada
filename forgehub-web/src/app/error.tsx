'use client';
// src/app/error.tsx
import { useEffect } from 'react';
import { Typography } from '../components/atoms/Typography';
import { Button } from '../components/atoms/Button';
import { Icon } from '../components/atoms/Icon';
import { useLanguage } from '../lib/i18n/LanguageProvider';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();
  useEffect(() => {
    // Em produção, isto iria para o monitoramento.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-container bg-danger/15 text-danger">
        <Icon name="bolt" size={32} />
      </div>
      <Typography variant="h3">{t('err.title')}</Typography>
      <Typography variant="p" className="mt-2 max-w-md">
        {t('err.desc')}
      </Typography>
      <div className="mt-8">
        <Button variant="primary" onClick={reset}>
          {t('err.retry')}
        </Button>
      </div>
    </div>
  );
}
