import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  largeText: false,
  setLargeText: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('multimeet-theme')
    return saved || 'light'
  })

  const [largeText, setLargeTextState] = useState(() => {
    return localStorage.getItem('multimeet-large-text') === 'true'
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'high-contrast')
    if (theme === 'dark') root.classList.add('dark')
    else if (theme === 'high-contrast') root.classList.add('high-contrast')
    localStorage.setItem('multimeet-theme', theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    if (largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }
    localStorage.setItem('multimeet-large-text', String(largeText))
  }, [largeText])

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark') return 'high-contrast'
      return 'light'
    })
  }

  const setTheme = (newTheme) => setThemeState(newTheme)
  const setLargeText = (value) => setLargeTextState(value)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, largeText, setLargeText }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
