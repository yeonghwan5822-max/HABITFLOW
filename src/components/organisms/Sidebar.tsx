import React from 'react';
import { View } from '../../types';
import { SidebarItem } from '../molecules/SidebarItem';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 flex flex-col pt-6 pb-8 transition-colors duration-300">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
          <Icon name="BarChart3" size={24} />
        </div>
        <div>
          <h2 className="text-lg font-black text-primary leading-none font-headline">HabitFlow</h2>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">Stay Consistent</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <SidebarItem icon="LayoutDashboard" label="대시보드" active={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
        <SidebarItem icon="CalendarDays" label="습관 관리" active={currentView === 'habits'} onClick={() => onViewChange('habits')} />
        <SidebarItem icon="BookOpen" label="데일리 저널" active={currentView === 'journal'} onClick={() => onViewChange('journal')} />
        <SidebarItem icon="BarChart3" label="진행 리포트" active={currentView === 'reports'} onClick={() => onViewChange('reports')} />
        <SidebarItem icon="Settings" label="환경 설정" active={currentView === 'settings'} onClick={() => onViewChange('settings')} />
      </nav>

      <div className="px-4 mt-auto">
        <Button className="w-full">
          <Icon name="Plus" size={18} />
          <span className="text-sm">Create New Habit</span>
        </Button>
        <div className="mt-6 pt-6 border-t border-border space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start px-4">
            <Icon name="HelpCircle" size={18} />
            <span>Help</span>
          </Button>
          <Button variant="danger" size="sm" className="w-full justify-start px-4" onClick={onLogout}>
            <Icon name="LogOut" size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
