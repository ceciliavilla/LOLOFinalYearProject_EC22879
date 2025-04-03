import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCYJbVTZT2c8MurUogM595480LuEEeWxfQ",
  authDomain: "loloprot1.firebaseapp.com",
  projectId: "loloprot1",
  storageBucket: "loloprot1.appspot.com", 
  messagingSenderId: "166973568590",
  appId: "1:166973568590:web:0bbe9f15fc54f2ada6b51f",
  measurementId: "G-J0RQ6YRTS4" 
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
