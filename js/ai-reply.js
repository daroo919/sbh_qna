// 1. AI 및 고정 설정
const AI_CONFIG = {
  API_KEY: "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", 
  MODEL: "google/gemini-flash-1.5",
  SITE_URL: window.location.origin
};

const AI_BOT = {
  uid: "SYSTEM_AI_BOT",
  nickname: "🤖 AI 답변봇",
  role: "AI"
};

/**
 * 2. 특정 시간(ms) 후에 AI 답변을 실행하는 함수
 * @param {string} docId - 질문 문서 ID
 * @param {string} content - 질문 내용
 * @param {number} delay - 대기 시간 (예: 600000 = 10분)
 */
function scheduleAIReply(docId, content, delay = 60000) {
  console.log(`${delay / 1000}초 후 AI 답변이 예약되었습니다.`);
  
  setTimeout(async () => {
    // 답변이 이미 달렸는지 확인하는 로직 (선택 사항)
    const snapshot = await db.collection('qna').doc(docId).collection('replies').get();
    if (!snapshot.empty) {
      console.log("이미 답변이 달려서 AI가 개입하지 않습니다.");
      return;
    }

    console.log("AI 답변 생성 중...");
    const aiContent = await fetchAIResponse(content);
    if (aiContent) {
      await saveAIResponse(docId, aiContent);
    }
  }, delay);
}

// OpenRouter 호출 함수
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
    console.error("AI 호출 실패:", e);
    return null;
  }
}

// Firestore 저장 함수
async function saveAIResponse(docId, text) {
  await db.collection('qna').doc(docId).collection('replies').add({
    content: text,
    authorUid: AI_BOT.uid,
    authorName: AI_BOT.nickname,
    role: AI_BOT.role,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  console.log("AI 답변 저장 완료!");
}
