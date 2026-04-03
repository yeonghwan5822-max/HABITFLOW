import { useState, useEffect, useCallback } from 'react';
import { Habit } from '../types';
import { getLocalDateString, calculateStreak, calculateWeeklyProgress } from '../lib/dateUtils';
import { db, auth } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { toast } from 'sonner';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  toast.error('데이터 처리 중 오류가 발생했습니다.');
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setHabits([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'habits'), where('userId', '==', auth.currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedHabits: Habit[] = [];
      snapshot.forEach((doc) => {
        fetchedHabits.push(doc.data() as Habit);
      });
      // Sort by createdAt descending (client-side for simplicity, or could add orderBy if index exists)
      fetchedHabits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHabits(fetchedHabits);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'habits');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleHabit = useCallback(async (id: string) => {
    if (!auth.currentUser) return;
    const today = getLocalDateString();
    
    // Optimistic Update: Update local state immediately
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const isCompletedToday = h.completedDates.includes(today);
        const newCompletedDates = isCompletedToday 
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today];
        return { ...h, completedDates: newCompletedDates };
      }
      return h;
    }));

    try {
      const habit = habits.find(h => h.id === id);
      if (habit) {
        const isCompletedToday = habit.completedDates.includes(today);
        const newCompletedDates = isCompletedToday 
          ? habit.completedDates.filter(d => d !== today)
          : [...habit.completedDates, today];
        
        await updateDoc(doc(db, 'habits', id), { 
          completedDates: newCompletedDates 
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `habits/${id}`);
      // Revert will happen automatically via onSnapshot if the server rejects it, 
      // but we could also manually revert here if needed.
    }
  }, [habits]);

  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'userId' | 'completedDates' | 'createdAt'>) => {
    if (!auth.currentUser) return;
    
    const newId = Math.random().toString(36).substr(2, 9);
    const newHabit: Habit = {
      ...habitData,
      id: newId,
      userId: auth.currentUser.uid,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update
    setHabits(prev => [newHabit, ...prev]);

    try {
      await setDoc(doc(db, 'habits', newId), newHabit);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `habits/${newId}`);
      // Revert optimistic update
      setHabits(prev => prev.filter(h => h.id !== newId));
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    if (!auth.currentUser) return;

    // Optimistic Update
    const habitToDelete = habits.find(h => h.id === id);
    setHabits(prev => prev.filter(h => h.id !== id));

    try {
      await deleteDoc(doc(db, 'habits', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `habits/${id}`);
      // Revert optimistic update
      if (habitToDelete) {
        setHabits(prev => [...prev, habitToDelete].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
    }
  }, [habits]);

  const today = getLocalDateString();
  const completedCount = habits.filter(h => h.completedDates.includes(today)).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const enhancedHabits = habits.map(h => ({
    ...h,
    isCompletedToday: h.completedDates.includes(today),
    streak: calculateStreak(h.completedDates),
    progress: calculateWeeklyProgress(h.completedDates),
  }));

  return {
    habits: enhancedHabits,
    toggleHabit,
    addHabit,
    deleteHabit,
    completedCount,
    progressPercent,
    loading
  };
}
