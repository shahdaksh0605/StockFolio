// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq_4pMumlK4CnE5Eu_vjlwl5rku596DTg",
  authDomain: "stockfolio-5000b.firebaseapp.com",
  projectId: "stockfolio-5000b",
  storageBucket: "stockfolio-5000b.firebasestorage.app",
  messagingSenderId: "81842789707",
  appId: "1:81842789707:web:d991d70041c59aa1a19cce",
  measurementId: "G-1ENMTQ1J1M"
};

// Initialize Firebase  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ⬇️ ADD THIS to disable login persistence after browser is closed
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // optional: continue setup or just leave empty
  })
  .catch((error) => {
    console.error("Persistence setting error:", error);
  });
// const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

export {app,auth};