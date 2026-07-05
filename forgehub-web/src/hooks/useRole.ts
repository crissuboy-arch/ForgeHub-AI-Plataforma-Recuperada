'use client';
// src/hooks/useRole.ts — papel do usuário atual (admin | aluno) via user_settings.
import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../data/userData';
import type { UserRole } from '../types';

export function useRole(): { role: UserRole | undefined; isAdmin: boolean; loading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => (await getSettings())?.role ?? 'aluno',
    staleTime: 5 * 60 * 1000,
  });
  return { role: data, isAdmin: data === 'admin', loading: isLoading };
}
