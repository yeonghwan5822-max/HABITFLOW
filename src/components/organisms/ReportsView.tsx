import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from 'recharts';
import { WeeklyData, ReportInsight } from '../../types';
import { Icon } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { cn } from '../../lib/utils';

interface ReportsViewProps {
  weeklyData: WeeklyData[];
  insights: ReportInsight[];
  averageCompletion: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-xl shadow-lg">
        <p className="font-bold text-card-foreground mb-1">{label}요일</p>
        <p className="text-primary font-bold">
          달성률: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export function ReportsView({ weeklyData, insights, averageCompletion }: ReportsViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-headline text-xl font-bold text-card-foreground">주간 달성률 추이</h2>
              <p className="text-sm text-muted-foreground">지난 7일간의 습관 완수 데이터</p>
            </div>
            <div className="flex bg-muted p-1 rounded-xl">
              <Button variant="primary" size="sm" className="px-4 py-1.5 bg-card text-primary shadow-sm hover:bg-card/90" aria-label="주간 리포트 보기">주간</Button>
              <Button variant="ghost" size="sm" className="px-4 py-1.5 text-muted-foreground hover:text-foreground" aria-label="월간 리포트 보기">월간</Button>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--muted-foreground)' }}
                  dy={10}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === '오늘' ? 'var(--primary)' : 'var(--primary)'} 
                      fillOpacity={entry.name === '오늘' ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[180px]">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Icon name="Flame" size={120} className="fill-primary-foreground" />
            </div>
            <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest mb-1">현재 스트릭</p>
            <div className="flex items-end gap-2">
              <h3 className="text-5xl font-black font-headline tracking-tight">12</h3>
              <span className="text-xl font-bold mb-1">일</span>
            </div>
            <p className="mt-4 text-[10px] text-primary-foreground/80 font-bold uppercase tracking-wider">어제보다 +1일 증가했습니다!</p>
          </div>
          
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col justify-center min-h-[180px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 text-orange-500 rounded-xl">
                <Icon name="Trophy" size={20} />
              </div>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">최장 스트릭</p>
            </div>
            <div className="flex items-end gap-2">
              <h3 className="text-4xl font-black font-headline text-card-foreground tracking-tight">45</h3>
              <span className="text-lg font-bold text-muted-foreground mb-1">일</span>
            </div>
            <p className="mt-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">최고 기록 달성: 2024년 2월 14일</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-card p-8 rounded-3xl border border-border shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-headline text-xl font-bold text-card-foreground">평균 달성률: {averageCompletion}%</h2>
            <Badge variant="secondary">실시간 반영</Badge>
          </div>
          <div className="space-y-8">
            {/* Mock ranking for now */}
            <RankingItem rank={1} name="매일 30분 명상" percent={98} />
            <RankingItem rank={2} name="물 2L 마시기" percent={92} />
            <RankingItem rank={3} name="영어 단어 10개 외우기" percent={85} />
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-8 rounded-3xl flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h3 className="font-headline font-bold text-lg mb-4">리포트 인사이트</h3>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Icon 
                    name={insight.type === 'success' ? 'CheckCircle2' : 'Info'} 
                    size={18} 
                    className={insight.type === 'success' ? 'text-green-400' : 'text-blue-400'} 
                  />
                  <p className="text-slate-300 text-sm leading-relaxed">{insight.message}</p>
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-4">
            <Icon name="Share2" size={20} />
            <span className="text-sm uppercase tracking-widest">리포트 공유하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function RankingItem({ rank, name, percent }: { rank: number, name: string, percent: number }) {
  return (
    <div className="flex items-center group">
      <div className="w-12 h-12 flex items-center justify-center font-black text-2xl text-muted group-hover:text-primary transition-colors font-headline italic mr-4">{rank}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-card-foreground text-sm">{name}</span>
          <span className="text-primary font-black text-sm">{percent}%</span>
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </div>
  );
}
