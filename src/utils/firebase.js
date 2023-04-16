// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsb9hteKVWiuyMZ0mW33hiu35-BFtBSKQ",
  authDomain: "weather-app-21f42.firebaseapp.com",
  projectId: "weather-app-21f42",
  storageBucket: "weather-app-21f42.appspot.com",
  messagingSenderId: "904414893652",
  appId: "1:904414893652:web:650d222f6f700b8e427fc1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 
