import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, TopNav, LogoSection, Footer } from '../../../components/layout'
import { OTPInput } from '../../../components/ui'
import authService from '../../../shared/services/authService'
import userService from '../../../shared/services/userService'
import { useToast } from '../../../components/ui/Toast/ToastProvider'
import logo from '../../../assets/logo.svg'

const EmailVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  
  const { 
    userId, 
    maskedEmail, 
    maskedPhone,
    email, 
    phone,
    nextStep, 
    context = 'SIGNUP',
    isTemporaryPassword,
    fullName 
  } = location.state || {}

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (authService.getAuthToken()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  // Redirect if no required data
  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleOTPComplete = (otp) => {
    handleVerify(otp)
  }

  const handleVerify = async (otp) => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setLoading(true)
      setError('')

      const verificationData = {
        userId,
        otp,
        verificationType: 'EMAIL',
        context: context.toUpperCase()
      }

      console.log('Verifying email OTP:', verificationData)
      const response = await authService.verifyOTP(verificationData)

      console.log('Email verification response:', response)

      // Handle different verification contexts and next steps
      if (context === 'SIGNUP') {
        if (response.nextStep === 'COMPANY_DETAILS_REQUIRED') {
          navigate('/company-info', {
            state: {
              userId,
              email,
              fullName
            },
            replace: true
          })
        }
      } else if (context === 'LOGIN') {
        if (isTemporaryPassword) {
          navigate('/reset-password', {
            state: {
              userId,
              email,
              isTemporaryPassword: true,
              fullName
            },
            replace: true
          })
        } else {
          // Complete login
          const loginResponse = await authService.completeLogin(userId)
          
          if (loginResponse.jwtToken) {
            // Login successful - show popup and redirect to dashboard
            const userProfile = userService.getSimulatedUserProfile()
            const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)
            showSuccess('Successfully logged in.')
            navigate(dashboardRoute, { replace: true })
          }
        }
      } else if (context === 'PASSWORD_RESET') {
        navigate('/reset-password', {
          state: {
            userId,
            email,
            isPasswordReset: true,
            fullName
          },
          replace: true
        })
      }

    } catch (err) {
      console.error('Email verification error:', err)
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResendLoading(true)
      setError('')

      await authService.resendVerification(userId, 'EMAIL', context.toUpperCase())
      
      // Reset countdown to 2 minutes
      setCanResend(false)
      setCountdown(120)
      
    } catch (err) {
      console.error('Email resend error:', err)
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleChangeToSMS = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await authService.changeVerificationType({
        userId,
        newVerificationType: 'SMS',
        context: context.toUpperCase()
      })

      navigate('/sms-verification', {
        state: {
          userId,
          phone,
          maskedPhone: response.maskedContact,
          nextStep,
          context,
          isTemporaryPassword,
          fullName
        }
      })

    } catch (err) {
      console.error('Change verification type error:', err)
      setError(err.message || 'Failed to switch to SMS verification.')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return null // Will redirect via useEffect
  }

  // Show verification type switching for LOGIN and PASSWORD_RESET flows only
  const showChangeToSMS = (context === 'LOGIN' || context === 'PASSWORD_RESET') && phone

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
          
          <h2>Email Verification</h2>
          <p className="subtitle">
            A one-time password has been sent to<br />
            {maskedEmail || email || 'your email'}
            {showChangeToSMS && (
              <span 
                onClick={handleChangeToSMS}
                className="change-link"
                style={{ 
                  fontSize: '13px',
                  color: '#8FB7C6',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  transition: 'text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                verify using mobile
              </span>
            )}
          </p>

          <OTPInput 
            length={6}
            onComplete={handleOTPComplete}
            onVerify={handleVerify}
            loading={loading}
          />

          {error && (
            <div style={{ color: '#ff4d4f', marginTop: '16px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {canResend ? (
              <span
                onClick={handleResend}
                style={{
                  fontSize: '13px',
                  color: resendLoading ? '#6c757d' : '#8FB7C6',
                  textDecoration: 'none',
                  cursor: resendLoading ? 'not-allowed' : 'pointer',
                  transition: 'text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!resendLoading) {
                    e.target.style.textDecoration = 'underline'
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = 'none'
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </span>
            ) : (
              <span style={{ 
                color: '#666', 
                fontSize: '13px',
                textDecoration: 'none'
              }}>
                Resend OTP in {formatTime(countdown)} mins
              </span>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default EmailVerificationPage
