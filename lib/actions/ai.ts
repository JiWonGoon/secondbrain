"use server";

import { classifyNode, findRelatedNodes } from "@/lib/ai/classify";
import { createClient } from "@/lib/supabase/server";

/**
 * Node를 AI로 자동 분류하고 결과를 반환한다.
 */
export async function classifyNodeAction(input: string) {
  try {
    console.log('[Server] AI 분류 요청:', input.substring(0, 50));
    const result = await classifyNode(input);
    console.log('[Server] AI 분류 완료:', result);
    return result;
  } catch (error) {
    console.error('[Server] AI 분류 에러:', error);
    throw error;
  }
}

/**
 * 새로운 Node와 관련된 기존 Node를 추천한다.
 */
export async function getAIRelatedNodes(
  newNode: {
    type: string;
    title: string;
    summary: string;
    tags: string[];
  },
  limit: number = 20
) {
  try {
    const supabase = await createClient();

    // 현재 사용자의 모든 Node 조회
    const { data: nodes, error } = await supabase
      .from("nodes")
      .select("id, type, title, summary, tags")
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error || !nodes) {
      console.error("Node 조회 실패:", error);
      return [];
    }

    // AI 추천
    const related = await findRelatedNodes(
      newNode,
      nodes as Array<{
        id: string;
        type: string;
        title: string;
        summary: string;
        tags: string[];
      }>
    );

    return related;
  } catch (error) {
    console.error("관련 Node 추천 실패:", error);
    return [];
  }
}
