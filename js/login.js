import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");

if (btnLogin) {
  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    const errorLogin = document.getElementById("errorLogin");
    if (errorLogin) errorLogin.innerText = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      if (errorLogin) errorLogin.innerText = "이메일과 비밀번호를 입력해주세요.";
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      window.location.href = "main.html";
    } catch (err) {
      console.error(err);
      if (errorLogin) errorLogin.innerText = "로그인 실패! 정보를 확인해주세요.";
    }
  });
}
