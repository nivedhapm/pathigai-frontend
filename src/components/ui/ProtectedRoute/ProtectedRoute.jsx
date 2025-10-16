import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Alert, Snackbar } from '@mui/material'
import authService from '../../../shared/services/authService'
import sessionService from '../../../shared/services/sessionService'

const ProtectedRoute = ({ children, requiredProfile = null, requiredRole = null, allowedProfiles = null }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' })
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setLoading(false)
          return
        }

        const userData = authService.getCurrentUser()
        if (userData) {
          // TODO: Fetch complete user profile from API
          // For now, simulate profile data
          const userWithProfile = {
            ...userData,
            primaryProfile: 'SUPER_ADMIN', // This should come from API
            primaryRole: 'ADMIN'
          }
          setUser(userWithProfile)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        authService.clearAllUserData()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for session events
    const handleSessionExpired = () => {
      setSessionExpired(true)
      setNotification({
        open: true,
        message: 'Your session has expired. Please login again.',
        severity: 'warning'
      })
    }

    const handleTokenRefreshed = (event) => {
      setNotification({
        open: true,
        message: 'Session refreshed successfully.',
        severity: 'success'
      })
    }

    window.addEventListener('sessionExpired', handleSessionExpired)
    window.addEventListener('tokenRefreshed', handleTokenRefreshed)

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired)
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed)
    }
  }, [])

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }))
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  // Redirect to login if not authenticated or session expired
  if (!authService.isAuthenticated() || !user || sessionExpired) {
    const redirectTo = location.pathname !== '/dashboard' ? location.pathname : undefined
    return <Navigate to="/login" state={{ from: redirectTo }} replace />
  }

  // Check profile-based access control
  if (requiredProfile && user.primaryProfile !== requiredProfile) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You don't have permission to access this page. Required profile: {requiredProfile}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check multiple allowed profiles access control
  if (allowedProfiles && !allowedProfiles.includes(user.primaryProfile)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You don't have permission to access this page. Required profiles: {allowedProfiles.join(', ')}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Check role-based access control
  if (requiredRole && user.primaryRole !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Access Denied</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You don't have the required role to access this page. Required role: {requiredRole}
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
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
    </>
  )
}

export default ProtectedRoute