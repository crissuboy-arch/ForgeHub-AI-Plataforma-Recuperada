'use client';
// src/components/organisms/BonusLibrary.tsx
// Biblioteca de Bônus data-driven (config/bonus-library.ts, via .map()).
// Admin cadastra o link de cada card (modal → localStorage); aluno abre o link
// ou recebe aviso se não configurado. Sem "Em breve", sem botão desativado.
import React, { useEffect, useState } from 'react';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { useLanguage } from '../../lib/i18n/LanguageProvider';
import { useToast } from './Toast';
import { useRole } from '../../hooks/useRole';
import { bonusLibrary, type BonusItem } from '../../config/bonus-library';

const STORAGE_KEY = 'fh-bonus-links';

const ICON_MAP: Record<string, string> = {
  Sparkles: 'sparkles', LayoutTemplate: 'stack', Package: 'cube', Sticker: 'favorite',
  Film: 'rocket', Smartphone: 'cube', MessageSquare: 'docs', Shapes: 'cube',
  Type: 'docs', Image: 'asset', Wrench: 'settings',
  BookOpen: 'docs', CheckSquare: 'check', Bot: 'command',
};
const mapIcon = (name: string) => ICON_MAP[name] ?? 'star';

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

export const BonusLibrary: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAdmin } = useRole();

  // Links cadastrados (override das urls vazias do config), persistidos localmente.
  const [links, setLinks] = useState<Record<string, string>>({});
  const [cfg, setCfg] = useState<BonusItem | null>(null);
  const [val, setVal] = useState('');

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLinks(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch {
      /* ignore */
    }
  }, []);

  const urlOf = (item: BonusItem) => (links[item.id] || item.url || '');

  const openConfig = (item: BonusItem) => { setCfg(item); setVal(urlOf(item)); };
  const saveLink = () => {
    if (!cfg) return;
    const url = val.trim();
    setLinks((prev) => {
      const next = { ...prev };
      if (url) next[cfg.id] = url; else delete next[cfg.id];
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
    toast(t('bonus.linkSaved'), 'success');
    setCfg(null);
  };

  const onCardClick = (item: BonusItem) => {
    const url = urlOf(item);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    else if (isAdmin) openConfig(item);
    else toast(t('bonus.notConfiguredStudent'), 'info');
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bonusLibrary.map((item) => {
          const url = urlOf(item);
          const hasUrl = Boolean(url);
          const label = hasUrl ? item.buttonText : isAdmin ? t('bonus.configLink') : item.buttonText;
          return (
            <div key={item.id} className="card-premium lift glow-blue-hover ring-hairline flex flex-col rounded-container p-5 hover:border-primary/40">
              <div className="mb-3 flex items-start justify-between gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-interactive text-white" style={{ background: item.color, boxShadow: `0 0 20px ${hexA(item.color, 0.45)}` }}>
                  <Icon name={mapIcon(item.icon)} size={20} />
                </span>
                {item.badge && <Badge tone="primary">{item.badge}</Badge>}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{item.category}</span>
              <h4 className="mt-0.5 font-display text-base font-bold text-content" title={item.title}>{item.title}</h4>
              <p className="mt-1 flex-1 text-sm text-muted">{item.description}</p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => onCardClick(item)}
                  className={`inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-interactive text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                    hasUrl || !isAdmin ? 'text-white' : 'border border-primary/40 text-primary-hover'
                  }`}
                  style={hasUrl || !isAdmin ? { background: item.color, boxShadow: `0 0 18px ${hexA(item.color, 0.4)}` } : undefined}
                >
                  <Icon name={hasUrl ? 'external' : isAdmin ? 'settings' : 'external'} size={15} /> {label}
                </button>
                {/* Admin com link já cadastrado: reconfigurar */}
                {isAdmin && hasUrl && (
                  <button
                    type="button"
                    onClick={() => openConfig(item)}
                    aria-label={t('bonus.configLink')}
                    title={t('bonus.configLink')}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-interactive border border-border text-muted transition-colors hover:bg-surface-2 hover:text-content"
                  >
                    <Icon name="settings" size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Configurar Link (admin) */}
      {cfg && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" onClick={() => setCfg(null)} aria-hidden="true" />
          <div className="glass animate-in relative z-10 w-full max-w-md rounded-container p-6 shadow-modal">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-interactive text-white" style={{ background: cfg.color }}>
                <Icon name={mapIcon(cfg.icon)} size={18} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-content">{t('bonus.configLink')}</h3>
                <p className="text-xs text-muted">{cfg.title}</p>
              </div>
            </div>
            <label className="mb-1.5 block text-sm font-medium text-content">{t('bonus.urlField')}</label>
            <input
              autoFocus
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveLink(); if (e.key === 'Escape') setCfg(null); }}
              placeholder="https://drive.google.com/…  ·  https://canva.com/…"
              className="h-11 w-full rounded-interactive border border-border bg-surface px-3 text-content placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setCfg(null)} className="h-10 rounded-interactive border border-border px-4 text-sm font-semibold text-content transition-colors hover:bg-surface-2">
                {t('common.cancel')}
              </button>
              <button type="button" onClick={saveLink} className="bg-brand-glow h-10 rounded-interactive px-5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]">
                {t('studio.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
