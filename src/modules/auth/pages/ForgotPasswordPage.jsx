import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, TopNav, LogoSection, Footer } from '../../../components/layout'





import authService from '../../../shared/services/authService'
import logo from '../../../assets/logo.svg'


const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setEmail(e.target.value)
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    if (!email || !email.trim()) {
      setError('Please enter your email address')
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError('')

      console.log('Initiating forgot password for email:', email)
      const response = await authService.forgotPassword(email.trim())
      console.log('Forgot password response:', response)

      // Navigate to EMAIL verification (default) with password reset context
      navigate('/email-verification', {
        state: {
          userId: response.userId,
          email: response.email || email.trim(),
          phone: response.phone,
          maskedPhone: response.maskedPhone,
          maskedEmail: response.maskedEmail || authService.maskEmail(email.trim()),
          nextStep: response.nextStep,
          context: 'PASSWORD_RESET',
          fullName: response.fullName
        }
      })

    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err.message || 'Failed to initiate password reset. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="verification-page">
      <FloatingElements />
      <TopNav />

      <div className="container">
        <div className="form-box">
          <div className="form-logo-section">
            <img src={logo} alt="PathIGAI Logo" />
            <h3>PATHIGAI</h3>
          </div>
          
          <h2>Forgot Password</h2>
          <p className="subtitle">
            Enter your email address and we'll send you a verification code to reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={handleInputChange}
            />

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !email.trim()}>
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>

            <div className="login-link">
              <div style={{ marginBottom: '8px' }}>
                Remember your password?{' '}
                <Link 
                  to="/login" 
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  Back to Login
                </Link>
              </div>
              <div>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ForgotPasswordPage
