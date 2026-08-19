'use client'

import { signOut } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                SecondBrain
              </h1>
              <p className="text-slate-600">
                환영합니다, <span className="font-semibold">{user?.email}</span>님!
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              로그아웃
            </button>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              대시보드
            </h2>
            <p className="text-slate-600">
              이 부분은 Phase 3에서 구현될 예정입니다.
            </p>
            <p className="text-slate-500 text-sm mt-4">
              다음 단계: 데이터베이스 및 노드 관리
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
