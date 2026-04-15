import { auth } from "../firebase.js"; // 👈 한 단계 위(..)로 가서 찾아라!
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const btnLogin = document.getElementById("btnLogin");

if (btnLogin) {
  btnLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorLogin = document.getElementById("errorLogin");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("로그인 성공!");
      window.location.href = "main.html"; // 👈 같은 층에 있으니까 바로 이동
    } catch (err) {
      if (errorLogin) errorLogin.innerText = "로그인 실패! 정보를 확인해주세요.";
    }
  });
}
