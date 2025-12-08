import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingElements, ThemeToggle, TopNav, LogoSection, Footer } from '../../../components/layout'
import { OTPInput } from '../../../components/ui'
import authService from '../../../shared/services/authService'
import userService from '../../../shared/services/userService'
import { useToast } from '../../../components/ui/Toast/ToastProvider'
import logo from '../../../assets/logo.svg'

const SMSVerificationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { showSuccess } = useToast()
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (authService.getAuthToken()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])
  
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
  const [verificationAttempts, setVerificationAttempts] = useState(0)

  // Enhanced countdown timer
  useEffect(() => {
    let timer
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, canResend])

  // Enhanced redirect check
  useEffect(() => {
    if (!userId) {
      console.warn('No userId found, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [userId, navigate])

  // Cleanup on unmount
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

  // Enhanced OTP completion handler
  const handleOTPComplete = useCallback((otp) => {
    if (loading) return // Prevent multiple submissions
    handleVerify(otp)
  }, [loading])

  // Comprehensive verification handler
  const handleVerify = async (otp) => {
    // Prevent double submission
    if (loading) {
      console.log('Already processing verification, ignoring duplicate request')
      return
    }

    // Rate limiting check
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

      // Enhanced response validation
      if (!response) {
        throw new Error('No response received from verification service')
      }

      console.log('Verification response:', response)

      // Handle verification failure
      if (response.verified === false) {
        setVerificationAttempts(prev => prev + 1)
        const remainingAttempts = 5 - (verificationAttempts + 1)
        const errorMsg = response.message || 'Verification failed. Please check your code and try again.'
        setError(remainingAttempts > 0 ? `${errorMsg} (${remainingAttempts} attempts remaining)` : errorMsg)
        return
      }

      // Reset attempts on success
      setVerificationAttempts(0)

      console.log('Verification successful! Context and flags:', {
        context,
        isTemporaryPassword,
        userId,
        nextStep: response.nextStep
      })

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
          // Get user profile to determine dashboard route
          const userProfile = userService.getSimulatedUserProfile() // TODO: Get from API
          const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)
          
          navigate(dashboardRoute, { replace: true })
        } else {
          console.warn('Unexpected nextStep for SIGNUP:', response.nextStep)
          setError('Verification completed but next step is unclear. Please contact support.')
        }
      } else if (context === 'LOGIN') {
        if (isTemporaryPassword) {
          console.log('Temporary password user verified, redirecting to reset password')
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
            console.log('Completing login for regular user')
            const loginResponse = await authService.completeLogin(userId)
            console.log('Login completion response:', loginResponse)
            
            if (loginResponse && (loginResponse.jwtToken || loginResponse.authToken)) {
              console.log('Login completed successfully')
              
              // Get user profile to determine dashboard route
              const userProfile = userService.getSimulatedUserProfile() // TODO: Get from API
              const dashboardRoute = userService.getDashboardRoute(userProfile.primaryProfile)
              
              showSuccess('Successfully logged in.')
              navigate(dashboardRoute, { replace: true })
            } else {
              console.warn('Login response missing token:', loginResponse)
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
      
      // Enhanced error handling
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

  // Enhanced resend handler
  const handleResend = async () => {
    if (resendLoading || (!canResend && !isTemporaryPassword)) return

    try {
      setResendLoading(true)
      setError('')
      setVerificationAttempts(0) // Reset attempts on resend

      console.log('Resending verification:', { userId, type: 'SMS', context })

      // For temporary password users, try both initiate and resend
      if (isTemporaryPassword) {
        try {
          const response = await authService.initiateVerification(userId, 'SMS', context.toUpperCase())
          console.log('Initiate verification response:', response)
        } catch (initiateError) {
          console.log('Initiate failed, trying resend:', initiateError.message)
          const response = await authService.resendVerification(userId, 'SMS', context.toUpperCase())
          console.log('Resend verification response:', response)
        }
      } else {
        const response = await authService.resendVerification(userId, 'SMS', context.toUpperCase())
        console.log('Resend verification response:', response)
      }
      
      // Reset countdown to 2 minutes
      setCanResend(false)
      setCountdown(120)
      
      console.log('Verification code resent successfully')
      
    } catch (err) {
      console.error('Resend error:', err)
      setError(err.message || 'Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  // Enhanced change to email handler
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

  // Show verification type switching for LOGIN and PASSWORD_RESET flows only
  const showChangeToEmail = (context === 'LOGIN' || context === 'PASSWORD_RESET') && email

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
          
          <h2>SMS Verification</h2>
          <p className="subtitle">
            A one-time password has been sent to<br />
            {maskedPhone || '+91 **********'}
            {showChangeToEmail && (
              <span 
                onClick={handleChangeToEmail}
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
                verify using email
              </span>
            )}
          </p>

          {/* Enhanced development mode indicator */}
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

          {/* Show verification attempts warning */}
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

          {/* Enhanced error display */}
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
            {(canResend || isTemporaryPassword) ? (
              <span
                onClick={handleResend}
                style={{
                  fontSize: '13px',
                  color: (resendLoading || verificationAttempts >= 5) ? '#6c757d' : '#8FB7C6',
                  textDecoration: 'none',
                  cursor: (resendLoading || verificationAttempts >= 5) ? 'not-allowed' : 'pointer',
                  transition: 'text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!resendLoading && verificationAttempts < 5) {
                    e.target.style.textDecoration = 'underline'
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = 'none'
                }}
              >
                {resendLoading ? 'Sending...' : 
                 verificationAttempts >= 5 ? 'Maximum attempts reached' : 
                 isTemporaryPassword ? 'Request code' : 'Resend OTP'}
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

export default SMSVerificationPage
