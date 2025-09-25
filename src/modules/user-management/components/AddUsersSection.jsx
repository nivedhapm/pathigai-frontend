import { useState } from 'react'
import { UserPlus, Upload, ArrowLeft, Users } from 'lucide-react'
import { Button } from '../../../shared/components'
import UserForm from './UserForm'
import BulkUploadCSV from './BulkUploadCSV'
import userService from '../../../shared/services/userService'
import authService from '../../../shared/services/authService'
import apiService from '../../../shared/services/api'
import '../styles/user-form.css'
import '../styles/bulk-upload.css'

const AddUsersSection = () => {
  const [activeView, setActiveView] = useState('options') // 'options', 'single-user', 'bulk-upload'

  const handleAddUser = async (userData) => {
    console.log('🔥 Starting user creation process...')
    console.log('📝 User data to create:', userData)
    
    // Debug ALL localStorage contents
    console.log('🔍 Full localStorage contents:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      console.log(`  ${key}:`, value?.length > 100 ? `${value.substring(0, 50)}...` : value)
    }
    
    // Debug authentication status
    const authToken = localStorage.getItem('authToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const user = localStorage.getItem('user')
    
    console.log('🔍 Auth Debug Info:', {
      hasAuthToken: !!authToken,
      hasRefreshToken: !!refreshToken,
      hasUser: !!user,
      authTokenPreview: authToken ? `${authToken.substring(0, 20)}...` : 'NO TOKEN',
      userInfo: user ? JSON.parse(user) : 'NO USER DATA'
    })
    
    // For testing - let's create a temporary token to test the backend
    if (!authToken) {
      console.log('❌ No authentication token found in localStorage!')
      
      const shouldCreateTestToken = confirm(
        '❌ No authentication token found!\n\n' +
        'This means you\'re not logged in. The backend requires authentication.\n\n' +
        'Would you like me to create a temporary test token for development?\n\n' +
        'Click OK to create test token, Cancel to stop.'
      )
      
      if (shouldCreateTestToken) {
        // Create a temporary test token for development
        const testToken = createTestJWTToken()
        localStorage.setItem('authToken', testToken)
        localStorage.setItem('refreshToken', 'test-refresh-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify({
          userId: 'test-user-1',
          email: 'test@example.com',
          fullName: 'Test User',
          primaryProfile: 'SUPER_ADMIN',
          role: 'ADMIN'
        }))
        
        console.log('🧪 Created test authentication:')
        console.log('  Token preview:', testToken.substring(0, 30) + '...')
        console.log('  User data:', { userId: 'test-user-1', email: 'test@example.com', profile: 'SUPER_ADMIN' })
        
        alert('🧪 Created temporary test credentials!\n\nPlease try creating the user again.')
      } else {
        console.log('❌ User cancelled - cannot proceed without authentication')
      }
      return
    }
    
    console.log('✅ Auth token found, proceeding with API call...')
    
    try {
      // Actually call the backend API
      console.log('📡 Calling userService.createUser...')
      const response = await userService.createUser(userData)
      console.log('✅ User created successfully:', response)
      alert('✅ User created successfully!')
      setActiveView('options')
    } catch (error) {
      console.error('❌ Failed to create user:', error)
      
      // Enhanced error handling with specific messages
      if (error.status === 401) {
        alert('❌ Session expired or invalid token. Please log in again.')
        // Clear invalid tokens
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      } else if (error.status === 403 || error.message?.includes('Access denied')) {
        alert('❌ Access denied. You do not have permission to create users.\n\nPlease contact your administrator.')
      } else if (error.status === 500) {
        alert('❌ Server error: ' + (error.data?.message || error.message || 'Unknown server error'))
      } else {
        alert('❌ Failed to create user: ' + (error.message || 'Unknown error'))
      }
    }
  }
  
  // Temporary function to create a test JWT token for development
  const createTestJWTToken = () => {
    console.log('🧪 Creating test JWT token...')
    
    // Create a simple JWT-like token for testing (this is NOT secure, just for development)
    const header = btoa(JSON.stringify({ 
      "alg": "HS256", 
      "typ": "JWT" 
    }))
    
    const payload = btoa(JSON.stringify({
      "sub": "test-user-1",
      "userId": "test-user-1",
      "email": "test@example.com",
      "fullName": "Test User",
      "role": "ADMIN",
      "profile": "SUPER_ADMIN",
      "profileLevel": "ADMIN",
      "companyId": "test-company-1",
      "companyName": "Test Company",
      "authorities": ["USER_CREATE", "USER_READ", "USER_UPDATE", "USER_DELETE"],
      "exp": Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
      "iat": Math.floor(Date.now() / 1000)
    }))
    
    // Note: This is just a dummy signature - in production, this would be signed by the server
    const signature = btoa("test-signature-not-real-" + Date.now())
    
    const token = `${header}.${payload}.${signature}`
    console.log('🧪 Test token created:', {
      tokenPreview: token.substring(0, 50) + '...',
      decodedPayload: JSON.parse(atob(payload))
    })
    
    return token
  }

  // Test backend connection
  const testBackendConnection = async () => {
    console.log('🧪 Testing backend connection...')
    
    try {
      // Test a simple GET endpoint that doesn't require complex parameters
      const response = await apiService.get('/health')
      console.log('✅ Backend health check successful:', response)
      alert('✅ Backend connection successful!')
    } catch (error) {
      console.log('❌ Backend health check failed:', error)
      
      try {
        // Try to test with any other simple endpoint
        const authResponse = await apiService.get('/auth/session-status')
        console.log('✅ Auth session status successful:', authResponse)
        alert('✅ Authentication is working, but health endpoint may not exist')
      } catch (authError) {
        console.log('❌ Auth session status also failed:', authError)
        alert('❌ Backend connection failed. Check if backend server is running on http://localhost:8080')
      }
    }
  }

  // Debug function to check current auth state
  const checkAuthState = () => {
    console.log('🔍 Current Authentication State:')
    console.log('  localStorage authToken:', !!localStorage.getItem('authToken'))
    console.log('  localStorage refreshToken:', !!localStorage.getItem('refreshToken'))
    console.log('  localStorage user:', !!localStorage.getItem('user'))
    
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      console.log('  Full token:', authToken)
      try {
        const parts = authToken.split('.')
        if (parts.length === 3) {
          const header = JSON.parse(atob(parts[0]))
          const payload = JSON.parse(atob(parts[1]))
          
          console.log('  Token header:', header)
          console.log('  Token payload:', payload)
          console.log('  Token issued at:', new Date(payload.iat * 1000))
          console.log('  Token expires at:', new Date(payload.exp * 1000))
          console.log('  Current time:', new Date())
          console.log('  Token valid (time):', payload.exp > (Date.now() / 1000))
          console.log('  Time until expiry:', Math.round((payload.exp * 1000 - Date.now()) / 1000 / 60), 'minutes')
          
          // Check required claims for user creation
          console.log('  Required claims check:')
          console.log('    userId:', payload.userId || payload.sub)
          console.log('    email:', payload.email)
          console.log('    role:', payload.role)
          console.log('    profile:', payload.profile)
          console.log('    authorities:', payload.authorities)
          console.log('    companyId:', payload.companyId)
        } else {
          console.log('  Invalid token format - not 3 parts')
        }
      } catch (e) {
        console.log('  Token parse error:', e.message)
        console.log('  This might not be a valid JWT token')
      }
    } else {
      console.log('  No auth token found')
    }
    
    // Also check what authService thinks
    console.log('  AuthService.isAuthenticated():', authService.isAuthenticated())
    console.log('  AuthService.getCurrentUser():', authService.getCurrentUser())
  }

  const handleBackToOptions = () => {
    setActiveView('options')
  }

  // Options view - main selection interface
  if (activeView === 'options') {
    return (
      <div className="section-content fade-in">
        <h2 className="section-title">
          <UserPlus className="nav-tab-icon" />
          Add/Create Users
        </h2>
        <p className="section-description">
          Create new user accounts and assign roles and permissions. You can add individual users or upload multiple users via CSV file.
        </p>
        
          {/* Debug Panel for Development */}
          <div style={{ 
            background: '#f8f9fa', 
            border: '1px solid #dee2e6', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            <strong>🔧 Development Debug Panel</strong>
            <div style={{ marginTop: '8px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button 
                onClick={checkAuthState}
                style={{
                  background: '#17a2b8',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Check Auth State
              </button>
              <button 
                onClick={testBackendConnection}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Test Backend Connection
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  console.log('🧹 Cleared localStorage')
                  alert('🧹 Cleared all localStorage data')
                }}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear Storage
              </button>
              <span style={{ color: '#6c757d', alignSelf: 'center' }}>
                Auth: {localStorage.getItem('authToken') ? '✅' : '❌'} | 
                User: {localStorage.getItem('user') ? '✅' : '❌'}
              </span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#dc3545' }}>
              <strong>Issue Identified:</strong> Backend controller expects UserDetails parameter but Spring Security isn't injecting it properly. 
              The controller should use SecurityContextHolder.getContext().getAuthentication() instead.
            </div>
          </div>        <div className="add-users-options">
          <div className="option-card">
            <div className="option-header">
              <UserPlus size={32} className="option-icon" />
              <h3>Add Single User</h3>
            </div>
            <p className="option-description">
              Create a new user account with detailed information, role assignment, and profile configuration.
            </p>
            <Button
              variant="primary"
              size="large"
              onClick={() => setActiveView('single-user')}
            >
              Create New User
            </Button>
          </div>

          <div className="option-card">
            <div className="option-header">
              <Upload size={32} className="option-icon" />
              <h3>Upload CSV File</h3>
            </div>
            <p className="option-description">
              Bulk import multiple users by uploading a CSV file with validation and error checking.
            </p>
            <Button
              variant="success"
              size="large"
              onClick={() => setActiveView('bulk-upload')}
            >
              Upload CSV File
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Single user form view
  if (activeView === 'single-user') {
    return (
      <div className="section-content fade-in">
        <div className="section-header-with-back">
          <Button
            variant="outline-secondary"
            size="small"
            onClick={handleBackToOptions}
          >
            <ArrowLeft size={16} />
            Back to Options
          </Button>
          <h2 className="section-title">
            <UserPlus className="nav-tab-icon" />
            Add Single User
          </h2>
        </div>
        
        <UserForm
          onSubmit={handleAddUser}
          onCancel={handleBackToOptions}
        />
      </div>
    )
  }

  // Bulk upload CSV view
  if (activeView === 'bulk-upload') {
    return (
      <div className="section-content fade-in">
        <div className="section-header-with-back">
          <Button
            variant="outline-secondary"
            size="small"
            onClick={handleBackToOptions}
          >
            <ArrowLeft size={16} />
            Back to Options
          </Button>
          <h2 className="section-title">
            <Upload className="nav-tab-icon" />
            Bulk Upload Users from CSV
          </h2>
        </div>
        
        <BulkUploadCSV />
      </div>
    )
  }

  return null
}

export default AddUsersSection