// src/lib/authErrors.ts — traduz erros técnicos do Supabase em mensagens amigáveis.
// Retorna uma CHAVE i18n (autherr.*) — nunca expõe a mensagem técnica ao usuário.
export function authErrorKey(raw: unknown): string {
  const msg = (raw instanceof Error ? raw.message : String(raw ?? '')).toLowerCase();
  if (!msg) return 'autherr.generic';
  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid email or password'))
    return 'autherr.invalidCredentials';
  if (msg.includes('email not confirmed') || msg.includes('not confirmed')) return 'autherr.notConfirmed';
  if (msg.includes('user already registered') || msg.includes('already registered') || msg.includes('already exists'))
    return 'autherr.alreadyRegistered';
  if (msg.includes('user not found') || msg.includes('no user')) return 'autherr.notFound';
  if (msg.includes('password should be') || msg.includes('weak') || msg.includes('at least 6'))
    return 'autherr.weakPassword';
  if (msg.includes('rate limit') || msg.includes('too many')) return 'autherr.rateLimit';
  if (msg.includes('session') && (msg.includes('expired') || msg.includes('missing'))) return 'autherr.sessionExpired';
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch')) return 'autherr.network';
  if (msg.includes('provider') || msg.includes('oauth')) return 'autherr.oauth';
  return 'autherr.generic';
}
