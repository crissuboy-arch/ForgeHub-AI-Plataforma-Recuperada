// src/lib/passwordStrength.ts — avalia força da senha e devolve checklist de regras.
export type PwCheck = { minLength: boolean; upper: boolean; lower: boolean; number: boolean; special: boolean };
export type PwScore = { checks: PwCheck; passed: number; level: 'weak' | 'medium' | 'strong' };

export function evaluatePassword(pw: string): PwScore {
  const checks: PwCheck = {
    minLength: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const level: PwScore['level'] = passed <= 2 ? 'weak' : passed <= 4 ? 'medium' : 'strong';
  return { checks, passed, level };
}
