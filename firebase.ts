import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzlK9BDm4kVxdnESEKoQzb3_qSyNDlw6c",
  authDomain: "meu-restaurante-f6aac.firebaseapp.com",
  projectId: "meu-restaurante-f6aac",
  storageBucket: "meu-restaurante-f6aac.firebasestorage.app",
  messagingSenderId: "118411712568",
  appId: "1:118411712568:web:09a87f21f64dc4a9ca2ecd",
  measurementId: "G-GM82ZFLFZ6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
