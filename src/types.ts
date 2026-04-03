export type View = 'dashboard' | 'habits' | 'journal' | 'reports' | 'settings';

export type Frequency = '매일' | '주 5회' | '주 3회' | '주말' | '평일';

export type Mood = '🤩' | '😊' | '😐' | '😔' | '😢';

export interface Habit {
  id: string;
  userId?: string;
  name: string;
  description: string;
  frequency: Frequency;
  time: string;
  icon: string;
  color: string;
  completedDates: string[];
  createdAt: string;
  streak?: number;
  progress?: number;
}

export interface JournalEntry {
  id: string;
  userId?: string;
  date: string;
  mood: Mood;
  content: string;
  createdAt?: string;
}

export interface WeeklyData {
  name: string;
  value: number;
}

export interface ReportInsight {
  type: 'success' | 'info' | 'warning';
  message: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: string;
  integrity_score?: number;
  current_rank?: string;
  max_streak?: number;
}
