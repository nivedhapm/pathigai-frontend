import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import ProtectedRoute from './shared/components/ProtectedRoute'
import tokenRefreshManager from './shared/services/tokenRefreshManager'
import authService from './shared/services/authService'
import LandingPage from './modules/auth/pages/LandingPage'
import LoginPage from './modules/auth/pages/LoginPage'
import SignupPage from './modules/auth/pages/SignupPage'
import EmailVerificationPage from './modules/auth/pages/EmailVerificationPage'
import SMSVerificationPage from './modules/auth/pages/SMSVerificationPage'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import CompanyInfoPage from './modules/auth/pages/CompanyInfoPage'
import DashboardPage from './modules/dashboard/pages/DashboardPage'

function App() {
  // ✅ ENHANCED: Initialize token refresh + session validation on app startup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user has valid tokens
        const token = authService.getAuthToken()
        const refreshToken = authService.getRefreshToken()
        
        if (token && refreshToken) {
          // Check if token is expired or near expiration
          if (authService.isTokenNearExpiration(token)) {
            console.log('🔄 Token near expiration on app load, attempting refresh...')
            try {
              await authService.refreshAccessToken()
              console.log('✅ Token refreshed successfully on app load')
            } catch (error) {
              console.log('❌ Token refresh failed on app load, clearing tokens...')
              authService.clearAllUserData()
            }
          }
        }
        
        // Initialize token refresh manager
        tokenRefreshManager.initialize()
        
      } catch (error) {
        console.error('❌ App initialization failed:', error)
      }
    }
    
    initializeApp()
    
    // Cleanup on app unmount
    return () => {
      tokenRefreshManager.stopTokenRefreshMonitoring()
    }
  }, [])
  return (
    <ThemeProvider>
      <Router>
        {/* Enhanced token refresh now works completely silently in background */}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/email-verification" element={<EmailVerificationPage />} />
          <Route path="/sms-verification" element={<SMSVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/company-info" element={<CompanyInfoPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          {/* User Management Routes - Restricted to SUPER_ADMIN, ADMIN, MANAGEMENT */}
          <Route 
            path="/dashboard/users" 
            element={
              <ProtectedRoute allowedProfiles={['SUPER_ADMIN', 'ADMIN', 'MANAGEMENT']}>
                <DashboardPage content="user-management" />
              </ProtectedRoute>
            } 
          />
          
          {/* Future protected routes will be added here */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App