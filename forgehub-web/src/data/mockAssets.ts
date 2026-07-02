// src/data/mockAssets.ts
// Mock estático (sem backend) que ainda alimenta a UI da Sprint 1.5.
// Será substituído pela camada de dados real (Supabase) na Sprint 3.
import { AssetSummary } from '../types';

export const mockAssets: AssetSummary[] = [
  {
    id: '1', slug: 'agendamento-clinico-ai', name: 'Agendamento Clínico AI',
    category: 'MicroApp',
    shortDescription: 'MicroApp de agendamento com confirmação automática por WhatsApp.',
    status: 'active', version: 'v2.1.0', level: 'elite', healthScore: 100, updatedAt: '2026-06-28',
  },
  {
    id: '2', slug: 'copywriter-de-anuncios', name: 'Copywriter de Anúncios',
    category: 'AI Agent',
    shortDescription: 'Agente que gera copies de alta conversão para Meta Ads e Google.',
    status: 'updated', version: 'v1.4.2', level: 'pro', healthScore: 67, updatedAt: '2026-06-30',
  },
  {
    id: '3', slug: 'landing-de-lancamento', name: 'Landing de Lançamento',
    category: 'Landing',
    shortDescription: 'Template de landing premium com checkout integrado.',
    status: 'active', version: 'v3.0.0', level: 'pro', healthScore: 58, updatedAt: '2026-06-20',
  },
  {
    id: '4', slug: 'calculadora-de-roi', name: 'Calculadora de ROI',
    category: 'Planilha',
    shortDescription: 'Planilha inteligente que simula lucro, ticket médio e retorno.',
    status: 'draft', version: 'v1.0.3', level: 'starter', healthScore: 8, updatedAt: '2026-06-15',
  },
  {
    id: '5', slug: 'prompt-mestre-vendas', name: 'Prompt Mestre — Vendas',
    category: 'Prompt',
    shortDescription: 'Prompt estruturado e blindado, otimizado com few-shot para vendas.',
    status: 'active', version: 'v2.2.1', level: 'pro', healthScore: 25, updatedAt: '2026-07-01',
  },
  {
    id: '6', slug: 'suite-lancamento-completa', name: 'Suíte de Lançamento Completa',
    category: 'Copy',
    shortDescription: 'Combo ponta a ponta: agente, landing, copy, criativos e automações.',
    status: 'active', version: 'v1.2.0', level: 'enterprise', healthScore: 100, updatedAt: '2026-06-26',
  },
];
