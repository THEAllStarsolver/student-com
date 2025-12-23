// Firebase Configuration and Initialization
// TODO: Replace with your Firebase project credentials from Firebase Console

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize variables with explicit types, initially undefined
let app: import('firebase/app').FirebaseApp;
let auth: import('firebase/auth').Auth;
let db: import('firebase/firestore').Firestore;

if (typeof window !== 'undefined') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

// Exporting as potentially undefined if consumed on server side without checks, 
// strictly speaking, but in this project it's used in client components mostly.
// To be safe for TS, we can cast them if we are sure they are initialized in the client context
export { auth, db };
