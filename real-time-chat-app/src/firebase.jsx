
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {  
  apiKey: "AIzaSyDEmyu7w3BjTGBtX-wqry5xvdngBXPbJmE",
  authDomain: "react-chat-app-c8e77.firebaseapp.com",
  projectId: "react-chat-app-c8e77",
  storageBucket: "react-chat-app-c8e77.appspot.com",
  messagingSenderId: "230123610660",
  appId: "1:230123610660:web:4dc07412d98c2f531eeeb1"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore database
const auth = getAuth(app); // Firebase Authentication

export { db, auth }