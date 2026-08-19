'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">대시보드</h1>
        <p className="text-slate-600">
          오늘 해야 할 일과 최근 저장한 항목들을 확인하세요.
        </p>
      </div>

      {/* 메뉴 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/inbox">
          <div className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition p-6 cursor-pointer">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-slate-900 mb-1">Inbox</h3>
            <p className="text-sm text-slate-600">
              빠르게 입력한 내용들
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-lg border border-slate-200 p-6 opacity-50">
          <div className="text-3xl mb-2">📋</div>
          <h3 className="font-semibold text-slate-900 mb-1">할 일</h3>
          <p className="text-sm text-slate-600">
            Phase 5에서 구현 예정
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 opacity-50">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold text-slate-900 mb-1">검색</h3>
          <p className="text-sm text-slate-600">
            Phase 6에서 구현 예정
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 opacity-50">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-slate-900 mb-1">분석</h3>
          <p className="text-sm text-slate-600">
            Phase 8에서 구현 예정
          </p>
        </div>
      </div>
    </div>
  )
}
