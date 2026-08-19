'use client'

import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">대시보드</h1>
        <p className="text-slate-600 dark:text-slate-400">
          빠른 입력, 검색, 항목 관리를 한곳에서 하세요.
        </p>
      </div>

      {/* 메뉴 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/inbox">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition p-6 cursor-pointer">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Inbox</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              빠르게 입력한 내용들
            </p>
          </div>
        </Link>

        <Link href="/dashboard/search">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition p-6 cursor-pointer">
            <div className="text-3xl mb-2">🔍</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">검색</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              항목 검색 및 필터
            </p>
          </div>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 opacity-50">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">분석</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Phase 8에서 구현 예정
          </p>
        </div>
      </div>
    </div>
  )
}
