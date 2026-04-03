import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { cn } from '../../lib/utils';
import { Theme } from '../../hooks/useTheme';
import { User } from 'firebase/auth';

interface SettingsViewProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user?: User | null;
}

export function SettingsView({ theme, setTheme, user }: SettingsViewProps) {
  return (
    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
      <nav className="w-full lg:w-48 shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
        <Button variant="secondary" size="sm" className="bg-card shadow-sm border border-primary/20 uppercase tracking-widest whitespace-nowrap">프로필</Button>
        <Button variant="ghost" size="sm" className="uppercase tracking-widest whitespace-nowrap">앱 설정</Button>
        <Button variant="ghost" size="sm" className="uppercase tracking-widest whitespace-nowrap">데이터 관리</Button>
        <Button variant="ghost" size="sm" className="uppercase tracking-widest whitespace-nowrap">지원 센터</Button>
      </nav>

      <div className="flex-1 space-y-10 pb-20">
        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 font-headline">
            <Icon name="User" size={24} className="text-primary" />
            프로필 정보
          </h2>
          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-muted overflow-hidden ring-4 ring-primary/10">
                  <img 
                    src={user?.photoURL || "https://picsum.photos/seed/user/200/200"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-2 border-card hover:bg-primary/90 transition-colors">
                  <Icon name="Plus" size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{user?.displayName || '사용자'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">PREMIUM MEMBER</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" className="w-full">프로필 수정</Button>
              <Button variant="outline" className="w-full">비밀번호 변경</Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 font-headline">
            <Icon name="Smartphone" size={24} className="text-primary" />
            앱 환경 설정
          </h2>
          <div className="bg-card rounded-3xl shadow-sm border border-border divide-y divide-border">
            <SettingsToggle icon="Bell" title="푸시 알림" desc="습관을 잊지 않도록 미리 알려드립니다." active />
            
            <div className="p-6 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Icon name="MoonStar" size={20} />
                </div>
                <div>
                  <p className="font-bold text-card-foreground text-sm">테마 설정</p>
                  <p className="text-xs text-muted-foreground">앱의 색상 테마를 선택합니다.</p>
                </div>
              </div>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
                className="bg-muted border border-border text-card-foreground text-xs font-bold rounded-xl focus:ring-primary/20 focus:border-primary block p-2.5 outline-none"
              >
                <option value="light">라이트 모드</option>
                <option value="dark">다크 모드</option>
                <option value="system">시스템 설정</option>
              </select>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Icon name="Type" size={20} />
                </div>
                <div>
                  <p className="font-bold text-card-foreground text-sm">폰트 크기</p>
                  <p className="text-xs text-muted-foreground">전체 텍스트의 크기를 조절합니다.</p>
                </div>
              </div>
              <select defaultValue="기본" className="bg-muted border border-border text-card-foreground text-xs font-bold rounded-xl focus:ring-primary/20 focus:border-primary block p-2.5 outline-none">
                <option value="작게">작게</option>
                <option value="기본">기본</option>
                <option value="크게">크게</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 font-headline">
            <Icon name="ShieldCheck" size={24} className="text-primary" />
            데이터 관리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col justify-between min-h-[180px]">
              <div>
                <p className="font-bold text-card-foreground mb-2">백업 및 복구</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">모든 습관 데이터를 클라우드에 안전하게 저장하거나 이전에 저장된 시점으로 복원합니다.</p>
              </div>
              <Button variant="secondary" className="w-full">
                <Icon name="CloudUpload" size={18} />
                백업 시작하기
              </Button>
            </div>
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border flex flex-col justify-between min-h-[180px]">
              <div>
                <p className="font-bold text-card-foreground mb-2">데이터 내보내기</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">모든 기록을 CSV 파일 형식으로 다운로드하여 엑셀 등에서 분석할 수 있습니다.</p>
              </div>
              <Button variant="outline" className="w-full">
                <Icon name="Download" size={18} />
                CSV 파일로 저장
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingsToggle({ icon, title, desc, active }: { icon: any, title: string, desc: string, active?: boolean }) {
  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex gap-4 items-center">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
          <Icon name={icon} size={20} />
        </div>
        <div>
          <p className="font-bold text-card-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <button 
        aria-label={`${title} 토글`}
        aria-pressed={active}
        className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out",
        active ? "bg-primary" : "bg-muted-foreground/30"
      )}>
        <div className={cn(
          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out",
          active && "translate-x-5"
        )} />
      </button>
    </div>
  );
}
