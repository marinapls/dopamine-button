import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj7hlz7CzzwL_m3K1wDWXF3UqUL-FtGo",
  authDomain: "dopamine-button-22a2e.firebaseapp.com",
  projectId: "dopamine-button-22a2e",
  storageBucket: "dopamine-button-22a2e.firebasestorage.app",
  messagingSenderId: "274789669836",
  appId: "1:274789669836:web:0a3e8c9ad46ab83c14db69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 