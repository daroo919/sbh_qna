<script type="module">
  import { auth, db } from "./firebase.js";
  import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
  import { doc, setDoc, query, getDocs, collection, where } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

  const btnSignup = document.getElementById("btnSignup");

  btnSignup.addEventListener("click", async () => {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.innerText = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const realname = document.getElementById("realname").value.trim();
    const studentid = document.getElementById("studentid").value.trim();

    // 1. 유효성 검사
    if (!email || !password || !nickname || !realname || !studentid) {
      errorMsg.innerText = "모든 항목을 입력해주세요.";
      return;
    }
    if (password.length < 6) {
      errorMsg.innerText = "비밀번호는 최소 6자리 이상이어야 합니다.";
      return;
    }

    // 버튼 비활성화 (중복 클릭 방지)
    btnSignup.disabled = true;
    btnSignup.innerText = "가입 중...";

    try {
      // 2. 닉네임 중복 체크
      const q = query(collection(db, "users"), where("nicknameLower", "==", nickname.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        errorMsg.innerText = "이미 사용 중인 닉네임입니다.";
        btnSignup.disabled = false;
        btnSignup.innerText = "회원가입";
        return;
      }

      // 3. Firebase Auth 계정 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 4. Firestore에 추가 정보 저장
      await setDoc(doc(db, "users", uid), {
        email: email,
        nickname: nickname,
        nicknameLower: nickname.toLowerCase(),
        realName: realname,
        studentId: studentid,
        points: 0,
        nicknameHistory: [nickname],
        role: "student",
        createdAt: new Date().toISOString() // 서버 시간을 쓰려면 serverTimestamp() 추천
      });

      alert("회원가입 완료! 메인 화면으로 이동합니다.");
      window.location.href = "main.html";

    } catch (err) {
      // Firebase 에러 메시지를 한국어로 변환해주면 더 좋습니다.
      if (err.code === 'auth/email-already-in-use') {
        errorMsg.innerText = "이미 가입된 이메일입니다.";
      } else {
        errorMsg.innerText = "에러 발생: " + err.message;
      }
      btnSignup.disabled = false;
      btnSignup.innerText = "회원가입";
    }
  });
</script>
