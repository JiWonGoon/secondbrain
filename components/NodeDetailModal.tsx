'use client'

import { useEffect, useState } from 'react'
import { Node, Relation, NodeType } from '@/types/node'
import { getNode, updateNode, deleteNode } from '@/lib/actions/node'
import { getRelations, deleteRelation } from '@/lib/actions/relation'
import { useNodeStore } from '@/lib/stores/nodeStore'
import { AddRelationModal } from '@/components/AddRelationModal'
import { X, Edit, Trash2, Plus, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { RelationType } from '@/types/node'

const nodeTypes: NodeType[] = ['task', 'note', 'book', 'place', 'study', 'project', 'idea', 'person']

const relationLabels: Record<RelationType, string> = {
  related_to: '관련됨',
  requires: '필요함',
  inspired_by: '영감받음',
  part_of: '포함됨',
  derived_from: '파생됨',
  recommended: '추천됨',
}

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

const priorityLabels: Record<string, string> = {
  urgent: '긴급',
  high: '높음',
  medium: '중간',
  low: '낮음',
}

const typeColors: Record<string, { bg: string; text: string; darkBg: string }> = {
  task: { bg: 'bg-blue-50', text: 'text-blue-700', darkBg: 'dark:bg-blue-900' },
  note: { bg: 'bg-purple-50', text: 'text-purple-700', darkBg: 'dark:bg-purple-900' },
  book: { bg: 'bg-amber-50', text: 'text-amber-700', darkBg: 'dark:bg-amber-900' },
  place: { bg: 'bg-green-50', text: 'text-green-700', darkBg: 'dark:bg-green-900' },
  study: { bg: 'bg-cyan-50', text: 'text-cyan-700', darkBg: 'dark:bg-cyan-900' },
  project: { bg: 'bg-indigo-50', text: 'text-indigo-700', darkBg: 'dark:bg-indigo-900' },
  idea: { bg: 'bg-pink-50', text: 'text-pink-700', darkBg: 'dark:bg-pink-900' },
  person: { bg: 'bg-orange-50', text: 'text-orange-700', darkBg: 'dark:bg-orange-900' },
}

interface NodeDetailModalProps {
  nodeId: string
  isOpen: boolean
  onClose: () => void
}

export function NodeDetailModal({ nodeId, isOpen, onClose }: NodeDetailModalProps) {
  const [node, setNode] = useState<Node | null>(null)
  const [relations, setRelations] = useState<Relation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddRelationModalOpen, setIsAddRelationModalOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    tags: true,
    metadata: true,
    relations: true,
  })

  const updateStoreNode = useNodeStore((state) => state.updateNode)
  const removeNode = useNodeStore((state) => state.removeNode)

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

  useEffect(() => {
    if (!isOpen) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [nodeData, relationsData] = await Promise.all([
          getNode(nodeId),
          getRelations(nodeId),
        ])

        // 삭제된 노드 확인
        if (!nodeData) {
          setError('삭제된 항목입니다.')
          setIsLoading(false)
          return
        }

        setNode(nodeData)
        setRelations(relationsData)
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
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isOpen, nodeId])

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

  const handleSave = async () => {
    if (!node || !formData.title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    try {
      setError(null)
      const updates = {
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
      setNode(updatedNode)
      updateStoreNode(updatedNode)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 중 오류 발생')
    }
  }

  const handleDelete = async () => {
    if (!confirm('이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteNode(nodeId)
      removeNode(nodeId)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류 발생')
      setIsDeleting(false)
    }
  }

  const refreshRelations = async () => {
    try {
      const relationsData = await getRelations(nodeId)
      setRelations(relationsData)
    } catch (err) {
      console.error('Failed to refresh relations:', err)
    }
  }

  const handleDeleteRelation = async (relation: Relation) => {
    if (!confirm('이 관계를 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteRelation(relation.from_node_id, relation.to_node_id, relation.relation_type)
      await refreshRelations()
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류 발생')
    }
  }

  if (!isOpen) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 rounded-t-lg md:rounded-lg w-screen md:w-full md:max-w-2xl h-screen md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse" />
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !node) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 rounded-t-lg md:rounded-lg w-screen md:w-full md:max-w-2xl h-screen md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">오류</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={24} />
            </button>
          </div>
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!node) return null

  const colors = typeColors[node.type] || typeColors.note
  const label = typeLabels[node.type] || node.type

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-0 md:p-4 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 rounded-t-lg md:rounded-lg w-screen md:w-full md:max-w-2xl h-screen md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col">
          {/* 헤더 */}
          <div className="flex items-start justify-between p-3 md:p-6 border-b border-slate-200 dark:border-slate-700 gap-2 flex-shrink-0">
            <div className="flex-1 min-w-0 pr-2">
              <h2 className="text-base md:text-2xl font-bold text-slate-900 dark:text-white line-clamp-2 break-words">
                {formData.title}
              </h2>
            </div>
            <div className="flex gap-1 md:gap-2 flex-shrink-0 ml-auto">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 md:p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition"
                  >
                    <Edit size={18} className="md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 md:p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} className="md:w-5 md:h-5" />
                  </button>
                </>
              )}
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="p-1.5 md:p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded transition"
                >
                  <Save size={18} className="md:w-5 md:h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 md:p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-2 md:space-y-4 w-full">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded">
                <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* 타입 배지 */}
            <div className="flex items-center gap-2">
              <span className={`${colors.bg} ${colors.darkBg} ${colors.text} dark:text-slate-100 text-sm font-semibold px-3 py-1 rounded`}>
                {label}
              </span>
            </div>

            {isEditing ? (
              // 편집 모드
              <div className="space-y-2 md:space-y-4 w-full">
                {/* 타입 선택 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    타입
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as NodeType }))}
                    className="w-full px-2.5 md:px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
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
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="제목을 입력해주세요."
                    className="w-full px-2.5 md:px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="자세한 내용을 입력해주세요."
                    className="w-full px-2.5 md:px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    rows={3}
                  />
                </div>

                {/* 요약 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    요약
                  </label>
                  <input
                    type="text"
                    value={formData.summary}
                    onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                    placeholder="요약을 입력해주세요."
                    className="w-full px-2.5 md:px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                  />
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    태그
                  </label>
                  <div className="flex gap-2 mb-2">
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
                      className="flex-1 px-2.5 md:px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 md:px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition text-sm"
                    >
                      추가
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-xs">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-500 hover:text-red-600 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 상태, 우선순위, 예정일 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      상태
                    </label>
                    <input
                      type="text"
                      value={formData.status}
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                      placeholder="상태..."
                      className="w-full px-2 md:px-2.5 py-1.5 md:py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder-slate-400 dark:placeholder-slate-500 text-xs md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      우선순위
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-2 md:px-2.5 py-1.5 md:py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-xs md:text-sm"
                    >
                      <option value="">선택</option>
                      <option value="low">낮음</option>
                      <option value="medium">중간</option>
                      <option value="high">높음</option>
                      <option value="urgent">긴급</option>
                    </select>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      예정일
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-2 md:px-2.5 py-1.5 md:py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-xs md:text-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // 읽기 모드
              <div className="space-y-4">
                {formData.summary && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{formData.summary}</p>
                  </div>
                )}

                {formData.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words text-sm">
                      {formData.content}
                    </p>
                  </div>
                )}

                {/* 태그 섹션 */}
                {formData.tags.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedSections((prev) => ({ ...prev, tags: !prev.tags }))}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
                    >
                      {expandedSections.tags ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      태그 ({formData.tags.length})
                    </button>
                    {expandedSections.tags && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-xs text-slate-600 dark:text-slate-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 메타데이터 섹션 */}
                {(formData.status || formData.priority || formData.dueDate) && (
                  <div>
                    <button
                      onClick={() => setExpandedSections((prev) => ({ ...prev, metadata: !prev.metadata }))}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
                    >
                      {expandedSections.metadata ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      정보
                    </button>
                    {expandedSections.metadata && (
                      <div className="mt-2 space-y-1 text-xs">
                        {formData.status && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">상태:</span>
                            <span className="text-slate-900 dark:text-white font-medium">{formData.status}</span>
                          </div>
                        )}
                        {formData.priority && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">우선순위:</span>
                            <span className="text-slate-900 dark:text-white font-medium">{priorityLabels[formData.priority] || formData.priority}</span>
                          </div>
                        )}
                        {formData.dueDate && (
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">예정일:</span>
                            <span className="text-slate-900 dark:text-white font-medium">
                              {new Date(formData.dueDate).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-600">
                          <span className="text-slate-600 dark:text-slate-400">생성일:</span>
                          <span className="text-slate-900 dark:text-white font-medium">
                            {new Date(node.created_at).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 관련 항목 섹션 */}
                {relations.length > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedSections((prev) => ({ ...prev, relations: !prev.relations }))}
                      className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
                    >
                      {expandedSections.relations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      관련 항목 ({relations.length})
                    </button>
                    {expandedSections.relations && (
                      <div className="mt-2 space-y-3">
                        {relations.map((relation: any) => {
                          const isOutgoing = relation.from_node_id === nodeId
                          const relatedNode = relation.relatedNode
                          const relationType = relation.relation_type as RelationType

                          return (
                            <div
                              key={relation.id}
                              className="p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                    {isOutgoing ? '→' : '←'} {relationLabels[relationType] || relationType}
                                  </div>
                                  <div className="text-sm text-slate-900 dark:text-slate-100 font-medium line-clamp-2 break-words">
                                    {relatedNode?.title || '(삭제됨)'}
                                  </div>
                                  {relatedNode?.type && (
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      {typeLabels[relatedNode.type as NodeType] || relatedNode.type}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleDeleteRelation(relation)}
                                  className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition flex-shrink-0"
                                  title="삭제"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 md:p-4 flex gap-2 flex-shrink-0 bg-white dark:bg-slate-800">
            {!isEditing && (
              <button
                onClick={() => setIsAddRelationModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition text-xs md:text-sm font-medium"
              >
                <Plus size={16} />
                <span className="hidden md:inline">관련 항목 추가</span>
                <span className="md:hidden">추가</span>
              </button>
            )}
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition text-xs md:text-sm font-medium"
                >
                  <Save size={16} />
                  <span className="hidden md:inline">저장</span>
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition text-xs md:text-sm font-medium"
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Relation 추가 모달 */}
      <AddRelationModal
        nodeId={nodeId}
        isOpen={isAddRelationModalOpen}
        onClose={() => setIsAddRelationModalOpen(false)}
        onSuccess={refreshRelations}
      />
    </>
  )
}
