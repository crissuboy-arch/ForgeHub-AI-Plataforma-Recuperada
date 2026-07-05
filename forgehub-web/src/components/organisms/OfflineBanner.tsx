'use client';
// src/components/organisms/OfflineBanner.tsx — detecta ausência de internet (item 5).
import React, { useEffect, useState } from 'react';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] flex flex-wrap items-center justify-center gap-2 border-t border-warning/30 bg-warning/15 px-4 py-3 text-sm text-warning backdrop-blur">
      <Icon name="bolt" size={16} />
      <span className="font-semibold">{t('off.title')}</span>
      <span className="text-warning/80">{t('off.desc')}</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="ml-2 rounded-interactive border border-warning/40 px-3 py-1 font-semibold transition-colors hover:bg-warning/20"
      >
        {t('off.retry')}
      </button>
    </div>
  );
};
