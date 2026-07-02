// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Fallbacks placeholder para permitir que a aplicação compile e rode sem um
// .env.local configurado (o supabase-js lança erro com URL vazia). As chamadas
// de auth só funcionarão de fato quando as variáveis reais forem definidas.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
