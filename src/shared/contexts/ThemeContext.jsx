import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Centralized color palette aligned with existing globals.css
const existingColors = {
  light: {
    primary: '#8FB7C6', // primary buttons
    primaryDark: '#7ba5b4',
    secondary: '#0077cc', // links/accent
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    background: '#ffffff',
    surface: '#eaf4fa', // form-box
    text: '#162D3A',
    textSecondary: '#666666',
    border: '#cccccc',
    divider: '#e0e0e0'
  },
  dark: {
    primary: '#8FB7C6',
    primaryDark: '#7ba5b4',
    secondary: '#66aaff',
    success: '#4caf50',
    warning: '#ffb74d',
    error: '#f44336',
    background: '#1e1e1e',
    surface: '#2b2b2b',
    text: '#eaeaea',
    textSecondary: '#bbbbbb',
    border: '#555555',
    divider: '#404040'
  }
}

const createAppTheme = (isDark) => {
  const c = isDark ? existingColors.dark : existingColors.light
  return createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: c.primary, dark: c.primaryDark, contrastText: '#ffffff' },
      secondary: { main: c.secondary, contrastText: '#ffffff' },
      success: { main: c.success },
      warning: { main: c.warning },
      error: { main: c.error },
      background: { default: c.background, paper: c.surface },
      text: { primary: c.text, secondary: c.textSecondary },
      divider: c.divider
    },
    typography: {
      fontFamily: 'Rubik, Roboto, Arial, sans-serif',
      button: { fontWeight: 600 }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 6, textTransform: 'none', fontWeight: 600 }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 6 } }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 12 }
        }
      }
    }
  })
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })

  // Build MUI theme only when mode changes
  const muiTheme = useMemo(() => createAppTheme(isDark), [isDark])

  // Keep body class in sync with mode without clobbering other classes
  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')

    // Expose a few CSS variables for optional CSS usage
    const root = document.documentElement
    const c = isDark ? existingColors.dark : existingColors.light
    root.style.setProperty('--primary-main', c.primary)
    root.style.setProperty('--primary-dark', c.primaryDark)
    root.style.setProperty('--secondary-main', c.secondary)
    root.style.setProperty('--success-main', c.success)
    root.style.setProperty('--warning-main', c.warning)
    root.style.setProperty('--error-main', c.error)
    root.style.setProperty('--bg-default', c.background)
    root.style.setProperty('--bg-surface', c.surface)
    root.style.setProperty('--text-primary', c.text)
    root.style.setProperty('--text-secondary', c.textSecondary)
    root.style.setProperty('--border-color', c.border)
    root.style.setProperty('--divider-color', c.divider)
  }, [isDark])

  const toggleTheme = () => setIsDark((v) => !v)

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, muiTheme }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}