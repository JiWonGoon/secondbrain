'use client'

import { useEffect, useState } from 'react'
import { useThemeStore } from '@/lib/stores/themeStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 스토어 초기화 - localStorage에서 테마 로드
    useThemeStore.getState()
  }, [])

  // hydration 에러 방지
  if (!mounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
