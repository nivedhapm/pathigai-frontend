import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FloatingElements from '../../../components/common/FloatingElements/FloatingElements'
import ThemeToggle from '../../../components/common/ThemeToggle/ThemeToggle'
import LogoSection from '../../../components/common/LogoSection/LogoSection'
import Footer from '../../../components/common/Footer/Footer'
import OTPInput from '../../../components/ui/OTPInput/OTPInput'
import authService from '../../../shared/services/authService'

const SMSVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { 
    userId, 
    maskedPhone, 
    maskedEmail,
    phone, 
    email,
    nextStep, 
    context = 'SIGNUP',
    isTemporaryPassword,
    fullName 
  } = location.state || {}

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(30)

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
        verificationType: 'SMS',
        context: context.toUpperCase()
      }

      const response = await authService.verifyOTP(verificationData)

      // Handle different verification contexts and next steps
      if (context === 'SIGNUP') {
        if (response.nextStep === 'EMAIL_VERIFICATION_REQUIRED') {
          navigate('/email-verification', {
            state: {
              userId,
              email,
              maskedEmail: maskedEmail || authService.maskEmail(email),
              nextStep: response.nextStep,
              context: 'SIGNUP',
              fullName
            }
          })
        } else if (response.nextStep === 'COMPANY_DETAILS_REQUIRED') {
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
            navigate('/dashboard') // You'll need to create this route
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
      console.error('Verification error:', err)
      setError(err.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setResendLoading(true)
      setError('')

      await authService.resendVerification(userId, 'SMS', context.toUpperCase())
      
      // Reset countdown
      setCanResend(false)
      setCountdown(30)
      
    } catch (err) {
      console.error('Resend error:', err)
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleChangeToEmail = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await authService.changeVerificationType({
        userId,
        newVerificationType: 'EMAIL',
        context: context.toUpperCase()
      })

      navigate('/email-verification', {
        state: {
          userId,
          email,
          maskedEmail: response.maskedContact,
          nextStep,
          context,
          isTemporaryPassword,
          fullName
        }
      })

    } catch (err) {
      console.error('Change verification type error:', err)
      setError(err.message || 'Failed to switch to email verification.')
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return null // Will redirect via useEffect
  }

  return (
    <>
      <FloatingElements />
      <ThemeToggle />

      <div className="container">
        <LogoSection />

        <div className="form-box">
          <h2>SMS Verification</h2>
          <p className="subtitle">
            A one-time password has been sent to<br />
            {maskedPhone || '+91 **********'}
            <button 
              onClick={handleChangeToEmail}
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
              use email instead
            </button>
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
                Resend code in {countdown}s
              </span>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default SMSVerificationPage