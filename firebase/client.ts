// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0OQayS4Wdasxy6fmuMwdFE_PmkVLUF74",
  authDomain: "intervuslayer.firebaseapp.com",
  projectId: "intervuslayer",
  storageBucket: "intervuslayer.firebasestorage.app",
  messagingSenderId: "1093733314678",
  appId: "1:1093733314678:web:bb3754ff9f28b6df38af57",
  measurementId: "G-5TF3VS489K"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);