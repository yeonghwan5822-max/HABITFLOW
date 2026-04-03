import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export type DisciplineRank = 'Cadet' | 'Officer' | 'Senior Warden' | 'Master of Discipline';

export function useIntegrityScore(habits: Habit[]) {
  const [score, setScore] = useState<number>(0);
  const [tier, setTier] = useState<DisciplineRank>('Cadet');
  const [globalStreak, setGlobalStreak] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const calculateScore = async () => {
      if (habits.length === 0) {
        setScore(0);
        setTier('Cadet');
        setGlobalStreak(0);
        setLoading(false);
        return;
      }

      // 1. Calculate Global Streak (Strict)
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const isCompleted = (dateStr: string) => {
        const activeHabits = habits.filter(h => h.createdAt.slice(0, 10) <= dateStr);
        if (activeHabits.length === 0) return false;
        return activeHabits.every(h => h.completedDates?.includes(dateStr));
      };

      let currentGlobalStreak = 0;
      const currentDateForStreak = new Date();
      const todayStr = formatDate(currentDateForStreak);

      if (isCompleted(todayStr)) {
        currentGlobalStreak++;
      }

      currentDateForStreak.setDate(currentDateForStreak.getDate() - 1);
      
      while (true) {
        const dateStr = formatDate(currentDateForStreak);
        const activeHabits = habits.filter(h => h.createdAt.slice(0, 10) <= dateStr);
        
        if (activeHabits.length === 0) break;
        
        if (isCompleted(dateStr)) {
          currentGlobalStreak++;
          currentDateForStreak.setDate(currentDateForStreak.getDate() - 1);
        } else {
          break;
        }
      }

      setGlobalStreak(currentGlobalStreak);

      // 2. Calculate completion rate
      let totalCompleted = 0;
      let totalExpected = 0;

      const today = new Date();
      habits.forEach(habit => {
        totalCompleted += (habit.completedDates?.length || 0);
        
        // Days since creation
        const createdAt = new Date(habit.createdAt);
        // Normalize times to midnight to avoid partial day issues
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const createdDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate());
        
        const diffTime = Math.abs(todayDate.getTime() - createdDate.getTime());
        // Add 1 to include the day of creation as an expected day
        const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
        
        totalExpected += diffDays;
      });

      const completionRate = totalExpected > 0 ? (totalCompleted / totalExpected) * 100 : 0;

      // 3. Formula: Score = (Global Streak * 1.5) + (Total Completion Rate * 0.5)
      const calculatedScore = Math.round((currentGlobalStreak * 1.5) + (completionRate * 0.5));

      setScore(calculatedScore);

      // Determine tier
      let currentTier: DisciplineRank = 'Cadet';
      if (calculatedScore >= 120) currentTier = 'Master of Discipline';
      else if (calculatedScore >= 80) currentTier = 'Senior Warden';
      else if (calculatedScore >= 50) currentTier = 'Officer';
      else currentTier = 'Cadet';
      
      setTier(currentTier);

      // 4. Update Firestore user profile
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.integrity_score !== calculatedScore || data.global_streak !== currentGlobalStreak || data.current_rank !== currentTier) {
            await updateDoc(userRef, {
              integrity_score: calculatedScore,
              global_streak: currentGlobalStreak,
              current_rank: currentTier
            });
          }
        } else {
          await setDoc(userRef, {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            integrity_score: calculatedScore,
            global_streak: currentGlobalStreak,
            current_rank: currentTier,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (error) {
        console.error('Failed to update integrity score in Firestore', error);
      }

      setLoading(false);
    };

    // Calculate immediately
    calculateScore();
  }, [habits]);

  return { score, tier, globalStreak, loading };
}
