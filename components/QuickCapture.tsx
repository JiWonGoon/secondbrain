'use client'

import { createNode } from '@/lib/actions/node'
import { useNodeStore } from '@/lib/stores/nodeStore'
import { useState } from 'react'

export function QuickCapture() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addNode = useNodeStore((state) => state.addNode)
  const setStoreError = useNodeStore((state) => state.setError)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // 첫 줄을 제목으로 사용 (최대 100자)
      const lines = content.trim().split('\n')
      const title = lines[0].substring(0, 100)
      const fullContent = content.trim()

      const newNode = await createNode('note', title, fullContent, {
        tags: [],
        metadata: {},
      })

      addNode(newNode)
      setContent('')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '노드 생성 중 오류가 발생했습니다.'
      setError(errorMessage)
      setStoreError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          빠른 입력
        </h2>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          placeholder="생각나는 것을 입력하세요..."
          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition placeholder-slate-400 dark:placeholder-slate-500"
          rows={4}
        />

        {error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
          <button
            type="button"
            onClick={() => {
              setContent('')
              setError(null)
            }}
            disabled={isLoading}
            className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            초기화
          </button>
        </div>
      </form>
    </div>
  )
}
