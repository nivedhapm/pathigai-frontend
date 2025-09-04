import { useState, useEffect, useCallback } from 'react'
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
    fullName,
    developmentMode = false
  } = location.state || {}

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [countdown, setCountdown] = useState(120) // 2 minutes
  const [verificationAttempts, setVerificationAttempts] = useState(0) // ✅ Track attempts

  // ✅ Enhanced countdown timer
  useEffect(() => {
    let timer
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, canResend])

  // ✅ Enhanced redirect check
  useEffect(() => {
    if (!userId) {
      console.warn('No userId found, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [userId, navigate])

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      setLoading(false)
      setError('')
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // ✅ Enhanced OTP completion handler
  const handleOTPComplete = useCallback((otp) => {
    if (loading) return // Prevent multiple submissions
    handleVerify(otp)
  }, [loading])

  // ✅ Comprehensive verification handler
  const handleVerify = async (otp) => {
    // ✅ Rate limiting check
    if (verificationAttempts >= 5) {
      setError('Too many failed attempts. Please request a new code.')
      return
    }

    // Development mode validation
    if (developmentMode && otp === '123456') {
      console.log('Development mode: Using test OTP')
    } else if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    } else if (!/^\d{6}$/.test(otp)) {
      setError('OTP must contain only numbers')
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

      console.log('Verifying OTP:', { userId, context, otpLength: otp.length })

      const response = await authService.verifyOTP(verificationData)

      // ✅ Enhanced response validation
      if (!response) {
        throw new Error('No response received from verification service')
      }

      console.log('Verification response:', response)

      // ✅ Handle verification failure
      if (response.verified === false) {
        setVerificationAttempts(prev => prev + 1)
        const remainingAttempts = 5 - (verificationAttempts + 1)
        const errorMsg = response.message || 'Verification failed. Please check your code and try again.'
        setError(remainingAttempts > 0 ? `${errorMsg} (${remainingAttempts} attempts remaining)` : errorMsg)
        return
      }

      // ✅ Reset attempts on success
      setVerificationAttempts(0)

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
            },
            replace: true
          })
        } else if (response.nextStep === 'COMPANY_DETAILS_REQUIRED') {
          navigate('/company-info', {
            state: {
              userId,
              email,
              fullName
            },
            replace: true
          })
        } else if (response.nextStep === 'SIGNUP_COMPLETE') {
          // ✅ Handle signup completion
          navigate('/dashboard', { replace: true })
        } else {
          console.warn('Unexpected nextStep for SIGNUP:', response.nextStep)
          setError('Verification completed but next step is unclear. Please contact support.')
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
          try {
            const loginResponse = await authService.completeLogin(userId)
            
            if (loginResponse && loginResponse.jwtToken) {
              console.log('Login completed successfully')
              navigate('/dashboard', { replace: true })
            } else {
              setError('Login completion failed. Please try again.')
            }
          } catch (loginError) {
            console.error('Login completion error:', loginError)
            setError(loginError.message || 'Login completion failed. Please try again.')
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
      } else {
        console.warn('Unknown context:', context)
        setError('Unknown verification context. Please contact support.')
      }

    } catch (err) {
      console.error('Verification error:', err)
      setVerificationAttempts(prev => prev + 1)
      
      // ✅ Enhanced error handling
      let errorMessage = 'Verification failed. Please try again.'
      
      if (err.isNetworkError) {
        errorMessage = 'Network error. Please check your connection and try again.'
      } else if (err.isValidationError && err.fieldErrors) {
        errorMessage = Object.values(err.fieldErrors).flat().join(', ')
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.responseBody?.message) {
        errorMessage = err.responseBody.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Enhanced resend handler
  const handleResend = async () => {
    if (resendLoading || !canResend) return

    try {
      setResendLoading(true)
      setError('')
      setVerificationAttempts(0) // Reset attempts on resend

      console.log('Resending verification:', { userId, type: 'SMS', context })

      await authService.resendVerification(userId, 'SMS', context.toUpperCase())
      
      // Reset countdown to 2 minutes
      setCanResend(false)
      setCountdown(120)
      
      // ✅ Show success feedback
      console.log('Verification code resent successfully')
      
    } catch (err) {
      console.error('Resend error:', err)
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  // ✅ Enhanced change to email handler
  const handleChangeToEmail = async () => {
    if (loading) return

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
          maskedEmail: response.maskedContact || authService.maskEmail(email),
          nextStep,
          context,
          isTemporaryPassword,
          fullName
        },
        replace: true
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

  // Don't show "use email instead" option for signup flow
  const showChangeToEmail = context !== 'SIGNUP' && email

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
            {showChangeToEmail && (
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
            )}
          </p>

          {/* ✅ Enhanced development mode indicator */}
          {developmentMode && (
            <div style={{
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#856404',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>🔧</span>
              <div>
                <strong>Development Mode</strong><br />
                Use "123456" as test OTP
              </div>
            </div>
          )}

          {/* ✅ Show verification attempts warning */}
          {verificationAttempts > 0 && verificationAttempts < 3 && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              padding: '10px',
              marginBottom: '15px',
              fontSize: '12px',
              color: '#856404',
              textAlign: 'center'
            }}>
              {5 - verificationAttempts} attempts remaining
            </div>
          )}

          <OTPInput 
            length={6}
            onComplete={handleOTPComplete}
            onVerify={handleVerify}
            loading={loading}
            disabled={verificationAttempts >= 5}
          />


          {/* ✅ Enhanced error display */}
          {error && (
            <div style={{ 
              color: '#dc3545',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              padding: '12px',
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading || verificationAttempts >= 5}
                style={{
                  background: 'none',
                  border: 'none',
                  color: verificationAttempts >= 5 ? '#6c757d' : '#007bff',
                  textDecoration: 'underline',
                  cursor: verificationAttempts >= 5 ? 'not-allowed' : 'pointer'
                }}
              >
                {resendLoading ? 'Sending...' : 
                 verificationAttempts >= 5 ? 'Maximum attempts reached' : 'Resend Code'}
              </button>
            ) : (
              <span style={{ color: '#666', fontSize: '14px' }}>
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

export default SMSVerificationPage