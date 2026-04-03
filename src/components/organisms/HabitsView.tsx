import React, { memo } from 'react';
import { Habit } from '../../types';
import { Icon, IconName } from '../atoms/Icon';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { cn } from '../../lib/utils';
import { EmptyState } from '../molecules/EmptyState';

interface HabitsViewProps {
  habits: (Habit & { progress?: number })[];
  onAddHabit?: () => void;
  onDeleteHabit?: (id: string) => void;
}

const HabitListItem = memo(({ habit, onDelete }: { habit: Habit & { progress?: number }, onDelete?: (id: string) => void }) => {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors bg-muted">
          <Icon name={habit.icon as IconName} size={28} className={habit.color} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-card-foreground mb-1">{habit.name}</h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">{habit.frequency}</Badge>
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Icon name="CalendarDays" size={12} />
              {habit.time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="hidden md:block">
          <p className="text-[10px] text-muted-foreground text-right mb-1 font-bold uppercase">이번 주 달성률</p>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${habit.progress || 0}%` }}></div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="p-2" aria-label={`${habit.name} 설정`}>
            <Icon name="Settings" size={18} />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            className="p-2" 
            aria-label={`${habit.name} 삭제`}
            onClick={() => onDelete?.(habit.id)}
          >
            <Icon name="Plus" className="rotate-45" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
});

HabitListItem.displayName = 'HabitListItem';

export function HabitsView({ habits, onAddHabit, onDeleteHabit }: HabitsViewProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-muted-foreground">현재 {habits.length}개의 습관을 실천 중입니다.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Icon name="Search" size={16} />
            필터
          </Button>
          <Button variant="primary" size="sm" onClick={onAddHabit}>
            <Icon name="Plus" size={16} />
            습관 추가
          </Button>
        </div>
      </div>

      {habits.length === 0 ? (
        <EmptyState
          icon="ListTodo"
          title="등록된 습관이 없습니다"
          description="첫 번째 습관을 등록하고 새로운 루틴을 시작해보세요."
          action={
            <Button variant="primary" onClick={onAddHabit}>
              <Icon name="Plus" size={18} />
              새 습관 추가
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitListItem key={habit.id} habit={habit} onDelete={onDeleteHabit} />
          ))}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary text-primary-foreground p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-headline mb-4">꾸준함이 핵심입니다!</h2>
            <p className="text-primary-foreground/80 max-w-md mb-6 leading-relaxed">작은 습관들이 모여 위대한 변화를 만듭니다. 이번 주 당신은 평소보다 15% 더 높은 달성률을 기록하고 있습니다.</p>
            <Button variant="outline" className="bg-card text-primary border-none">리포트 상세보기</Button>
          </div>
          <div className="absolute -right-12 -bottom-12 opacity-10">
            <Icon name="Trophy" size={200} />
          </div>
        </div>
        <div className="bg-card border border-border p-8 rounded-3xl flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Icon name="Trophy" size={32} />
          </div>
          <h3 className="font-bold text-card-foreground mb-1">다음 목표</h3>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">현재 연속 5일째!<br/>7일을 채우면 배지를 획득해요.</p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary"></div>)}
            {[1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-muted"></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
