import React, { useState, useRef, useEffect } from 'react';
import { Habit } from '../../types';
import { HabitGrid } from './HabitGrid';
import { StatCard } from '../molecules/StatCard';
import { Icon } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { useIntegrityScore, DisciplineRank } from '../../hooks/useIntegrityScore';
import { IntegrityCallout } from '../atoms/IntegrityCallout';
import { ProtocolComplete } from '../atoms/ProtocolComplete';
import { RankUpModal } from '../molecules/RankUpModal';

interface DashboardViewProps {
  habits: (Habit & { isCompletedToday?: boolean })[];
  onToggle: (id: string) => void;
  progressPercent: number;
  onAddHabit?: () => void;
  editingId?: string | null;
  setEditingId?: (id: string | null) => void;
  updateHabit?: (id: string, updates: Partial<Habit>) => void;
  deleteHabit?: (id: string) => void;
}

export function DashboardView({ habits, onToggle, progressPercent, onAddHabit, editingId, setEditingId, updateHabit, deleteHabit }: DashboardViewProps) {
  const pendingHabits = habits.filter(h => !h.isCompletedToday);
  const completedHabits = habits.filter(h => h.isCompletedToday);
  const remainingCount = pendingHabits.length;
  
  // Calculate integrity score and pull strict global streak
  const { score, tier, globalStreak, loading: loadingScore } = useIntegrityScore(habits);

  const rankOrder: Record<DisciplineRank, number> = {
    'Cadet': 1,
    'Officer': 2,
    'Senior Warden': 3,
    'Master of Discipline': 4
  };

  const [showProtocolComplete, setShowProtocolComplete] = useState(false);
  const prevRemainingRef = useRef<number>(remainingCount);

  const [showRankModal, setShowRankModal] = useState(false);
  const prevTierRef = useRef<DisciplineRank>(tier);

  useEffect(() => {
    // Check Protocol Complete
    if (remainingCount === 0 && prevRemainingRef.current > 0 && habits.length > 0) {
      setShowProtocolComplete(true);
    }
    prevRemainingRef.current = remainingCount;

    // Check Rank Up
    if (
      prevTierRef.current && 
      tier !== prevTierRef.current && 
      rankOrder[tier] > rankOrder[prevTierRef.current]
    ) {
      setShowRankModal(true);
    }
    prevTierRef.current = tier;
  }, [remainingCount, tier, habits.length]);

  return (
    <>
      <ProtocolComplete 
        isVisible={showProtocolComplete} 
        onComplete={() => setShowProtocolComplete(false)} 
      />
      <RankUpModal 
        rank={tier} 
        isVisible={showRankModal} 
        onClose={() => setShowRankModal(false)} 
      />
      <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <IntegrityCallout score={score} tier={tier} loading={loadingScore} />
      </div>

      {/* Streak Card */}
      <div className="col-span-12 lg:col-span-4 bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">Global Protocol</span>
            <h3 className="text-xl font-bold mt-2 font-headline text-card-foreground">Global Streak: {globalStreak}일</h3>
          </div>
          <Icon name="Flame" size={32} className="text-primary fill-primary" />
        </div>
        
        <div className="flex items-center justify-center py-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-muted" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-headline text-primary">{progressPercent}%</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">Completed</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center">오늘 완료까지 {remainingCount}개의 습관이 남았습니다.</p>
      </div>

      {/* Habit List */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {pendingHabits.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Clock" size={20} className="text-primary" />
              <h3 className="text-lg font-bold text-primary">오늘의 미완료 습관</h3>
            </div>
            <HabitGrid 
              habits={pendingHabits} 
              onToggle={onToggle} 
              editingId={editingId} 
              setEditingId={setEditingId} 
              updateHabit={updateHabit} 
              deleteHabit={deleteHabit}
            />
          </div>
        )}
        
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold text-foreground">전체 습관</h3>
          </div>
          <HabitGrid 
            habits={habits} 
            onToggle={onToggle} 
            onAddHabit={onAddHabit}
            editingId={editingId}
            setEditingId={setEditingId}
            updateHabit={updateHabit}
            deleteHabit={deleteHabit}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Weekly" value="주간 달성률 92%" />
        <StatCard label="Focus" value="총 집중 시간 124h" />
        <StatCard label="Journal" value="기록된 일지 18" />
        <StatCard label="Ranking" value="전체 순위 상위 5%" highlight />
      </div>

      {/* Banner */}
      <div className="col-span-12 bg-zinc-900 dark:bg-zinc-800 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        <div className="relative z-10 max-w-2xl text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed mb-2 font-headline italic">당신의 성장은 조용하지만 끊임없는 여정입니다.</h2>
          <p className="text-zinc-300 font-medium">이번 달에는 지난달보다 <span className="text-white text-2xl font-black">84%</span> 더 많은 습관을 실천했습니다.</p>
        </div>
        <div className="relative z-10 flex gap-4">
          <Button variant="primary" size="lg" aria-label="상세 리포트 보기">상세 리포트 보기</Button>
          <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" aria-label="리포트 공유하기">공유하기</Button>
        </div>
      </div>
    </div>
    </>
  );
}
