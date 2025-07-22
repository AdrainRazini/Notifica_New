
  // js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyA0Gn8wrdxwkVsd1Tku8dAo1hCCikc9xTQ",
    authDomain: "noticia-data.firebaseapp.com",
    projectId: "noticia-data",
    storageBucket: "noticia-data.firebasestorage.app",
    messagingSenderId: "101459238484",
    appId: "1:101459238484:web:79b52a8c200f2e4b8a57c1",
    measurementId: "G-6BDWBCGSF8"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { app, auth, db, provider };