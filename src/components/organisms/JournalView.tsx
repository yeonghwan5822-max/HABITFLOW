import React from 'react';
import { JournalEntry, Mood } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { EmptyState } from '../molecules/EmptyState';
import { getLocalDateString } from '../../lib/dateUtils';

interface JournalViewProps {
  entries: JournalEntry[];
  mood: Mood;
  setMood: (mood: Mood) => void;
  content: string;
  setContent: (content: string) => void;
  onSave: () => void;
}

export function JournalView({ 
  entries, 
  mood, 
  setMood, 
  content, 
  setContent, 
  onSave 
}: JournalViewProps) {
  const moods: Mood[] = ['🤩', '😊', '😐', '😔', '😢'];
  const labels = ['최고예요', '좋아요', '평범해요', '그저 그래요', '별로예요'];

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  }).format(new Date());

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <p className="text-primary font-bold text-xs mb-1 uppercase tracking-widest">Today's Reflection</p>
        <h2 className="text-3xl font-headline font-bold text-foreground">{todayStr}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
            <h3 className="text-sm font-bold text-card-foreground mb-6 uppercase tracking-wider">오늘의 기분은 어떤가요?</h3>
            <div className="flex justify-between gap-2">
              {moods.map((m, i) => (
                <button 
                  key={m}
                  onClick={() => setMood(m)}
                  aria-label={`기분: ${labels[i]}`}
                  aria-pressed={mood === m}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                    mood === m ? "bg-primary/10 border-primary" : "border-transparent hover:bg-muted"
                  )}
                >
                  <span className={cn("text-3xl transition-all", mood !== m && "grayscale opacity-50")}>{m}</span>
                  <span className={cn("text-[10px] font-bold", mood === m ? "text-primary" : "text-muted-foreground")}>{labels[i]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider">기록하기</h3>
              <span className="text-[10px] text-muted-foreground font-bold uppercase">{content.length}자 작성됨</span>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-5 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground resize-none leading-relaxed text-sm" 
              placeholder="오늘의 습관 실천 소감을 자유롭게 기록해 보세요. 사소한 변화도 소중한 기록이 됩니다."
            />
            <div className="flex justify-end gap-3 mt-2">
              <Button variant="outline" size="sm">임시저장</Button>
              <Button variant="primary" size="sm" onClick={onSave}>저장하기</Button>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider">과거의 기록</h3>
            {entries.length > 0 && (
              <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">모두 보기</button>
            )}
          </div>
          
          {entries.length === 0 ? (
            <EmptyState
              icon="BookOpen"
              title="기록이 없습니다"
              description="오늘의 첫 번째 일지를 작성해보세요."
              className="p-8"
            />
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <div key={entry.id} className="bg-card p-5 rounded-2xl shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{entry.mood}</span>
                      <span className="text-sm font-bold text-card-foreground">{entry.date}</span>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
