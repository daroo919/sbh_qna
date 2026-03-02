// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🔹 Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyC9y33YK_3b5NMfAk6dZi2jDMIi_dDXklQ",
  authDomain: "site4school-6affe.firebaseapp.com",
  projectId: "site4school-6affe",
  storageBucket: "site4school-6affe.appspot.com",
  messagingSenderId: "527337035288",
  appId: "1:527337035288:web:31056f24b22a940e90d56d",
  measurementId: "G-8Q3WC7K8HP" 
};

// 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);