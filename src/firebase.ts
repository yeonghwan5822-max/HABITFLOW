import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 브라우저 콘솔에서 확인하기 위한 디버깅 로그
console.log("Firebase Env Check:", import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Key Found" : "❌ Key Missing");

// Defensive Config: as string 강제 형변환으로 Vite 빌더가 확실히 문자열로 치환
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialization Guard: getApps()로 중복 초기화 방지
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// auth, db는 이미 초기화된 app에서 가져옴
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  await signOut(auth);
};