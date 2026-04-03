import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export interface UserProfile {
  is_premium: boolean;
  integrity_score?: number;
  global_streak?: number;
  current_rank?: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          is_premium: !!data.is_premium,
          integrity_score: data.integrity_score,
          global_streak: data.global_streak,
          current_rank: data.current_rank,
        });
      } else {
        // default if not exists yet
        setProfile({
          is_premium: false,
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setProfile({ is_premium: false });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { profile, loading };
}
