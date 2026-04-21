import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbdohB61du6uE627zE7suf7kRk9eIw60U",
  authDomain: "zonera-e4b13.firebaseapp.com",
  projectId: "zonera-e4b13",
  storageBucket: "zonera-e4b13.firebasestorage.app",
  messagingSenderId: "176063306389",
  appId: "1:176063306389:web:b4dfadc3f89b502eed999c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
