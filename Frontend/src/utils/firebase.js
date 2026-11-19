import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "pixelai-1a8c4.firebaseapp.com",
  projectId: "pixelai-1a8c4",
  storageBucket: "pixelai-1a8c4.firebasestorage.app",
  messagingSenderId: "660481395979",
  appId: "1:660481395979:web:62c235e7f272ef05d7a60e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };