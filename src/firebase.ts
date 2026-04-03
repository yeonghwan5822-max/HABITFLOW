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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()})
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

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
