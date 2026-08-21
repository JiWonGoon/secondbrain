import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Gemini API 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 분류 결과 스키마
const ClassificationResultSchema = z.object({
  type: z.enum([
    "task",
    "note",
    "book",
    "place",
    "study",
    "project",
    "idea",
    "person",
  ]),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  tags: z.array(z.string()).max(10),
  suggestedTasks: z.array(z.string()).max(5),
});

export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

/**
 * 사용자 입력을 분석하여 Node 타입, 제목, 요약, 태그를 제안한다.
 */
export async function classifyNode(
  input: string
): Promise<ClassificationResult | null> {
  try {
    console.log("[AI] API 키 확인:", process.env.GEMINI_API_KEY ? "있음" : "없음");

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `당신은 개인용 Life OS의 AI 분류 시스템입니다.

사용자가 입력한 텍스트를 분석하여 다음을 판단하세요:

1. **type**: 다음 중 가장 적합한 타입을 선택하세요
   - task: 해야 할 일, 체크리스트 항목
   - note: 메모, 생각, 아이디어 기록
   - book: 책, 논문, 자료
   - place: 가고 싶은 곳, 장소, 여행지
   - study: 공부해야 할 것, 학습 주제
   - project: 진행 중인 프로젝트, 큰 작업
   - idea: 해보고 싶은 것, 창의적 아이디어
   - person: 사람, 연락처, 관계

2. **title**: 입력을 요약한 짧은 제목 (20자 이내 권장)

3. **summary**: 입력의 핵심을 2-3문장으로 요약

4. **tags**: 관련된 태그 3-5개 (예: 일본, 여행, 책 읽기 등)

5. **suggestedTasks**: 이 항목과 관련하여 해야 할 일 1-5개
   (예: "숙소 조사하기", "비용 견적 내기" 등)
   태스크가 없으면 빈 배열 []

사용자 입력:
"""
${input}
"""

다음 JSON 형식으로만 응답하세요 (다른 설명 없이):
{
  "type": "task|note|book|place|study|project|idea|person",
  "title": "제목",
  "summary": "요약",
  "tags": ["태그1", "태그2", "태그3"],
  "suggestedTasks": ["할일1", "할일2", "할일3", "할일4", "할일5"]
}`;

    console.log("[AI] 분류 요청:", input.substring(0, 50));
    console.log("[AI] Gemini API 호출 시작...");

    const result = await model.generateContent(prompt);

    console.log("[AI] Gemini 응답 받음");

    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("[AI] 응답:", responseText);

    // JSON 추출 (```json ... ``` 형식 대응)
    const jsonMatch =
      responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
      responseText.match(/({[\s\S]*})/);

    if (!jsonMatch) {
      console.error("[AI] JSON 파싱 실패. 응답:", responseText);
      return null;
    }

    const jsonStr = jsonMatch[1];
    const parsed = JSON.parse(jsonStr);

    console.log("[AI] 파싱된 JSON:", parsed);

    // Zod 검증
    const validated = ClassificationResultSchema.parse(parsed);
    console.log("[AI] 검증 완료:", validated);
    return validated;
  } catch (error) {
    console.error("[AI] 분류 실패:", error);
    if (error instanceof Error) {
      console.error("[AI] 에러 메시지:", error.message);
      console.error("[AI] 에러 스택:", error.stack);
    }
    return null;
  }
}

/**
 * 여러 Node 중에서 새로운 Node와 관련된 항목을 추천한다.
 */
export async function findRelatedNodes(
  newNode: { type: string; title: string; summary: string; tags: string[] },
  existingNodes: Array<{
    id: string;
    type: string;
    title: string;
    summary: string;
    tags: string[];
  }>
): Promise<Array<{ id: string; reason: string }>> {
  try {
    if (existingNodes.length === 0) {
      return [];
    }

    // 기존 Node를 요약하여 전달 (토큰 절약)
    const nodesList = existingNodes
      .slice(0, 20) // 최대 20개까지만 고려
      .map((node) => `- [${node.id}] ${node.title} (${node.type})`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `당신은 개인용 Life OS의 관계 분석 AI입니다.

새로운 항목:
타입: ${newNode.type}
제목: ${newNode.title}
요약: ${newNode.summary}
태그: ${newNode.tags.join(", ")}

기존 항목:
${nodesList}

위 새로운 항목과 관련이 있을 가능성이 높은 기존 항목 ID를 최대 5개까지 선택하고, 각각에 대해 간단한 관계 설명을 제시하세요.

다음 JSON 형식으로 응답하세요 (다른 설명 없이):
{
  "relatedNodes": [
    {
      "id": "항목ID",
      "reason": "관계 설명"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch =
      responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
      responseText.match(/({[\s\S]*})/);

    if (!jsonMatch) {
      return [];
    }

    const jsonStr = jsonMatch[1];
    const parsed = JSON.parse(jsonStr);

    return parsed.relatedNodes || [];
  } catch (error) {
    console.error("관련 항목 추천 실패:", error);
    return [];
  }
}
