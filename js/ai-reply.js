// --- AI 설정 ---
async function checkAndReplyWithAI(qId, qTitle) {
    console.log("🔥 AI 함수 실행됨", qId);
const AI_CONFIG = {
  API_KEY: "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", 
  MODEL: "google/gemini-flash-1.5",
  BOT: { uid: "SYSTEM_AI_BOT", nickname: "시어尸魚(AI)", role: "AI" }
};

/**
 * 1. AI 답변 예약 함수 (v9 호환)
 */
async function scheduleAIReply(docId, content, delay = 60000) {
  console.log(`${delay / 1000}초 후 AI 답변이 예약되었습니다.`);
  
  setTimeout(async () => {
    try {
      // 답변이 이미 달렸는지 확인 (v9 문법)
      const answersRef = collection(db, "questions", docId, "answers");
      const snapshot = await getDocs(answersRef);
      
      if (!snapshot.empty) {
        console.log("이미 답변이 달려서 AI가 개입하지 않습니다.");
        return;
      }

      console.log("AI 답변 생성 중...");
      const aiContent = await fetchAIResponse(content);
      
      if (aiContent) {
        // AI 답변 저장 (v9 문법)
        await addDoc(answersRef, {
          content: aiContent,
          uid: AI_CONFIG.BOT.uid,
          nickname: AI_CONFIG.BOT.nickname,
          role: AI_CONFIG.BOT.role,
          createdAt: Date.now(), // 또는 serverTimestamp() 사용 가능
          isAI: true
        });

        // 질문 상태 업데이트
        await updateDoc(doc(db, "questions", docId), { answerCount: increment(1) });
        console.log("AI 답변 저장 완료!");
      }
    } catch (error) {
      console.error("AI 프로세스 중 오류:", error);
    }
  }, delay);
}

/**
 * 2. OpenRouter 호출 함수
 */
async function fetchAIResponse(prompt) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AI_CONFIG.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": AI_CONFIG.MODEL,
        "messages": [
          { "role": "system", "content": "당신은 Q&A 게시판의 AI 도우미입니다. 한국어로 짧고 친절하게 답하세요." },
          { "role": "user", "content": prompt }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.error("AI API 호출 실패:", e);
    return null;
  }
}
