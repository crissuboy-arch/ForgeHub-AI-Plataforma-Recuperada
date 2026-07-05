'use client';
// src/app/(auth)/login/page.tsx — Login premium ForgeHub com fundo de vídeo.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components/molecules/FormField';
import { PasswordInput } from '../../../components/molecules/PasswordInput';
import { SocialAuth } from '../../../components/molecules/SocialAuth';
import { VideoBackground } from '../../../components/molecules/VideoBackground';
import { Button } from '../../../components/atoms/Button';
import { Typography } from '../../../components/atoms/Typography';
import { Icon } from '../../../components/atoms/Icon';
import { Logo } from '../../../components/atoms/Logo';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { useToast } from '../../../components/organisms/Toast';
import { authErrorKey } from '../../../lib/authErrors';

const REMEMBER_KEY = 'fh-remember-email';
// URL do vídeo de fundo (mp4/webm) via env NEXT_PUBLIC_AUTH_VIDEO_URL. Vazio = gradiente da marca.
const LOGIN_VIDEO_URL = process.env.NEXT_PUBLIC_AUTH_VIDEO_URL || '';

export default function LoginPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { signIn, resetPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(REMEMBER_KEY) : null;
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);
    setLoading(true);
    try {
      await signIn(email, password);
      if (remember) window.localStorage.setItem(REMEMBER_KEY, email);
      else window.localStorage.removeItem(REMEMBER_KEY);
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorKey(authErrorKey(err));
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async () => {
    if (!email.trim()) {
      toast(t('auth.forgotNeedEmail'), 'info');
      return;
    }
    setResetting(true);
    try {
      await resetPassword(email.trim());
      toast(t('auth.forgotSent'), 'success');
    } catch (err) {
      toast(t(authErrorKey(err)), 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      <VideoBackground videoUrl={LOGIN_VIDEO_URL} />

      <div className="animate-in relative z-20 w-full max-w-md">
        <div className="glass rounded-container p-8 shadow-modal">
          {/* Marca */}
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-content">
              <Icon name="back" size={15} /> {t('auth.back')}
            </Link>
          </div>

          <Typography variant="h3" className="mb-1">{t('auth.login')}</Typography>
          <Typography variant="small" className="mb-6 block">{t('auth.loginSubtitle')}</Typography>

          {errorKey && (
            <div className="mb-4 rounded-interactive border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {t(errorKey)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField
                id="email"
                label={t('auth.email')}
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <PasswordInput
                id="password"
                label={t('auth.password')}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-content">
                <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                {t('auth.remember')}
              </label>
              <button type="button" onClick={onForgot} disabled={resetting} className="text-sm text-primary transition-colors hover:text-primary-hover disabled:opacity-60">
                {t('auth.forgot')}
              </button>
            </div>

            <Button type="submit" variant="primary" loading={loading} className="mt-6 w-full">
              {t('auth.login')}
            </Button>
          </form>

          {/* Divisor + social */}
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
            <span className="h-px flex-1 bg-border" /> {t('auth.or')} <span className="h-px flex-1 bg-border" />
          </div>
          <SocialAuth />

          <Typography variant="small" className="mt-6 block text-center">
            {t('auth.noAccount')}{' '}
            <Link href="/signup" className="font-medium text-primary hover:text-primary-hover">{t('auth.signupLink')}</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
