import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

// Production
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};
// Development
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