import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FloatingElements, ThemeToggle, LogoSection, Footer } from '../../../components/layout'
import { PasswordInput, Recaptcha } from '../../../components/ui'
import authService from '../../../shared/services/authService'
import userService from '../../../shared/services/userService'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Check if user just completed password reset
  const { passwordResetComplete, email: resetEmail } = location.state || {}
  
  const [formData, setFormData] = useState({
    email: resetEmail || '', // Pre-fill email if coming from reset
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState('')

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    if (error) {
      setError('')
    }
  }

  const handlePasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }))
    if (error) {
      setError('')
    }
  }

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification')
      return
    }

    try {
      setLoading(true)
      
      // Step 1: Authenticate credentials
      const authResponse = await authService.login({
        ...formData,
        recaptchaToken,
        passwordResetComplete // Include flag to inform backend
      })

      console.log('Login response received:', authResponse)

      // Clear password reset state after use
      if (passwordResetComplete) {
        navigate(location.pathname, { replace: true, state: {} })
      }

      // Handle different next steps based on backend response
      if (authResponse.nextStep === 'LOGIN_COMPLETE' || authResponse.nextStep === 'VERIFICATION_NOT_REQUIRED') {
        // User doesn't need verification - complete login directly
        try {
          const loginResponse = await authService.completeLogin(authResponse.userId)
          if (loginResponse && (loginResponse.jwtToken || loginResponse.authToken)) {
            // Get user profile to determine dashboard route
            const userProfile = userService.getSimulatedUserProfile() // TODO: Get from API
            const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)
            
            alert('Successfully logged in!')
            navigate(dashboardRoute, { replace: true })
            return
          }
        } catch (error) {
          console.error('Direct login completion failed:', error)
          // Fall back to verification flow
        }
      } else if (authResponse.nextStep === 'SMS_VERIFICATION_REQUIRED') {
        // Temporary password or unverified users need SMS verification
        navigate('/sms-verification', {
          state: {
            userId: authResponse.userId,
            email: formData.email,
            phone: authResponse.phone,
            maskedPhone: authService.maskPhone(authResponse.phone),
            maskedEmail: authService.maskEmail(formData.email),
            nextStep: authResponse.nextStep,
            context: 'LOGIN',
            isTemporaryPassword: authResponse.temporaryPassword || authResponse.isTemporaryPassword,
            fullName: authResponse.fullName
          }
        })
        return
      } else if (authResponse.nextStep === 'EMAIL_VERIFICATION_REQUIRED') {
        // Some users might need email verification
        navigate('/email-verification', {
          state: {
            userId: authResponse.userId,
            email: formData.email,
            phone: authResponse.phone,
            maskedPhone: authService.maskPhone(authResponse.phone),
            maskedEmail: authService.maskEmail(formData.email),
            nextStep: authResponse.nextStep,
            context: 'LOGIN',
            isTemporaryPassword: authResponse.temporaryPassword || authResponse.isTemporaryPassword,
            fullName: authResponse.fullName
          }
        })
        return
      }

      // Default fallback - if nextStep is unclear, try to complete login
      try {
        const loginResponse = await authService.completeLogin(authResponse.userId)
        if (loginResponse && (loginResponse.jwtToken || loginResponse.authToken)) {
          // Get user profile to determine dashboard route
          const userProfile = userService.getSimulatedUserProfile() // TODO: Get from API
          const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)
          
          alert('Successfully logged in!')
          navigate(dashboardRoute, { replace: true })
        } else {
          setError('Login completion failed. Please contact support.')
        }
      } catch (error) {
        console.error('Fallback login completion failed:', error)
        setError('Login failed. Please try again or contact support.')
      }

    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Login</h2>
          <p className="subtitle">to track, train, transform<br />with Pathigai</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              required
              value={formData.email}
              onChange={handleInputChange}
            />

            <label htmlFor="password">Password*</label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />

            <div className="forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <Recaptcha onVerify={handleRecaptchaChange} />
            </div>

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px' }}>{error}</div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="login-link">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default LoginPage
