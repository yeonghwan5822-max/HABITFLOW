import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Icon, IconName } from '../atoms/Icon';
import { Badge } from '../atoms/Badge';
import { Habit } from '../../types';

interface HabitCardProps {
  habit: Habit & { isCompletedToday?: boolean };
  onToggle: (id: string) => void;
  key?: string;
}

export const HabitCard = memo(function HabitCard({ habit, onToggle }: HabitCardProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleToggle = () => {
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
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-bold text-card-foreground truncate", habit.isCompletedToday && "line-through opacity-60")}>{habit.name}</h4>
        <p className="text-xs text-muted-foreground truncate">{habit.description}</p>
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
