import { auth, db } from "../firebase.js";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const signupBtn = document.getElementById("btnSignup");

if (signupBtn) {
  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const nickname = document.getElementById("nickname").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    // 1. 초기화
    if (errorMsg) errorMsg.textContent = "";

    // 2. 유효성 검사 (빈 값, 이메일 형식, 일회용 도메인)
    const validationError = validateSignup(email, password, nickname);
    if (validationError) {
      if (errorMsg) errorMsg.textContent = validationError;
      return;
    }

    try {
      // 3. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 4. (선택사항) 실제 사용 가능한 메일인지 확인하기 위해 인증 메일 발송
      // await sendEmailVerification(user);

      // 5. Firestore에 추가 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        nickname: nickname,
        createdAt: Date.now(),
        isVerified: false // 인증 메일 사용 시 상태값 활용 가능
      });

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      window.location.href = "login.html";

    } catch (error) {
      console.error("회원가입 에러:", error);
      if (errorMsg) {
        // Firebase 에러 코드에 따른 한국어 메시지 처리
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMsg.textContent = "이미 사용 중인 이메일입니다.";
            break;
          case "auth/weak-password":
            errorMsg.textContent = "비밀번호는 6자리 이상이어야 합니다.";
            break;
          default:
            errorMsg.textContent = "오류가 발생했습니다: " + error.message;
        }
      }
    }
  });
}

/**
 * 회원가입 유효성 검사 함수
 */
function validateSignup(email, password, nickname) {
  if (!email || !password || !nickname) {
    return "모든 항목을 입력해주세요.";
  }

  // 이메일 형식 검사 (정규표현식)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "올바른 이메일 형식이 아닙니다.";
  }

  // 일회용 이메일 도메인 차단 리스트 (예시)
  const disposableDomains = [
    "tempmail.com", "mailinator.com", "10minutemail.com", 
    "guerrillamail.com", "dispostable.com", "trashmail.com"
  ];
  const domain = email.split("@")[1].toLowerCase();
  
  if (disposableDomains.includes(domain)) {
    return "고작 일회용 이메일로 계정을 생성할려고 하는거냐.";
  }

  if (password.length < 6) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }

  return null; // 에러 없음
}
