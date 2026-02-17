import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
    theme: 'light',
    setTheme: () => { },
    toggleTheme: () => { },
})

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('multimeet-theme')
        return saved || 'light'
    })

    useEffect(() => {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
        localStorage.setItem('multimeet-theme', theme)
    }, [theme])

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return useContext(ThemeContext)
}
