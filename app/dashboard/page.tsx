'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTodayTasks, getUpcomingTasks, getRecentNodes, getActiveProjects } from '@/lib/actions/node'
import { NodeCard } from '@/components/NodeCard'
import { ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const [todayTasks, setTodayTasks] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [recentNodes, setRecentNodes] = useState<any[]>([])
  const [activeProjects, setActiveProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [today, upcoming, recent, projects] = await Promise.all([
          getTodayTasks(),
          getUpcomingTasks(),
          getRecentNodes(5),
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

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
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
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">대시보드</h1>
        <p className="text-slate-600 dark:text-slate-400">오늘의 일과 최근 항목을 확인하세요.</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* 오늘 할 일 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">오늘 할 일</h2>
          <Link
            href="/dashboard/search"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">오늘 할 일이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition"
              >
                <p className="text-slate-900 dark:text-white font-medium">{task.title}</p>
                {task.priority && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    우선순위: {task.priority}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 예정된 할 일 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">예정된 할 일</h2>
          <Link
            href="/dashboard/search"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition"
          >
            모두 보기
            <ChevronRight size={16} />
          </Link>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">예정된 할 일이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map((task) => {
              const dueDate = new Date(task.due_date).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              })

              return (
                <div
                  key={task.id}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-300 dark:hover:border-blue-600 transition flex items-center justify-between"
                >
                  <p className="text-slate-900 dark:text-white font-medium">{task.title}</p>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded">
                    {dueDate}
                  </span>
                </div>
              )
            })}
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

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentNodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </section>

      {/* 빠른 링크 */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">빠른 링크</h2>
        <div className="grid gap-3 md:grid-cols-3">
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
    </div>
  )
}
