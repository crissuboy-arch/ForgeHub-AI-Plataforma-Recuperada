// src/data/adminMetrics.ts — métricas agregadas do Painel Admin (item 16).
import { supabase } from '../lib/supabaseClient';

export type AdminMetrics = {
  kits: number; kitsActive: number; downloads: number; favorites: number;
  remixes: number; views: number; opens: number; users: number; admins: number;
  students: number; countries: number; niches: number; languages: number;
  revenuePotential: number; conversion: number;
  byNiche: { key: string; value: number }[];
  byLanguage: { key: string; value: number }[];
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const { data, error } = await supabase.rpc('admin_dashboard_metrics');
  if (error) throw error;
  return data as AdminMetrics;
}
