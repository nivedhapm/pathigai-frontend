import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import authService from '../../../shared/services/authService'
import dashboardService from '../../../shared/services/dashboardService'
import { UserManagementPage } from '../../user-management'
import SettingsPage from './SettingsPage'

// Import all dashboard components
import SuperAdminDashboard from './SuperAdminDashboard'
import AdminDashboard from './AdminDashboard'
import ManagementDashboard from './ManagementDashboard'
import TrainerDashboard from './TrainerDashboard'
import InterviewPanelistDashboard from './InterviewPanelistDashboard'
import PlacementDashboard from './PlacementDashboard'
import TraineeDashboard from './TraineeDashboard'

// Profile-based dashboard component renderer
const renderDashboardComponent = (profile, content = null) => {
  // Handle specific content types (like user management)
  if (content === 'user-management') {
    return <UserManagementPage />
  }

  // Handle settings content
  if (content === 'settings') {
    return <SettingsPage />
  }

  // Handle APPLICANT role (no profile)
  if (!profile || profile === null) {
    return (
      <div className="fade-in">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Applicant Portal</h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
              Track your application status and next steps
            </p>
          </div>
        </div>
      </div>
    )
  }

  switch (profile) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    case 'MANAGEMENT':
      return <ManagementDashboard />
    case 'TRAINER':
      return <TrainerDashboard />
    case 'INTERVIEW_PANELIST':
      return <InterviewPanelistDashboard />
    case 'PLACEMENT':
      return <PlacementDashboard />
    case 'TRAINEE':
      return <TraineeDashboard />
    default:
      return (
        <div className="fade-in">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Dashboard</h2>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                Welcome to your dashboard
              </p>
            </div>
          </div>
        </div>
      )
  }
}

const DashboardPage = ({ content = null }) => {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          return
        }

        // Try to get profile from JWT token first (faster)
        const userFromToken = authService.getUserFromToken()
        if (userFromToken && userFromToken.profile) {
          setUserProfile(userFromToken.profile)
          setLoading(false)
          return
        }

        // Fallback to API call for enhanced profile data
        const profileData = await authService.getUserProfile()
        setUserProfile(profileData.profile)
        
      } catch (error) {
        console.error('Failed to load user profile:', error)
        setError('Failed to load dashboard. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  // Auto-extend session on page load
  useEffect(() => {
    const extendSession = async () => {
      try {
        if (authService.isAuthenticated()) {
          await authService.extendSession()
        }
      } catch (error) {
        console.warn('Failed to extend session:', error)
        // Don't show error to user, session will be handled by interceptors
      }
    }

    extendSession()
  }, [])

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="fade-in">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title" style={{ color: '#dc2626' }}>Error</h2>
              <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                {error}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {renderDashboardComponent(userProfile, content)}
    </DashboardLayout>
  )
}

export default DashboardPage