'use client'

import { useState } from 'react'
import { Node } from '@/types/node'
import { NodeDetailModal } from '@/components/NodeDetailModal'

interface NodeCardProps {
  node: Node
}

export function NodeCard({ node }: NodeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
