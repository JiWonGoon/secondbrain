'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Node, Relation } from '@/types/node'
import { getNode, deleteNode } from '@/lib/actions/node'
import { getRelations, deleteRelation } from '@/lib/actions/relation'
import { useNodeStore } from '@/lib/stores/nodeStore'
import { AddRelationModal } from '@/components/AddRelationModal'
import Link from 'next/link'
import { ChevronLeft, Edit, Trash2, Plus } from 'lucide-react'

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

const typeLabels: Record<string, string> = {
  task: '할 일',
  note: '메모',
  book: '책',
  place: '장소',
  study: '공부',
  project: '프로젝트',
  idea: '아이디어',
  person: '사람',
}

export default function NodeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const nodeId = params.id as string

  const [node, setNode] = useState<Node | null>(null)
  const [relations, setRelations] = useState<Relation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddRelationModalOpen, setIsAddRelationModalOpen] = useState(false)

  const removeNode = useNodeStore((state) => state.removeNode)

  const refreshRelations = async () => {
    try {
      const relationsData = await getRelations(nodeId)
      setRelations(relationsData)
    } catch (err) {
      console.error('Failed to refresh relations:', err)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [nodeData, relationsData] = await Promise.all([
          getNode(nodeId),
          getRelations(nodeId),
        ])
        setNode(nodeData)
        setRelations(relationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터 로드 실패')
        console.error('Failed to load node:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [nodeId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-20 animate-pulse" />
        <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    )
  }

  if (error || !node) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-200">{error || 'Node를 찾을 수 없습니다.'}</p>
        <Link href="/dashboard/inbox" className="text-red-600 dark:text-red-300 hover:underline mt-2 inline-block">
          Inbox로 돌아가기
        </Link>
      </div>
    )
  }

  const colors = typeColors[node.type] || typeColors.note
  const label = typeLabels[node.type] || node.type

  return (
    <div className="space-y-6">
      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/inbox"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ChevronLeft size={20} />
          뒤로
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/nodes/${node.id}/edit`)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition"
          >
            <Edit size={18} />
            수정
          </button>
          <button
            onClick={async () => {
              if (confirm('이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                setIsDeleting(true)
                try {
                  await deleteNode(nodeId)
                  removeNode(nodeId)
                  router.push('/dashboard/inbox')
                } catch (err) {
                  setError(err instanceof Error ? err.message : '삭제 중 오류 발생')
                  setIsDeleting(false)
                }
              }
            }}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition disabled:bg-red-100 dark:disabled:bg-red-900 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex-1 break-words">
            {node.title}
          </h1>
          <span className={`${colors.bg} ${colors.darkBg} ${colors.text} dark:text-slate-100 text-sm font-semibold px-3 py-1 rounded whitespace-nowrap`}>
            {label}
          </span>
        </div>

        {node.summary && (
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
            <p className="text-sm text-slate-600 dark:text-slate-300">{node.summary}</p>
          </div>
        )}

        {node.content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
              {node.content}
            </p>
          </div>
        )}
      </div>

      {/* 태그 및 메타데이터 */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* 태그 */}
        {node.tags.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">태그</h3>
            <div className="flex flex-wrap gap-2">
              {node.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-600 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 메타데이터 */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">정보</h3>
          <div className="space-y-2 text-sm">
            {node.status && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">상태:</span>
                <span className="text-slate-900 dark:text-white font-medium">{node.status}</span>
              </div>
            )}
            {node.priority && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">우선순위:</span>
                <span className="text-slate-900 dark:text-white font-medium">{node.priority}</span>
              </div>
            )}
            {node.due_date && (
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">예정일:</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {new Date(node.due_date).toLocaleDateString('ko-KR')}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 dark:text-slate-400">생성일:</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {new Date(node.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 관련 항목 */}
      {relations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            관련 항목 ({relations.length})
          </h3>
          <div className="space-y-3">
            {relations.map((relation) => {
              const relatedNodeId = relation.from_node_id === nodeId ? relation.to_node_id : relation.from_node_id
              const isOutgoing = relation.from_node_id === nodeId

              return (
                <div
                  key={relation.id}
                  className="p-3 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-600 transition"
                >
                  <Link
                    href={`/nodes/${relatedNodeId}`}
                    className="flex-1 flex items-center gap-2 text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {isOutgoing ? '→' : '←'}
                    </span>
                    <span className="text-sm font-medium">{relation.relation_type}</span>
                  </Link>
                  <button
                    onClick={async () => {
                      if (confirm('이 관계를 삭제하시겠습니까?')) {
                        try {
                          await deleteRelation(
                            relation.from_node_id,
                            relation.to_node_id,
                            relation.relation_type
                          )
                          await refreshRelations()
                        } catch (err) {
                          setError(err instanceof Error ? err.message : '삭제 중 오류 발생')
                        }
                      }
                    }}
                    className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition ml-2 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 관련 항목 추가 버튼 */}
      <button
        onClick={() => setIsAddRelationModalOpen(true)}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition"
      >
        <Plus size={18} />
        관련 항목 추가
      </button>

      {/* Relation 추가 모달 */}
      <AddRelationModal
        nodeId={nodeId}
        isOpen={isAddRelationModalOpen}
        onClose={() => setIsAddRelationModalOpen(false)}
        onSuccess={refreshRelations}
      />
    </div>
  )
}
