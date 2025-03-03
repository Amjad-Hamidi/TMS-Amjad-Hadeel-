// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "training-management-5dd85.firebaseapp.com",
  projectId: "training-management-5dd85",
  storageBucket: "training-management-5dd85.firebasestorage.app",
  messagingSenderId: "73649858952",
  appId: "1:73649858952:web:3bfcce8a53ab77eb31f23d",
  measurementId: "G-TM8KKR8N3K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

