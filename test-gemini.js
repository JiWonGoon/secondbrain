const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API 키:", apiKey ? "있음" : "없음");
    console.log("API 키 (첫 10자):", apiKey ? apiKey.substring(0, 10) : "없음");

    if (!apiKey) {
      console.error("API 키가 없습니다!");
      console.error("GEMINI_API_KEY 환경변수를 확인하세요.");
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    console.log("Gemini API 테스트 시작...");

    const result = await model.generateContent(
      "한국어로 'hello'라고 하세요."
    );

    console.log("응답:", result.response.text());
    console.log("✅ Gemini API 정상 작동!");
  } catch (error) {
    console.error("❌ 에러:", error.message);
    console.error("상세:", error);
  }
}

testGemini();
