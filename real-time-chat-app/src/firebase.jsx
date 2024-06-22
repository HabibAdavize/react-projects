import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";


const firebaseConfig = {  
  apiKey: "AIzaSyDEmyu7w3BjTGBtX-wqry5xvdngBXPbJmE",
  authDomain: "react-chat-app-c8e77.firebaseapp.com",
  projectId: "react-chat-app-c8e77",
  storageBucket: "react-chat-app-c8e77.appspot.com",
  messagingSenderId: "230123610660",
  appId: "1:230123610660:web:4dc07412d98c2f531eeeb1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, collection, addDoc, query, orderBy, onSnapshot };
