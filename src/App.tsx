import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { View } from './types';
import { useHabits } from './hooks/useHabits';
import { useJournal } from './hooks/useJournal';
import { useReports } from './hooks/useReports';
import { useTheme } from './hooks/useTheme';
import { useReminders } from './hooks/useReminders';
import { Sidebar } from './components/organisms/Sidebar';
import { DashboardView } from './components/organisms/DashboardView';
import { HabitsView } from './components/organisms/HabitsView';
import { JournalView } from './components/organisms/JournalView';
import { ReportsView } from './components/organisms/ReportsView';
import { SettingsView } from './components/organisms/SettingsView';
import { LandingView } from './components/organisms/LandingView';
import { Icon } from './components/atoms/Icon';
import { ErrorBoundary } from './components/atoms/ErrorBoundary';
import { auth, logout } from './firebase';
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { habits, toggleHabit, addHabit, deleteHabit, progressPercent, loading: loadingHabits } = useHabits();
  const { entries, mood, setMood, content, setContent, saveEntry, loading: loadingJournal } = useJournal();
  const { weeklyData, insights, averageCompletion } = useReports();
  const { theme, setTheme } = useTheme();

  useReminders(habits);

  useEffect(() => { signInAnonymously(auth); 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddHabit = () => {
    // In a real app, this would open a modal to create a habit
    addHabit({
      name: '새로운 습관',
      description: '습관에 대한 설명을 입력하세요.',
      frequency: '매일',
      time: '오전 09:00',
      icon: 'Star',
      color: 'text-yellow-500',
    });
    toast.success('새로운 습관이 추가되었습니다.');
  };

  const handleDeleteHabit = (id: string) => {
    deleteHabit(id);
    toast.success('습관이 삭제되었습니다.');
  };

  const handleSaveJournal = () => {
    saveEntry();
    toast.success('저널이 저장되었습니다.');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('로그아웃 되었습니다.');
    } catch (error) {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  const todayStr = new Intl.DateTimeFormat('ko-KR', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  }).format(new Date());

  if (loading || (user && (loadingHabits || loadingJournal))) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LandingView />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Toaster position="bottom-right" richColors />
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={handleLogout} />

      <main className="ml-64 flex-1 p-8 pb-12">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">
              {currentView === 'dashboard' && '오늘의 습관'}
              {currentView === 'habits' && '습관 관리'}
              {currentView === 'journal' && '일일 저널'}
              {currentView === 'reports' && '진행 리포트'}
              {currentView === 'settings' && '설정'}
            </h1>
            <p className="text-muted-foreground mt-1">{todayStr}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="알림"
              >
                <Icon name="Bell" size={22} />
              </button>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.displayName || '사용자'} 님</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <img 
                src={user.photoURL || "https://picsum.photos/seed/user/100/100"} 
                alt="프로필 이미지" 
                className="w-10 h-10 rounded-full border-2 border-primary/20"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && (
                <DashboardView 
                  habits={habits} 
                  onToggle={toggleHabit} 
                  progressPercent={progressPercent} 
                  onAddHabit={handleAddHabit}
                />
              )}
              {currentView === 'habits' && (
                <HabitsView 
                  habits={habits} 
                  onAddHabit={handleAddHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              )}
              {currentView === 'journal' && (
                <JournalView 
                  entries={entries}
                  mood={mood} 
                  setMood={setMood} 
                  content={content} 
                  setContent={setContent} 
                  onSave={handleSaveJournal}
                />
              )}
              {currentView === 'reports' && (
                <ReportsView 
                  weeklyData={weeklyData}
                  insights={insights}
                  averageCompletion={averageCompletion}
                />
              )}
              {currentView === 'settings' && (
                <SettingsView theme={theme} setTheme={setTheme} user={user} />
              )}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
    </div>
  );
}
