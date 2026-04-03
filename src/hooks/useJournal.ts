import { useState, useEffect, useCallback } from 'react';
import { JournalEntry, Mood } from '../types';
import { db, auth } from '../firebase';
import { collection, doc, onSnapshot, setDoc, query, where } from 'firebase/firestore';
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

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mood, setMood] = useState<Mood>('😊');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'journals'), where('userId', '==', auth.currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEntries: JournalEntry[] = [];
      snapshot.forEach((doc) => {
        fetchedEntries.push(doc.data() as JournalEntry);
      });
      // Sort by createdAt descending
      fetchedEntries.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setEntries(fetchedEntries);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'journals');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveEntry = useCallback(async () => {
    if (!content.trim() || !auth.currentUser) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const newEntry: JournalEntry = {
      id: newId,
      userId: auth.currentUser.uid,
      date: new Intl.DateTimeFormat('ko-KR', { 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      }).format(new Date()),
      mood,
      content,
      createdAt: new Date().toISOString(),
    };

    // Optimistic Update
    setEntries(prev => [newEntry, ...prev]);
    const previousContent = content;
    const previousMood = mood;
    
    setContent('');
    setMood('😊');

    try {
      await setDoc(doc(db, 'journals', newId), newEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `journals/${newId}`);
      // Revert optimistic update
      setEntries(prev => prev.filter(e => e.id !== newId));
      setContent(previousContent);
      setMood(previousMood);
    }
  }, [mood, content]);

  return {
    entries,
    mood,
    setMood,
    content,
    setContent,
    saveEntry,
    loading
  };
}
