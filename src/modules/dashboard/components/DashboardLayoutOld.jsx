import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import authService from '../../../shared/services/authService'
import dashboardService from '../../../shared/services/dashboardService'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import '../styles/dashboard.css'

// Fallback navigation structure when API fails
const getFallbackNavigation = (profile) => {
  const baseNavigation = [
    {
      section: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard', enabled: true }
      ]
    }
  ]

  switch (profile) {
    case 'SUPER_ADMIN':
      return {
        navigation: [
          ...baseNavigation,
          {
            section: 'Administration',
            items: [
              { id: 'users', label: 'User Management', path: '/dashboard/users', icon: 'users', enabled: true },
              { id: 'settings', label: 'System Settings', path: '/dashboard/settings', icon: 'settings', enabled: true }
            ]
          }
        ],
        permissions: ['user.create', 'user.view', 'user.edit', 'user.delete', 'system.admin']
      }

    case 'ADMIN':
      return {
        navigation: [
          ...baseNavigation,
          {
            section: 'Management',
            items: [
              { id: 'users', label: 'User Management', path: '/dashboard/users', icon: 'users', enabled: true }
            ]
          }
        ],
        permissions: ['user.create', 'user.view', 'user.edit']
      }

    default:
      return {
        navigation: baseNavigation,
        permissions: ['dashboard.view']
      }
  }
}

// Icon component mapping
const getIconComponent = (iconName) => {
  const iconMap = {
    'layout-dashboard': 'layout-dashboard',
    'users': 'users',
    'file-text': 'file-text',
    'calendar': 'calendar',
    'settings': 'settings',
    'user-check': 'user-check',
    'graduation-cap': 'graduation-cap',
    'building': 'building',
    'book-open': 'book-open',
    'clipboard-list': 'clipboard-list',
    'bar-chart-3': 'bar-chart-3',
    'shield': 'shield'
  }
  return iconMap[iconName] || 'layout-dashboard'
}

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [navigation, setNavigation] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })
  const [logoutDialog, setLogoutDialog] = useState(false)

  // Check authentication and load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setLoading(false)
          return
        }

        // Get user data from JWT token (fastest)
        const userData = authService.getUserFromToken()
        if (userData) {
          setUser(userData)
        } else {
          // Fallback to localStorage
          const fallbackData = authService.getCurrentUser()
          setUser(fallbackData)
        }

        // Load navigation data
        try {
          const navData = await dashboardService.getCachedNavigation()
          setNavigation(navData)
        } catch (navError) {
          console.warn('Failed to load navigation, using fallback:', navError)
          // Use fallback navigation structure
          const currentUserData = userData || authService.getCurrentUser()
          setNavigation(getFallbackNavigation(currentUserData?.profile))
        }

      } catch (error) {
        console.error('Failed to load user data:', error)
        showNotification('Failed to load user data', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Save sidebar state
  useEffect(() => {
    sessionStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      showNotification('Successfully logged out', 'success')
      // Redirect will happen automatically due to authentication check
    } catch (error) {
      console.error('Logout failed:', error)
      showNotification('Logout failed', 'error')
    }
    setLogoutDialog(false)
  }

  const getUserInitials = (fullName) => {
    if (!fullName) return 'U'
    return fullName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getPageTitle = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/dashboard/users': 'User Management',
      '/dashboard/settings': 'Settings',
      '/dashboard/interviews': 'Interviews',
      '/dashboard/training': 'Training',
      '/dashboard/reports': 'Reports',
      '/dashboard/trainees': 'Trainees',
      '/dashboard/progress': 'Progress',
      '/dashboard/schedule': 'Schedule',
      '/dashboard/assignments': 'Assignments'
    }
    return pathMap[location.pathname] || 'Dashboard'
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!authService.isAuthenticated() || !user) {
    return <Navigate to="/login" replace />
  }

  // Use API navigation data or fallback
  const navigationConfig = navigation?.navigation || getFallbackNavigation(user.profile || user.primaryProfile)?.navigation || []
  const profileClass = `profile-${(user.profile || user.primaryProfile)?.toLowerCase().replace('_', '-')}`

  return (
    <div className={`dashboard-layout ${profileClass}`}>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMobileMenu}
      />

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : 'expanded'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.svg" alt="Pathigai" />
            <h3>PATHIGAI</h3>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationConfig.map((section) => (
            <div key={section.section} className="nav-section">
              <h4 className="nav-section-title">{section.section}</h4>
              {section.items.map((item) => {
                const IconComponent = getIconComponent(item.icon)
                const isActive = location.pathname === item.path
                
                return (
                  <a
                    key={item.id}
                    href={item.path}
                    className={`nav-item ${isActive ? 'active' : ''} ${!item.enabled ? 'disabled' : ''}`}
                    title={sidebarCollapsed ? item.label : ''}
                    onClick={(e) => {
                      if (!item.enabled) {
                        e.preventDefault()
                        return
                      }
                      setMobileMenuOpen(false)
                    }}
                  >
                    <IconComponent className="nav-item-icon" />
                    <span className="nav-item-text">{item.label}</span>
                  </a>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {getUserInitials(user.fullName)}
            </div>
            <div className="user-info">
              <p className="user-name">{user.fullName}</p>
              <p className="user-role">{user.primaryProfile?.replace('_', ' ')}</p>
            </div>
          </div>
          
          <button
            className="nav-item"
            onClick={() => setLogoutDialog(true)}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut className="nav-item-icon" />
            <span className="nav-item-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`dashboard-main ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <div className="desktop-only">
              <button 
                className="mobile-menu-button"
                onClick={toggleSidebar}
                style={{ display: 'block' }}
              >
                <Menu size={24} />
              </button>
            </div>
            
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          
          <div className="header-right">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onClose={() => setLogoutDialog(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialog(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default DashboardLayout