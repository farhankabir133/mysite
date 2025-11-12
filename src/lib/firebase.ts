import { initializeApp, FirebaseApp } from "firebase/app";
import { getFunctions, Functions } from "firebase/functions";
import { getAnalytics, Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Only initialize Firebase if the minimal required values are present.
// Missing values (especially projectId) cause runtime throws when calling
// analytics or other services — guard against that so the app doesn't render
// a blank page during module import.
let app: FirebaseApp | null = null;
let functions: Functions | null = null;
let analytics: Analytics | null = null;

const required = [firebaseConfig.apiKey, firebaseConfig.projectId, firebaseConfig.appId];
const hasRequired = required.every(Boolean);

if (!hasRequired) {
  // eslint-disable-next-line no-console
  console.warn('Incomplete Firebase configuration. Firebase will not be initialized. Required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID');
} else {
  try {
    app = initializeApp(firebaseConfig as any);
    functions = getFunctions(app);
    try {
      // analytics may throw if measurementId or config is missing/invalid
      analytics = getAnalytics(app);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Firebase analytics not initialized:', err);
      analytics = null;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase app:', err);
    app = null;
    functions = null;
    analytics = null;
  }
}

export { app, functions, analytics };