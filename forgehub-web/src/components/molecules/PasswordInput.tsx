'use client';
// src/components/molecules/PasswordInput.tsx
// Campo de senha reutilizável: mostrar/ocultar (olho) + indicador de Caps Lock.
import React, { useState } from 'react';
import { Icon } from '../atoms/Icon';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  required?: boolean;
};

export const PasswordInput: React.FC<Props> = ({ id, label, value, onChange, placeholder, autoComplete, error, required }) => {
  const { t } = useLanguage();
  const [show, setShow] = useState(false);
  const [caps, setCaps] = useState(false);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof e.getModifierState === 'function') setCaps(e.getModifierState('CapsLock'));
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-content">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={onKey}
          onKeyDown={onKey}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`h-12 w-full rounded-interactive border bg-surface px-4 pr-11 text-content placeholder:text-muted transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary ${error ? 'border-danger' : 'border-border'}`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? t('auth.hidePw') : t('auth.showPw')}
          title={show ? t('auth.hidePw') : t('auth.showPw')}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:text-content"
        >
          <Icon name={show ? 'eye-off' : 'eye'} size={18} />
        </button>
      </div>
      {caps && (
        <span className="mt-1 flex items-center gap-1 text-xs text-warning">
          <Icon name="lock" size={12} /> {t('auth.capsLock')}
        </span>
      )}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </div>
  );
};
