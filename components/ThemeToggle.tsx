'use client'

import { useThemeStore } from '@/lib/stores/themeStore'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themes: Array<{ value: 'light' | 'dark' | 'system'; icon: React.ReactNode; label: string }> = [
    { value: 'light', icon: <Sun size={18} />, label: '라이트' },
    { value: 'dark', icon: <Moon size={18} />, label: '다크' },
    { value: 'system', icon: <Monitor size={18} />, label: '시스템' },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 h-10 w-24" />
    )
  }

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => {
            console.log('Theme changed to:', t.value)
            setTheme(t.value)
          }}
          className={`p-2 rounded transition-colors ${
            theme === t.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={t.label}
          type="button"
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
