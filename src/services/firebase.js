// Firebase Modular SDK v10 Configuration for Cabinet Dr. NAMBOY
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDyLLjInefnBTxEmbgj4Qw22wZ6MhkXArM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cabinet-dr-namboy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cabinet-dr-namboy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cabinet-dr-namboy.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "330826957841",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:330826957841:web:84e9502a7715416c611db0"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

let appInstance = null;
let authInstance = null;
let dbInstance = null;
let storageInstance = null;

try {
  if (getApps().length > 0) {
    appInstance = getApp();
  } else {
    appInstance = initializeApp(firebaseConfig);
  }

  if (isFirebaseConfigured) {
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    try {
      storageInstance = getStorage(appInstance);
    } catch (storageErr) {
      console.warn("Firebase Storage init warning:", storageErr);
    }
  }
} catch (e) {
  console.warn("Firebase initialized with local fallback mode:", e);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

export default app;
