'use client'

import { useState, useEffect } from 'react'
import { NodeType, Priority } from '@/types/node'
import { searchNodes } from '@/lib/actions/node'
import { NodeCard } from '@/components/NodeCard'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

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

const priorities: Priority[] = ['low', 'medium', 'high', 'urgent']

const priorityLabels: Record<Priority, string> = {
  low: '낮음',
  medium: '중간',
  high: '높음',
  urgent: '긴급',
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // 필터 상태
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    tags: [] as string[],
    dueDateFrom: '',
    dueDateTo: '',
  })

  const [tagInput, setTagInput] = useState('')

  // 검색 함수
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('검색어를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const searchFilters = {
        type: filters.type ? (filters.type as NodeType) : undefined,
        status: filters.status || undefined,
        priority: filters.priority ? (filters.priority as Priority) : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        dueDate:
          filters.dueDateFrom || filters.dueDateTo
            ? {
                from: filters.dueDateFrom,
                to: filters.dueDateTo,
              }
            : undefined,
      }

      const searchResults = await searchNodes(query, searchFilters)
      setResults(searchResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류 발생')
    } finally {
      setIsLoading(false)
    }
  }

  // 엔터 키로 검색
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        void (async () => {
          if (!query.trim()) {
            setError('검색어를 입력해주세요.')
            return
          }

          setIsLoading(true)
          setError(null)

          try {
            const searchFilters = {
              type: filters.type ? (filters.type as NodeType) : undefined,
              status: filters.status || undefined,
              priority: filters.priority ? (filters.priority as Priority) : undefined,
              tags: filters.tags.length > 0 ? filters.tags : undefined,
              dueDate:
                filters.dueDateFrom || filters.dueDateTo
                  ? {
                      from: filters.dueDateFrom,
                      to: filters.dueDateTo,
                    }
                  : undefined,
            }

            const searchResults = await searchNodes(query, searchFilters)
            setResults(searchResults)
          } catch (err) {
            setError(err instanceof Error ? err.message : '검색 중 오류 발생')
          } finally {
            setIsLoading(false)
          }
        })()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [query, filters])

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !filters.tags.includes(trimmed)) {
      setFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      type: '',
      status: '',
      priority: '',
      tags: [],
      dueDateFrom: '',
      dueDateTo: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">검색</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          저장된 항목을 검색하고 필터링하세요.
        </p>
      </div>

      {/* 검색 입력 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 sm:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 sm:top-3 text-slate-400 dark:text-slate-500" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              placeholder="검색어를 입력하세요..."
              className="w-full pl-10 pr-4 py-3 sm:py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 h-12 sm:h-auto"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed h-12 sm:h-auto"
          >
            {isLoading ? '검색 중...' : '검색'}
          </button>
        </div>

        {/* 필터 토글 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
        >
          {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          고급 필터
        </button>

        {/* 필터 */}
        {showFilters && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            {/* Type 필터 */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                타입
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">모두</option>
                {nodeTypes.map((type) => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Status 필터 */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                상태
              </label>
              <input
                type="text"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                placeholder="상태를 입력하세요..."
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>

            {/* Priority 필터 */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                우선순위
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">모두</option>
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag 필터 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                태그
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="태그 입력..."
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition font-medium whitespace-nowrap"
                >
                  추가
                </button>
              </div>
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {filters.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="text-slate-700 dark:text-slate-200">#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-500 hover:text-red-600 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Due Date 필터 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  예정일 (시작)
                </label>
                <input
                  type="date"
                  value={filters.dueDateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dueDateFrom: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  예정일 (종료)
                </label>
                <input
                  type="date"
                  value={filters.dueDateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dueDateTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* 필터 초기화 버튼 */}
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* 검색 결과 */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-4">
          검색 결과 ({results.length})
        </h2>

        {isLoading ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-700 rounded-lg h-40 animate-pulse"
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg mb-2">
              검색 결과가 없습니다.
            </p>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-500">
              다른 검색어나 필터를 시도해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {results.map((node) => (
              <NodeCard key={node.id} node={node} onRefresh={handleSearch} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
