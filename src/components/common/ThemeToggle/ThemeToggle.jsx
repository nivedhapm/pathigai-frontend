import { useTheme } from '../../../shared/contexts/ThemeContext'
import { IconButton } from '@mui/material'
import { Sun, Moon } from 'lucide-react'

const ThemeToggle = ({ isCompanyPage = false, variant = 'default' }) => {
  const { isDark, toggleTheme } = useTheme()

  // MUI variant for modern look (uses current MUI theme)
  if (variant === 'mui') {
    return (
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        aria-label="Toggle Theme"
        sx={{
          bgcolor: isCompanyPage ? 'transparent' : 'background.paper',
          borderRadius: '10px',
          boxShadow: isCompanyPage ? 'none' : 2,
          '&:hover': {
            bgcolor: isCompanyPage ? 'action.hover' : 'action.hover'
          }
        }}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </IconButton>
    )
  }

  const buttonStyle = isCompanyPage 
    ? { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'inherit' }
    : {}

  return (
    <div className="theme-toggle">
      <button 
        onClick={toggleTheme} 
        aria-label="Toggle Theme"
        style={buttonStyle}
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>
  )
}

export default ThemeToggle