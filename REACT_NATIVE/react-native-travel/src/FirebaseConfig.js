// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.YOUR_FIREBASE_API_KEY,
  authDomain: "react-native-travel-d44c7.firebaseapp.com",
  projectId: "react-native-travel-d44c7",
  storageBucket: "react-native-travel-d44c7.firebasestorage.app",
  messagingSenderId: "911995478994",
  appId: process.env.YOUR_FIREBASE_API_ID,
  measurementId: "G-989GFVNF7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

export { app, auth };