import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import firebaseConfigJson from '../firebase-applet-config.json';

// Explicitly reference each variable because Vite does static string replacement at build time.
// Do not use dynamic indexing (e.g., import.meta.env[key]) as it prevents Vercel from injecting correctly.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId,
};

// Fail fast: Prevent "API Key must be set" empty string/undefined errors.
const firebaseConfig = {
  apiKey: (config.apiKey && config.apiKey.trim() !== '') ? config.apiKey : undefined,
  authDomain: (config.authDomain && config.authDomain.trim() !== '') ? config.authDomain : undefined,
  projectId: (config.projectId && config.projectId.trim() !== '') ? config.projectId : undefined,
  appId: (config.appId && config.appId.trim() !== '') ? config.appId : undefined,
  firestoreDatabaseId: (config.firestoreDatabaseId && config.firestoreDatabaseId.trim() !== '') ? config.firestoreDatabaseId : undefined,
};

if (!firebaseConfig.apiKey) {
  console.error(
    "FIREBASE FATAL ERROR: 'apiKey' is missing or undefined! " +
    "Check Vercel Environment Variables: ensure VITE_FIREBASE_API_KEY is correctly set."
  );
}

let app: any;
export let auth: any;
export let db: any;
export const googleProvider = new GoogleAuthProvider();

try {
  // Debugging: Log exactly which keys are missing
  const missingKeys = [];
  if (!firebaseConfig.apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
  
  if (missingKeys.length > 0) {
    console.error("🔥 Firebase Config Warning - Missing Keys:", missingKeys.join(', '));
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
  }, firebaseConfig.firestoreDatabaseId);

} catch (error) {
  console.error("🔥 Firebase FATAL Initialization Error:", error);
  // Safe-Guard: Replace DOM to prevent white screen of death
  if (typeof document !== 'undefined') {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: #f9f9f9; color: #333; font-family: sans-serif; padding: 20px;">
        <div style="text-align: center; max-width: 500px; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #ef4444; margin-bottom: 16px;">설정 오류가 발생했습니다</h2>
          <p style="margin-bottom: 24px; color: #666;">Vercel 환경 변수(Environment Variables) 설정과 Vite 빌드 설정 간 문제가 발생하여 클라이언트를 로드할 수 없습니다.</p>
          <p style="font-size: 13px; color: #999; background: #f3f4f6; padding: 12px; border-radius: 6px;">디버그 힌트: 콘솔(Developer Tools)을 확인하여 누락된 API 키를 점검해 주세요.</p>
        </div>
      </div>
    `;
  }
}

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
