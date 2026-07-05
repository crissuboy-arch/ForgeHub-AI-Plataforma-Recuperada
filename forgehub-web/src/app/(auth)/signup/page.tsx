'use client';
// src/app/(auth)/signup/page.tsx — Cadastro premium ForgeHub com fundo de vídeo.
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components/molecules/FormField';
import { PasswordInput } from '../../../components/molecules/PasswordInput';
import { PasswordStrength } from '../../../components/molecules/PasswordStrength';
import { SocialAuth } from '../../../components/molecules/SocialAuth';
import { VideoBackground } from '../../../components/molecules/VideoBackground';
import { Button } from '../../../components/atoms/Button';
import { Typography } from '../../../components/atoms/Typography';
import { Icon } from '../../../components/atoms/Icon';
import { Logo } from '../../../components/atoms/Logo';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';
import { authErrorKey } from '../../../lib/authErrors';

// URL do vídeo de fundo (mp4/webm) via env NEXT_PUBLIC_AUTH_VIDEO_URL. Vazio = gradiente da marca.
const SIGNUP_VIDEO_URL = process.env.NEXT_PUBLIC_AUTH_VIDEO_URL || '';

export default function SignupPage() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorKey(null);
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      router.push('/dashboard');
    } catch (err: unknown) {
      setErrorKey(authErrorKey(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-12">
      <VideoBackground videoUrl={SIGNUP_VIDEO_URL} />

      <div className="animate-in relative z-20 w-full max-w-md">
        <div className="glass rounded-container p-8 shadow-modal">
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-content">
              <Icon name="back" size={15} /> {t('auth.back')}
            </Link>
          </div>

          <Typography variant="h3" className="mb-1">{t('auth.createAccount')}</Typography>
          <Typography variant="small" className="mb-6 block">{t('auth.signupSubtitle')}</Typography>

          {errorKey && (
            <div className="mb-4 rounded-interactive border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {t(errorKey)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField
                id="fullName"
                label={t('auth.fullName')}
                type="text"
                placeholder={t('auth.fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
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
              <div>
                <PasswordInput
                  id="password"
                  label={t('auth.password')}
                  value={password}
                  onChange={setPassword}
                  placeholder={t('auth.passwordMin')}
                  autoComplete="new-password"
                  required
                />
                <PasswordStrength password={password} />
              </div>
            </div>

            <Typography variant="caption" className="mt-4 block">{t('auth.terms')}</Typography>

            <Button type="submit" variant="primary" loading={loading} className="mt-6 w-full">
              {t('auth.createAccount')}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted">
            <span className="h-px flex-1 bg-border" /> {t('auth.or')} <span className="h-px flex-1 bg-border" />
          </div>
          <SocialAuth />

          <Typography variant="small" className="mt-6 block text-center">
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">{t('auth.login')}</Link>
          </Typography>
        </div>
      </div>
    </div>
  );
}
