import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAaRjzmqYyEgNj4nnKK-v0m-14pIw7Em4",
  authDomain: "hobi-ccbc3.firebaseapp.com",
  projectId: "hobi-ccbc3",
  storageBucket: "hobi-ccbc3.appspot.com", // Fix if needed
  messagingSenderId: "37827118946",
  appId: "1:37827118946:web:ab97c4049daf9b0c510e3b",
  measurementId: "G-RF1KS2X2NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth

export { auth }; // Export auth
