import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Icon, IconName } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Habit } from '../../types';

interface HabitCardProps {
  habit: Habit & { isCompletedToday?: boolean };
  onToggle: (id: string) => void;
  key?: string;
  editingId?: string | null;
  setEditingId?: (id: string | null) => void;
  updateHabit?: (id: string, updates: Partial<Habit>) => void;
  deleteHabit?: (id: string) => void;
}

export const HabitCard = memo(function HabitCard({ habit, onToggle, editingId, setEditingId, updateHabit, deleteHabit }: HabitCardProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const isEditing = editingId === habit.id;
  const [editName, setEditName] = useState(habit.name);
  const [editTime, setEditTime] = useState(habit.time || '오전 09:00');
  const [editFrequency, setEditFrequency] = useState(habit.frequency || '매일');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Update local edit name if habit name changes outside
  useEffect(() => {
    setEditName(habit.name);
    setEditTime(habit.time || '오전 09:00');
    setEditFrequency(habit.frequency || '매일');
  }, [habit.name, habit.time, habit.frequency]);

  const handleSave = () => {
    const trimmedName = editName.trim();
    if (trimmedName === '') {
      if (deleteHabit) deleteHabit(habit.id); // Clean-up empty
    } else if (
      trimmedName !== habit.name || 
      editTime !== habit.time || 
      editFrequency !== habit.frequency
    ) {
      if (updateHabit) {
        updateHabit(habit.id, { 
          name: trimmedName,
          time: editTime,
          frequency: editFrequency
        });
      }
    } else {
      setEditName(habit.name);
      setEditTime(habit.time || '오전 09:00');
      setEditFrequency(habit.frequency || '매일');
    }
    if (setEditingId) setEditingId(null);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // 만약 새롭게 포커스를 받는 요소가 이 HabitCard 컴포넌트 내부에 없다면 Blur 처리=Save
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      handleSave();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      // ESC 시 원래 비어있던 항목이면 삭제, 아니면 이전 속성들로 원복 (Notion Style)
      if (habit.name === '' || editName.trim() === '') {
        if (deleteHabit) deleteHabit(habit.id);
      } else {
        setEditName(habit.name);
        setEditTime(habit.time || '오전 09:00');
        setEditFrequency(habit.frequency || '매일');
      }
      if (setEditingId) setEditingId(null);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    // Prevent toggle when editing
    if (isEditing) return;
    if (!habit.isCompletedToday) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
    onToggle(habit.id);
  };

  const particles = Array.from({ length: 12 });

  return (
    <button 
      onClick={handleToggle}
      aria-label={`${habit.name} ${habit.isCompletedToday ? '완료 취소' : '완료'}`}
      className={cn(
        "bg-card rounded-2xl p-5 border border-border shadow-sm hover:border-primary/30 transition-all flex items-center gap-4 group text-left w-full",
        habit.isCompletedToday && "bg-primary/5 border-primary/20"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0",
        habit.isCompletedToday ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}>
        <Icon name={habit.icon as IconName} size={24} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center" onClick={(e) => { if (isEditing) e.stopPropagation(); }}>
        {isEditing ? (
          <div 
            className="w-full bg-[#F9F9F9] dark:bg-zinc-900 rounded-lg p-3 flex flex-col gap-3 -ml-2 -mt-2 shadow-inner border border-zinc-200 dark:border-zinc-800"
            onBlur={handleBlur}
            tabIndex={-1}
          >
            <input
              ref={inputRef}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none focus:outline-none text-card-foreground font-sans text-base font-bold placeholder-zinc-400"
              placeholder="습관 이름 입력..."
              autoFocus
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <select 
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="오전 06:00">오전 06:00</option>
                <option value="오전 07:00">오전 07:00</option>
                <option value="오전 08:00">오전 08:00</option>
                <option value="오전 09:00">오전 09:00</option>
                <option value="오후 12:00">오후 12:00</option>
                <option value="오후 06:00">오후 06:00</option>
                <option value="오후 09:00">오후 09:00</option>
                <option value="시간 없음">시간 없음</option>
              </select>
              <select
                value={editFrequency}
                onChange={(e) => setEditFrequency(e.target.value)}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="매일">매일</option>
                <option value="주 1회">주 1회</option>
                <option value="주 3회">주 3회</option>
                <option value="주 5회">주 5회</option>
                <option value="주말">주말</option>
                <option value="평일">평일</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <h4 
              className={cn("font-bold text-card-foreground truncate", habit.isCompletedToday && "line-through opacity-60 cursor-pointer")}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (setEditingId) setEditingId(habit.id);
              }}
            >
              {habit.name}
            </h4>
            <div className="flex gap-2 items-center mt-1">
              {habit.time && habit.time !== '시간 없음' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-muted text-muted-foreground">{habit.time}</span>
              )}
              {habit.frequency && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-muted text-muted-foreground">{habit.frequency}</span>
              )}
              {(!habit.time || habit.time === '시간 없음') && !habit.frequency && (
                <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
              )}
            </div>
          </>
        )}
      </div>
      <div className="relative shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
          habit.isCompletedToday ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent group-hover:border-primary group-hover:text-primary"
        )}>
          <Icon name="Check" size={16} strokeWidth={3} />
        </div>
        <AnimatePresence>
          {showCelebration && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {particles.map((_, i) => {
                const angle = (i / particles.length) * 360;
                const distance = 40 + Math.random() * 20; // Randomize distance
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * distance;
                const y = Math.sin(rad) * distance;
                const size = 4 + Math.random() * 6; // Randomize size
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                    animate={{ 
                      x: [0, x, x * 1.2], 
                      y: [0, y, y + 20], // Add gravity effect
                      scale: [0, 1, 0], 
                      opacity: [1, 1, 0],
                      rotate: [0, Math.random() * 360]
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute rounded-sm"
                    style={{ 
                      width: size, 
                      height: size, 
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5] 
                    }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </button>
  );
});
