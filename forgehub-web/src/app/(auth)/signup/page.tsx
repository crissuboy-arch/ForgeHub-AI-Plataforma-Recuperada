'use client';
// src/app/(auth)/signup/page.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { FormField } from '../../../components/molecules/FormField';
import { Button } from '../../../components/atoms/Button';
import { Typography } from '../../../components/atoms/Typography';
import { Icon } from '../../../components/atoms/Icon';
import { useLanguage } from '../../../lib/i18n/LanguageProvider';

export default function SignupPage() {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, fullName);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Painel de marca */}
      <div className="relative hidden flex-col justify-between bg-brand-glow p-12 lg:flex">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-white/20 text-base font-bold text-white">
            F
          </span>
          <span className="text-lg font-semibold text-white">ForgeHub AI</span>
        </div>
        <div>
          <p className="max-w-md text-3xl font-bold leading-tight text-white">
            {t('auth.brandSignup')}
          </p>
          <p className="mt-4 max-w-sm text-white/70">
            {t('auth.brandSignupSub')}
          </p>
        </div>
        <p className="text-sm text-white/60">© 2026 ForgeHub AI</p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center bg-canvas px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted hover:text-content">
            <Icon name="back" size={16} /> {t('auth.back')}
          </Link>
          <Typography variant="h3" className="mb-1">
            {t('auth.createAccount')}
          </Typography>
          <Typography variant="small" className="mb-8 block">
            {t('auth.signupSubtitle')}
          </Typography>

          {error && (
            <div className="mb-4 rounded-interactive border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <FormField
              id="fullName"
              label={t('auth.fullName')}
              type="text"
              placeholder={t('auth.fullNamePlaceholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FormField
              id="email"
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              id="password"
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordMin')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Typography variant="caption" className="mt-4 block">
            {t('auth.terms')}
          </Typography>

          <Button type="submit" variant="primary" loading={loading} className="mt-6 w-full">
            {t('auth.createAccount')}
          </Button>

          <Typography variant="small" className="mt-6 block text-center">
            {t('auth.haveAccount')}{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
              {t('auth.login')}
            </Link>
          </Typography>
        </form>
      </div>
    </div>
  );
}
