import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEVSswbO9cYzHjAwc3GdP2fMpu4fWDSro",
  authDomain: "ujianonline-d443d.firebaseapp.com",
  projectId: "ujianonline-d443d",
  storageBucket: "ujianonline-d443d.firebasestorage.app",
  messagingSenderId: "134852657664",
  appId: "1:134852657664:web:869a3e777c021907004ee5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
