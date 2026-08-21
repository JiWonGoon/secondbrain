"use client";

import { useState } from "react";
import { X, Loader2, Check } from "lucide-react";
import { ClassificationResult } from "@/lib/ai/classify";
import { createNode } from "@/lib/actions/node";
import { createRelation } from "@/lib/actions/relation";
import { useNodeStore } from "@/lib/stores/nodeStore";

interface ClassificationSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  originalInput: string;
  suggestion: ClassificationResult | null;
  isLoading: boolean;
}

const NODE_TYPE_LABELS: Record<string, string> = {
  task: "할 일",
  note: "메모",
  book: "책",
  place: "장소",
  study: "공부",
  project: "프로젝트",
  idea: "아이디어",
  person: "사람",
};

const NODE_TYPE_COLORS: Record<string, string> = {
  task: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  note: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  book: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  place: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  study: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  project: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  idea: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  person: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export function ClassificationSuggestionModal({
  isOpen,
  onClose,
  onSuccess,
  originalInput,
  suggestion,
  isLoading,
}: ClassificationSuggestionModalProps) {
  const [isApplying, setIsApplying] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const addNode = useNodeStore((state) => state.addNode);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!suggestion) return;

    setIsApplying(true);
    try {
      // 메인 Node 생성
      const newNode = await createNode(
        suggestion.type as any,
        suggestion.title,
        originalInput,
        {
          summary: suggestion.summary,
          tags: suggestion.tags,
        }
      );

      if (newNode) {
        addNode(newNode);

        // 선택된 suggestedTasks를 Task로 생성 및 메인 Node와 연결
        if (selectedTasks.size > 0) {
          console.log("[Modal] 선택된 Task 인덱스:", Array.from(selectedTasks));
          const tasksToCreate = suggestion.suggestedTasks
            .map((task, idx) => selectedTasks.has(idx) ? task : null)
            .filter((task): task is string => task !== null);

          console.log("[Modal] 생성할 Task 목록:", tasksToCreate);

          for (const taskTitle of tasksToCreate) {
            try {
              console.log("[Modal] Task 생성 중:", taskTitle);
              const taskNode = await createNode("task", taskTitle, "", {
                summary: taskTitle,
                tags: suggestion.tags, // 메인 Node의 태그 상속
              });

              if (taskNode) {
                // Zustand store에 Task 추가 (실시간 반영)
                addNode(taskNode);

                // 메인 Node와 Task를 "requires" 관계로 연결
                await createRelation(newNode.id, taskNode.id, "requires");
                console.log("[Modal] Task 생성 및 연결 완료:", taskTitle);
              }
            } catch (error) {
              console.error("[Modal] Task 생성 실패:", taskTitle, error);
            }
          }
        }

        onSuccess?.();
        onClose();
        setSelectedTasks(new Set());
      }
    } catch (error) {
      console.error("Node 생성 실패:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const toggleTaskSelection = (index: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };

  const handleIgnore = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg sm:rounded-xl w-full sm:w-full max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            AI 분류 제안
          </h2>
          <button
            onClick={handleIgnore}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                AI가 분석 중입니다...
              </p>
            </div>
          ) : suggestion ? (
            <div className="space-y-4">
              {/* 타입 */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  타입
                </label>
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${NODE_TYPE_COLORS[suggestion.type]}`}
                  >
                    {NODE_TYPE_LABELS[suggestion.type]}
                  </span>
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  제목
                </label>
                <p className="mt-2 text-slate-900 dark:text-white font-medium">
                  {suggestion.title}
                </p>
              </div>

              {/* 요약 */}
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                  요약
                </label>
                <p className="mt-2 text-slate-700 dark:text-slate-300 text-sm">
                  {suggestion.summary}
                </p>
              </div>

              {/* 태그 */}
              {suggestion.tags.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    태그
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestion.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 추천 할 일 */}
              {suggestion.suggestedTasks.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    추천 할 일 (선택하면 자동으로 생성됩니다)
                  </label>
                  <ul className="mt-2 space-y-2">
                    {suggestion.suggestedTasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`task-${idx}`}
                          checked={selectedTasks.has(idx)}
                          onChange={() => toggleTaskSelection(idx)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 cursor-pointer"
                        />
                        <label
                          htmlFor={`task-${idx}`}
                          className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer flex-1"
                        >
                          {task}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                분류에 실패했습니다. 다시 시도해주세요.
              </p>
            </div>
          )}
        </div>

        {/* 버튼 */}
        {!isLoading && suggestion && (
          <div className="flex gap-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
            <button
              onClick={handleIgnore}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              무시
            </button>
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  적용 중...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  적용
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
