import { useEffect, useRef } from 'react';
import { Habit } from '../types';
import { toast } from 'sonner';
import { parseKoreanTime } from '../lib/dateUtils';

export function useReminders(habits: Habit[]) {
  const notifiedHabits = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request notification permission if not already granted/denied
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const todayStr = now.toDateString();

      habits.forEach(habit => {
        // Skip if already completed today
        if (habit.isCompletedToday) return;

        const parsedTime = parseKoreanTime(habit.time);
        if (!parsedTime) return;

        // Check if it's the exact minute
        if (parsedTime.hours === currentHours && parsedTime.minutes === currentMinutes) {
          const habitKey = `${habit.id}-${todayStr}`;
          
          if (!notifiedHabits.current.has(habitKey)) {
            // Trigger Toast
            toast(`⏰ '${habit.name}' 실천할 시간이에요!`, {
              description: habit.description || '오늘의 목표를 달성해보세요.',
              duration: 10000,
            });

            // Trigger Browser Notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`⏰ ${habit.name} 할 시간이에요!`, {
                body: habit.description || '오늘의 목표를 달성해보세요.',
                icon: '/favicon.ico'
              });
            }

            notifiedHabits.current.add(habitKey);
          }
        }
      });
    };

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [habits]);
}
