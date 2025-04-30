// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "react-native-travel-e18d1.firebaseapp.com",
  projectId: "react-native-travel-e18d1",
  storageBucket: "react-native-travel-e18d1.firebasestorage.app",
  messagingSenderId: "656611254658",
  appId: "1:656611254658:web:38f9455cda1f919ee42f9b",
  measurementId: "G-CY4SHG1ERG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
