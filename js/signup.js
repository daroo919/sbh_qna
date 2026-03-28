import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const signupBtn = document.getElementById("btnSignup");

if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const errorMsg = document.getElementById("errorMsg");

    if (errorMsg) errorMsg.textContent = "";

    if (!email || !nickname || !password || !passwordConfirm) {
      errorMsg.textContent = "모든 항목을 입력해주세요.";
      return;
    }

    if (password !== passwordConfirm) {
      errorMsg.textContent = "비밀번호가 일치하지 않습니다.";
      return;
    }

    try {
      // 닉네임 중복 체크
      const nicknameRef = doc(db, "nicknames", nickname);
      const nicknameSnap = await getDoc(nicknameRef);

      if (nicknameSnap.exists()) {
        errorMsg.textContent = "이미 사용중인 닉네임입니다.";
        return;
      }

      // 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 정보 저장
      await setDoc(nicknameRef, { uid: user.uid });
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        nickname: nickname,
        createdAt: Date.now()
      });

      alert("회원가입 완료!");
      location.href = "login.html";

    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        errorMsg.textContent = "이미 사용 중인 이메일입니다.";
      } else {
        errorMsg.textContent = "에러: " + error.message;
      }
    }
  });
}
