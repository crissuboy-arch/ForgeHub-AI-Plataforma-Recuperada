'use client';
// src/components/organisms/CommandPalette.tsx
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '../atoms/Icon';

type Command = {
  id: string;
  label: string;
  hint?: string;
  iconName: string;
  href: string;
};

const COMMANDS: Command[] = [
  { id: 'dashboard', label: 'Ir para o Dashboard', iconName: 'home', href: '/dashboard', hint: 'Navegação' },
  { id: 'assets', label: 'Abrir biblioteca de Assets', iconName: 'asset', href: '/assets', hint: 'Navegação' },
  { id: 'settings', label: 'Abrir Configurações', iconName: 'settings', href: '/settings', hint: 'Navegação' },
  { id: 'landing', label: 'Ver Landing Page', iconName: 'sparkles', href: '/', hint: 'Navegação' },
  { id: 'login', label: 'Tela de Login', iconName: 'user', href: '/login', hint: 'Conta' },
];

type CommandPaletteContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextType | undefined>(undefined);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('useCommandPalette deve ser usado dentro de CommandPaletteProvider');
  }
  return ctx;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q));
  }, [query]);

  // Atalho global Ctrl+K / ⌘K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggle, close]);

  const run = useCallback(
    (cmd: Command) => {
      close();
      router.push(cmd.href);
    },
    [close, router],
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = results[activeIndex];
      if (cmd) run(cmd);
    }
  };

  const ctxValue = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return (
    <CommandPaletteContext.Provider value={ctxValue}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
        >
          {/* Backdrop com blur (Bible 4.3) */}
          <div
            className="absolute inset-0 bg-canvas/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xl overflow-hidden rounded-container border border-border bg-surface shadow-modal">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Icon name="search" size={18} className="text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Buscar ações e telas…"
                className="h-14 flex-1 bg-transparent text-content placeholder:text-muted focus:outline-none"
              />
              <kbd className="rounded-md border border-border bg-card px-1.5 py-0.5 text-xs text-muted">
                Esc
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-muted">
                  Nenhum resultado para “{query}”.
                </li>
              )}
              {results.map((cmd, i) => (
                <li key={cmd.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => run(cmd)}
                    className={`flex w-full items-center gap-3 rounded-interactive px-3 py-2.5 text-left text-sm transition-colors ${
                      i === activeIndex ? 'bg-primary/15 text-content' : 'text-muted hover:bg-card'
                    }`}
                  >
                    <Icon name={cmd.iconName} size={18} />
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.hint && <span className="text-xs text-muted">{cmd.hint}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
}
