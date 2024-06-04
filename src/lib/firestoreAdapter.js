import { initFirestore } from "@auth/firebase-adapter"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { cert } from "firebase-admin/app";
import { initializeApp, getApp, getApps } from "firebase/app";

export const firestoreConfig = {
 credential: cert({
   projectId: process.env.FIREBASE_PROJECT_ID,
   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
   privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
 }),

  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

}

const app = getApps().length ? getApp() : initializeApp(firestoreConfig);
const db = getFirestore(app);
const firestoreApp = initFirestore(firestoreConfig)
const storage = getStorage(app);

export { app, db, firestoreApp, storage };
