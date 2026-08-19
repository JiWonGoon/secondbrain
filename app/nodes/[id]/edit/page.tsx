'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Node, NodeType } from '@/types/node'
import { getNode, updateNode } from '@/lib/actions/node'
import { useNodeStore } from '@/lib/stores/nodeStore'
import Link from 'next/link'
import { ChevronLeft, Save } from 'lucide-react'

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

export default function NodeEditPage() {
  const params = useParams()
  const router = useRouter()
  const nodeId = params.id as string

  const [node, setNode] = useState<Node | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    type: 'note' as NodeType,
    title: '',
    content: '',
    summary: '',
    tags: [] as string[],
    status: '',
    priority: '',
    dueDate: '',
  })

  const [tagInput, setTagInput] = useState('')
  const updateStoreNode = useNodeStore((state) => state.updateNode)

  useEffect(() => {
    const fetchNode = async () => {
      try {
        setIsLoading(true)
        const nodeData = await getNode(nodeId)

        if (!nodeData) {
          setError('삭제된 항목입니다.')
          setIsLoading(false)
          return
        }

        setNode(nodeData)
        setFormData({
          type: nodeData.type,
          title: nodeData.title,
          content: nodeData.content,
          summary: nodeData.summary || '',
          tags: nodeData.tags || [],
          status: nodeData.status || '',
          priority: nodeData.priority || '',
          dueDate: nodeData.due_date ? nodeData.due_date.split('T')[0] : '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로드 실패')
        console.error('Failed to load node:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNode()
  }, [nodeId])

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !formData.tags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmed],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const updates: Partial<Omit<Node, 'id' | 'user_id' | 'created_at' | 'updated_at'>> = {
        type: formData.type,
        title: formData.title,
        content: formData.content,
        summary: formData.summary,
        tags: formData.tags,
        status: formData.status || undefined,
        priority: formData.priority ? (formData.priority as any) : undefined,
        due_date: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      }

      const updatedNode = await updateNode(nodeId, updates)
      updateStoreNode(updatedNode)
      router.push(`/nodes/${nodeId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류 발생')
      console.error('Failed to update node:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    )
  }

  if (!node) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-200">{error || 'Node를 찾을 수 없습니다.'}</p>
        <Link href="/dashboard/inbox" className="text-red-600 dark:text-red-300 hover:underline mt-2 inline-block">
          Inbox로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Link
          href={`/nodes/${nodeId}`}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft size={20} />
          뒤로
        </Link>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">항목 수정</h1>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* 타입 선택 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            타입
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as NodeType }))}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            {nodeTypes.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            제목 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            disabled={isSaving}
            placeholder="제목을 입력해주세요."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            내용
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            disabled={isSaving}
            placeholder="자세한 내용을 입력해주세요."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition resize-vertical placeholder-slate-400 dark:placeholder-slate-500"
            rows={6}
          />
        </div>

        {/* 요약 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            요약
          </label>
          <input
            type="text"
            value={formData.summary}
            onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
            disabled={isSaving}
            placeholder="요약을 입력해주세요."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            태그
          </label>
          <div className="flex gap-2 mb-3">
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
              disabled={isSaving}
              placeholder="태그를 입력하고 Enter를 누르세요."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition placeholder-slate-400 dark:placeholder-slate-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm"
              >
                <span className="text-slate-700 dark:text-slate-200">#{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isSaving}
                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition disabled:cursor-not-allowed"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 상태 및 우선순위 */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              상태
            </label>
            <input
              type="text"
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              disabled={isSaving}
              placeholder="상태를 입력해주세요."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              우선순위
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
              disabled={isSaving}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              <option value="">선택하세요</option>
              <option value="low">낮음</option>
              <option value="medium">중간</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>
        </div>

        {/* 예정일 */}
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
            예정일
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/nodes/${nodeId}`)}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  )
}
