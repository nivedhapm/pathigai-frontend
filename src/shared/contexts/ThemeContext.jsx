import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to light
  const [isDark, setIsDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        return savedTheme === 'dark'
      }
      // Default to system preference if no saved theme
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error)
      return false
    }
  })

  useEffect(() => {
    // Apply theme to body
    document.body.className = isDark ? 'dark' : 'light'
    
    // Save theme preference to localStorage
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const setTheme = (theme) => {
    setIsDark(theme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}