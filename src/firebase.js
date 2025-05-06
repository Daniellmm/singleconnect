import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// firebase configuration for my web app
const firebaseConfig = {
    apiKey: "AIzaSyAKZW1b4A2c0Ed-ha9f-FrR2L5h3UlU8bI",
    authDomain: "sc2025-5ea8d.firebaseapp.com",
    projectId: "sc2025-5ea8d",
    storageBucket: "sc2025-5ea8d.firebasestorage.app",
    messagingSenderId: "403332412907",
    appId: "1:403332412907:web:cc312e82a0ea13055d55ae",
    measurementId: "G-3WLFHQD2WE"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;

// Deployment ID AKfycby6Cs7B4q9ioCF5nDeemGKa6aqIVZykpRtlBJU252q5yc5cIWk8WUcLcEi1nASfIZkf

// Web app URL https://script.google.com/macros/s/AKfycby6Cs7B4q9ioCF5nDeemGKa6aqIVZykpRtlBJU252q5yc5cIWk8WUcLcEi1nASfIZkf/exec

