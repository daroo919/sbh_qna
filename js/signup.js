import { auth, db } from "../firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const signupBtn = document.getElementById("btnSignup");

if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const nickname = document.getElementById("nickname").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    // 1. 초기화
    if (errorMsg) errorMsg.textContent = "";

    // 2. 유효성 검사 실행
    const validationError = validateSignup(email, password, passwordConfirm, nickname);
    if (validationError) {
      errorMsg.textContent = validationError;
      return;
    }

    try {
      // 3. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 4. Firestore에 추가 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        nickname: nickname,
        createdAt: Date.now()
      });

      alert("회원가입이 완료되었습니다!");
      window.location.href = "login.html";

    } catch (error) {
      console.error(error);
      // Firebase 에러 한국어 처리
      handleFirebaseError(error, errorMsg);
    }
  });
}

/**
 * [핵심] 유효성 검사 로직
 */
function validateSignup(email, password, passwordConfirm, nickname) {
  // 빈 값 검사
  if (!email || !password || !passwordConfirm || !nickname) {
    return "모든 항목을 입력해 주세요.";
  }

  // 이메일 형식 검사 (정규표현식)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "유효한 이메일 형식이 아닙니다.";
  }

  // 일회용 이메일 도메인 차단
  const disposableDomains = [
    "tempmail.com", "mailinator.com", "10minutemail.com", 
    "guerrillamail.com", "sharklasers.com", "dispostable.com"
  ];
  const domain = email.split("@")[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return "일회용 이메일은 사용할 수 없습니다.";
  }

  // 비밀번호 일치 검사
  if (password !== passwordConfirm) {
    return "비밀번호가 서로 일치하지 않습니다.";
  }

  // 비밀번호 길이 검사
  if (password.length < 6) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  return null; // 에러 없음
}

/**
 * Firebase 에러 처리
 */
function handleFirebaseError(error, errorMsg) {
  switch (error.code) {
    case "auth/email-already-in-use":
      errorMsg.textContent = "이미 사용 중인 이메일입니다.";
      break;
    case "auth/invalid-email":
      errorMsg.textContent = "유효하지 않은 이메일 형식입니다.";
      break;
    case "auth/weak-password":
      errorMsg.textContent = "비밀번호가 너무 취약합니다.";
      break;
    default:
      errorMsg.textContent = "가입 중 오류가 발생했습니다: " + error.message;
  }
}
