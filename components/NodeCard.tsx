'use client'

import { useState } from 'react'
import { Node } from '@/types/node'
import { NodeDetailModal } from '@/components/NodeDetailModal'

interface NodeCardProps {
  node: Node
  onRefresh?: () => void
}

export function NodeCard({ node, onRefresh }: NodeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleModalClose = () => {
    setIsModalOpen(false)
    onRefresh?.()
  }

  // 타입별 색상
  const typeColors: Record<string, { bg: string; text: string }> = {
    task: { bg: 'bg-blue-50', text: 'text-blue-700' },
    note: { bg: 'bg-purple-50', text: 'text-purple-700' },
    book: { bg: 'bg-amber-50', text: 'text-amber-700' },
    place: { bg: 'bg-green-50', text: 'text-green-700' },
    study: { bg: 'bg-cyan-50', text: 'text-cyan-700' },
    project: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
    idea: { bg: 'bg-pink-50', text: 'text-pink-700' },
    person: { bg: 'bg-orange-50', text: 'text-orange-700' },
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

  // 우선순위별 색상
  const priorityColors: Record<string, { bg: string; text: string }> = {
    urgent: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-200' },
    high: { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-200' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-200' },
    low: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-200' },
  }

  const priorityLabels: Record<string, string> = {
    urgent: '긴급',
    high: '높음',
    medium: '중간',
    low: '낮음',
  }

  // D-XX 형식으로 남은 일수 계산
  const calculateDaysLeft = (dueDate: string): string => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return `D+${Math.abs(diffDays)}`
    if (diffDays === 0) return 'D-DAY'
    return `D-${diffDays}`
  }

  const colors = typeColors[node.type] || typeColors.note
  const label = typeLabels[node.type] || node.type

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition p-4 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2 flex-1">
            {node.title}
          </h3>
          <span className={`${colors.bg} dark:bg-slate-700 ${colors.text} dark:text-slate-300 text-xs font-semibold px-2 py-1 rounded whitespace-nowrap`}>
            {label}
          </span>
        </div>

        {node.content && (
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3">
            {node.content}
          </p>
        )}

        {/* 우선순위 및 예정일 */}
        {(node.priority || node.due_date) && (
          <div className="flex gap-2 mb-3">
            {node.priority && (
              <span className={`${priorityColors[node.priority]?.bg || priorityColors.low.bg} ${priorityColors[node.priority]?.text || priorityColors.low.text} text-xs font-semibold px-2 py-1 rounded`}>
                {priorityLabels[node.priority] || node.priority}
              </span>
            )}
            {node.due_date && (
              <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2 py-1 rounded">
                {calculateDaysLeft(node.due_date)}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-2">
            {node.tags.length > 0 && (
              <div className="flex gap-1">
                {node.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
                {node.tags.length > 2 && (
                  <span className="text-slate-500 dark:text-slate-400">
                    +{node.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <time dateTime={node.created_at}>
            {new Date(node.created_at).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
            })}{' '}
            {new Date(node.created_at).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </time>
        </div>
      </button>

      {/* Node Detail Modal */}
      <NodeDetailModal
        nodeId={node.id}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}
