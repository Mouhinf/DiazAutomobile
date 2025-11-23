// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// getAnalytics est importé dynamiquement ci-dessous pour s'assurer qu'il n'est chargé que côté client

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Log pour vérifier si la configuration est chargée
if (!getApps().length) {
  console.log("Firebase Config:", firebaseConfig);
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing! Check your .env.local file.");
  }
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics;
// Importe getAnalytics dynamiquement et l'initialise uniquement côté client
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch(e => console.error("Failed to load Firebase Analytics:", e));
}

export { app, auth, db, storage, analytics };