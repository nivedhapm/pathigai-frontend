import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import OTPInput from '../../../components/ui/OTPInput/OTPInput'
import authService from '../../../shared/services/authService'

const EmailVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
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
  const [emailSent, setEmailSent] = useState(false) // Track if email was sent

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirect if no required data
  useEffect(() => {
    if (!userId) {
      navigate('/login')
    }
  }, [userId, navigate])

  // Backend automatically sends email OTP when SMS verification completes
  // No need to send from frontend

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
            }
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
            }
          })
        } else {
          // Complete login
          const loginResponse = await authService.completeLogin(userId)
          
          if (loginResponse.jwtToken) {
            // Login successful - redirect to dashboard
            navigate('/dashboard')
          }
        }
      } else if (context === 'PASSWORD_RESET') {
        navigate('/reset-password', {
          state: {
            userId,
            email,
            isPasswordReset: true,
            fullName
          }
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

  // Don't show "use SMS instead" option for signup flow
  const showChangeToSMS = context !== 'SIGNUP'

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>Email Verification</h2>
          <p className="subtitle">
            A one-time password has been sent to<br />
            {maskedEmail || email || 'your email'}
            {showChangeToSMS && (
              <button 
                onClick={handleChangeToSMS}
                className="change-link"
                disabled={loading}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#007bff', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                use SMS instead
              </button>
            )}
          </p>

          {/* Show OTP input directly - no loading state needed */}
          <OTPInput 
            length={6}
            onComplete={handleOTPComplete}
            onVerify={handleVerify}
            loading={loading}
          />

          {showChangeToSMS && (
            <div style={{ textAlign: 'center', marginTop: '15px', marginBottom: '10px' }}>
              <button
                onClick={handleChangeToSMS}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              >
                Verify with SMS
              </button>
            </div>
          )}

          {error && (
            <div style={{ color: '#ff4d4f', marginTop: '16px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </button>
            ) : (
              <span style={{ color: '#666' }}>
                Resend code in {formatTime(countdown)}
              </span>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default EmailVerificationPage