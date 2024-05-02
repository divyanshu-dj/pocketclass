import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

//Production
const firebaseConfig = {
    apiKey: "AIzaSyBKP8mEj1UHijTvkZ00TWqkRdIsKF3qpzk",
    authDomain: "pocket-class-bf921.firebaseapp.com",
    projectId: "pocket-class-bf921",
    storageBucket: "pocket-class-bf921.appspot.com",
    messagingSenderId: "270140022594",
    appId: "1:270140022594:web:d25d81f3a3b7070df332db"
};
//Development
// const firebaseConfig = {
//     apiKey: "AIzaSyBHmTGkLANrTPUON-7jGO8PbFcALeVYrTA",
//     authDomain: "pocketclass-dev.firebaseapp.com",
//     projectId: "pocketclass-dev",
//     storageBucket: "pocketclass-dev.appspot.com",
//     messagingSenderId: "914929617844",
//     appId: "1:914929617844:web:d15d04a2bdd05c697100e1"
//   };


const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)
export { db, storage, auth }