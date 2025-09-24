import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { 
  ChevronRight,
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  UserCheck,
  GraduationCap,
  Building,
  BookOpen,
  ClipboardList,
  BarChart3,
  Shield,
  User,
  LogOut
} from 'lucide-react'
import '../styles/dashboard.css'

const getIcon = (iconName) => {
  const iconMap = {
    'layout-dashboard': LayoutDashboard,
    'users': Users,
    'file-text': FileText,
    'calendar': Calendar,
    'settings': Settings,
    'user-check': UserCheck,
    'graduation-cap': GraduationCap,
    'building': Building,
    'book-open': BookOpen,
    'clipboard-list': ClipboardList,
    'bar-chart-3': BarChart3,
    'shield': Shield
  }
  return iconMap[iconName] || LayoutDashboard
}

const Sidebar = ({ 
  navigationConfig, 
  sidebarCollapsed, 
  setSidebarCollapsed,
  mobileMenuOpen, 
  setMobileMenuOpen,
  onLogout,
  user 
}) => {
  const location = useLocation()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const profileDropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen])

  // Close dropdown when sidebar becomes collapsed
  useEffect(() => {
    if (sidebarCollapsed && profileDropdownOpen) {
      setProfileDropdownOpen(false)
    }
  }, [sidebarCollapsed, profileDropdownOpen])

  // Debug navigation config
  console.log('Sidebar navigationConfig:', navigationConfig)

  // Flatten navigation items - remove sections
  const flattenedItems = []
  if (navigationConfig && navigationConfig.length > 0) {
    navigationConfig.forEach(section => {
      if (section.items) {
        flattenedItems.push(...section.items.filter(item => item.enabled))
      }
    })
  } else {
    // Fallback navigation
    flattenedItems.push({
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'layout-dashboard',
      enabled: true
    })
  }

  return (
    <>
      <aside 
        className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} ${mobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => {
          // Debug logging
          console.log('Sidebar clicked, window width:', window.innerWidth, 'mobileMenuOpen:', mobileMenuOpen)
          
          // On desktop and tablet (but not mobile), clicking sidebar toggles it
          // Only when mobile menu is not open
          if (window.innerWidth > 768 && !mobileMenuOpen) {
            console.log('Toggling sidebar collapse from', sidebarCollapsed, 'to', !sidebarCollapsed)
            setSidebarCollapsed(!sidebarCollapsed)
          }
        }}
      >
        {/* Sidebar Content */}
        <div className="sidebar-content">
          {/* Navigation Items - No sections */}
          <div className="nav-items">
            {flattenedItems.map((item) => {
              const IconComponent = getIcon(item.icon)
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent sidebar toggle
                    if (window.innerWidth <= 768) {
                      setMobileMenuOpen(false)
                    }
                  }}
                >
                  <IconComponent className="nav-item-icon" size={20} />
                  <span className="nav-item-text">{item.label}</span>
                  {!sidebarCollapsed && (
                    <ChevronRight className="nav-item-arrow" size={16} />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* User Profile Section at Bottom */}
        <div className="sidebar-footer">
          <div 
            ref={profileDropdownRef}
            className="user-profile"
            onClick={(e) => {
              e.stopPropagation() // Prevent sidebar toggle
              
              // Only allow dropdown to open when sidebar is expanded
              if (!sidebarCollapsed) {
                setProfileDropdownOpen(!profileDropdownOpen)
              }
            }}
          >
            <div className="user-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'N'}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">{user?.fullName || 'Nivi'}</div>
                <div className="user-role">{user?.role || user?.profile || 'SUPER_ADMIN'}</div>
              </div>
            )}
            
            {/* Profile Dropdown - Only show when sidebar is expanded */}
            {profileDropdownOpen && !sidebarCollapsed && (
              <div className="profile-dropdown">
                <button className="profile-dropdown-item">
                  <User size={16} />
                  Profile
                </button>
                <button 
                  className="profile-dropdown-item logout" 
                  onClick={(e) => {
                    e.stopPropagation()
                    onLogout()
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar