import React, { useState } from 'react';
import { JournalEntry, Mood } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { EmptyState } from '../molecules/EmptyState';
import { getLocalDateString } from '../../lib/dateUtils';
import { generatePoliceInstructorFeedback } from '../../lib/gemini';
import { trackAIReflection } from '../../lib/analytics';
import { toast } from 'sonner';

interface JournalViewProps {
  entries: JournalEntry[];
  mood: Mood;
  setMood: (mood: Mood) => void;
  content: string;
  setContent: (content: string) => void;
  onSave: () => void;
  isPremium?: boolean;
  completionRate?: number;
}

export function JournalView({ 
  entries, 
  mood, 
  setMood, 
  content, 
  setContent, 
  onSave,
  isPremium = false,
  completionRate = 0
}: JournalViewProps) {
  const [reflection, setReflection] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const moods: Mood[] = ['🤩', '😊', '😐', '😔', '😢'];
  const labels = ['최고예요', '좋아요', '평범해요', '그저 그래요', '별로예요'];

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  }).format(new Date());

  const handleReflection = async () => {
    if (!isPremium) {
      toast.error('AI 교관의 성찰은 프리미엄 멤버십 전용 기능입니다.');
      return;
    }
    if (!content.trim()) {
      toast.error('일기를 먼저 작성해 주십시오, 훈련병!');
      return;
    }
    
    setIsReflecting(true);
    setReflection(null);
    trackAIReflection();
    try {
      const result = await generatePoliceInstructorFeedback(content, completionRate);
      setReflection(result || null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '성찰에 실패했습니다.');
    } finally {
      setIsReflecting(false);
    }
  };

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
              className="w-full h-48 p-5 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground resize-none leading-relaxed text-sm" 
              placeholder="오늘의 습관 실천 소감을 자유롭게 기록해 보세요. 사소한 변화도 소중한 기록이 됩니다."
            />
            {reflection && (
              <div className="mt-2 border-l-4 border-primary bg-primary/5 p-5 rounded-r-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="ShieldAlert" size={16} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">교관의 피드백</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed font-serif whitespace-pre-wrap">
                  "{reflection}"
                </p>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReflection}
                className={cn("gap-2", !isPremium && "opacity-50")}
                disabled={isReflecting}
              >
                {isReflecting ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Icon name="Sparkles" size={16} />
                )}
                {isPremium ? 'AI 성찰 받기' : 'AI 성찰 (Premium)'}
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">임시저장</Button>
                <Button variant="primary" size="sm" onClick={onSave}>저장하기</Button>
              </div>
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
