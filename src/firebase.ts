// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔐 Your Firebase Config Here
const firebaseConfig = {
  apiKey: "AIzaSyDUwJfk8nujG1xzRQZ6Rme8puP511WAiww",
  authDomain: "smart-productivity-dashb-c4a24.firebaseapp.com",
  projectId: "smart-productivity-dashb-c4a24",
  appId: "1:199931437019:web:3b08bbf1e74117cadd11fe",
  storageBucket: "smart-productivity-dashb-c4a24.firebasestorage.app",
  messagingSenderId: "G-8V12M70VW7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
