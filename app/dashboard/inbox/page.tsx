'use client'

import { QuickCapture } from '@/components/QuickCapture'
import { NodeCard } from '@/components/NodeCard'
import { listNodes } from '@/lib/actions/node'
import { useNodeStore } from '@/lib/stores/nodeStore'
import { useEffect } from 'react'

export default function InboxPage() {
  const nodes = useNodeStore((state) => state.nodes)
  const setNodes = useNodeStore((state) => state.setNodes)
  const isLoading = useNodeStore((state) => state.isLoading)
  const error = useNodeStore((state) => state.error)
  const setLoading = useNodeStore((state) => state.setLoading)

  useEffect(() => {
    const fetchNodes = async () => {
      setLoading(true)
      try {
        const inboxNodes = await listNodes({ captureStatus: 'inbox' })
        setNodes(inboxNodes)
      } catch (err) {
        console.error('노드 로드 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [setNodes, setLoading])

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Inbox</h1>
        <p className="text-slate-600">
          빠르게 입력한 내용들을 정리하고 분류하세요.
        </p>
      </div>

      {/* Quick Capture */}
      <QuickCapture />

      {/* Inbox 목록 */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          저장된 항목 ({nodes.length})
        </h2>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 rounded-lg h-40 animate-pulse"
              />
            ))}
          </div>
        ) : nodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-2">
              아직 저장된 항목이 없습니다.
            </p>
            <p className="text-slate-500">
              위의 입력창에서 생각나는 것을 저장해보세요.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nodes.map((node) => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
