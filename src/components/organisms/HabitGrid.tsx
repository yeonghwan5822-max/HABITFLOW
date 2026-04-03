import React from 'react';
import { motion } from 'motion/react';
import { Habit } from '../../types';
import { HabitCard } from '../molecules/HabitCard';
import { Icon } from '../atoms/Icon';
import { EmptyState } from '../molecules/EmptyState';

interface HabitGridProps {
  habits: (Habit & { isCompletedToday?: boolean })[];
  onToggle: (id: string) => void;
  onAddHabit?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(4px)" },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 250, damping: 20 } 
  }
};

export function HabitGrid({ habits, onToggle, onAddHabit }: HabitGridProps) {
  if (habits.length === 0) {
    return (
      <EmptyState
        icon="ListTodo"
        title="등록된 습관이 없습니다"
        description="첫 번째 습관을 등록하고 새로운 루틴을 시작해보세요."
        action={
          onAddHabit && (
            <button 
              onClick={onAddHabit}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Icon name="Plus" size={18} />
              새 습관 추가
            </button>
          )
        }
      />
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {habits.map((habit) => (
        <motion.div key={habit.id} variants={itemVariants}>
          <HabitCard habit={habit} onToggle={onToggle} />
        </motion.div>
      ))}
      {onAddHabit && (
        <motion.button 
          variants={itemVariants}
          onClick={onAddHabit}
          aria-label="새 습관 추가"
          className="bg-muted rounded-2xl p-5 border-2 border-dashed border-border flex items-center justify-center gap-3 hover:bg-card hover:border-primary hover:text-primary transition-all group min-h-[88px]"
        >
          <Icon name="Plus" className="group-hover:rotate-90 transition-transform" />
          <span className="font-bold text-muted-foreground group-hover:text-primary">새 습관 추가</span>
        </motion.button>
      )}
    </motion.div>
  );
}
