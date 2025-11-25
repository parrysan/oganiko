import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    projectId: "velvety-arc-472510-j4",
    appId: "1:998396393588:web:e54dec3a4cef795b163921",
    storageBucket: "velvety-arc-472510-j4.firebasestorage.app",
    apiKey: "AIzaSyCKQCRPdrW4b3UHtMcYOxRnYCGQ-jdK9LE",
    authDomain: "velvety-arc-472510-j4.firebaseapp.com",
    messagingSenderId: "998396393588",
    projectNumber: "998396393588",
    version: "2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/drive');
