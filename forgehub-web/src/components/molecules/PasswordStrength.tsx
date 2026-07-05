'use client';
// src/components/molecules/PasswordStrength.tsx
// Indicador de força + checklist visual das regras (item 9 do aditivo).
import React from 'react';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { evaluatePassword } from '../../lib/passwordStrength';

const BAR: Record<string, string> = { weak: 'bg-danger', medium: 'bg-warning', strong: 'bg-success' };
const TEXT: Record<string, string> = { weak: 'text-danger', medium: 'text-warning', strong: 'text-success' };
const WIDTH: Record<string, string> = { weak: 'w-1/3', medium: 'w-2/3', strong: 'w-full' };

export const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const { t } = useLanguage();
  if (!password) return null;
  const { checks, level } = evaluatePassword(password);
  const rules: { key: keyof typeof checks; label: string }[] = [
    { key: 'minLength', label: t('pw.min') },
    { key: 'upper', label: t('pw.upper') },
    { key: 'lower', label: t('pw.lower') },
    { key: 'number', label: t('pw.number') },
    { key: 'special', label: t('pw.special') },
  ];
  return (
    <div className="mt-2">
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">{t('pw.strength')}</span>
        <span className={`font-semibold ${TEXT[level]}`}>{t(`pw.${level}`)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className={`h-full rounded-full transition-all duration-300 ${BAR[level]} ${WIDTH[level]}`} />
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
        {rules.map((r) => {
          const ok = checks[r.key];
          return (
            <li key={r.key} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-success' : 'text-muted'}`}>
              <Icon name={ok ? 'check' : 'x'} size={12} /> {r.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
