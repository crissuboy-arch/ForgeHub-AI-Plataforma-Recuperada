// src/app/(auth)/login/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { Input } from '../../../components/atoms/Input';
import { Button } from '../../../components/atoms/Button';
import { Typography } from '../../../components/atoms/Typography';

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded bg-white p-8 shadow-md">
        <Typography variant="h4" className="text-center mb-4">
          Entrar
        </Typography>
        {error && (
          <Typography variant="small" className="text-red-600 text-center">
            {error}
          </Typography>
        )}
        <div>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          Entrar
        </Button>
        <Typography variant="small" className="text-center">
          Ainda não tem conta? <a href="/signup" className="text-indigo-600 hover:underline">Cadastre‑se</a>
        </Typography>
      </form>
    </section>
  );
}
