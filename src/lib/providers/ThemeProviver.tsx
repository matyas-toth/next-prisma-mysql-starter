// components/theme-provider.tsx
'use client'

import { cookies } from 'next/headers'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'oled'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light')

  // On mount: load theme from localStorage and apply it
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setThemeState(stored)
      applyThemeToHtml(stored)
    }
  }, [])

  // Apply theme to <html> and save to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToHtml(newTheme)
    localStorage.setItem('theme', newTheme)
    window.document.cookie = `theme=${newTheme}; path=/`
  }

  // Helper to apply correct className
  const applyThemeToHtml = (theme: Theme) => {
    const html = document.documentElement
    html.classList.remove('dark', 'oled')
    if (theme === 'dark' || theme === 'oled') {
      html.classList.add(theme)
    }
  }

  // Optional: cycle through the themes (for a toggle button)
  const cycleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'oled' : 'light'
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
