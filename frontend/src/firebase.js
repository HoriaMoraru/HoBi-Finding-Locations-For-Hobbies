// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAaRjzmqYyEgNj4nnKK-v0m-14pIw7Em4",
  authDomain: "hobi-ccbc3.firebaseapp.com",
  projectId: "hobi-ccbc3",
  storageBucket: "hobi-ccbc3.firebasestorage.app",
  messagingSenderId: "37827118946",
  appId: "1:37827118946:web:ab97c4049daf9b0c510e3b",
  measurementId: "G-RF1KS2X2NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
