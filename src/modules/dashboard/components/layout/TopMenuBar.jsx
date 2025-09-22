import { Menu } from 'lucide-react'
import ThemeToggle from '../../../../components/common/ThemeToggle/ThemeToggle'
import logo from '../../../../assets/logo.svg'
import './TopMenuBar.css'

const TopMenuBar = ({ onMenuToggle, isMobile }) => {
  return (
    <header className="top-menu-bar">
      {/* Mobile hamburger menu */}
      {isMobile && (
        <button
          className="hamburger-menu"
          onClick={onMenuToggle}
          aria-label="Toggle navigation"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Logo and brand */}
      <div className="nav-logo">
        <img 
          src={logo} 
          alt="PathIGAI Logo"
        />
        <h3>PATHIGAI</h3>
      </div>

      {/* Navigation actions */}
      <div className="nav-actions">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default TopMenuBar
