'use client';
// src/components/organisms/ActivityTimeline.tsx — Atividade recente (timeline com dados reais).
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '../atoms/Typography';
import { Icon } from '../atoms/Icon';
import { Skeleton } from '../atoms/Skeleton';
import { getRecentActivity, type ActivityItem } from '../../data/dashboard';
import { useLanguage } from '../../lib/i18n/LanguageProvider';

const TONE: Record<ActivityItem['tone'], string> = {
  primary: 'text-primary-hover bg-primary/15',
  success: 'text-success bg-success/12',
  gold: 'text-gold bg-gold/12',
  cyan: 'text-cyan bg-cyan/12',
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return '1 min';
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} d`;
}

export const ActivityTimeline: React.FC = () => {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({ queryKey: ['recent-activity'], queryFn: () => getRecentActivity(8) });

  return (
    <div className="card-premium ring-hairline rounded-container p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon name="recent" size={16} className="text-muted" />
        <Typography variant="h5">{t('timeline.title')}</Typography>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
      ) : (data?.length ?? 0) === 0 ? (
        <p className="py-6 text-center text-sm text-muted">{t('timeline.empty')}</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border pl-5">
          {data!.map((it, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full ${TONE[it.tone]}`}>
                <Icon name={it.icon} size={11} />
              </span>
              <p className="text-sm leading-snug text-content">{it.text}</p>
              <span className="text-xs text-dim">{timeAgo(it.date)} {t('time.ago')}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
