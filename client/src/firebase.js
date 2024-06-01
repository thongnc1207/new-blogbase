// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-910cf.firebaseapp.com",
  projectId: "mern-blog-910cf",
  storageBucket: "mern-blog-910cf.appspot.com",
  messagingSenderId: "922980103501",
  appId: "1:922980103501:web:9ece10833b1b1adb69b304"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);