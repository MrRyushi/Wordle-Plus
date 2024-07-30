import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBD5VxGB6syDEw8lGmab7cLyuUtq3-6ziw",
  authDomain: "wordle-e8031.firebaseapp.com",
  projectId: "wordle-e8031",
  storageBucket: "wordle-e8031.appspot.com",
  messagingSenderId: "247300489965",
  appId: "1:247300489965:web:be554d6cb1fe1d10ae42e4",
  measurementId: "G-MFE99G4K0X",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
