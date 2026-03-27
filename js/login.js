// js/login.js

import { auth } from "../firebase.js";
import { signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {
  const errorLogin = document.getElementById("errorLogin");
  errorLogin.innerText = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorLogin.innerText = "이메일과 비밀번호를 입력해주세요.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    window.location.href = "main.html";

  } catch (err) {
    errorLogin.innerText = "로그인 실패! 이메일/비밀번호 확인.";
  }
});
