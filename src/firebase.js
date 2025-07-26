// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAuEpSeEFwt8C9979-y_BZW7SnN6qBbxDg",
  authDomain: "programmatee.firebaseapp.com",
  projectId: "programmatee",
  storageBucket: "programmatee.firebasestorage.app",
  messagingSenderId: "1093903877466",
  appId: "1:1093903877466:web:113f7a29fe7ab807c71f63",
  measurementId: "G-B4KELJ98BR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
