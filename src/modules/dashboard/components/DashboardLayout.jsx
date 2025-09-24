import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import authService from '../../../shared/services/authService'
import dashboardService from '../../../shared/services/dashboardService'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import ContentArea from './ContentArea'
import Footer from '../../../components/common/Footer/Footer'
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

const DashboardLayout = ({ children }) => {
  const [user, setUser] = useState(null)
  const [navigation, setNavigation] = useState(null)
  
  // Responsive sidebar state based on screen size
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('sidebarCollapsed')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    // Default behavior based on screen size
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1440 // Collapsed for screens smaller than 1440px
    }
    return false
  })
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })
  const [logoutDialog, setLogoutDialog] = useState(false)

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight)
      
      // On mobile, close mobile menu
      if (window.innerWidth > 768 && mobileMenuOpen) {
        console.log('Closing mobile menu due to resize')
        setMobileMenuOpen(false)
      }
      
      // Auto-adjust sidebar for different screen sizes if not manually set
      const hasManualState = sessionStorage.getItem('sidebarCollapsed') !== null
      if (!hasManualState) {
        const shouldCollapse = window.innerWidth < 1440
        console.log('Auto-adjusting sidebar collapsed to:', shouldCollapse)
        setSidebarCollapsed(shouldCollapse)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  // Load user data and navigation
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

  // Close mobile menu when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mobileMenuOpen])

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
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
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Top Navigation */}
      <TopNav
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Container */}
      <div className="dashboard-main">
        {/* Sidebar Navigation */}
        <Sidebar
          navigationConfig={navigationConfig}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onLogout={() => setLogoutDialog(true)}
          user={user}
        />

        {/* Content Wrapper with Footer */}
        <div className={`dashboard-content-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
          {/* Main Content Area */}
          <ContentArea sidebarCollapsed={sidebarCollapsed}>
            {children}
          </ContentArea>

          {/* Footer */}
          <Footer />
        </div>
      </div>

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