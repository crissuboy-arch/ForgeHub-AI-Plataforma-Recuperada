'use client';
// src/components/molecules/SocialAuth.tsx — botões de login social (Google / GitHub).
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from '../organisms/Toast';
import { authErrorKey } from '../../lib/authErrors';

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.87z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.08 7.95-2.91l-3.88-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

const GitHubMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.35.78 1.05.78 2.12v3.14c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

export const SocialAuth: React.FC = () => {
  const { signInWithProvider } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  const go = async (provider: 'google' | 'github') => {
    setBusy(provider);
    try {
      await signInWithProvider(provider); // redireciona no sucesso
    } catch (e) {
      toast(t(authErrorKey(e)), 'error');
      setBusy(null);
    }
  };

  const btn = 'flex h-11 w-full items-center justify-center gap-2 rounded-interactive border border-border bg-surface text-sm font-semibold text-content transition-colors hover:bg-card disabled:opacity-60';

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => go('google')} disabled={!!busy} className={btn}>
        <GoogleMark /> {t('auth.google')}
      </button>
      <button type="button" onClick={() => go('github')} disabled={!!busy} className={btn}>
        <GitHubMark /> {t('auth.github')}
      </button>
    </div>
  );
};
