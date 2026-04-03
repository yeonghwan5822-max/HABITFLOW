import React from 'react';
import { Icon, IconName } from './Icon';
import { DisciplineRank } from '../../hooks/useIntegrityScore';

interface IntegrityCalloutProps {
  score: number;
  tier: DisciplineRank;
  loading?: boolean;
}

export function IntegrityCallout({ score, tier, loading }: IntegrityCalloutProps) {
  if (loading) {
    return (
      <div 
        className="w-full bg-[#F7F7F7] border border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-lg p-4 animate-pulse flex justify-between items-center"
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="flex flex-col gap-2 justify-center">
            <div className="w-20 h-3 bg-gray-200 dark:bg-zinc-800 rounded" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="w-1/3 min-w-[150px] h-6 bg-gray-200 dark:bg-zinc-800 rounded" />
      </div>
    );
  }

  const getTierDetails = (): { icon: IconName; maxScore: number; color: string; bg: string } => {
    switch (tier) {
      case 'Master of Discipline': return { icon: 'Diamond', maxScore: 120, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/10' };
      case 'Senior Warden': return { icon: 'ShieldCheck', maxScore: 120, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/10' };
      case 'Officer': return { icon: 'Scale', maxScore: 80, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/10' };
      case 'Cadet': 
      default: return { icon: 'Shield', maxScore: 50, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-200 dark:bg-gray-800' };
    }
  };

  const { icon, maxScore, color, bg } = getTierDetails();
  
  // We use absolute progress relative to zero, bounded by maxScore.
  const displayScore = Math.min(score, maxScore);
  const progressPercent = tier === 'Master of Discipline' ? 100 : Math.round((displayScore / maxScore) * 100);
  const pointsLeft = maxScore - displayScore;

  return (
    <div 
      className="w-full bg-[#F7F7F7] dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      {/* Left: Icon & Rank */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
          <Icon name={icon} size={24} className={color} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">Integrity Level</span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">{tier}</span>
        </div>
      </div>

      {/* Right: Progress Area */}
      <div className="flex flex-col w-full md:w-2/5 min-w-[200px]">
        <div className="flex justify-between w-full mb-2 items-end">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
            {score} <span className="text-xs text-gray-500 font-medium">Score</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {tier === 'Master of Discipline' ? 'MAX LEVEL' : `${pointsLeft} to next level`}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-zinc-900 rounded-full overflow-hidden border border-gray-300 dark:border-zinc-700">
          <div 
            className="h-full bg-gray-800 dark:bg-gray-300 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
