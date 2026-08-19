'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { NodeType } from '@/types/node'
import { listNodes } from '@/lib/actions/node'
import { NodeCard } from '@/components/NodeCard'

const nodeTypes: NodeType[] = ['task', 'note', 'book', 'place', 'study', 'project', 'idea', 'person']

const typeLabels: Record<NodeType, string> = {
  task: '할 일',
  note: '메모',
  book: '책',
  place: '장소',
  study: '공부',
  project: '프로젝트',
  idea: '아이디어',
  person: '사람',
}

const typeEmojis: Record<NodeType, string> = {
  task: '✓',
  note: '📝',
  book: '📖',
  place: '📍',
  study: '📚',
  project: '🎯',
  idea: '💡',
  person: '👤',
}

type SortOption = 'created_desc' | 'created_asc' | 'updated_desc' | 'title_asc'

interface NodeStats {
  total: number
  byType: Record<NodeType, number>
  byStatus: Record<string, number>
  byPriority: Record<string, number>
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')

  const [nodes, setNodes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('created_desc')
  const [selectedTypes, setSelectedTypes] = useState<NodeType[]>([])
  const [stats, setStats] = useState<NodeStats | null>(null)

  // 모든 항목 조회
  useEffect(() => {
    const fetchNodes = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await listNodes()

        // filter 쿼리 파라미터에 따라 필터 적용
        let filteredData = data
        if (filter === 'today') {
          // 오늘 D-day: 타입 상관없이 due_date=오늘인 모든 항목
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          filteredData = data.filter((node) => {
            if (!node.due_date) return false
            const dueDate = new Date(node.due_date)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate.getTime() === today.getTime()
          })
        } else if (filter === 'upcoming') {
          // 예정된 항목: 타입 상관없이 due_date > 오늘 & due_date <= 30일 뒤인 모든 항목
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const thirtyDaysLater = new Date(today)
          thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)

          filteredData = data.filter((node) => {
            if (!node.due_date) return false
            const dueDate = new Date(node.due_date)
            dueDate.setHours(0, 0, 0, 0)
            return dueDate.getTime() > today.getTime() && dueDate.getTime() <= thirtyDaysLater.getTime()
          })
        }

        setNodes(filteredData)

        // 통계 계산
        const calculatedStats: NodeStats = {
          total: filteredData.length,
          byType: nodeTypes.reduce((acc, type) => {
            acc[type] = filteredData.filter((n) => n.type === type).length
            return acc
          }, {} as Record<NodeType, number>),
          byStatus: filteredData.reduce(
            (acc, node) => {
              if (node.status) {
                acc[node.status] = (acc[node.status] || 0) + 1
              }
              return acc
            },
            {} as Record<string, number>
          ),
          byPriority: filteredData.reduce(
            (acc, node) => {
              if (node.priority) {
                acc[node.priority] = (acc[node.priority] || 0) + 1
              }
              return acc
            },
            {} as Record<string, number>
          ),
        }
        setStats(calculatedStats)
      } catch (err) {
        setError(err instanceof Error ? err.message : '항목 조회 중 오류 발생')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNodes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  // 정렬 적용
  const getSortedNodes = () => {
    let sorted = [...nodes]

    if (selectedTypes.length > 0) {
      sorted = sorted.filter((n) => selectedTypes.includes(n.type))
    }

    switch (sortBy) {
      case 'created_asc':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'updated_desc':
        sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        break
      case 'title_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'ko'))
        break
      case 'created_desc':
      default:
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    return sorted
  }

  const sortedNodes = getSortedNodes()

  const toggleTypeFilter = (type: NodeType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">전체 항목</h1>
          <p className="text-slate-600 dark:text-slate-400">로딩 중...</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-200 dark:bg-slate-700 rounded-lg h-40 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">전체 항목</h1>
        <p className="text-slate-600 dark:text-slate-400">저장된 모든 항목을 탐색하세요.</p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* 통계 */}
      {stats && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">통계</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 dark:bg-slate-700 rounded p-3">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">전체 항목</div>
            </div>

            {nodeTypes.map((type) => (
              <div key={type} className="bg-slate-50 dark:bg-slate-700 rounded p-3">
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.byType[type]}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{typeLabels[type]}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 필터 및 정렬 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        {/* 타입 필터 */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">타입 필터</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {nodeTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedTypes.includes(type)
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <span className="mr-1">{typeEmojis[type]}</span>
                {typeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            정렬
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="created_desc">최신순</option>
            <option value="created_asc">오래된순</option>
            <option value="updated_desc">최근 수정순</option>
            <option value="title_asc">제목순</option>
          </select>
        </div>
      </div>

      {/* 결과 */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          결과 ({sortedNodes.length})
        </h2>

        {sortedNodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
              {selectedTypes.length > 0 ? '선택된 타입의 항목이 없습니다.' : '저장된 항목이 없습니다.'}
            </p>
            <p className="text-slate-500 dark:text-slate-500">
              {selectedTypes.length > 0 ? '다른 타입을 선택해보세요.' : '빠른 입력으로 항목을 추가해보세요.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedNodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
