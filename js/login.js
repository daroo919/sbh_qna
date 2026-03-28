import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");

if (btnLogin) { // 버튼이 존재하는지 확인 (에러 방지)
  btnLogin.addEventListener("click", async () => {
    const errorLogin = document.getElementById("errorLogin");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (errorLogin) errorLogin.innerText = "";

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      if (errorLogin) errorLogin.innerText = "이메일과 비밀번호를 입력해주세요.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 로그인 성공 시 메인 페이지로 이동
      window.location.href = "main.html";
    } catch (err) {
      console.error(err);
      if (errorLogin) errorLogin.innerText = "로그인 실패! 이메일/비밀번호 확인.";
    }
  });
}
