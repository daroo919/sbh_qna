import { auth, db } from "../firebase.js"; // 👈 네 말대로 한 칸 위(..)로!
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const signupBtn = document.getElementById("btnSignup");

if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("nickname").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    // 초기화
    if (errorMsg) errorMsg.textContent = "";

    // 유효성 검사
    if (!email || !password || !nickname) {
      if (errorMsg) errorMsg.textContent = "모든 항목을 입력해주세요.";
      return;
    }

    try {
      // 1. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore에 닉네임 등 추가 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        nickname: nickname,
        createdAt: Date.now()
      });

      alert("회원가입 성공!");
      window.location.href = "login.html"; // 가입 후 로그인 페이지로 이동

    } catch (error) {
      console.error(error);
      if (errorMsg) errorMsg.textContent = "에러: " + error.message;
    }
  });
}
