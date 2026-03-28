// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =======================
// Firebase 설정 (기존거 유지)
// =======================
const firebaseConfig = {
  apiKey: "여기그대로",
  authDomain: "여기그대로",
  projectId: "여기그대로",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


// =======================
// ✅ 닉네임 중복 체크 함수
// =======================
async function isNicknameTaken(nickname) {

  const q = query(
    collection(db, "users"),
    where("nickname", "==", nickname)
  );

  const snapshot = await getDocs(q);

  return !snapshot.empty;
}


// =======================
// ✅ 회원가입
// =======================
export async function signup(email, password, nickname) {

  if (!email || !password || !nickname) {
    alert("모든 항목 입력해라");
    return;
  }

  // 🔥 닉네임 중복 검사
  const taken = await isNicknameTaken(nickname);

  if (taken) {
    alert("이미 사용중인 닉네임");
    return;
  }

  try {

    // Auth 생성
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Firestore 저장 (3개만)
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      nickname: nickname,
      createdAt: serverTimestamp()
    });

    alert("회원가입 완료");
    location.href = "login.html";

  } catch (e) {
    alert(e.message);
  }
}
