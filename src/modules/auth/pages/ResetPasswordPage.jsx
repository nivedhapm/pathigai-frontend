import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, TopNav, LogoSection, Footer } from '../../../components/layout'
import { PasswordInput, PasswordStrengthIndicator } from '../../../components/ui'
import authService from '../../../shared/services/authService'
import { useToast } from '../../../components/ui/Toast/ToastProvider'
import logo from '../../../assets/logo.svg'

const ResetPasswordPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (authService.getAuthToken()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])
  
  const { 
    userId, 
    email, 
    fullName,
    isTemporaryPassword = false,
    isPasswordReset = false 
  } = location.state || {}

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleConfirmPasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      confirmPassword: e.target.value
    }))
    if (error) {
      setError('')
    }
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    // Add more password validation rules here if needed
    return null
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    try {
      setLoading(true)

      const resetData = {
        userId,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword
      }

      if (isTemporaryPassword) {
        await authService.resetTemporaryPassword(resetData)
        showSuccess('Password reset successful! Please login with your new password.')
        navigate('/login', { 
          state: { 
            passwordResetComplete: true,
            email: email 
          },
          replace: true
        })
      } else {
        await authService.resetPassword(resetData)
        showSuccess('Password reset successful! Please login with your new password.')
        navigate('/login', { 
          state: { 
            passwordResetComplete: true,
            email: email 
          },
          replace: true
        })
      }

    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Redirect if trying to reset without proper state
  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  if (!userId) {
    return null // Will redirect via useEffect
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
          
          <h2>
            {isTemporaryPassword ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="subtitle">
            {isTemporaryPassword 
              ? 'Please set a new password for your account'
              : 'Enter your new password'
            }
          </p>

          <form onSubmit={handleResetPassword}>
            <label htmlFor="password">New Password*</label>
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              required
              value={formData.password}
              onChange={handlePasswordChange}
            />
            
            <PasswordStrengthIndicator password={formData.password} />

            <label htmlFor="confirmPassword">Confirm New Password*</label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter your new password"
              required
              value={formData.confirmPassword}
              onChange={handleConfirmPasswordChange}
            />

            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginTop: '8px',
              marginBottom: '16px'
            }}>
              Password must be at least 8 characters long
            </div>

            {error && (
              <div style={{ color: '#ff4d4f', marginTop: '8px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ResetPasswordPage
