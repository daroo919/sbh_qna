import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";


const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const password = document.getElementById("password").value;

  try {

    // ✅ Firebase Auth 계정 생성
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // ✅ 닉네임 중복 체크
    const nicknameRef = doc(db, "nicknames", nickname);
    const nicknameSnap = await getDoc(nicknameRef);

    if (nicknameSnap.exists()) {
      alert("이미 사용중인 닉네임입니다.");
      return;
    }

    // 닉네임 예약
    await setDoc(nicknameRef, {
      uid: user.uid
    });

    // ✅ 유저 정보 저장 (본명/학번 없음)
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      nickname: nickname,
      createdAt: Date.now()
    });

    alert("회원가입 완료!");
    location.href = "login.html";

  } catch (error) {
    console.error(error);
    alert("회원가입 실패: " + error.message);
  }
});
