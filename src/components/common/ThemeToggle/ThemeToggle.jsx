import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../../shared/contexts/ThemeContext'

const ThemeToggle = ({ isCompanyPage = false }) => {
  const { isDark, toggleTheme } = useTheme()

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
        {isDark ? (
          <Sun size={20} color="#ffffff" />
        ) : (
          <Moon size={20} color="#8FB7C6" />
        )}
      </button>
    </div>
  )
}

export default ThemeToggle