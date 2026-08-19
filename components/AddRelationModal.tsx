'use client'

import { useEffect, useState } from 'react'
import { createRelation } from '@/lib/actions/relation'
import { listNodes } from '@/lib/actions/node'
import { Node, RelationType } from '@/types/node'
import { X, Search } from 'lucide-react'

const relationTypes: RelationType[] = [
  'related_to',
  'requires',
  'inspired_by',
  'part_of',
  'derived_from',
  'recommended',
]

const relationLabels: Record<RelationType, string> = {
  related_to: '관련됨',
  requires: '필요함',
  inspired_by: '영감받음',
  part_of: '포함됨',
  derived_from: '파생됨',
  recommended: '추천됨',
}

interface AddRelationModalProps {
  nodeId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddRelationModal({
  nodeId,
  isOpen,
  onClose,
  onSuccess,
}: AddRelationModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [relationType, setRelationType] = useState<RelationType>('related_to')
  const [availableNodes, setAvailableNodes] = useState<Node[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const fetchNodes = async () => {
      try {
        setIsLoading(true)
        const nodes = await listNodes()
        // 현재 노드 제외
        setAvailableNodes(nodes.filter((n) => n.id !== nodeId))
      } catch (err) {
        setError(err instanceof Error ? err.message : '노드 로드 실패')
      } finally {
        setIsLoading(false)
      }
    }

    fetchNodes()
  }, [isOpen, nodeId])

  const filteredNodes = availableNodes.filter((node) =>
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddRelation = async (toNodeId: string) => {
    try {
      setError(null)
      await createRelation(nodeId, toNodeId, relationType)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '관계 추가 실패')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">관련 항목 추가</h2>
          <button
            onClick={onClose}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded">
              <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* 관계 타입 선택 */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              관계 타입
            </label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value as RelationType)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {relationTypes.map((type) => (
                <option key={type} value={type}>
                  {relationLabels[type]}
                </option>
              ))}
            </select>
          </div>

          {/* 검색 */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              항목 검색
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="항목 검색..."
                className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500"
              />
            </div>
          </div>

          {/* 항목 목록 */}
          <div>
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
              선택 ({filteredNodes.length})
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                  로드 중...
                </div>
              ) : filteredNodes.length === 0 ? (
                <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                  {searchQuery ? '검색 결과가 없습니다.' : '항목이 없습니다.'}
                </div>
              ) : (
                filteredNodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleAddRelation(node.id)}
                    className="w-full text-left p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                  >
                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {node.title}
                    </p>
                    {node.content && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                        {node.content}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
