import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import PasswordInput from '../../../components/ui/PasswordInput/PasswordInput'
import authService from '../../../shared/services/authService'

const ResetPasswordPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { 
    userId, 
    email, 
    fullName,
    isTemporaryPassword = false,
    isPasswordReset = false 
  } = location.state || {}

  const [step, setStep] = useState(isTemporaryPassword || isPasswordReset ? 'reset' : 'initiate')
  const [formData, setFormData] = useState({
    email: email || '',
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
  }

  const handlePasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      password: e.target.value
    }))
  }

  const handleConfirmPasswordChange = (e) => {
    setFormData(prev => ({
      ...prev,
      confirmPassword: e.target.value
    }))
  }

  const handleInitiateReset = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email) {
      setError('Please enter your email address')
      return
    }

    try {
      setLoading(true)
      
      const response = await authService.forgotPassword(formData.email)
      
      // Navigate to SMS verification for password reset
      navigate('/sms-verification', {
        state: {
          userId: response.userId,
          email: formData.email,
          maskedPhone: response.maskedPhone,
          context: 'PASSWORD_RESET',
          fullName: response.fullName
        }
      })

    } catch (err) {
      console.error('Password reset initiation error:', err)
      setError(err.message || 'Failed to initiate password reset. Please try again.')
    } finally {
      setLoading(false)
    }
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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      setLoading(true)

      const resetData = {
        userId,
        newPassword: formData.password
      }

      if (isTemporaryPassword) {
        await authService.resetTemporaryPassword(resetData)
        alert('Password reset successful! Please login with your new password.')
        navigate('/login')
      } else {
        await authService.resetPassword(resetData)
        alert('Password reset successful! Please login with your new password.')
        navigate('/login')
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
    if (step === 'reset' && !userId) {
      setStep('initiate')
    }
  }, [step, userId])

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          {step === 'initiate' ? (
            <>
              <h2>Reset Password</h2>
              <p className="subtitle">
                Enter your email address and we'll send you a verification code
              </p>

              <form onSubmit={handleInitiateReset}>
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  id="email"
                  placeholder="person1@zoho.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />

                {error && (
                  <div style={{ color: '#ff4d4f', marginTop: '8px' }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}>
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>

                <div className="login-link">
                  Remember your password? <a href="/login">Login</a>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2>
                {isTemporaryPassword ? 'Set New Password' : 'Reset Password'}
              </h2>
              <p className="subtitle">
                {isTemporaryPassword 
                  ? 'Please set a new password for your account'
                  : 'Enter your new password'
                }
              </p>

              {fullName && (
                <div style={{ 
                  background: '#f0f8ff', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  border: '1px solid #e1f5fe'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#1565c0' }}>
                    <strong>Account:</strong> {fullName} ({email})
                  </p>
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <label htmlFor="password">New Password*</label>
                <PasswordInput
                  id="password"
                  placeholder="* * * * * * * *"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                />

                <label htmlFor="confirmPassword">Confirm New Password*</label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="* * * * * * * *"
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

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    style={{
                      background: 'none',
                      border: '1px solid #ddd',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ResetPasswordPage