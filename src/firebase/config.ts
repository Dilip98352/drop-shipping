import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD3FukddgjWQS1mzqN2NLz2THLlBKOxmNE",
  authDomain: "cash-king-5a2e4.firebaseapp.com",
  databaseURL: "https://cash-king-5a2e4-default-rtdb.firebaseio.com",
  projectId: "cash-king-5a2e4",
  storageBucket: "cash-king-5a2e4.appspot.com",
  messagingSenderId: "252371777417",
  appId: "1:252371777417:web:379b9098ce670b006a1358",
  measurementId: "G-WGF3BR17H5"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize services
export const database = getDatabase(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;