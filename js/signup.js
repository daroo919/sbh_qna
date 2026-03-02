// js/signup.js

console.log("🔥 signup.js 실행됨");
console.log("뭘봐");

import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import {
  doc, setDoc, query, getDocs, collection, where
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const btnSignup = document.getElementById("btnSignup");

btnSignup.addEventListener("click", async () => {
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const passwordConfirm = document.getElementById("passwordConfirm").value.trim();
  const nickname = document.getElementById("nickname").value.trim();
  const realname = document.getElementById("realname").value.trim();
  const studentid = document.getElementById("studentid").value.trim();

  if (!email || !password || !passwordConfirm || !nickname || !realname || !studentid) {
    errorMsg.innerText = "모든 항목을 입력해주세요.";
    return;
  }

  if (password.length < 6) {
    errorMsg.innerText = "비밀번호는 최소 6자리 이상이어야 합니다.";
    return;
  }

  if (password !== passwordConfirm) {
    errorMsg.innerText = "비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    // 닉네임 중복 검사
    const q = query(
      collection(db, "users"),
      where("nicknameLower", "==", nickname.toLowerCase())
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      errorMsg.innerText = "이미 사용 중인 닉네임입니다.";
      return;
    }

    // 회원 생성
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    // Firestore 저장
    await setDoc(doc(db, "users", uid), {
      email,
      nickname,
      nicknameLower: nickname.toLowerCase(),
      realName: realname,
      studentId: studentid,
      points: 0,
      nicknameHistory: [nickname],
      role: "student",
      createdAt: new Date().toISOString()
    });

    alert("회원가입 완료! 메인 화면으로 이동합니다.");
    window.location.href = "/sbh_qna/main.html";

  } catch (err) {
    errorMsg.innerText = err.message;
  }
});


// 👁 비밀번호 보기/숨기기 기능
const toggle1 = document.getElementById("togglePassword1");
const toggle2 = document.getElementById("togglePassword2");

toggle1.addEventListener("click", () => {
  const pw = document.getElementById("password");
  pw.type = pw.type === "password" ? "text" : "password";
});

toggle2.addEventListener("click", () => {
  const pwc = document.getElementById("passwordConfirm");
  pwc.type = pwc.type === "password" ? "text" : "password";
});
