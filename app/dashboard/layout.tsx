'use client'

import { signOut } from '@/lib/actions/auth'
import { createClient } from '@/lib/supabase/client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ProfileModal } from '@/components/ProfileModal'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search as SearchIcon, User } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      setIsLoading(false)
    })
  }, [router])

  const handleSignOut = async () => {
    await signOut()
  }

  const handleProfileUpdate = () => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">로딩 중...</div>
      </div>
    )
  }

  const userName = user?.user_metadata?.name || '사용자'
  const userEmail = user?.email || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* 헤더 */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-2 sm:gap-4 min-h-[60px] sm:min-h-auto">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white whitespace-nowrap truncate">
              SecondBrain
            </h1>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
            <Link
              href="/dashboard/search"
              className="p-2 h-10 w-10 sm:h-auto sm:w-auto flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex-shrink-0"
              title="검색"
            >
              <SearchIcon size={20} />
            </Link>

            {/* 프로필 버튼 - 클릭하면 모달 오픈 */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="프로필 설정"
            >
              <User size={18} />
              <span className="truncate max-w-[150px]">
                {userName}
              </span>
            </button>

            {/* 모바일: 프로필 아이콘만 */}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="md:hidden p-2 h-10 w-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              title="프로필 설정"
            >
              <User size={20} />
            </button>

            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="px-2 sm:px-3 md:px-4 py-2 text-xs md:text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-200 font-medium rounded-lg transition whitespace-nowrap flex-shrink-0 h-10 sm:h-auto"
            >
              <span className="hidden sm:inline">로그아웃</span>
              <span className="sm:hidden">나가기</span>
            </button>
          </div>
        </div>
      </header>

      {/* 프로필 모달 */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userName={userName}
        userEmail={userEmail}
        onSuccess={handleProfileUpdate}
      />

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
