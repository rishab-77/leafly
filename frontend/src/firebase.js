import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyABhx9E1XEX8l2YHkAwkFT74RQ46gn8gxw",
  authDomain: "leafly-app-2026.firebaseapp.com",
  projectId: "leafly-app-2026",
  storageBucket: "leafly-app-2026.firebasestorage.app",
  messagingSenderId: "111054569319",
  appId: "1:111054569319:web:33f94c11707a67d9f439c2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
