
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBp-dVh3qAoxye3Z942hKxR9AhKfpS3ngo",
  authDomain: "nacimm-27ec2.firebaseapp.com",
  projectId: "nacimm-27ec2",
  storageBucket: "nacimm-27ec2.appspot.com",
  messagingSenderId: "791102608495",
  appId: "1:791102608495:web:8a25c838e22f465ba3299a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };