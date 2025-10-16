import { Menu, X, Bell } from 'lucide-react'
import { ThemeToggle } from '../../../components/layout'
import '../styles/dashboard.css'

const TopNav = ({ 
  mobileMenuOpen, 
  setMobileMenuOpen
}) => {
  const toggleMobileMenu = () => {
    console.log('Hamburger clicked, current state:', mobileMenuOpen, 'window size:', window.innerWidth)
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="dashboard-topnav">
      <div className="topnav-left">
        {/* Mobile Hamburger Menu - only on mobile */}
        <button
          className="menu-toggle mobile-only"
          onClick={toggleMobileMenu}
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>

        {/* Logo/Title */}
        <div className="topnav-logo">
          <img 
            src="/logo.svg" 
            alt="PATHIGAI" 
            className="topnav-logo-img"
          />
          <h3 className="topnav-logo-text">PATHIGAI</h3>
        </div>
      </div>

      <div className="topnav-right">
        {/* Notifications */}
        <button className="topnav-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}

export default TopNav