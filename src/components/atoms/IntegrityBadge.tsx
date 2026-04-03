import React from 'react';
import { Icon, IconName } from './Icon';
import { DisciplineRank } from '../../hooks/useIntegrityScore';

interface IntegrityBadgeProps {
  score: number;
  tier: DisciplineRank;
  loading?: boolean;
}

export function IntegrityBadge({ score, tier, loading }: IntegrityBadgeProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800">
        <div className="w-3.5 h-3.5 rounded-full animate-pulse bg-zinc-300 dark:bg-zinc-700" />
        <div className="w-4 h-3 rounded animate-pulse bg-zinc-300 dark:bg-zinc-700" />
      </div>
    );
  }

  const getBadgeDetails = (): { icon: IconName; text: string; } => {
    switch (tier) {
      case 'Master of Discipline': return { icon: 'Diamond', text: 'Master of Discipline' };
      case 'Senior Warden': return { icon: 'Crown', text: 'Senior Warden' };
      case 'Officer': return { icon: 'Medal', text: 'Officer' };
      case 'Cadet': 
      default: return { icon: 'Circle', text: 'Cadet' };
    }
  };

  const { icon, text } = getBadgeDetails();

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/50 dark:border-zinc-800 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-sm">
        <Icon name={icon} size={14} className="text-zinc-800 dark:text-zinc-300 stroke-[1.5]" />
        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 font-headline tracking-widest">{score}</span>
      </div>

      {/* Tooltip */}
      <div className="absolute top-full mt-2 right-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-[11px] px-3 py-2 rounded-md shadow-lg whitespace-nowrap z-50 border border-zinc-700">
        <div className="flex flex-col items-center">
          <span className="font-bold tracking-wider mb-0.5">{text}</span>
          <span className="text-zinc-400 text-[10px]">신뢰 점수: {score}</span>
        </div>
      </div>
    </div>
  );
}
