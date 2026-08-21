'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTodayTasks, getUpcomingTasks, getRecentNodes, getActiveProjects, createNode } from '@/lib/actions/node'
import { classifyNodeAction } from '@/lib/actions/ai'
import { useNodeStore } from '@/lib/stores/nodeStore'
import { NodeCard } from '@/components/NodeCard'
import { ClassificationSuggestionModal } from '@/components/nodes/ClassificationSuggestionModal'
import { ClassificationResult } from '@/lib/ai/classify'
import { ChevronRight, Plus, X } from 'lucide-react'

export default function DashboardPage() {
  const [todayTasks, setTodayTasks] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [recentNodes, setRecentNodes] = useState<any[]>([])
  const [activeProjects, setActiveProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQuickCapture, setShowQuickCapture] = useState(false)
  const [quickCaptureText, setQuickCaptureText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<ClassificationResult | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const nodeStoreNodes = useNodeStore((state) => state.nodes)

  // Quick Capture 제출
  const handleQuickCapture = async () => {
    if (!quickCaptureText.trim()) return

    setIsSubmitting(true)

    try {
      // AI 분류 요청
      setIsClassifying(true)
      const classification = await classifyNodeAction(quickCaptureText.trim())

      if (classification) {
        setAiSuggestion(classification)
        setShowSuggestion(true)
      } else {
        // AI 분류 실패 시 기본 저장
        await createNode('note', quickCaptureText.trim(), quickCaptureText.trim(), {
          summary: quickCaptureText.trim(),
        })

        setShowQuickCapture(false)
        setQuickCaptureText('')
        await loadDashboardData()
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '항목 저장 실패')
    } finally {
      setIsSubmitting(false)
      setIsClassifying(false)
    }
  }

  // 대시보드 데이터 로드
  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [today, upcoming, recent, projects] = await Promise.all([
        getTodayTasks(),
        getUpcomingTasks(),
        getRecentNodes(6),
        getActiveProjects(),
      ])

      setTodayTasks(today)
      setUpcomingTasks(upcoming)
      setRecentNodes(recent)
      setActiveProjects(projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : '대시보드 로드 실패')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  // 노드 스토어 변경 감지 - 최근 항목 새로고침
  useEffect(() => {
    if (!nodeStoreNodes || nodeStoreNodes.length === 0) return

    // 스토어의 노드가 변경되면 최근 항목 새로고침 (디바운싱)
    const timer = setTimeout(async () => {
      try {
        const updated = await getRecentNodes(6)
        setRecentNodes(updated)
      } catch (err) {
        console.error('Failed to refresh recent nodes:', err)
      }
    }, 500) // 500ms 디바운싱

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeStoreNodes])

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">대시보드</h1>
          <p className="text-slate-600 dark:text-slate-400">로딩 중...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">대시보드</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">오늘의 일과 최근 항목을 확인하세요.</p>
        </div>
        <button
          onClick={() => setShowQuickCapture(true)}
          className="flex-shrink-0 w-full sm:w-auto h-12 sm:h-auto px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap"
        >
          <Plus size={20} />
          <span>빠른 입력</span>
        </button>
      </div>

      {/* Quick Capture 모달 */}
      {showQuickCapture && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-800 rounded-t-lg sm:rounded-lg shadow-xl w-full sm:max-w-md max-h-[90vh] sm:max-h-none flex flex-col">
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">빠른 입력</h2>
              <button
                onClick={() => setShowQuickCapture(false)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                생각나는 것을 빠르게 입력하세요. 분류는 나중에 할 수 있습니다.
              </p>

              <textarea
                value={quickCaptureText}
                onChange={(e) => setQuickCaptureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleQuickCapture()
                  }
                }}
                placeholder="생각나는 것을 입력하세요..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                rows={4}
                autoFocus
              />

              <div className="text-xs text-slate-500 dark:text-slate-400">
                Ctrl+Enter 또는 Cmd+Enter로 저장
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="flex gap-3 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
              <button
                onClick={() => setShowQuickCapture(false)}
                className="flex-1 px-4 py-3 sm:py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition min-h-[44px] sm:min-h-auto"
              >
                취소
              </button>
              <button
                onClick={handleQuickCapture}
                disabled={!quickCaptureText.trim() || isSubmitting}
                className="flex-1 px-4 py-3 sm:py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition min-h-[44px] sm:min-h-auto"
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* 오늘 D-day */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">오늘 D-DAY</h2>
          <Link
            href="/dashboard/explore?filter=today"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">오늘 D-DAY가 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {todayTasks.map((item) => (
              <NodeCard key={item.id} node={item} onRefresh={loadDashboardData} />
            ))}
          </div>
        )}
      </section>

      {/* 예정된 항목 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">예정된 항목</h2>
          <Link
            href="/dashboard/explore?filter=upcoming"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">예정된 항목이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTasks.map((item) => (
              <NodeCard key={item.id} node={item} onRefresh={loadDashboardData} />
            ))}
          </div>
        )}
      </section>

      {/* 진행 중인 프로젝트 */}
      {activeProjects.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">진행 중인 프로젝트</h2>
            <Link
              href="/dashboard/explore"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
            >
              모두 보기
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition"
              >
                <p className="text-slate-900 dark:text-white font-medium">{project.title}</p>
                {project.content && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {project.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 최근 추가한 항목 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">최근 항목</h2>
          <Link
            href="/dashboard/explore"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {recentNodes.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">저장된 항목이 없습니다.</p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recentNodes.map((node) => (
              <NodeCard key={node.id} node={node} onRefresh={loadDashboardData} />
            ))}
          </div>
        )}
      </section>

      {/* 빠른 링크 */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">빠른 링크</h2>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <Link href="/dashboard/inbox">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition p-4 cursor-pointer text-center">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Inbox</h3>
            </div>
          </Link>

          <Link href="/dashboard/search">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition p-4 cursor-pointer text-center">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">검색</h3>
            </div>
          </Link>

          <Link href="/dashboard/explore">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition p-4 cursor-pointer text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">전체 항목</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* AI 분류 제안 모달 */}
      <ClassificationSuggestionModal
        isOpen={showSuggestion}
        onClose={() => {
          setShowSuggestion(false)
          setAiSuggestion(null)
        }}
        onSuccess={() => {
          setShowSuggestion(false)
          setAiSuggestion(null)
          setShowQuickCapture(false)
          setQuickCaptureText('')
          loadDashboardData()
        }}
        originalInput={quickCaptureText}
        suggestion={aiSuggestion}
        isLoading={isClassifying}
      />
    </div>
  )
}
