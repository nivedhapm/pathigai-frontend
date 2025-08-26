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
        <i 
          className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}
          style={{ color: isDark ? '#ffffff' : '#162a3a' }}
        ></i>
      </button>
    </div>
  )
}

export default ThemeToggle