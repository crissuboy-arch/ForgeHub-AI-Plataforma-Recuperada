'use client';
// src/components/organisms/AuthGate.tsx
// Portão de autenticação: se não houver sessão do Supabase, redireciona para /login.
// Enquanto verifica, mostra um spinner (sem piscar o shell do app para deslogados).
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { Spinner } from '../atoms/Spinner';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>('checking');

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) {
        setStatus('authed');
      } else {
        setStatus('guest');
        router.replace('/login');
      }
    });
    return () => {
      active = false;
    };
  }, [router]);

  if (status !== 'authed') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
