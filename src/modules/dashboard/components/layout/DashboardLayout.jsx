import { useState, useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import TopMenuBar from './TopMenuBar'
import SideMenuBar from './SideMenuBar'
import Footer from '../../../../components/common/Footer/Footer'
import useActivityTimeout from '../../../../shared/hooks/useActivityTimeout'
import AuthDebug from '../../../../components/debug/AuthDebug'
import './DashboardLayout.css'

const DashboardLayout = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:768px)')
  const isTablet = useMediaQuery('(max-width:1200px)')
  
  // Activity-based session management
  // 120 minutes of inactivity = logout, but token refresh keeps session alive if user is active
  useActivityTimeout(120)
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    // Initialize based on screen size and saved preference
    if (isMobile) return false
    const saved = sessionStorage.getItem('sidebar-expanded')
    if (saved !== null) return JSON.parse(saved)
    return !isTablet // Expanded by default on desktop, collapsed on tablet
  })

  // Handle screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarExpanded(false)
      setMobileMenuOpen(false)
    } else if (!isMobile && !isTablet) {
      // Desktop (>1200px) - restore saved state or default to expanded
      const saved = sessionStorage.getItem('sidebar-expanded')
      setSidebarExpanded(saved !== null ? JSON.parse(saved) : true)
    }
  }, [isMobile, isTablet])

  // Save sidebar state to session storage
  useEffect(() => {
    if (!isMobile) {
      sessionStorage.setItem('sidebar-expanded', JSON.stringify(sidebarExpanded))
    }
  }, [sidebarExpanded, isMobile])

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false)
  }

  const handleSidebarExpandToggle = () => {
    if (!isMobile) {
      setSidebarExpanded(!sidebarExpanded)
    }
  }

  const sidebarWidth = isMobile ? 0 : (sidebarExpanded ? 270 : 60)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Navigation */}
      <TopMenuBar 
        onMenuToggle={handleMobileMenuToggle}
        isMobile={isMobile}
      />

      {/* Side Navigation */}
      <SideMenuBar
        isOpen={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        isMobile={isMobile}
        isExpanded={sidebarExpanded}
        onExpandToggle={handleSidebarExpandToggle}
      />

      {/* Main Content Area with Footer */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          padding: '0',
          marginTop: '60px', // Match TopMenuBar height
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`,
          transition: 'margin-left 0.3s ease-in-out',
          backgroundColor: '#f8fafc',
          height: 'calc(100vh - 60px)', // Match TopMenuBar height
          overflow: 'auto',
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          className="content-container"
          sx={{
            maxWidth: '100%',
            margin: '0',
            backgroundColor: '#ffffff',
            borderRadius: '0',
            padding: 3,
            border: 'none',
            flex: 1,
          }}
        >
          {children}
        </Box>

        {/* Footer */}
        <Box
          className="dashboard-footer"
          sx={{
            marginTop: 'auto' // Push to bottom
          }}
        >
          <Footer />
        </Box>
      </Box>

      {/* Mobile backdrop */}
      {isMobile && mobileMenuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Temporary Debug Panel - Remove after fixing auth issues */}
      {import.meta.env.DEV && <AuthDebug />}
    </Box>
  )
}

export default DashboardLayout